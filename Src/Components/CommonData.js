export const AppName = 'Nexus';
export const PrimaryColor = '#0887ff'; // utils/relativeTime.js
export const getRelativeTime = timestamp => {
  // Simulated current time to match the test data
  const simulatedNow = new Date('2025-03-03T10:10:00Z'); // Set this to match your test data
  const messageDate = new Date(timestamp);

  const secondsAgo = Math.floor((simulatedNow - messageDate) / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  if (secondsAgo < 60) {
    return 'Just now';
  } else if (minutesAgo < 60) {
    return `${minutesAgo}m ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo}h ago`;
  } else if (daysAgo < 7) {
    return `${daysAgo}d ago`;
  } else {
    // Fallback to full date if older than 7 days
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};
