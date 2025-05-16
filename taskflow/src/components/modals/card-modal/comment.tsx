import { useState } from 'react';
import FormInput from "../../form/form-input";
import FormSubmit from "../../form/form-submit";
import { useCreateAuditLog } from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";
import { useQueryClient } from "@tanstack/react-query";

interface CardModalCommentProps {
    children: React.ReactNode;
    id_card: string | undefined ;
}

const CardModalComment = ({ children, id_card }: CardModalCommentProps) => {
    const { createAuditLog } = useCreateAuditLog();

    const queryClient = useQueryClient();
    const [comment, setComment] = useState('');

    const onSubmit = async () => {


        if (!comment.trim()) return;

        await createAuditLog({
            action: ACTION.CREATE,
            entityId: id_card,
            entityTitle: comment,
            entityType: ENTITY_TYPE.COMMENT,
        });

        queryClient.invalidateQueries({queryKey: ["card", id_card],});
        queryClient.invalidateQueries({ queryKey: ["card-logs", id_card] });
        setComment('');
    };

    return (
        <div>
            <form className='py-2' action={onSubmit}>
                <FormInput
                    type="text"
                    id='comment'
                    placeholder='Write a comment...'
                    className="py-4"
                    onChange={(e) => setComment(e.target.value)}
                />
                {comment.trim() !== '' && (
                    <FormSubmit
                        className="mt-2 text-white px-4 py-2 rounded"
                    >
                        Save
                    </FormSubmit>
                )}
            </form>
            {children}
        </div>
    );
};

export default CardModalComment;
