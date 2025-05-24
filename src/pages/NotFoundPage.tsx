import React from 'react'
import { Link } from 'wouter'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Strona nie została znaleziona
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Nie możemy znaleźć strony, której szukasz. Sprawdź adres URL lub wróć do strony głównej.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Strona główna</span>
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wróć
          </Button>
        </div>
      </div>
    </div>
  )
}