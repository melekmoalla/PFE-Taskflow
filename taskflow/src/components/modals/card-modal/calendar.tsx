import { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { useUpdateCard } from "@/action/update-card";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod"
import FormErrors from "../../form/form-errors";
import FormInput from "../../form/form-input";
import { useBoard } from "@/hooks/use-board";

interface CalendarData {
    id: number | string;
    reminder_time?: string;
    time_date?: string;
    due_date?: string;
    start_date?: string;
}

interface CalendarFormProps {
    children: React.ReactNode;
    data: CalendarData;
}

export function CalendarForm({ children, data }: CalendarFormProps) {



    const FormSchema = z.object({
        data: z.date({
            required_error: "A date is required.",
        }),
    })

    const closeRef = useRef<HTMLButtonElement | null>(null);
    const actionRef = useRef<"delete" | "create" | "update" | null>(null);
    const queryClient = useQueryClient();

    const [errors, setErrors] = useState({});
    const [reminder, setReminder] = useState(data.reminder_time);
    const [isRange, setIsRange] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [dateRange, setDateRange] = useState<any>({
        from: new Date(),
        to: undefined,
    });


    const [selectedTime, setSelectedTime] = useState(data.time_date ? data.time_date.slice(0, 5) : "00:00");
    const { setDescription_audit } = useBoard() as { setDescription_audit: (desc: string) => void };


    const resetForm = () => {
        setErrors({});
        setReminder(data.reminder_time);
        setIsRange(false);
        setSelectedDate(data.due_date ? new Date(data.due_date) : undefined);
        setDateRange({ from: undefined, to: undefined });
        setSelectedTime(data.time_date ? data.time_date.slice(0, 5) : "00:00");
    };


    const handleTimeChange = (e: any) => {
        setSelectedTime(e.target.value);

    };

    useEffect(() => {
        if (data.due_date) {
            const dueDate = new Date(data.due_date);
            const startDate = new Date(data.start_date ?? '');

            const dueTime = dueDate.getTime();
            const startTime = startDate.getTime();

            if (dueTime !== startTime) {
                setIsRange(true);
                setDateRange({ from: startDate, to: dueDate });
            } else {
                setSelectedDate(dueDate);
            }

        }
    }, [data.due_date, data.start_date, data]);


    // //////////////////////////
    const UpdateCard = useUpdateCard();
    const { execute: executeUpdateCard } = useAction(UpdateCard, {
        onSuccess: (data) => {

            let message = "";

            switch (actionRef.current) {
                case "delete":
                    message = `Removed due date from the card "${data.title}".`;
                    resetForm();
                    break;
                case "create":
                    message = `Create due date for the card "${data.title}".`;
                    break;
                default:
                    message = `Saved changes to the card "${data.title}".`;
            }

            closeRef.current?.click();
            toast.success(message);

            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id],
            });


        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSave = () => {

        setErrors({});
        const result = FormSchema.safeParse({ data: isRange ? dateRange?.to : selectedDate });

        if (!result.success) {

            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        let start_date = null;
        let due_date = null;

        if (isRange) {
            start_date = dateRange.from;
            due_date = dateRange.to;
        } else {
            start_date = selectedDate;
            due_date = selectedDate;
        }


        const payload = {
            id: Number(data.id),
            start_date: start_date ? new Date(start_date).toISOString() : null,
            due_date: due_date ? new Date(due_date).toISOString() : null,
            reminder_time: reminder,
            time_date: selectedTime,
        };
        setDescription_audit('Create a due date');
        actionRef.current = 'create';
        executeUpdateCard(payload);
    };

    const onRemove = () => {

        const payload = {
            id: Number(data.id),
            start_date: null,
            due_date: null,
            time_date: null,
            reminder_time: "",
        };
        setDescription_audit('Remove a due date');
        actionRef.current = 'delete';
        executeUpdateCard(payload);

    };

    const handleSelect = (value: any) => {
        if (isRange) {
            setDateRange(value as { from?: Date; to?: Date });
        } else {
            setSelectedDate(value as Date);
        }
    };


    return (

        <Popover onOpenChange={(open) => {
            if (!open) resetForm();
        }}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-full sm:w-[300px] max-h-[54vh] overflow-y-auto p-4 space-y-4" align="end">
                <div className="text-sm font-medium text-center text-neutral-600 ">
                    Dates
                </div>
                <PopoverClose asChild>
                    <Button variant="ghost" className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" ref={closeRef}>
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>

                {/* Range toggle */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="range-toggle"
                        checked={isRange}
                        onChange={() => setIsRange(!isRange)}
                    />
                    <label htmlFor="range-toggle" className="text-sm font-medium">
                        Enable start date
                    </label>
                </div>

                {/* Calendar */}
                <div>

                    {isRange && dateRange.from ? (
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={handleSelect}
                            initialFocus
                        />
                    ) : (
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            initialFocus
                        />
                    )}

                    <FormErrors errors={errors} id="data" />
                </div>

                {/* Start Date */}
                {isRange && dateRange && (
                    <div>
                        <p className="text-sm font-medium mb-1">Start date</p>
                        <div className="text-sm text-muted-foreground">
                            {dateRange.from
                                ? format(dateRange.from, "d/M/yyyy")
                                : "No start date selected"}
                        </div>
                    </div>
                )}

                {/* Due Date */}
                <div>
                    <p className="text-sm font-medium mb-1">Due date</p>
                    <div className="text-sm text-muted-foreground flex gap-2">
                        <span>
                            {isRange && dateRange

                                ? dateRange.to
                                    ? format(dateRange.to, "d/M/yyyy")
                                    : "No due date selected"
                                : selectedDate
                                    ? format(selectedDate, "d/M/yyyy")
                                    : "No due date selected"},
                        </span>
                        <FormInput
                            id='time'
                            className="w-30 relative bottom-1.5"
                            type="time"
                            defaultValue={selectedTime}
                            onChange={handleTimeChange}
                        />
                    </div>
                </div>

                {/* Reminder Selection */}
                <div >
                    <p className="text-sm font-medium mb-1">Set due date reminder</p>
                    <Select value={reminder} onValueChange={setReminder}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select reminder time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30 Minutes before">30 Minutes before</SelectItem>
                            <SelectItem value="1 Hour before">1 Hour before</SelectItem>
                            <SelectItem value="1 Day before">1 Day before</SelectItem>
                            <SelectItem value="2 Days before">2 Days before</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                <p className="text-xs text-muted-foreground">
                    Reminders will be sent to all members and watchers of this card.
                </p>

                <div className="flex justify-between pt-2">
                    <Button variant="default" onClick={onSave}>Save</Button>
                    <Button variant="destructive" onClick={onRemove}>Remove</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
