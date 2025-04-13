
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import LocationsTable from '@/components/Locations/LocationsTable';
import { WarehouseProvider } from '@/context/WarehouseContext';

const Locations: React.FC = () => {
  return (
    <WarehouseProvider>
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Локации хранения</h1>
          <p className="text-muted-foreground">Управление местами хранения товаров</p>
        </div>
        
        <LocationsTable />
      </MainLayout>
    </WarehouseProvider>
  );
};

export default Locations;
