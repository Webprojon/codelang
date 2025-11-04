/**
 * Navigation utility for use in non-React contexts (e.g., interceptors)
 * Uses browser history API to navigate programmatically
 */

let navigateFunction: ((path: string) => void) | null = null;

/**
 * Sets the navigation function to be used by utilities
 * Should be called from main.tsx with React Router's navigate
 */
export const setNavigateFunction = (navigate: (path: string) => void) => {
  navigateFunction = navigate;
};

/**
 * Navigates to a path
 * Falls back to window.location if navigate function is not set
 */
export const navigateTo = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    // Fallback to window.location for non-React contexts
    window.location.href = path;
  }
};
