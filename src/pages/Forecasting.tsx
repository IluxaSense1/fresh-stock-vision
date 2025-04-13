
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import ForecastChart from '@/components/Forecasting/ForecastChart';
import { WarehouseProvider } from '@/context/WarehouseContext';

const Forecasting: React.FC = () => {
  return (
    <WarehouseProvider>
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Прогнозирование запасов</h1>
          <p className="text-muted-foreground">Анализ и прогнозирование будущих продаж и запасов</p>
        </div>
        
        <ForecastChart />
      </MainLayout>
    </WarehouseProvider>
  );
};

export default Forecasting;
