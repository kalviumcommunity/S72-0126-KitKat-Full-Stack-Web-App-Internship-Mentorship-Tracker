// Performance Monitoring System
// Real-time performance tracking and optimization

export interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage: number;
  bundleSize: number;
  networkRequests: number;
  cacheHitRate: number;
}

export interface WebVitals {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    componentCount: 0,
    memoryUsage: 0,
    bundleSize: 0,
    networkRequests: 0,
    cacheHitRate: 0,
  };

  private webVitals: Partial<WebVitals> = {};
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    this.isMonitoring = true;
    this.setupWebVitalsMonitoring();
    this.setupResourceMonitoring();
    this.setupMemoryMonitoring();
  }

  private setupWebVitalsMonitoring() {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.webVitals.fcp = entry.startTime;
          this.logMetric('FCP', entry.startTime);
        }
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(fcpObserver);

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.webVitals.lcp = lastEntry.startTime;
      this.logMetric('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.webVitals.fid = (entry as any).processingStart - entry.startTime;
        this.logMetric('FID', this.webVitals.fid);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.webVitals.cls = clsValue;
      this.logMetric('CLS', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);

    // Time to First Byte
    const navigationObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const navEntry = entry as PerformanceNavigationTiming;
        this.webVitals.ttfb = navEntry.responseStart - navEntry.requestStart;
        this.logMetric('TTFB', this.webVitals.ttfb);
      }
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });
    this.observers.push(navigationObserver);
  }

  private setupResourceMonitoring() {
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.networkRequests++;
        
        // Track bundle size
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          this.metrics.bundleSize += (entry as any).transferSize || 0;
        }
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
  }

  private setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
      }, 5000);
    }
  }

  private logMetric(name: string, value: number) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getWebVitals(): Partial<WebVitals> {
    return { ...this.webVitals };
  }

  public measureComponentRender(componentName: string, renderFn: () => void) {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    this.metrics.renderTime = renderTime;
    this.metrics.componentCount++;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Component Render - ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }

  public trackUserInteraction(action: string, startTime: number) {
    const endTime = performance.now();
    const interactionTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`User Interaction - ${action}: ${interactionTime.toFixed(2)}ms`);
    }
    
    return interactionTime;
  }

  public generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      webVitals: this.webVitals,
      metrics: this.metrics,
      recommendations: this.generateRecommendations(),
    };
    
    return JSON.stringify(report, null, 2);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.webVitals.fcp && this.webVitals.fcp > 2000) {
      recommendations.push('Consider optimizing critical rendering path to improve FCP');
    }
    
    if (this.webVitals.lcp && this.webVitals.lcp > 4000) {
      recommendations.push('Optimize largest content element to improve LCP');
    }
    
    if (this.webVitals.fid && this.webVitals.fid > 300) {
      recommendations.push('Reduce JavaScript execution time to improve FID');
    }
    
    if (this.webVitals.cls && this.webVitals.cls > 0.25) {
      recommendations.push('Minimize layout shifts to improve CLS');
    }
    
    if (this.metrics.bundleSize > 1000000) { // 1MB
      recommendations.push('Consider code splitting to reduce bundle size');
    }
    
    if (this.metrics.memoryUsage > 50000000) { // 50MB
      recommendations.push('Monitor memory usage and implement cleanup');
    }
    
    return recommendations;
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const renderStart = performance.now();
  
  React.useEffect(() => {
    const renderTime = performance.now() - renderStart;
    performanceMonitor.measureComponentRender(componentName, () => {});
    
    return () => {
      // Cleanup if needed
    };
  });
  
  return {
    trackInteraction: (action: string) => {
      const startTime = performance.now();
      return () => performanceMonitor.trackUserInteraction(action, startTime);
    },
    getMetrics: () => performanceMonitor.getMetrics(),
    getWebVitals: () => performanceMonitor.getWebVitals(),
  };
}

// Performance optimization utilities
export class PerformanceOptimizer {
  private static imageCache = new Map<string, HTMLImageElement>();
  private static componentCache = new Map<string, React.ComponentType<any>>();

  // Image optimization
  static optimizeImage(src: string, width?: number, quality?: number): string {
    // In a real implementation, this would integrate with an image CDN
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (quality) params.set('q', quality.toString());
    
    return params.toString() ? `${src}?${params.toString()}` : src;
  }

  // Preload critical images
  static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.imageCache.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  // Component memoization
  static memoizeComponent<P extends object>(
    Component: React.ComponentType<P>,
    areEqual?: (prevProps: P, nextProps: P) => boolean
  ): React.ComponentType<P> {
    const cacheKey = Component.name || 'AnonymousComponent';
    
    if (this.componentCache.has(cacheKey)) {
      return this.componentCache.get(cacheKey)!;
    }

    const MemoizedComponent = React.memo(Component, areEqual);
    this.componentCache.set(cacheKey, MemoizedComponent);
    
    return MemoizedComponent;
  }

  // Bundle analysis
  static analyzeBundleSize(): Promise<any> {
    if (typeof window === 'undefined') {
      return Promise.resolve({});
    }

    return new Promise((resolve) => {
      const resources = performance.getEntriesByType('resource');
      const analysis = {
        totalSize: 0,
        jsSize: 0,
        cssSize: 0,
        imageSize: 0,
        resources: resources.map((resource: any) => ({
          name: resource.name,
          size: resource.transferSize || 0,
          type: this.getResourceType(resource.name),
        })),
      };

      analysis.resources.forEach((resource: any) => {
        analysis.totalSize += resource.size;
        switch (resource.type) {
          case 'js':
            analysis.jsSize += resource.size;
            break;
          case 'css':
            analysis.cssSize += resource.size;
            break;
          case 'image':
            analysis.imageSize += resource.size;
            break;
        }
      });

      resolve(analysis);
    });
  }

  private static getResourceType(url: string): string {
    if (url.includes('.js')) return 'js';
    if (url.includes('.css')) return 'css';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    return 'other';
  }
}

// Export performance utilities
export { PerformanceOptimizer };

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Start monitoring when the page loads
  window.addEventListener('load', () => {
    performanceMonitor.generateReport();
  });
}