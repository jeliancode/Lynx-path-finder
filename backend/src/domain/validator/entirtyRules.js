export const hasValidName = (data) => data.name != null || data.username != null;
export const hasValidEmail = (data) => typeof data.email === 'string' && data.email.includes('@');
export const hasValidPassword = (data) => typeof data.password === 'string' && data.password.length >= 8;
export const hasValidDimensions = (data) => data.width > 0 && data.height > 0;
export const hasValidUserId = (data) => data.userId != null;