interface UsePaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const usePaginationControls = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: UsePaginationControlsProps) => {
  const isPreviousDisabled = currentPage === 1 || isLoading;
  const isNextDisabled = currentPage === totalPages || isLoading;

  const handlePrevious = () => {
    if (!isPreviousDisabled) {
      onPageChange(Math.max(1, currentPage - 1));
    }
  };

  const handleNext = () => {
    if (!isNextDisabled) {
      onPageChange(Math.min(totalPages, currentPage + 1));
    }
  };

  return {
    handlePrevious,
    handleNext,
    isPreviousDisabled,
    isNextDisabled,
  };
};
