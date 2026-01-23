import { useEffect, useRef, useCallback } from 'react';
import tracker from '../utils/tracker';

/**
 * Hook to track section views using IntersectionObserver
 * 
 * @param {Array<{id: string, name: string}>} sections - Array of section configs
 *   - id: The DOM element ID to observe
 *   - name: The section name to send in tracking (section_name)
 * @param {Object} options - Optional configuration
 *   - threshold: Visibility threshold (0-1), default 0.3
 *   - trackOnce: Whether to track only once per section, default true
 *   - rootMargin: Root margin for observer, default '0px'
 *   - enabled: Whether tracking is enabled, default true
 *   - customAttributes: Additional attributes to include in tracking
 * 
 * @example
 * // Basic usage
 * useSectionViewTracking([
 *   { id: 'hero-section', name: 'Hero Section' },
 *   { id: 'skills-chart', name: 'Skills Analysis' },
 *   { id: 'career-timeline', name: 'Career Journey' }
 * ]);
 * 
 * @example
 * // With custom options
 * useSectionViewTracking(
 *   [{ id: 'my-section', name: 'My Section' }],
 *   { 
 *     threshold: 0.5, 
 *     customAttributes: { page: 'results' } 
 *   }
 * );
 */
const useSectionViewTracking = (sections = [], options = {}) => {
  const {
    threshold = 0.3,
    trackOnce = true,
    rootMargin = '0px',
    enabled = true,
    customAttributes = {}
  } = options;

  const observerRef = useRef(null);
  const trackedSectionsRef = useRef(new Set());
  const sectionsMapRef = useRef(new Map());

  // Track a section view
  const trackSectionView = useCallback((sectionName, additionalData = {}) => {
    tracker.sectionView({
      section_name: sectionName,
      ...customAttributes,
      ...additionalData
    });
  }, [customAttributes]);

  useEffect(() => {
    if (!enabled || !sections.length) return;

    // Build a map of id -> name for quick lookup
    const sectionsMap = new Map();
    sections.forEach(({ id, name }) => {
      if (id && name) {
        sectionsMap.set(id, name);
      }
    });
    sectionsMapRef.current = sectionsMap;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.id;
          const sectionName = sectionsMap.get(elementId);

          if (sectionName) {
            const shouldTrack = !trackOnce || !trackedSectionsRef.current.has(elementId);

            if (shouldTrack) {
              trackSectionView(sectionName);
              
              if (trackOnce) {
                trackedSectionsRef.current.add(elementId);
                
                // Unobserve if tracking only once
                if (observerRef.current) {
                  observerRef.current.unobserve(entry.target);
                }
              }
            }
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin,
      threshold
    };

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    // Function to observe elements
    const observeElements = () => {
      sections.forEach(({ id }) => {
        if (!id) return;
        
        const element = document.getElementById(id);
        if (element && observerRef.current) {
          // Don't observe if already tracked (and trackOnce is true)
          if (!trackOnce || !trackedSectionsRef.current.has(id)) {
            observerRef.current.observe(element);
          }
        }
      });
    };

    // Initial observation
    observeElements();

    // Set up MutationObserver to catch dynamically added elements
    const mutationObserver = new MutationObserver(() => {
      // Re-check for elements that might have been added
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      mutationObserver.disconnect();
    };
  }, [sections, threshold, rootMargin, enabled, trackOnce, trackSectionView]);

  // Return a function to manually reset tracking (useful for SPA navigation)
  const resetTracking = useCallback(() => {
    trackedSectionsRef.current.clear();
  }, []);

  return { resetTracking };
};

export default useSectionViewTracking;
