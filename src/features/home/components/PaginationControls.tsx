import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePaginationControls } from '../hooks/usePaginationControls';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: PaginationControlsProps) {
  const { handlePrevious, handleNext, isPreviousDisabled, isNextDisabled } = usePaginationControls({
    currentPage,
    totalPages,
    isLoading,
    onPageChange,
  });

  return (
    <div className="flex justify-center items-center gap-4 my-8">
      <button
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        className={`hover:bg-gray-200 px-3 py-3 rounded cursor-pointer ${
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
        className={`hover:bg-gray-100 px-3 py-3 rounded cursor-pointer ${
          isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Next page"
      >
        <FaChevronRight className="text-gray-300 size-3" />
      </button>
    </div>
  );
}
