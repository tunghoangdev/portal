
import { createContext, ReactNode, useContext, useCallback } from 'react';
import { useMediaQuery as useMediaQueryTS } from 'usehooks-ts';

type MediaQueryContextType = {
  isMobile: boolean;
  isTablet: boolean;
  isCustom: (query: string) => boolean;
};

const MediaQueryContext = createContext<MediaQueryContextType | null>(null);

export const MediaQueryProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useMediaQueryTS('(max-width: 768px)');
  const isTablet = useMediaQueryTS('(max-width: 1024px)');

  const isCustom = useCallback((query: string) => {
    // This is a workaround - we can't use hooks inside this function
    // The hook should be called at the component level
    return false; // Return false as fallback
  }, []);

  return (
    <MediaQueryContext.Provider
      value={{
        isMobile,
        isTablet,
        isCustom,
      }}
    >
      {children}
    </MediaQueryContext.Provider>
  );
};

export const useMediaQuery = (query?: string): any => {
  const context = useContext(MediaQueryContext);
  const customQuery = useMediaQueryTS(query || '(max-width: 0px)');

  // ✅ Kiểm tra nếu truyền tham số → Trả về boolean
  if (query) {
    return customQuery;
  }

  // ✅ Nếu không truyền tham số → Trả về object
  if (!context) {
    throw new Error('useMediaQuery must be used within a MediaQueryProvider');
  }

  return context;
};
