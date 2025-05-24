import React, { useState } from 'react'
import { Plus, Calendar, LayoutGrid, BarChart3 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { TaskBoard } from '../components/TaskBoard'
import { TimelineCalendar } from '../components/TimelineCalendar'
import { Dashboard } from '../components/Dashboard'

export function BoardPage() {
  const [viewMode, setViewMode] = useState<'board' | 'calendar' | 'dashboard'>('board')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              TaskFlow
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Zarządzaj projektami z kalendarzem timeline
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'board' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('board')}
              className="flex items-center space-x-2"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Tablica</span>
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Kalendarz</span>
            </Button>
            <Button
              variant={viewMode === 'dashboard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('dashboard')}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'board' && <TaskBoard />}
        {viewMode === 'calendar' && <TimelineCalendar />}
        {viewMode === 'dashboard' && <Dashboard />}
      </div>
    </div>
  )
}