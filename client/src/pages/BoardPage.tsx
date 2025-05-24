import { useParams } from "wouter";
import { useBoards } from "@/hooks/use-boards";
import Header from "@/components/Header";
import Board from "@/components/Board";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function BoardPage() {
  const { id } = useParams();
  const boardId = id ? parseInt(id) : 1; // Default to first board
  const { data: boards, isLoading, error } = useBoards();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="min-w-80 w-80 h-96 flex-shrink-0" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load boards. Please try again later.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const board = boards?.find(b => b.id === boardId) || boards?.[0];

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No boards found. Create your first board to get started.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Board board={board} />
    </div>
  );
}
