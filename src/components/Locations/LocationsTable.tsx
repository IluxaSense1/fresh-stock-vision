
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { MapPin, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LocationsTable: React.FC = () => {
  const { locations, products } = useWarehouse();
  
  // Count products per location
  const getProductCount = (locationId: number) => {
    return products.filter(p => p.location_id === locationId).length;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Локации хранения</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить локацию
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <div key={location.id} className="card-dashboard group">
              <div className="flex justify-between items-start mb-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Изменить
                </Button>
              </div>
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{location.description}</p>
              <div className="flex items-center mt-4 text-muted-foreground">
                <Package className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{getProductCount(location.id)} товаров</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationsTable;
