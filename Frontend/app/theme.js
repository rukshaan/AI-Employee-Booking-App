export const theme = {
  colors: {
    primary: '#4f46e5',    // Indigo (Premium accent)
    secondary: '#10b981',  // Emerald (Success/Customer)
    tertiary: '#f43f5e',   // Rose (Admin/Alerts)
    violet: '#8b5cf6',     // Violet (Worker)
    background: '#f8fafc', // Slate 50 (App background)
    surface: '#ffffff',    // White (Cards, Forms)
    textDark: '#0f172a',   // Slate 900 (Main text)
    textLight: '#64748b',  // Slate 500 (Subtitles)
    border: '#e2e8f0',     // Slate 200 (Inputs, borders)
    error: '#ef4444',      // Red 500
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    round: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#64748b',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#64748b',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }
  }
};
