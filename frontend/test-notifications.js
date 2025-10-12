
// Quick test script to trigger notification
(function() {
  // Find notification service or manually trigger
  console.log('Testing notification...');
  
  // Create a manual notification element to test styling
  const container = document.querySelector('.notification-container');
  if (container) {
    console.log('Found notification container');
  } else {
    console.log('No notification container found');
  }
  
  // Check if notification service is available
  const notificationElements = document.querySelectorAll('.notification');
  console.log('Found', notificationElements.length, 'notifications');
  
  notificationElements.forEach((el, index) => {
    const title = el.querySelector('.notification-title');
    const message = el.querySelector('.notification-message');
    console.log('Notification', index + 1, ':');
    console.log('  Title:', title ? title.textContent : 'EMPTY');
    console.log('  Message:', message ? message.textContent : 'EMPTY');
  });
})();

