import React from 'react'
import { X, Calendar, User, Tag } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: {
    id: string
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    assignee?: string
    tags?: string[]
    status?: string
  }
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  if (!isOpen) return null

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  }

  const priorityLabels = {
    low: 'Niski',
    medium: 'Średni', 
    high: 'Wysoki'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          {task.description && (
            <div>
              <h4 className="font-medium mb-2">Opis</h4>
              <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            {task.priority && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Priorytet
                </h4>
                <Badge className={priorityColors[task.priority]}>
                  {priorityLabels[task.priority]}
                </Badge>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Termin
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {format(new Date(task.dueDate), 'd MMMM yyyy', { locale: pl })}
                </p>
              </div>
            )}

            {/* Assignee */}
            {task.assignee && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Przypisane do
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{task.assignee}</p>
              </div>
            )}

            {/* Status */}
            {task.status && (
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <Badge variant="outline">{task.status}</Badge>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Etykiety</h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Zamknij
            </Button>
            <Button>Edytuj zadanie</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}