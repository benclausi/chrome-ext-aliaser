let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color, 'pairs': [] });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    chrome.tabs.executeScript(null, {
      file: "getsource.js"
    }, function() {
    });
  }
})

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    console.log(request.source);
  }
});