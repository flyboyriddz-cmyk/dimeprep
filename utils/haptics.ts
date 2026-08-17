export const vibrate = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors
    }
  }
};

export const HAPTICS = {
  light: 50,
  medium: 100,
  heavy: 200,
  success: [50, 50, 50],
  error: [100, 50, 100, 50, 100],
  gateUnlock: [100, 100, 200, 100, 400],
};
