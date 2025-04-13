
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import ProductTable from '@/components/Inventory/ProductTable';
import { WarehouseProvider } from '@/context/WarehouseContext';

const Inventory: React.FC = () => {
  return (
    <WarehouseProvider>
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Управление инвентарем</h1>
          <p className="text-muted-foreground">Просмотр и управление товарами на складе</p>
        </div>
        
        <ProductTable />
      </MainLayout>
    </WarehouseProvider>
  );
};

export default Inventory;
