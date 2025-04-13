
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LowStockAlert: React.FC = () => {
  const { getLowStockProducts } = useWarehouse();
  const lowStockProducts = getLowStockProducts();
  
  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-success" />
            Уровень запасов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Нет товаров с низким уровнем запасов.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-danger" />
          Товары с низким уровнем запаса
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.map((stock) => (
            <div key={stock.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{stock.product?.name}</p>
                <p className="text-sm text-muted-foreground">Артикул: {stock.product?.sku}</p>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant={stock.quantity < 5 ? "destructive" : "outline"} className="mb-1">
                  {stock.quantity} шт.
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {stock.product?.location?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
