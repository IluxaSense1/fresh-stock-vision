
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import SalesChart from '@/components/Sales/SalesChart';
import { WarehouseProvider } from '@/context/WarehouseContext';

const Sales: React.FC = () => {
  return (
    <WarehouseProvider>
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Анализ продаж</h1>
          <p className="text-muted-foreground">Отчеты и статистика по продажам товаров</p>
        </div>
        
        <SalesChart />
      </MainLayout>
    </WarehouseProvider>
  );
};

export default Sales;
