import { useEffect, useRef, useCallback } from 'react';

type Options = {
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  threshold?: number; // 0..1, default 0.9
  maxRetries?: number; // how many times to poll for viewport
  retryIntervalMs?: number; // poll interval
  debug?: boolean;
};

function logDebug(debug: boolean, ...args: any[]) {
  if (!debug) return;
  // eslint-disable-next-line no-console
  console.debug('[useRevoInfiniteScroll]', ...args);
}

export function useRevoInfiniteScroll(
  gridRef: React.RefObject<any>,
  options: Options = {}
) {
  const {
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage = false,
    threshold = 0.9,
    maxRetries = 12,
    retryIntervalMs = 200,
    debug = false,
  } = options;

  const cleanupRef = useRef<any>(() => {});
  const mountedRef = useRef(true);
  const retryTimerRef = useRef<any>(0);
  const lastCallRef = useRef(0);

  const safeFetch = useCallback(() => {
    if (!fetchNextPage) return;
    if (!hasNextPage || isFetchingNextPage) return;
    const now = Date.now();
    if (now - lastCallRef.current < 500) return; // throttle 500ms
    lastCallRef.current = now;
    logDebug(debug, 'trigger fetchNextPage()');
    try {
      fetchNextPage();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[useRevoInfiniteScroll] fetchNextPage error:', err);
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, debug]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    let mounted = true;

    const tryAttachToViewport = (gridInstance: any): HTMLElement | null => {
      // nhiều fallback tuỳ version/revo internals
      try {
        if (!gridInstance) return null;
        // 1. gridInstance.viewportElement (common in some builds)
        if (gridInstance.viewportElement?.addEventListener) {
          return gridInstance.viewportElement as HTMLElement;
        }
        // 2. gridInstance.viewport?.element
        if (gridInstance.viewport?.element) {
          return gridInstance.viewport.element as HTMLElement;
        }
        // 3. gridInstance.getViewportElement ?
        if (typeof gridInstance.getViewportElement === 'function') {
          const v = gridInstance.getViewportElement();
          if (v?.addEventListener) return v as HTMLElement;
        }
        // 4. If gridInstance is the host element with shadowRoot, query inside
        const host = gridInstance.host || gridInstance; // sometimes ref gives wrapper
        const root: Document | ShadowRoot = host?.shadowRoot
          ? host.shadowRoot
          : host?.shadowRoot || null;
        if (root) {
          // common selectors used by RevoGrid
          const candidates = [
            '.rg-viewport', // possible
            '.viewport',
            '.revo-viewport',
            '[part="viewport"]',
            'div[role="grid"]',
            '.rg-viewport-scroll',
          ];
          for (const sel of candidates) {
            const found = root.querySelector(sel) as HTMLElement | null;
            if (found) return found;
          }
          // last resort: first scrollable element in shadow root
          const elems = Array.from(root.querySelectorAll<HTMLElement>('div'));
          const scrollable = elems.find(
            (e) => e && e.scrollHeight > e.clientHeight + 5
          );
          if (scrollable) return scrollable;
        }
        // 5. try host's parent nodes
        let node = host?.parentElement;
        for (let i = 0; i < 6 && node; i++, node = node.parentElement) {
          if (node.scrollHeight > node.clientHeight + 5) return node;
        }
      } catch (err) {
        // ignore
      }
      return null;
    };

    const onScrollHandlerFactory = (viewportEl: HTMLElement) => {
      let lastCall = 0;
      return () => {
        if (!mounted) return;
        const now = Date.now();
        if (now - lastCall < 100) return; // cheap throttle 100ms
        lastCall = now;
        const scrollTop = viewportEl.scrollTop;
        const clientHeight = viewportEl.clientHeight;
        const scrollHeight = viewportEl.scrollHeight;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
        const pixelThreshold = 300;
        console.log('scrollHeight', scrollHeight);
        console.log('scrollTop', scrollTop);
        console.log('distanceFromBottom', distanceFromBottom);

        if (distanceFromBottom <= pixelThreshold) {
          // cách đáy 300px thì load
          logDebug(debug, {
            scrollTop,
            clientHeight,
            scrollHeight,
            distanceFromBottom,
          });
          safeFetch();
          return;
        }
      };
    };

    const attach = (viewportEl: HTMLElement | null) => {
      if (!viewportEl) return false;
      const onScroll = onScrollHandlerFactory(viewportEl);
      viewportEl.addEventListener('scroll', onScroll, { passive: true });
      // also listen wheel/touchmove to be safer
      viewportEl.addEventListener('wheel', onScroll, { passive: true });
      viewportEl.addEventListener('touchmove', onScroll, { passive: true });

      // cleanup setter
      cleanupRef.current = () => {
        try {
          viewportEl.removeEventListener('scroll', onScroll);
          viewportEl.removeEventListener('wheel', onScroll);
          viewportEl.removeEventListener('touchmove', onScroll);
        } catch (e) {}
      };
      return true;
    };

    const handleReady = (e: any) => {
      // e.detail?.ref often contains internal grid
      const candidateGrid = e?.detail?.ref ?? el; // fallback to element itself
      // try attaching immediately
      const viewport = tryAttachToViewport(candidateGrid);
      if (viewport) {
        attach(viewport);
        return;
      }

      // if not found, attempt after animationFrame (some internals init later)
      requestAnimationFrame(() => {
        if (!mounted) return;
        const tryAgainGrid = e?.detail?.ref ?? el;
        const viewport2 = tryAttachToViewport(tryAgainGrid);
        if (viewport2) attach(viewport2);
        else {
          // final fallback: search globally inside element and shadowRoot periodically short time
          let retries = 0;
          const interval = setInterval(() => {
            if (!mounted || retries++ > 10) {
              clearInterval(interval);
              return;
            }
            const viewport3 = tryAttachToViewport(tryAgainGrid);
            if (viewport3) {
              clearInterval(interval);
              attach(viewport3);
            }
          }, 120);
        }
      });
    };

    // If grid already fired ready earlier, try to attach directly to known internals
    // Try reading el.grid or el.__grid or el.getGridInstance
    try {
      const maybeGrid =
        (el as any).grid ??
        (el as any).__grid ??
        (el as any).getGridInstance?.();
      const vp = tryAttachToViewport(maybeGrid ?? el);
      if (vp) {
        attach(vp);
      } else {
        // otherwise wait for ready event
        el.addEventListener('ready', handleReady);
      }
    } catch (err) {
      el.addEventListener('ready', handleReady);
    }

    return () => {
      mounted = false;
      // remove ready listener
      try {
        el.removeEventListener('ready', handleReady);
      } catch (e) {}
      // cleanup viewport listeners
      if (cleanupRef.current) {
        try {
          cleanupRef.current();
        } catch (e) {}
        cleanupRef.current = undefined;
      }
      // clear debounce
      clearTimeout(retryTimerRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, safeFetch]);

  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true);

  // // Ref để truy cập vào instance của RevoGrid nhằm gọi các phương thức API như getContentSize()
  // // const gridRef = useRef(null);

  // // 1. Hàm tải dữ liệu ban đầu
  // useEffect(() => {
  //   const initialLoad = async () => {
  //     const initialData = await fetchData(1, DATA_LIMIT * 2);
  //     setData(initialData);
  //   };
  //   initialLoad();
  // }, []);

  // // 2. Hàm xử lý cuộn: Lắng nghe sự kiện `viewportscroll`
  // // Sự kiện `viewportscroll` được phát ra khi viewport được cuộn [1, 2].
  // const handleScroll = useCallback(
  //   async (event) => {
  //     // Chỉ quan tâm đến cuộn dọc (Y-axis) và khi không đang tải
  //     if (isLoading || !hasMore || event.detail.dimension !== 'rgRow') {
  //       return;
  //     }

  //     const currentScrollY = event.detail.coordinate;

  //     // Phải truy cập vào RevoGrid instance để lấy tổng kích thước nội dung
  //     if (gridRef.current && gridRef.current.getContentSize) {
  //       // Gọi API getContentSize() để lấy kích thước nội dung, bao gồm cả dữ liệu được ghim [3]
  //       const contentSize = await gridRef.current.getContentSize();
  //       const totalContentHeight = contentSize.y;

  //       // Giả định tổng chiều cao của grid viewport (khu vực hiển thị)
  //       // Lưu ý: RevoGrid không cung cấp trực tiếp chiều cao viewport trong sự kiện,
  //       // nhưng ta có thể ước tính dựa trên tổng chiều cao nội dung và vị trí cuộn.
  //       // Trong môi trường thực tế, bạn cần lấy chiều cao thực của grid container.

  //       // Ví dụ tính toán đơn giản: Nếu vị trí cuộn hiện tại + một ngưỡng gần bằng tổng chiều cao nội dung
  //       if (
  //         totalContentHeight > 0 &&
  //         currentScrollY + gridRef.current.offsetHeight >=
  //           totalContentHeight - SCROLL_THRESHOLD
  //       ) {
  //         // Nếu đã cuộn gần đến cuối
  //         setIsLoading(true);
  //         const startIndex = data.length + 1;
  //         const newRows = await fetchData(startIndex, DATA_LIMIT);

  //         // Cập nhật nguồn dữ liệu (`source`) bằng cách nối thêm dữ liệu mới
  //         if (newRows.length > 0) {
  //           setData((prevData) => [...prevData, ...newRows]);
  //         } else {
  //           setHasMore(false); // Hết dữ liệu
  //         }
  //         setIsLoading(false);
  //       }
  //     }
  //   },
  //   [data.length, isLoading, hasMore]
  // );
}
