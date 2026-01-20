// Theme System for Visual Consistency
// Comprehensive design system with consistent styling

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  warning: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  error: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  info: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    xs: [string, string];
    sm: [string, string];
    base: [string, string];
    lg: [string, string];
    xl: [string, string];
    '2xl': [string, string];
    '3xl': [string, string];
    '4xl': [string, string];
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  shadows: ThemeShadows;
  borderRadius: ThemeBorderRadius;
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// Default UIMP Theme
export const defaultTheme: Theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
      xl: ['1.25rem', '1.75rem'],
      '2xl': ['1.5rem', '2rem'],
      '3xl': ['1.875rem', '2.25rem'],
      '4xl': ['2.25rem', '2.5rem'],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Theme Context
export const ThemeContext = React.createContext<Theme>(defaultTheme);

// Theme Provider
export function ThemeProvider({ 
  children, 
  theme = defaultTheme 
}: { 
  children: React.ReactNode; 
  theme?: Theme; 
}) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme Hook
export function useTheme(): Theme {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility functions for consistent styling
export class ThemeUtils {
  static getColor(theme: Theme, colorPath: string): string {
    const parts = colorPath.split('.');
    let current: any = theme.colors;
    
    for (const part of parts) {
      current = current[part];
      if (!current) return theme.colors.gray[500];
    }
    
    return current;
  }

  static getSpacing(theme: Theme, size: keyof ThemeSpacing): string {
    return theme.spacing[size];
  }

  static getShadow(theme: Theme, size: keyof ThemeShadows): string {
    return theme.shadows[size];
  }

  static getBorderRadius(theme: Theme, size: keyof ThemeBorderRadius): string {
    return theme.borderRadius[size];
  }

  static getTransition(theme: Theme, speed: 'fast' | 'normal' | 'slow'): string {
    return theme.transitions[speed];
  }

  // Generate consistent component styles
  static buttonStyles(theme: Theme, variant: 'primary' | 'secondary' | 'outline' | 'ghost') {
    const baseStyles = {
      borderRadius: theme.borderRadius.md,
      transition: theme.transitions.normal,
      fontWeight: theme.typography.fontWeight.medium,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary[600],
          color: 'white',
          ':hover': {
            backgroundColor: theme.colors.primary[700],
          },
          ':active': {
            backgroundColor: theme.colors.primary[800],
          },
        };
      
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.secondary[100],
          color: theme.colors.secondary[900],
          ':hover': {
            backgroundColor: theme.colors.secondary[200],
          },
        };
      
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.colors.primary[600],
          border: `1px solid ${theme.colors.primary[300]}`,
          ':hover': {
            backgroundColor: theme.colors.primary[50],
          },
        };
      
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.colors.gray[700],
          ':hover': {
            backgroundColor: theme.colors.gray[100],
          },
        };
      
      default:
        return baseStyles;
    }
  }

  static cardStyles(theme: Theme, variant: 'default' | 'elevated' | 'outlined') {
    const baseStyles = {
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.lg,
      transition: theme.transitions.normal,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: theme.shadows.lg,
          ':hover': {
            boxShadow: theme.shadows.xl,
          },
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          border: `1px solid ${theme.colors.gray[200]}`,
          ':hover': {
            borderColor: theme.colors.gray[300],
          },
        };
      
      default:
        return {
          ...baseStyles,
          boxShadow: theme.shadows.sm,
          ':hover': {
            boxShadow: theme.shadows.md,
          },
        };
    }
  }

  static inputStyles(theme: Theme, state: 'default' | 'error' | 'success') {
    const baseStyles = {
      borderRadius: theme.borderRadius.md,
      transition: theme.transitions.fast,
      fontSize: theme.typography.fontSize.sm[0],
      lineHeight: theme.typography.fontSize.sm[1],
    };

    switch (state) {
      case 'error':
        return {
          ...baseStyles,
          borderColor: theme.colors.error[500],
          ':focus': {
            borderColor: theme.colors.error[600],
            boxShadow: `0 0 0 3px ${theme.colors.error[100]}`,
          },
        };
      
      case 'success':
        return {
          ...baseStyles,
          borderColor: theme.colors.success[500],
          ':focus': {
            borderColor: theme.colors.success[600],
            boxShadow: `0 0 0 3px ${theme.colors.success[100]}`,
          },
        };
      
      default:
        return {
          ...baseStyles,
          borderColor: theme.colors.gray[300],
          ':focus': {
            borderColor: theme.colors.primary[500],
            boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`,
          },
        };
    }
  }
}

// CSS-in-JS helper for styled components
export function createStyledComponent(
  tag: keyof JSX.IntrinsicElements,
  styles: (theme: Theme) => React.CSSProperties
) {
  return React.forwardRef<HTMLElement, any>((props, ref) => {
    const theme = useTheme();
    const computedStyles = styles(theme);
    
    return React.createElement(tag, {
      ...props,
      ref,
      style: { ...computedStyles, ...props.style },
    });
  });
}

// Responsive utilities
export function useResponsive() {
  const [screenSize, setScreenSize] = React.useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');
  
  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else if (width < 1280) setScreenSize('xl');
      else setScreenSize('2xl');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return {
    screenSize,
    isMobile: screenSize === 'sm',
    isTablet: screenSize === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(screenSize),
  };
}

// Dark mode support
export function useDarkMode() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleDarkMode = React.useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return { isDark, toggleDarkMode };
}