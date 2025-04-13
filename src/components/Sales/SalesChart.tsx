
import React, { useMemo } from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowUpRight } from 'lucide-react';

const SalesChart: React.FC = () => {
  const { salesData, products } = useWarehouse();
  
  // Group sales data by date
  const salesByDate = useMemo(() => {
    const groupedData: Record<string, { date: string; total: number }> = {};
    
    salesData.forEach(sale => {
      const { sale_date, quantity_sold, product_id } = sale;
      const product = products.find(p => p.id === product_id);
      
      if (!product) return;
      
      const totalSale = quantity_sold * product.price;
      
      if (!groupedData[sale_date]) {
        groupedData[sale_date] = {
          date: sale_date,
          total: 0
        };
      }
      
      groupedData[sale_date].total += totalSale;
    });
    
    return Object.values(groupedData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [salesData, products]);
  
  // Group sales data by product
  const salesByProduct = useMemo(() => {
    const groupedData: Record<number, { id: number; name: string; total: number; quantity: number }> = {};
    
    salesData.forEach(sale => {
      const { product_id, quantity_sold } = sale;
      const product = products.find(p => p.id === product_id);
      
      if (!product) return;
      
      const totalSale = quantity_sold * product.price;
      
      if (!groupedData[product_id]) {
        groupedData[product_id] = {
          id: product_id,
          name: product.name,
          total: 0,
          quantity: 0
        };
      }
      
      groupedData[product_id].total += totalSale;
      groupedData[product_id].quantity += quantity_sold;
    });
    
    return Object.values(groupedData)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Top 5 products
  }, [salesData, products]);
  
  // Format the date for the XAxis
  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), 'dd MMM', { locale: ru });
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border shadow-md rounded-md p-2 text-sm">
          <p className="font-medium">{format(parseISO(label), 'dd MMMM yyyy', { locale: ru })}</p>
          <p>Продажи: <span className="font-medium">{payload[0].value.toFixed(2)} ₽</span></p>
        </div>
      );
    }
    return null;
  };
  
  // Calculate total sales
  const totalSales = salesByDate.reduce((sum, item) => sum + item.total, 0);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Продажи по дням</CardTitle>
            <div className="flex items-center text-success text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12% к прошлой неделе
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold">{totalSales.toFixed(2)} ₽</p>
              <p className="text-muted-foreground text-sm">Общая сумма продаж</p>
            </div>
          </div>
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByDate}>
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
                  tickFormatter={(value) => `${value} ₽`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Топ продуктов по продажам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByProduct}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  interval={0}
                  tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value} ₽`}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="total" 
                  name="Сумма (₽)" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="quantity" 
                  name="Количество (шт.)" 
                  fill="hsl(var(--accent-foreground))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesChart;
