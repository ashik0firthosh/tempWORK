// Map Supabase auth error messages to user-friendly messages
export function getAuthErrorMessage(error: any): string {
  const message = error?.message?.toLowerCase() || '';
  
  if (message.includes('password')) {
    if (message.includes('weak')) {
      return 'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.';
    }
    return 'Invalid password. Please try again.';
  }
  
  if (message.includes('email')) {
    if (message.includes('already')) {
      return 'An account with this email already exists. Please log in instead.';
    }
    if (message.includes('invalid')) {
      return 'Please enter a valid email address.';
    }
    return 'Email error. Please try again.';
  }

  return 'An error occurred. Please try again.';
}
