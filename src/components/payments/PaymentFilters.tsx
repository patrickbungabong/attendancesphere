
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaymentMethod } from '@/types';

interface PaymentFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  methodFilter: PaymentMethod | null;
  setMethodFilter: (method: PaymentMethod | null) => void;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  methodFilter,
  setMethodFilter,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search payments..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            {methodFilter ? `Method: ${methodFilter}` : 'Filter by method'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setMethodFilter(null)}>
            All Methods
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMethodFilter('cash')}>
            Cash
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMethodFilter('bank-transfer')}>
            Bank Transfer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMethodFilter('gcash')}>
            GCash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
