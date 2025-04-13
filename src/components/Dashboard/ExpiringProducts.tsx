
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

const ExpiringProducts: React.FC = () => {
  const { getExpiringProducts } = useWarehouse();
  const expiringProducts = getExpiringProducts();
  
  if (expiringProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-success" />
            Сроки годности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">В ближайшее время нет истекающих сроков годности.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" />
          Истекающие сроки годности
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringProducts.map((product) => {
            const today = new Date();
            const expirationDate = new Date(product.expiration_date);
            const daysLeft = differenceInDays(expirationDate, today);
            
            return (
              <div key={product.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">Артикул: {product.sku}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`badge ${daysLeft <= 3 ? 'badge-danger' : 'badge-warning'}`}>
                    {daysLeft} дн.
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Истекает: {format(expirationDate, 'dd MMM yyyy', { locale: ru })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiringProducts;
