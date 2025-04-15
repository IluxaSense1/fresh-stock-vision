
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { Package, MapPin, AlertTriangle, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DashboardStats: React.FC = () => {
  const { products, locations, stocks, getExpiringProducts } = useWarehouse();
  
  const totalProducts = products.length;
  const totalLocations = locations.length;
  const lowStockCount = stocks.filter(s => s.quantity < 10).length;
  const expiringCount = getExpiringProducts().length;
  
  const stats = [
    {
      label: 'Всего товаров',
      value: totalProducts,
      icon: <Package className="h-10 w-10 text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300',
      description: 'Общее количество наименований'
    },
    {
      label: 'Локации',
      value: totalLocations,
      icon: <MapPin className="h-10 w-10 text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300',
      description: 'Активные места хранения'
    },
    {
      label: 'Низкий запас',
      value: lowStockCount,
      icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
      color: 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300',
      description: 'Товары требуют пополнения'
    },
    {
      label: 'Истекает срок',
      value: expiringCount,
      icon: <Clock className="h-10 w-10 text-amber-500" />,
      color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300',
      description: 'Скоро истекает срок годности'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="animate-fade-in hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-lg font-medium mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
