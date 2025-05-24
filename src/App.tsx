import { Router, Route, Switch } from 'wouter'
import { BoardPage } from './pages/BoardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <Switch>
          <Route path="/" component={BoardPage} />
          <Route path="/board/:boardId" component={BoardPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <Toaster />
      </div>
    </Router>
  )
}

export default App