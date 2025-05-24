import { useState } from "react";
import { useDrop } from "react-dnd";
import { useCards } from "@/hooks/use-cards";
import { useMoveCard } from "@/hooks/use-cards";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Plus } from "lucide-react";
import type { List } from "@shared/schema";

interface TaskListProps {
  list: List;
}

export default function TaskList({ list }: TaskListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  
  const { data: allCards } = useCards();
  const { mutate: moveCard } = useMoveCard();
  
  const cards = allCards?.filter(card => card.listId === list.id) || [];

  const [{ isOver }, drop] = useDrop({
    accept: "card",
    drop: (item: { id: number }, monitor) => {
      if (!monitor.didDrop()) {
        moveCard({
          cardId: item.id,
          listId: list.id,
          position: cards.length
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      // TODO: Implement add card mutation
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCard();
    } else if (e.key === "Escape") {
      setIsAddingCard(false);
      setNewCardTitle("");
    }
  };

  return (
    <div
      ref={drop}
      className={`bg-gray-100 rounded-lg min-w-80 w-80 flex-shrink-0 shadow-list transition-colors ${
        isOver ? "drag-over" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">{list.title}</h3>
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {cards.length}
            </span>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Cards Container */}
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto custom-scrollbar">
          {cards.map((card, index) => (
            <TaskCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {/* Add Card Section */}
        {isAddingCard ? (
          <div className="space-y-2">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Wprowadź tytuł karty..."
              className="w-full"
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <Button onClick={handleAddCard} size="sm" className="trello-blue">
                Dodaj kartę
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                Anuluj
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-200 justify-start"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Dodaj kartę
          </Button>
        )}
      </div>
    </div>
  );
}
