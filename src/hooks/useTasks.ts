import { useState, useEffect } from 'react'

// Sample data structure
const sampleLists = [
  { id: '1', title: 'Do zrobienia', color: '#f59e0b' },
  { id: '2', title: 'W trakcie', color: '#3b82f6' },
  { id: '3', title: 'Do sprawdzenia', color: '#f97316' },
  { id: '4', title: 'Ukończone', color: '#10b981' }
]

const sampleTasks = [
  {
    id: '1',
    listId: '1',
    title: 'Zaprojektować interfejs użytkownika',
    description: 'Stworzenie nowoczesnego i intuicyjnego interfejsu dla aplikacji TaskFlow',
    priority: 'high' as const,
    dueDate: '2025-05-30',
    assignee: 'Anna Kowalska',
    tags: ['UI/UX', 'Design', 'Frontend'],
    status: 'todo',
    comments: 3,
    attachments: 2
  },
  {
    id: '2',
    listId: '1',
    title: 'Napisać dokumentację API',
    description: 'Dokumentacja wszystkich endpointów API z przykładami',
    priority: 'medium' as const,
    dueDate: '2025-06-02',
    assignee: 'Jan Nowak',
    tags: ['Dokumentacja', 'API', 'Backend'],
    status: 'todo',
    comments: 1,
    attachments: 0
  },
  {
    id: '3',
    listId: '2',
    title: 'Implementacja kalendarz timeline',
    description: 'Dodanie funkcji wyświetlania zadań w widoku kalendarza',
    priority: 'high' as const,
    dueDate: '2025-05-28',
    assignee: 'Michał Wiśniewski',
    tags: ['Frontend', 'React', 'UI/UX'],
    status: 'in-progress',
    comments: 5,
    attachments: 1
  },
  {
    id: '4',
    listId: '2',
    title: 'Optymalizacja wydajności',
    description: 'Poprawa szybkości ładowania aplikacji',
    priority: 'medium' as const,
    dueDate: '2025-06-05',
    assignee: 'Katarzyna Nowak',
    tags: ['Optymalizacja', 'Performance', 'Frontend'],
    status: 'in-progress',
    comments: 2,
    attachments: 0
  },
  {
    id: '5',
    listId: '3',
    title: 'Testy jednostkowe komponentów',
    description: 'Napisanie kompletnych testów dla wszystkich komponentów React',
    priority: 'medium' as const,
    dueDate: '2025-06-01',
    assignee: 'Tomasz Kowalski',
    tags: ['Testy', 'Jest', 'Quality Assurance'],
    status: 'review',
    comments: 1,
    attachments: 3
  },
  {
    id: '6',
    listId: '4',
    title: 'Konfiguracja środowiska CI/CD',
    description: 'Skonfigurowanie automatycznego wdrażania i testowania',
    priority: 'low' as const,
    dueDate: '2025-05-25',
    assignee: 'Paweł Zieliński',
    tags: ['DevOps', 'CI/CD', 'Automatyzacja'],
    status: 'completed',
    comments: 0,
    attachments: 1
  },
  {
    id: '7',
    listId: '4',
    title: 'Analiza wymagań projektu',
    description: 'Szczegółowa analiza funkcjonalności i wymagań biznesowych',
    priority: 'low' as const,
    dueDate: '2025-05-20',
    assignee: 'Agnieszka Mazur',
    tags: ['Analiza', 'Biznes', 'Planowanie'],
    status: 'completed',
    comments: 4,
    attachments: 2
  },
  {
    id: '8',
    listId: '1',
    title: 'Integracja z bazą danych',
    description: 'Połączenie aplikacji z bazą danych PostgreSQL',
    priority: 'high' as const,
    dueDate: '2025-06-03',
    assignee: 'Jan Nowak',
    tags: ['Backend', 'Database', 'API'],
    status: 'todo',
    comments: 2,
    attachments: 1
  },
  {
    id: '9',
    listId: '2',
    title: 'Dashboard z analityką',
    description: 'Stworzenie dashboardu z statystykami zadań',
    priority: 'high' as const,
    dueDate: '2025-05-29',
    assignee: 'Anna Kowalska',
    tags: ['Frontend', 'Analytics', 'UI/UX'],
    status: 'in-progress',
    comments: 3,
    attachments: 0
  },
  {
    id: '10',
    listId: '1',
    title: 'Responsywny design mobilny',
    description: 'Optymalizacja interfejsu dla urządzeń mobilnych',
    priority: 'medium' as const,
    dueDate: '2025-06-07',
    assignee: 'Michał Wiśniewski',
    tags: ['Mobile', 'Responsive', 'CSS'],
    status: 'todo',
    comments: 1,
    attachments: 0
  },
  {
    id: '11',
    listId: '3',
    title: 'Bezpieczeństwo aplikacji',
    description: 'Audyt bezpieczeństwa i implementacja zabezpieczeń',
    priority: 'high' as const,
    dueDate: '2025-06-04',
    assignee: 'Tomasz Kowalski',
    tags: ['Security', 'Audit', 'Backend'],
    status: 'review',
    comments: 2,
    attachments: 2
  },
  {
    id: '12',
    listId: '2',
    title: 'Notyfikacje push',
    description: 'Sistema powiadomień o zadaniach i terminach',
    priority: 'low' as const,
    dueDate: '2025-06-10',
    assignee: 'Katarzyna Nowak',
    tags: ['Notifications', 'Frontend', 'User Experience'],
    status: 'in-progress',
    comments: 1,
    attachments: 0
  }
]

export function useTasks() {
  const [lists, setLists] = useState(sampleLists)
  const [tasks, setTasks] = useState(sampleTasks)
  const [isLoading, setIsLoading] = useState(false)

  const moveTask = (taskId: string, newListId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, listId: newListId } : task
    ))
  }

  const addTask = (listId: string, taskData: Partial<typeof sampleTasks[0]>) => {
    const newTask = {
      id: Date.now().toString(),
      listId,
      title: taskData.title || 'Nowe zadanie',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      assignee: taskData.assignee,
      tags: taskData.tags || [],
      status: 'todo',
      comments: 0,
      attachments: 0
    }
    setTasks(prev => [...prev, newTask])
  }

  const updateTask = (taskId: string, updates: Partial<typeof sampleTasks[0]>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  return {
    lists,
    tasks,
    isLoading,
    moveTask,
    addTask,
    updateTask,
    deleteTask
  }
}