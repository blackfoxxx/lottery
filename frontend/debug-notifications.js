
// Test script to check notification data
console.log('=== NOTIFICATION DEBUG TEST ===');

// Check if Angular is loaded
if (typeof ng !== 'undefined') {
  console.log('Angular DevTools available');
  
  // Try to find notification service
  const components = ng.getAllComponents();
  console.log('Found components:', components.length);
  
  // Check notification state
  components.forEach((comp, index) => {
    if (comp.constructor.name.includes('Notification')) {
      console.log('Notification component found:', comp);
      console.log('Notifications data:', comp.notifications);
    }
  });
} else {
  console.log('Angular DevTools not available');
}

// Check notification elements in DOM
const notifications = document.querySelectorAll('.notification');
console.log('Found', notifications.length, 'notification elements');

notifications.forEach((notif, index) => {
  const title = notif.querySelector('.notification-title');
  const message = notif.querySelector('.notification-message');
  const icon = notif.querySelector('.notification-icon i');
  
  console.log('Notification', index + 1, ':');
  console.log('  Title element:', title);
  console.log('  Title content:', title ? title.textContent : 'NULL');
  console.log('  Title innerHTML:', title ? title.innerHTML : 'NULL');
  console.log('  Message element:', message);
  console.log('  Message content:', message ? message.textContent : 'NULL');
  console.log('  Message innerHTML:', message ? message.innerHTML : 'NULL');
  console.log('  Icon element:', icon);
  console.log('  Icon classes:', icon ? icon.className : 'NULL');
});

