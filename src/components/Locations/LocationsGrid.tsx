
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { MapPin, Package, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LocationsGrid: React.FC = () => {
  const { locations, products } = useWarehouse();
  
  const getProductCount = (locationId: number) => {
    return products.filter(p => p.location_id === locationId).length;
  };
  
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <Card key={location.id} className="group hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/10 p-2">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">Склад #{location.id}</Badge>
            </div>
            <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl mb-2">{location.name}</CardTitle>
            <CardDescription className="mb-4 line-clamp-2">
              {location.description}
            </CardDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{getProductCount(location.id)} товаров</span>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Подробнее <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LocationsGrid;
