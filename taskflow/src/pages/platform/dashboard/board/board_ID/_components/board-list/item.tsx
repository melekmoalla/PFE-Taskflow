

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Draggable, Droppable } from "@hello-pangea/dnd";

//////////////////////////////////////////////

import CardForm from './Card/card-form';
import ListHeader from './header';
import CardItem from './Card/card-item';

//////////////////////////////////////////////


interface IListItemProps {
    index: number;
    data: any;
    refetchLists: () => void;
}

const ListItem = ({ index, data, refetchLists }: IListItemProps) => {

    const textareaRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };
    const disableEditing = () => setIsEditing(false);

    return (
        <Draggable draggableId={`${data.id}`} index={index}>
            {(provided) => (
                <li
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="shrink-0 h-full w-[272px] select-none"
                >
                    <div
                        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
                        {...provided.dragHandleProps}
                    >
                        <ListHeader data={data} onAddCard={enableEditing} refetchLists={refetchLists} />
                        <Droppable droppableId={data.id.toString()} type="card">
                            {(provided) => (
                                <ol
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={cn(
                                        "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                                        data.cards.length > 0 && "mt-2"
                                    )}
                                >
                                    {data.cards.map((card: { id: string; title: string }, index: number) => (
                                        <CardItem
                                            index={index}
                                            key={card.id}
                                            data={card}
                                            refetchLists={refetchLists}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ol>
                            )}
                        </Droppable>
                        <CardForm
                            listId={data.id}
                    
                            isEditing={isEditing}
                            enableEditing={enableEditing}
                            disableEditing={disableEditing}
                            refetchLists={refetchLists}
                        />
                    </div>
                </li>
            )}
        </Draggable>
    );
};

export default ListItem;
//ref={textareaRef}