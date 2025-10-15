import { Link, useLocation } from 'react-router-dom';
import { House, Database } from '@phosphor-icons/react';

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          <Link
            to="/"
            className={`
              flex items-center gap-2 px-3 py-3 border-b-2 transition-colors
              ${isActive('/') 
                ? 'border-primary text-foreground font-medium' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }
            `}
          >
            <House size={20} weight={isActive('/') ? 'fill' : 'regular'} />
            <span>Home</span>
          </Link>
          
          <Link
            to="/connection"
            className={`
              flex items-center gap-2 px-3 py-3 border-b-2 transition-colors
              ${isActive('/connection') 
                ? 'border-primary text-foreground font-medium' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }
            `}
          >
            <Database size={20} weight={isActive('/connection') ? 'fill' : 'regular'} />
            <span>Connection</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

