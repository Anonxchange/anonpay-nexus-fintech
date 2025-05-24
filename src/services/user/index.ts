
// Export all user-related service functions
export * from './accountService';
export * from './profileService';
export * from './adminService';

// Export the activity service notification function with a renamed export
export { getUserNotifications as getActivityNotifications } from './activityService';

// Export all notification functions from notifications index
export * from './notifications';
