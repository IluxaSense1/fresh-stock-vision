
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { Package, MapPin, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DashboardStats: React.FC = () => {
  const { products, locations, stocks, getExpiringProducts } = useWarehouse();
  
  const totalProducts = products.length;
  const totalLocations = locations.length;
  const lowStockCount = stocks.filter(s => s.quantity < 10).length;
  const expiringCount = getExpiringProducts().length;
  
  const stats = [
    {
      label: 'Товаров',
      value: totalProducts,
      icon: <Package className="h-10 w-10 text-blue-500" />,
      color: 'bg-blue-50 text-blue-800'
    },
    {
      label: 'Локаций',
      value: totalLocations,
      icon: <MapPin className="h-10 w-10 text-purple-500" />,
      color: 'bg-purple-50 text-purple-800'
    },
    {
      label: 'Низкий запас',
      value: lowStockCount,
      icon: <AlertTriangle className="h-10 w-10 text-danger" />,
      color: 'bg-red-50 text-red-800'
    },
    {
      label: 'Истекает срок',
      value: expiringCount,
      icon: <Clock className="h-10 w-10 text-warning" />,
      color: 'bg-amber-50 text-amber-800'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="stats-value">{stat.value}</p>
                <p className="stats-label">{stat.label}</p>
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
