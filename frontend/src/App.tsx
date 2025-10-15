import { Routes, Route } from 'react-router-dom';
import { Cube } from '@phosphor-icons/react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/pages/HomePage';
import { ConnectionPage } from '@/pages/ConnectionPage';

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cube size={32} weight="duotone" className="text-primary" />
            <h1 className="text-2xl font-bold">Reusable Template</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Navigation Tabs */}
      <Navigation />

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/connection" element={<ConnectionPage />} />
      </Routes>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Built with React + Vite, Tailwind CSS 3, shadcn/ui, Phosphor Icons, and Recharts</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
