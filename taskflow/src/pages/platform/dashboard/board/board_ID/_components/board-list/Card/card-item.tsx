
import useCardModal from "@/hooks/use-card-modal";
import { Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { CalendarCheck2 } from 'lucide-react';
import { isPast } from "date-fns";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Paperclip } from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface IBoardListCardItemProps {
  index: number;
  data: any;
  refetchLists: () => void;
}
const CardItem = ({ data, index, refetchLists }: IBoardListCardItemProps) => {

  const CardModal = useCardModal();
  const { boardId } = useParams();

  const [activeLabelId, setActiveLabelId] = useState<boolean>(false);

  const toggleLabel = () => {
    setActiveLabelId(!activeLabelId);
  };

  return (

    <Draggable draggableId={data.id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role={"button"}
          onClick={() => {
            CardModal.onOpen(data.id, boardId ?? "", refetchLists);
          }}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 bg-white text-sm rounded-md shadow-sm"
        >
          <div className="flex flex-wrap gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
            {data.colors.map((color:any) => (
              <div
                key={color.id}
                className="px-1 py-1 rounded text-white text-sm cursor-pointer"
                style={{ backgroundColor: color.color }}
                onClick={() => toggleLabel()}
              >
                <div
                  className={`
                transition-all duration-300 ease-in-out
                  ${activeLabelId ? "max-h-[40px] " : "max-h-0"}
                `}
                >

                  {color.title}
                </div>
              </div>

            ))}
          </div>
          {data.title}
          {(data.due_date || data.members) && (
            <div className="flex items-center justify-between ">
              {/* Calendar on the left */}
              <div className="flex gap-2 pt-5">
                {data.due_date && (
                  <div
                    className={`flex items-center gap-1 text-xs text-gray-600 
    ${isPast(new Date(data.due_date)) ? "text-red-600" : "text-green-600"}`}
                  >

                    <CalendarCheck2
                      className={`h-4 w-4 ${isPast(new Date(data.due_date)) ? "text-red-600" : "text-green-600"}`}
                    />
                    <span >{format(new Date(data.due_date), 'MMM dd')}</span>
                  </div>
                )}

                {data.attachments && data.attachments.length > 0 && (
                  <div className="flex">
                    <Paperclip className="h-4 w-4" />
                    <span>{data.attachments.length}</span>
                  </div>
                )}
                {data.audit_logs && data.audit_logs.length > 0 && (
                  <div className="flex">
                    <MessageSquare className="h-4 w-4" />
                    <span>{data.audit_logs.length}</span>
                  </div>
                )}
              </div>
              {/* Avatars on the right */}
              <div className="flex gap-1">
                {data.members &&
                  data.members.map((member: any) => (
                    <Avatar key={member.id} className="h-8 w-8">
                      <AvatarImage src={member.userImage} />
                    </Avatar>
                  ))}
              </div>
            </div>
          )}


        </div>
      )}
    </Draggable>
  );
};

export default CardItem;