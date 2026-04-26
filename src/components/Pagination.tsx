

import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-6 mb-4">
      {/* Go to first page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>

      {/* Previous page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Current Page */}
      <span className="px-6 py-2 border rounded-md bg-primary text-white font-medium select-none">
        {currentPage} / {totalPages}
      </span>

      {/* Next page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Go to last page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
