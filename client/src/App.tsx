import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DndProvider } from "./lib/dnd";
import BoardPage from "@/pages/BoardPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={BoardPage} />
      <Route path="/board/:id" component={BoardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DndProvider>
          <Toaster />
          <Router />
        </DndProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
