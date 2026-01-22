// Background script for Grammarly Clone Chrome Extension

// Initialize the extension
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Grammarly Clone extension installed:', details.reason);
  
  // Set up context menus if needed
  chrome.contextMenus.create({
    id: 'checkGrammar',
    title: 'Check Grammar with Grammarly Clone',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkGrammar' && info.selectionText) {
    // Send message to content script to check grammar
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'checkGrammar',
        text: info.selectionText
      });
    }
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkGrammar') {
    // This is where you would integrate with a grammar checking API
    // For now, just return a simple response
    sendResponse({
      success: true,
      suggestions: [
        {
          error: 'Example error',
          suggestion: 'Example correction',
          position: { start: 0, end: 5 }
        }
      ]
    });
  }
  
  return true; // Keep the message channel open for async response
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // You can perform additional setup here if needed
    console.log('Tab updated:', tab.url);
  }
});
