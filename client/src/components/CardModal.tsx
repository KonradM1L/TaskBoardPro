import { useState } from "react";
import { useUpdateCard, useDeleteCard } from "@/hooks/use-cards";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  AlignLeft,
  Calendar,
  Tags,
  MessageCircle,
  Save,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import type { Card } from "@shared/schema";

interface CardModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardModal({ card, isOpen, onClose }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [newComment, setNewComment] = useState("");

  const { mutate: updateCard, isPending: isUpdating } = useUpdateCard();
  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard();
  const { toast } = useToast();

  const handleSave = () => {
    updateCard(
      {
        cardId: card.id,
        data: {
          title,
          description: description || null,
          dueDate: dueDate || null,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Karta zaktualizowana",
            description: "Zmiany zostały pomyślnie zapisane.",
          });
          onClose();
        },
        onError: () => {
          toast({
            title: "Błąd",
            description: "Nie udało się zaktualizować karty.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Czy na pewno chcesz usunąć tę kartę?")) {
      deleteCard(card.id, {
        onSuccess: () => {
          toast({
            title: "Karta usunięta",
            description: "Karta została pomyślnie usunięta.",
          });
          onClose();
        },
        onError: () => {
          toast({
            title: "Błąd",
            description: "Nie udało się usunąć karty.",
            variant: "destructive",
          });
        },
      });
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold border-none p-0 focus:ring-0"
              />
              <p className="text-sm text-gray-600 mt-1">
                w liście <span className="font-medium">Do zrobienia</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <AlignLeft className="h-4 w-4 mr-2" />
              Opis
            </h4>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dodaj szczegółowy opis..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Labels */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Tags className="h-4 w-4 mr-2" />
              Etykiety
            </h4>
            <div className="flex flex-wrap gap-2">
              {card.labels?.map((label, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full ${getLabelColor(
                    label
                  )}`}
                >
                  {label}
                </span>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-6 px-3 py-1 rounded-full"
              >
                <Plus className="h-3 w-3 mr-1" />
                Dodaj etykietę
              </Button>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Termin
            </h4>
            <div className="flex items-center space-x-3">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-auto"
              />
              {dueDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDueDate("")}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Komentarze
            </h4>
            <div className="space-y-3">
              <div className="flex space-x-3">
                <div className="w-8 h-8 trello-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                  JK
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-800">
                      Czy moglibyśmy dodać opcję "Zapamiętaj mnie" do formularza?
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">2 godziny temu</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  TU
                </div>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Napisz komentarz..."
                    rows={3}
                    className="resize-none"
                  />
                  <Button className="mt-2 trello-blue text-sm">
                    Dodaj komentarz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="success-bg hover:bg-green-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Anuluj
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Usuwanie..." : "Usuń kartę"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
