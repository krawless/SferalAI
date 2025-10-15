import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Cube, ChartLine, Sun } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChartWrapper } from '@/components/ChartWrapper';
import { formatDecimal, addDecimal, multiplyDecimal } from '@/lib/utils';

const chartData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
];

export function HomePage() {
  const [count, setCount] = useState(0);
  const [price, setPrice] = useState('19.99');
  const [quantity, setQuantity] = useState('3');

  const total = formatDecimal(multiplyDecimal(price, quantity));
  const taxRate = '0.15';
  const tax = formatDecimal(multiplyDecimal(total, taxRate));
  const grandTotal = formatDecimal(addDecimal(total, tax));

  return (
    <div className="min-h-[calc(100vh-12rem)]">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <section>
            <h2 className="text-3xl font-bold mb-2">Welcome to Your Template</h2>
            <p className="text-muted-foreground">
              A modern React + Vite template with Tailwind CSS 3, shadcn/ui, Phosphor Icons, and
              Recharts
            </p>
          </section>

          {/* Feature Cards */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cube size={24} weight="duotone" className="text-primary" />
                  <CardTitle>shadcn/ui Components</CardTitle>
                </div>
                <CardDescription>Beautiful, accessible components</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pre-built components styled with Tailwind CSS and fully customizable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ChartLine size={24} weight="duotone" className="text-primary" />
                  <CardTitle>Recharts Integration</CardTitle>
                </div>
                <CardDescription>Beautiful data visualizations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Powerful charting library with theme-aware colors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sun size={24} weight="duotone" className="text-primary" />
                  <CardTitle>Dark Mode Support</CardTitle>
                </div>
                <CardDescription>Light and dark themes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Seamless theme switching with localStorage persistence.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Interactive Demo */}
          <section className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Demo</CardTitle>
                <CardDescription>Try out the components and decimal math utilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button onClick={() => setCount(count + 1)}>Count is {count}</Button>
                  <p className="text-sm text-muted-foreground">
                    Click the button to increment the counter
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="font-medium">${total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (15%):</span>
                    <span className="font-medium">${tax}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${grandTotal}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ✓ Calculated using Decimal.js for precise math (no floating-point errors)
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Chart Demo */}
          <section>
            <ChartWrapper
              title="Revenue & Expenses"
              description="Monthly financial overview with theme-aware colors"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-1))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </section>
        </div>
      </main>
    </div>
  );
}

