import { useState } from "react";
import { useDrag } from "react-dnd";
import { Calendar, MessageCircle, Paperclip, User } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import CardModal from "./CardModal";
import type { Card } from "@shared/schema";

interface TaskCardProps {
  card: Card;
  index: number;
}

export default function TaskCard({ card, index }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: { id: card.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case "frontend":
        return "success-bg text-white";
      case "backend":
        return "trello-blue text-white";
      case "qa":
        return "bg-gray-500 text-white";
      case "wysoki":
        return "warning-bg text-gray-800";
      case "krytyczny":
        return "error-bg text-white";
      case "niski":
        return "success-bg text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDueDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMM", { locale: pl });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div
        ref={drag}
        className={`bg-white p-4 rounded-lg shadow-card hover:shadow-card-hover transition-shadow cursor-pointer ${
          isDragging ? "drag-preview" : ""
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        <h4 className="font-medium text-gray-800 mb-2">{card.title}</h4>
        {card.description && (
          <p className="text-sm text-gray-600 mb-3">{card.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {card.labels?.map((label, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded ${getLabelColor(label)}`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            {card.dueDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDueDate(card.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>JK</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              <span>2</span>
            </div>
            <div className="flex items-center">
              <Paperclip className="h-3 w-3 mr-1" />
              <span>3</span>
            </div>
          </div>
        </div>
      </div>

      <CardModal
        card={card}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
