/**
 * Theme configuration for the Brainr app
 * Includes color schemes, typography, and spacing
 */

export const COLORS = {
  // Dark mode (primary theme)
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    primary: '#00AEEF', // Electric Blue
    secondary: '#7B61FF', // Vibrant Purple
    accent: '#FF61A6', // Pink accent for gradients
    card: 'rgba(40, 40, 40, 0.8)', // Glassmorphism effect
    inactive: '#757575',
    error: '#FF5252',
  },
  
  // Light mode (alternative theme)
  light: {
    background: '#FAFAFA',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#424242',
    primary: '#004AAD', // Navy Blue
    secondary: '#00875A', // Deep Green
    accent: '#FFA000', // Amber accent
    card: 'rgba(255, 255, 255, 0.8)', // Glassmorphism effect
    inactive: '#9E9E9E',
    error: '#B00020',
  }
};

export const TYPOGRAPHY = {
  headline: {
    fontFamily: 'Montserrat-Bold', // Will fallback to system font if not available
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.25,
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  subtitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  body: {
    fontFamily: 'Inter-Regular', // Will fallback to system font if not available
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.25,
  },
  button: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.75,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
};

// Animation durations
export const ANIMATION = {
  fast: 200,
  medium: 300,
  slow: 500,
};
