
import React, { useState } from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProductTable: React.FC = () => {
  const { products, stocks } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Combine products with stock information
  const productsWithStock = products.map(product => {
    const stock = stocks.find(s => s.product_id === product.id);
    return {
      ...product,
      stock: stock ? stock.quantity : 0
    };
  });
  
  // Filter products based on search term
  const filteredProducts = productsWithStock.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Function to determine badge color based on stock level
  const getStockBadgeVariant = (quantity: number) => {
    if (quantity <= 5) return "destructive";
    if (quantity <= 10) return "warning";
    return "success";
  };
  
  // Function to format price
  const formatPrice = (price: number) => {
    return price.toFixed(2) + ' ₽';
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Список товаров</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск товаров..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Артикул</th>
                <th className="table-header">Название</th>
                <th className="table-header">Локация</th>
                <th className="table-header">Цена</th>
                <th className="table-header">Срок годности</th>
                <th className="table-header">Остаток</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td className="table-cell font-medium">{product.sku}</td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.description}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-block px-2 py-1 rounded-md bg-secondary text-xs">
                        {product.location?.name}
                      </span>
                    </td>
                    <td className="table-cell">{formatPrice(product.price)}</td>
                    <td className="table-cell">
                      {format(new Date(product.expiration_date), 'dd MMM yyyy', { locale: ru })}
                    </td>
                    <td className="table-cell">
                      <Badge variant={getStockBadgeVariant(product.stock)}>
                        {product.stock} шт.
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8 text-muted-foreground">
                    {searchTerm ? 'Товары не найдены. Попробуйте изменить поисковый запрос.' : 'Нет доступных товаров.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTable;
