
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import LocationsGrid from '@/components/Locations/LocationsGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WarehouseProvider } from '@/context/WarehouseContext';

const Locations: React.FC = () => {
  return (
    <WarehouseProvider>
      <MainLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Локации хранения</h1>
            <p className="text-muted-foreground text-lg">
              Управление местами хранения товаров и их распределением
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Добавить локацию
          </Button>
        </div>
        
        <LocationsGrid />
      </MainLayout>
    </WarehouseProvider>
  );
};

export default Locations;
