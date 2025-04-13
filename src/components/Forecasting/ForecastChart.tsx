
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, subDays, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ForecastChart: React.FC = () => {
  const { forecasts, salesData, products, stocks } = useWarehouse();
  
  // Get a specific product for demonstration
  const selectedProductId = 1; // Milk
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedStock = stocks.find(s => s.product_id === selectedProductId);
  
  // Get historical sales data for the product
  const productSales = salesData
    .filter(sale => sale.product_id === selectedProductId)
    .sort((a, b) => new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime());
  
  // Get forecast data for the product
  const productForecast = forecasts
    .filter(forecast => forecast.product_id === selectedProductId)
    .sort((a, b) => new Date(a.forecast_date).getTime() - new Date(b.forecast_date).getTime());
  
  // Combine historical and forecast data for chart
  const today = new Date();
  const chartData = [
    ...productSales.map(sale => ({
      date: sale.sale_date,
      actual: sale.quantity_sold,
      forecast: null,
      type: 'historical'
    })),
    // Today's data point (connecting historical and forecast)
    {
      date: format(today, 'yyyy-MM-dd'),
      actual: null,
      forecast: productSales[productSales.length - 1]?.quantity_sold || 0,
      type: 'today'
    },
    ...productForecast.map(forecast => ({
      date: forecast.forecast_date,
      actual: null,
      forecast: forecast.predicted_quantity,
      type: 'forecast'
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Format the date for the XAxis
  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'dd MMM', { locale: ru });
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border shadow-md rounded-md p-2 text-sm">
          <p className="font-medium">{format(parseISO(label), 'dd MMMM yyyy', { locale: ru })}</p>
          {data.actual !== null && (
            <p>Фактические продажи: <span className="font-medium">{data.actual} шт.</span></p>
          )}
          {data.forecast !== null && (
            <p>Прогноз: <span className="font-medium">{data.forecast} шт.</span></p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Calculate when stock will be depleted based on forecast
  const calculateStockDepletion = () => {
    if (!selectedStock) return null;
    
    let remainingStock = selectedStock.quantity;
    let depletionDate = null;
    
    for (const forecast of productForecast) {
      remainingStock -= forecast.predicted_quantity;
      
      if (remainingStock <= 0 && !depletionDate) {
        depletionDate = forecast.forecast_date;
        break;
      }
    }
    
    return { 
      date: depletionDate, 
      daysUntil: depletionDate ? 
        Math.max(0, Math.ceil((new Date(depletionDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : 
        null 
    };
  };
  
  const depletion = calculateStockDepletion();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Прогноз продаж: {selectedProduct?.name}</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Как работает прогноз
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <p className="stats-label">Текущий запас</p>
              <p className="stats-value">{selectedStock?.quantity || 0} шт.</p>
            </div>
            {depletion?.date && (
              <div>
                <p className="stats-label">Запасы закончатся</p>
                <p className="stats-value">
                  {format(parseISO(depletion.date), 'dd MMM yyyy', { locale: ru })}
                </p>
                <p className="text-xs text-danger font-medium">
                  Через {depletion.daysUntil} дней
                </p>
              </div>
            )}
            <div>
              <p className="stats-label">Рекомендуемое пополнение</p>
              <p className="stats-value">25 шт.</p>
            </div>
          </div>
          
          <div className="h-[300px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine 
                  x={format(today, 'yyyy-MM-dd')} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="3 3"
                  label={{ value: 'Сегодня', position: 'insideTopLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                />
                {depletion?.date && (
                  <ReferenceLine 
                    x={depletion.date} 
                    stroke="hsl(var(--destructive))" 
                    strokeDasharray="3 3"
                    label={{ value: 'Запасы закончатся', position: 'insideTopRight', fill: 'hsl(var(--destructive))', fontSize: 12 }} 
                  />
                )}
                <ReferenceLine 
                  y={0} 
                  stroke="hsl(var(--border))" 
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Фактические продажи" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Прогноз" 
                  stroke="hsl(var(--info))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ stroke: 'hsl(var(--info))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Прогнозы по товарам</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Товар</TableHead>
                <TableHead>Текущий запас</TableHead>
                <TableHead>Прогноз на 7 дней</TableHead>
                <TableHead>Рекомендуемое пополнение</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.slice(0, 5).map((product) => {
                const stock = stocks.find(s => s.product_id === product.id);
                const productForecasts = forecasts.filter(f => f.product_id === product.id);
                const totalForecast = productForecasts.reduce((sum, f) => sum + f.predicted_quantity, 0);
                const remainingDays = stock && totalForecast > 0 ? 
                  Math.floor(stock.quantity / (totalForecast / productForecasts.length)) : 
                  null;
                
                let status = "badge-success";
                let statusText = "В норме";
                
                if (remainingDays !== null) {
                  if (remainingDays <= 3) {
                    status = "badge-danger";
                    statusText = "Критично";
                  } else if (remainingDays <= 7) {
                    status = "badge-warning";
                    statusText = "Требуется пополнение";
                  }
                }
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{stock?.quantity || 0} шт.</TableCell>
                    <TableCell>{totalForecast} шт.</TableCell>
                    <TableCell>{Math.max(0, totalForecast - (stock?.quantity || 0))} шт.</TableCell>
                    <TableCell>
                      <div className={status}>
                        {statusText}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastChart;
