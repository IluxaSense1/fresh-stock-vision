
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for our data models
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'logistician' | 'warehouse_keeper';
}

export interface Location {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  expiration_date: string;
  location_id: number;
  location?: Location;
}

export interface Stock {
  id: number;
  product_id: number;
  quantity: number;
  updated_at: string;
  product?: Product;
}

export interface SalesData {
  id: number;
  product_id: number;
  quantity_sold: number;
  sale_date: string;
  product?: Product;
}

export interface Forecast {
  id: number;
  product_id: number;
  forecast_date: string;
  predicted_quantity: number;
  created_at: string;
  product?: Product;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  user?: User;
}

// Sample data
const sampleLocations: Location[] = [
  { id: 1, name: 'Основной склад', description: 'Главный склад компании, расположенный в центре города.' },
  { id: 2, name: 'Склад охлажденных товаров', description: 'Помещение с температурным режимом для хранения скоропортящихся продуктов.' },
  { id: 3, name: 'Витрина магазина', description: 'Зона для демонстрации товаров в торговом зале, где продукты выставлены на продажу.' }
];

const sampleProducts: Product[] = [
  { id: 1, sku: 'MILK001', name: 'Молоко пастеризованное 2,5% 1л', description: 'Пастеризованное молоко с нормальной жирностью.', price: 1.50, expiration_date: '2025-04-20', location_id: 2 },
  { id: 2, sku: 'BREAD001', name: 'Хлеб белый', description: 'Свежий белый хлеб, выпеченный сегодня.', price: 0.80, expiration_date: '2025-04-15', location_id: 3 },
  { id: 3, sku: 'EGGS001', name: 'Яйца куриные (10 шт.)', description: 'Упаковка с 10 свежими куриными яйцами.', price: 2.50, expiration_date: '2025-04-25', location_id: 1 },
  { id: 4, sku: 'APPLE001', name: 'Яблоки Гренни Смит, 1 кг', description: 'Свежие яблоки сорта Гренни Смит.', price: 3.00, expiration_date: '2025-05-10', location_id: 1 },
  { id: 5, sku: 'CHEESE001', name: 'Сыр Чеддер 250 г', description: 'Твердый сыр Чеддер, выдержка 3 месяца.', price: 4.00, expiration_date: '2025-06-01', location_id: 2 }
];

const sampleStocks: Stock[] = [
  { id: 1, product_id: 1, quantity: 5, updated_at: '2025-04-10 09:00:00' },
  { id: 2, product_id: 2, quantity: 30, updated_at: '2025-04-10 09:00:00' },
  { id: 3, product_id: 3, quantity: 20, updated_at: '2025-04-10 09:00:00' },
  { id: 4, product_id: 4, quantity: 45, updated_at: '2025-04-10 09:00:00' },
  { id: 5, product_id: 5, quantity: 12, updated_at: '2025-04-10 09:00:00' }
];

const sampleSalesData: SalesData[] = [
  { id: 1, product_id: 1, quantity_sold: 10, sale_date: '2025-04-08' },
  { id: 2, product_id: 1, quantity_sold: 15, sale_date: '2025-04-09' },
  { id: 3, product_id: 1, quantity_sold: 12, sale_date: '2025-04-10' },
  { id: 4, product_id: 2, quantity_sold: 20, sale_date: '2025-04-08' },
  { id: 5, product_id: 2, quantity_sold: 25, sale_date: '2025-04-09' },
  { id: 6, product_id: 3, quantity_sold: 8, sale_date: '2025-04-08' },
  { id: 7, product_id: 3, quantity_sold: 12, sale_date: '2025-04-09' },
  { id: 8, product_id: 4, quantity_sold: 5, sale_date: '2025-04-08' },
  { id: 9, product_id: 4, quantity_sold: 7, sale_date: '2025-04-09' },
  { id: 10, product_id: 5, quantity_sold: 3, sale_date: '2025-04-08' },
  { id: 11, product_id: 5, quantity_sold: 4, sale_date: '2025-04-09' }
];

const sampleForecasts: Forecast[] = [
  { id: 1, product_id: 1, forecast_date: '2025-04-17', predicted_quantity: 18, created_at: '2025-04-10 10:00:00' },
  { id: 2, product_id: 2, forecast_date: '2025-04-17', predicted_quantity: 22, created_at: '2025-04-10 10:00:00' },
  { id: 3, product_id: 3, forecast_date: '2025-04-17', predicted_quantity: 10, created_at: '2025-04-10 10:00:00' },
  { id: 4, product_id: 4, forecast_date: '2025-04-17', predicted_quantity: 8, created_at: '2025-04-10 10:00:00' },
  { id: 5, product_id: 5, forecast_date: '2025-04-17', predicted_quantity: 5, created_at: '2025-04-10 10:00:00' }
];

const sampleNotifications: Notification[] = [
  { 
    id: 1, 
    user_id: 5, 
    message: 'Низкий остаток для Молока пастеризованного 2,5% 1л. Осталось: 5 единиц.', 
    created_at: '2025-04-10 11:00:00', 
    is_read: false 
  },
  { 
    id: 2, 
    user_id: 6, 
    message: 'Срок годности для Хлеба белого подходит к концу: 2025-04-15.', 
    created_at: '2025-04-10 11:05:00', 
    is_read: false 
  },
  { 
    id: 3, 
    user_id: 5, 
    message: 'Прогноз продаж показывает, что запасы Сыра Чеддер закончатся через 3 дня.', 
    created_at: '2025-04-10 11:10:00', 
    is_read: true 
  }
];

const sampleUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
  { id: 5, username: 'logistics1', email: 'logistics1@example.com', role: 'logistician' },
  { id: 6, username: 'warehouse1', email: 'warehouse1@example.com', role: 'warehouse_keeper' }
];

// Enrich data with relations
const enrichedProducts = sampleProducts.map(product => ({
  ...product,
  location: sampleLocations.find(loc => loc.id === product.location_id)
}));

const enrichedStocks = sampleStocks.map(stock => ({
  ...stock,
  product: enrichedProducts.find(product => product.id === stock.product_id)
}));

const enrichedSalesData = sampleSalesData.map(sale => ({
  ...sale,
  product: enrichedProducts.find(product => product.id === sale.product_id)
}));

const enrichedForecasts = sampleForecasts.map(forecast => ({
  ...forecast,
  product: enrichedProducts.find(product => product.id === forecast.product_id)
}));

const enrichedNotifications = sampleNotifications.map(notification => ({
  ...notification,
  user: sampleUsers.find(user => user.id === notification.user_id)
}));

// Context type
interface WarehouseContextType {
  locations: Location[];
  products: Product[];
  stocks: Stock[];
  salesData: SalesData[];
  forecasts: Forecast[];
  notifications: Notification[];
  users: User[];
  currentUser: User | null;
  markNotificationAsRead: (id: number) => void;
  getLowStockProducts: () => Stock[];
  getExpiringProducts: () => Product[];
}

// Create context
const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// Provider component
export const WarehouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locations] = useState<Location[]>(sampleLocations);
  const [products] = useState<Product[]>(enrichedProducts);
  const [stocks] = useState<Stock[]>(enrichedStocks);
  const [salesData] = useState<SalesData[]>(enrichedSalesData);
  const [forecasts] = useState<Forecast[]>(enrichedForecasts);
  const [notifications, setNotifications] = useState<Notification[]>(enrichedNotifications);
  const [users] = useState<User[]>(sampleUsers);
  // For demo, we'll set the current user as the admin
  const [currentUser] = useState<User | null>(sampleUsers[0]);

  // Mark notification as read
  const markNotificationAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, is_read: true } : notification
      )
    );
  };

  // Get products with low stock (less than 10 units)
  const getLowStockProducts = () => {
    return stocks.filter(stock => stock.quantity < 10);
  };

  // Get products expiring within 7 days
  const getExpiringProducts = () => {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    
    return products.filter(product => {
      const expirationDate = new Date(product.expiration_date);
      return expirationDate <= sevenDaysLater && expirationDate >= today;
    });
  };

  const value = {
    locations,
    products,
    stocks,
    salesData,
    forecasts,
    notifications,
    users,
    currentUser,
    markNotificationAsRead,
    getLowStockProducts,
    getExpiringProducts
  };

  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  );
};

// Custom hook to use the context
export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
