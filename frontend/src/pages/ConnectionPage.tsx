import { useState, useEffect } from 'react';
import { Database, Warning, CircleNotch } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Connection {
  id: number;
  name: string;
  host: string;
  port: number;
  database: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function ConnectionPage() {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConnection();
  }, []);

  const fetchConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/connection`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch connection: ${response.statusText}`);
      }
      
      const result = await response.json();
      setConnection(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Database size={32} weight="duotone" className="text-primary" />
              Database Connection
            </h1>
            <p className="text-muted-foreground">
              View information about the active database connection
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 text-muted-foreground py-8">
                  <CircleNotch size={24} className="animate-spin" />
                  <span>Loading connection details...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 text-destructive">
                  <Warning size={24} weight="fill" />
                  <div>
                    <p className="font-medium mb-1">Error Loading Connection</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connection Details */}
          {connection && !loading && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database size={24} weight="duotone" className="text-primary" />
                  {connection.name}
                </CardTitle>
                <CardDescription>
                  Connection established on{' '}
                  {new Date(connection.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Connection Details Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Host</p>
                      <p className="text-base font-mono">{connection.host}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Port</p>
                      <p className="text-base font-mono">{connection.port}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Database</p>
                      <p className="text-base font-mono">{connection.database}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            connection.status === 'active'
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                        <p className="text-base capitalize">{connection.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t">
                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Connection ID</p>
                        <p className="font-mono">#{connection.id}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Last Updated</p>
                        <p>
                          {new Date(connection.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connection String Info */}
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium mb-2">Connection String Format</p>
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      mysql://user:password@{connection.host}:{connection.port}/{connection.database}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

