import { Bell, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="trello-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">TaskFlow</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-gray-200 transition-colors">
                Tablice
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                Zespoły
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                Kalendarz
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <UserCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
