
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import NotificationList from '@/components/Notifications/NotificationList';
import { WarehouseProvider } from '@/context/WarehouseContext';

const Notifications: React.FC = () => {
  return (
    <WarehouseProvider>
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Центр уведомлений</h1>
          <p className="text-muted-foreground">Оповещения о важных событиях и состоянии склада</p>
        </div>
        
        <NotificationList />
      </MainLayout>
    </WarehouseProvider>
  );
};

export default Notifications;
