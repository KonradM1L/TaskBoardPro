import { useLists } from "@/hooks/use-lists";
import { useCards } from "@/hooks/use-cards";
import TaskList from "./TaskList";
import AddListButton from "./AddListButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, List, Clock, CheckSquare } from "lucide-react";
import type { Board } from "@shared/schema";

interface BoardProps {
  board: Board;
}

export default function Board({ board }: BoardProps) {
  const { data: lists, isLoading: listsLoading, error: listsError } = useLists(board.id);
  const { data: allCards, isLoading: cardsLoading } = useCards();

  const totalCards = allCards?.length || 0;
  const totalLists = lists?.length || 0;

  if (listsLoading || cardsLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-4" />
          <div className="flex items-center space-x-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="min-w-80 w-80 h-96 flex-shrink-0" />
          ))}
        </div>
      </main>
    );
  }

  if (listsError) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load board data. Please try again later.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Board Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{board.title}</h2>
            {board.description && (
              <p className="text-gray-600 mt-1">{board.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtruj
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Udostępnij
            </button>
            <button className="trello-blue text-white px-4 py-2 rounded-lg hover:trello-blue-dark transition-colors shadow-sm">
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ustawienia
            </button>
          </div>
        </div>
        
        {/* Board Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <span className="flex items-center">
            <List className="w-4 h-4 mr-2" />
            {totalLists} {totalLists === 1 ? 'lista' : 'listy'}
          </span>
          <span className="flex items-center">
            <CheckSquare className="w-4 h-4 mr-2" />
            {totalCards} {totalCards === 1 ? 'zadanie' : 'zadań'}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Ostatnio aktualizowane 2 godziny temu
          </span>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex space-x-6 overflow-x-auto pb-4 custom-scrollbar">
        {lists?.map((list) => (
          <TaskList key={list.id} list={list} />
        ))}
        <AddListButton boardId={board.id} />
      </div>
    </main>
  );
}
