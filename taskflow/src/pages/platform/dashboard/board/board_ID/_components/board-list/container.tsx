
import ListForm from './form';
import { useState, useEffect, useCallback } from 'react';
import ListItem from './item';
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { useupdateListOrder } from "@/action/update-list-order";
import { useUpdateCardOrder } from "@/action/update-card-order";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from 'react';

interface List {
    id: number;
    board: number;
    title: string;
    order: number;
    created_at: string;
    updated_at: string;
    cards: any[];
}

interface ListContainerProps {
    data: List[];
    setData: Dispatch<SetStateAction<List[]>>;
    refetchLists: () => void;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

const ListContainer = ({ data, setData, refetchLists }: ListContainerProps) => {

    const [orderedData, setOrderedData] = useState(data);

    const updateList = useupdateListOrder();
    const { execute: executeListReOrder } = useAction(updateList, {
        onSuccess: () => {
            toast.success("List reordered.");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const updateCard = useUpdateCardOrder();
    const { execute: executeCardReOrder } = useAction(updateCard, {
        onSuccess: () => {
            toast.success("Card reordered.");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = useCallback(
        (result: any) => {
            const { destination, source, type } = result;

            if (!destination) {
                return;
            }

            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) {
                return;
            }

            // on list order change
            if (type === "list") {
                const items = reorder(orderedData, source.index, destination.index).map(
                    (item, index) => ({ ...item, order: index })
                );
                setOrderedData(items);
                const result = executeListReOrder({ items });
                toast.promise(result, {
                    loading: "List reorder loading...",
                });

            }

            if (type === "card") {

                const newOrderedData = [...orderedData];
                const destinationList = newOrderedData.find(
                    (list) => list.id === parseInt(destination.droppableId)
                );
                const sourceList = newOrderedData.find(
                    (list) => list.id === parseInt(source.droppableId)
                );
                if (!destinationList || !sourceList) {
                    return;
                }

                if (!sourceList.cards) {
                    sourceList.cards = [];
                }

                if (!destinationList.cards) {
                    destinationList.cards = [];
                }

                // change only order of cart when destination list equals to source list
                if (destination.droppableId === source.droppableId) {

                    const orderedCards = reorder(
                        sourceList.cards,
                        source.index,
                        destination.index
                    );
                    orderedCards.forEach((card, index) => {
                        card.order = index;
                    });

                    sourceList.cards = orderedCards;


                    setOrderedData(newOrderedData);
                    // console.log(orderedCards);
                    const result = executeCardReOrder({ items: orderedCards });
                    toast.promise(result, {
                        loading: "Card reorder loading...",
                    });
                } else {
                    const [movedCard] = sourceList.cards.splice(source.index, 1);

                    movedCard.listId = destinationList.id;
                    destinationList.cards.splice(destination.index, 0, movedCard);

                    sourceList.cards.forEach((card, idx) => (card.order = idx));
                    destinationList.cards.forEach((card, idx) => (card.order = idx));


                    setOrderedData(newOrderedData);
                    const result = executeCardReOrder({ items: destinationList.cards });
                    toast.promise(result, {
                        loading: "Card reorder loading...",
                    });
                }
            }
        },
        [orderedData, executeListReOrder, executeCardReOrder]
    );


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData.map((list, idx) => (
                            <ListItem key={list.id} index={idx} data={list} refetchLists={refetchLists} />
                        ))}
                        {provided.placeholder}
                        <ListForm setData={setData} />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default ListContainer;
