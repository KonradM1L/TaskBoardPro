import { useState } from "react";
import { useCreateList } from "@/hooks/use-lists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddListButtonProps {
  boardId: number;
}

export default function AddListButton({ boardId }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  
  const { mutate: createList, isPending } = useCreateList();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (title.trim()) {
      createList(
        { title: title.trim(), boardId },
        {
          onSuccess: () => {
            setTitle("");
            setIsAdding(false);
            toast({
              title: "Lista utworzona",
              description: "Nowa lista została pomyślnie dodana.",
            });
          },
          onError: () => {
            toast({
              title: "Błąd",
              description: "Nie udało się utworzyć listy.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setTitle("");
    }
  };

  if (isAdding) {
    return (
      <div className="bg-gray-100 rounded-lg min-w-80 w-80 flex-shrink-0 p-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Wprowadź tytuł listy..."
          onKeyDown={handleKeyPress}
          autoFocus
          className="mb-3"
        />
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending || !title.trim()}
            size="sm"
            className="trello-blue"
          >
            {isPending ? "Dodawanie..." : "Dodaj listę"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAdding(false);
              setTitle("");
            }}
          >
            Anuluj
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-50 rounded-lg min-w-80 w-80 flex-shrink-0 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
      <Button
        variant="ghost"
        onClick={() => setIsAdding(true)}
        className="w-full h-full p-6 text-gray-600 hover:text-gray-800 flex-col space-y-2"
      >
        <Plus className="h-8 w-8" />
        <p className="font-medium">Dodaj kolejną listę</p>
      </Button>
    </div>
  );
}
