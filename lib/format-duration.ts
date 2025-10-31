/**
 * Format duration in minutes to human-readable format
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g., "1h 30m", "45m", "2h 00m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}m`;
}

/**
 * Format seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted string (e.g., "05:30", "120:45")
 */
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
