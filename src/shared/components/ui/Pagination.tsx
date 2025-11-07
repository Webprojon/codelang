import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePagination } from '../../hooks/usePagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  className = '',
}: PaginationProps) {
  const { handlePrevious, handleNext, isPreviousDisabled, isNextDisabled } = usePagination({
    currentPage,
    totalPages,
    isLoading,
    onPageChange,
  });

  return (
    <div className={`flex justify-center items-center gap-4 ${className}`}>
      <button
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        className={`hover:bg-gray-200 px-3 py-3 rounded cursor-pointer transition-colors ${
          isPreviousDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Previous page"
      >
        <FaChevronLeft className="text-gray-400 size-3" />
      </button>
      <div className="px-4 py-2 text-sm bg-gray-100 rounded font-semibold text-gray-400">
        {currentPage} / {totalPages}
      </div>
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`hover:bg-gray-100 px-3 py-3 rounded cursor-pointer transition-colors ${
          isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Next page"
      >
        <FaChevronRight className="text-gray-300 size-3" />
      </button>
    </div>
  );
}
