
import React, { useState } from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { Calendar, FileText, Search, Trash2, Edit, Package } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

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
  const filteredProducts = productsWithStock.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    );
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd MMM yyyy', { locale: ru });
  };
  
  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity <= 5) return { status: 'low', label: 'Низкий' };
    if (quantity <= 15) return { status: 'medium', label: 'Средний' };
    return { status: 'good', label: 'Хороший' };
  };
  
  // Get badge variant based on stock status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'low':
        return 'destructive';
      case 'medium':
        return 'outline'; // Changed from 'warning' to 'outline'
      case 'good':
        return 'secondary'; // Changed from 'success' to 'secondary'
      default:
        return 'default';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Товары</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Добавить товар
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Артикул</TableHead>
                <TableHead>Наименование</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Остаток</TableHead>
                <TableHead>Срок годности</TableHead>
                <TableHead>Локация</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Товары не найдены. Попробуйте изменить параметры поиска.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.sku}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.price.toFixed(2)} ₽
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(stockStatus.status)} className="font-semibold">
                          {product.stock} • {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(product.expiration_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.location?.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTable;
