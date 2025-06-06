import { useEffect } from 'react';
import { usePageTitle } from './PageTitleContext';

export default function useHeadingObserver(ref) {
  const { setIsTitleVisible } = usePageTitle();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsTitleVisible(entry.isIntersecting);
      },
      { rootMargin: '-64px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, setIsTitleVisible]);
} 