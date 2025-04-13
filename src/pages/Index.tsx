
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import LowStockAlert from '@/components/Dashboard/LowStockAlert';
import ExpiringProducts from '@/components/Dashboard/ExpiringProducts';
import { WarehouseProvider } from '@/context/WarehouseContext';

const Dashboard: React.FC = () => {
  return (
    <WarehouseProvider>
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Панель управления</h1>
          <p className="text-muted-foreground">Обзор основных показателей склада</p>
        </div>
        
        <div className="mb-8">
          <DashboardStats />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LowStockAlert />
          <ExpiringProducts />
        </div>
      </MainLayout>
    </WarehouseProvider>
  );
};

export default Dashboard;
