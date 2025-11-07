export const getDefaultQueryConfig = (options?: {
  staleTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
}) => ({
  staleTime: 5 * 60 * 1000,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  retry: 1,
  ...options,
});
