import { forwardRef } from 'react';

interface InfiniteScrollTriggerProps {
  isLoading?: boolean;
  hasMore?: boolean;
}

const InfiniteScrollTrigger = forwardRef<HTMLDivElement, InfiniteScrollTriggerProps>(
  ({ hasMore }, ref) => {
    if (!hasMore) {
      return null;
    }

    return (
      <div
        ref={ref}
        className="flex justify-center items-center py-4 md:hidden"
        aria-label="Load more"
      ></div>
    );
  }
);

InfiniteScrollTrigger.displayName = 'InfiniteScrollTrigger';

export default InfiniteScrollTrigger;
