import { useCallback, useEffect, useRef } from 'react';

interface UseRevoGridScrollOptions {
  /**
   * Callback function to fetch next page of data
   */
  fetchNextPage?: () => void;
  
  /**
   * Whether there is a next page to load
   */
  hasNextPage?: boolean;
  
  /**
   * Whether currently fetching next page
   */
  isFetchingNextPage?: boolean;
  
  /**
   * Current data array
   */
  data: any[];
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Minimum number of rows before enabling scroll restoration
   * @default 200
   */
  minRowsForRestore?: number;
  
  /**
   * Scroll percentage threshold to trigger load more (0-1)
   * @default 0.9
   */
  scrollThreshold?: number;
  
  /**
   * Remaining pixels threshold to trigger load more
   * @default 100
   */
  remainingThreshold?: number;
  
  /**
   * Throttle time in milliseconds
   * @default 1000
   */
  throttleMs?: number;
  
  /**
   * Delay before restoring scroll position in milliseconds
   * @default 200
   */
  restoreDelayMs?: number;
}

/**
 * Custom hook for handling RevoGrid infinite scroll with scroll position preservation
 * 
 * Features:
 * - Infinite scroll with configurable thresholds
 * - Scroll position preservation on data load
 * - Throttling to prevent excessive API calls
 * - Smooth scroll restoration with requestAnimationFrame
 * 
 * @example
 * ```tsx
 * const gridRef = useRef(null);
 * 
 * useRevoGridScroll(gridRef, {
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 *   data,
 *   loading,
 * });
 * ```
 */
export function useRevoGridScroll(
  gridRef: React.RefObject<any>,
  options: UseRevoGridScrollOptions
) {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    loading,
    minRowsForRestore = 200,
    scrollThreshold = 0.9,
    remainingThreshold = 100,
    throttleMs = 1000,
    restoreDelayMs = 200,
  } = options;

  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const prevDataLengthRef = useRef(0);

  // Handle scroll event
  const handleScroll = useCallback(
    async (event: any) => {
      const { detail } = event;

      // Chỉ xử lý scroll theo chiều dọc (rows)
      if (detail.dimension !== 'rgRow') return;

      // Liên tục lưu lại tọa độ cuộn hiện tại từ RevoGrid event
      lastScrollYRef.current = detail.coordinate;

      // Throttle: prevent rapid consecutive calls
      const now = Date.now();
      if (now - lastFetchTimeRef.current < throttleMs) return;

      const grid = gridRef.current;
      if (!grid || !grid.getContentSize) return;

      try {
        // Lấy kích thước content từ RevoGrid API
        const contentSize = await grid.getContentSize();
        const totalContentHeight = contentSize.y;
        const viewportHeight = grid.offsetHeight || 0;
        const currentScrollY = detail.coordinate;

        // Tính toán scroll percentage
        const scrollPercentage =
          (currentScrollY + viewportHeight) / totalContentHeight;
        const remaining = totalContentHeight - (currentScrollY + viewportHeight);

        // Trigger khi scroll đạt threshold hoặc còn ít pixels
        const shouldLoadMore =
          scrollPercentage >= scrollThreshold || remaining < remainingThreshold;

        if (shouldLoadMore && !isFetchingRef.current && hasNextPage) {
          isFetchingRef.current = true;
          lastFetchTimeRef.current = now;
          fetchNextPage?.();
        }
      } catch (error) {
        console.error('Error in handleScroll:', error);
      }
    },
    [
      hasNextPage,
      fetchNextPage,
      throttleMs,
      scrollThreshold,
      remainingThreshold,
      gridRef,
    ]
  );

  // Sync ref with prop to reset fetching state
  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage ?? false;
  }, [isFetchingNextPage]);

  // Attach scroll listener với viewportscroll event
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    grid.addEventListener('viewportscroll', handleScroll);

    return () => {
      grid.removeEventListener('viewportscroll', handleScroll);
    };
  }, [handleScroll, gridRef]);

  // Preserve scroll position khi load more data
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const currentLength = data.length;
    const prevLength = prevDataLengthRef.current;

    // Khi data tăng lên (load more) và có nhiều rows
    if (currentLength > prevLength && currentLength > minRowsForRestore && !loading) {
      const savedScrollY = lastScrollYRef.current;

      // Restore scroll position với delay và requestAnimationFrame để mượt hơn
      // Delay để đảm bảo RevoGrid đã render xong virtual rows
      setTimeout(() => {
        if (grid && savedScrollY > 0 && grid.scrollToCoordinate) {
          // Sử dụng requestAnimationFrame để sync với browser paint cycle
          // Tránh giật và trắng màn hình
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              grid.scrollToCoordinate({ y: savedScrollY });
            });
          });
        }
      }, restoreDelayMs);
    }

    prevDataLengthRef.current = currentLength;
  }, [data.length, loading, minRowsForRestore, restoreDelayMs, gridRef]);

  return {
    /**
     * Current scroll Y coordinate
     */
    scrollY: lastScrollYRef.current,
    
    /**
     * Whether currently fetching
     */
    isFetching: isFetchingRef.current,
  };
}
