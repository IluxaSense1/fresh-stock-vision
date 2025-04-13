
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  BarChart, 
  TrendingUp, 
  Bell, 
  UserCircle, 
  Settings, 
  Menu,
  X
} from 'lucide-react';
import { useWarehouse } from '@/context/WarehouseContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { notifications } = useWarehouse();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navigationItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Дашборд' },
    { path: '/inventory', icon: <Package size={20} />, label: 'Инвентарь' },
    { path: '/locations', icon: <MapPin size={20} />, label: 'Локации' },
    { path: '/sales', icon: <BarChart size={20} />, label: 'Продажи' },
    { path: '/forecasting', icon: <TrendingUp size={20} />, label: 'Прогнозы' },
    { 
      path: '/notifications', 
      icon: <Bell size={20} />, 
      label: 'Уведомления', 
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "h-screen w-64 bg-sidebar fixed left-0 top-0 z-50 flex flex-col transition-transform duration-300 shadow-lg",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            StockVision
          </h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X size={20} />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => cn(
                    "sidebar-link",
                    isActive && "active"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-danger text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-sidebar-border mt-6 pt-6">
            <ul className="space-y-1">
              <li>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => cn(
                    "sidebar-link",
                    isActive && "active"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <UserCircle size={20} />
                  <span>Профиль</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => cn(
                    "sidebar-link",
                    isActive && "active"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Settings size={20} />
                  <span>Настройки</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-semibold">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Администратор</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile toggle button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 right-4 z-30 md:hidden shadow-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu />
      </Button>
    </>
  );
};

export default Sidebar;
