/**
 * Utility functions for managing user data events
 */

/**
 * Dispatch event to notify all components that user data has changed
 * This is useful for real-time updates when user logs in/out or profile changes
 */
export const dispatchUserDataChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('userDataChanged'));
  }
};

/**
 * Dispatch event to notify all components that user has logged in
 */
export const dispatchUserLoggedIn = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userLoggedIn'));
  }
};

/**
 * Dispatch event to notify all components that user has logged out
 */
export const dispatchUserLoggedOut = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  }
};
