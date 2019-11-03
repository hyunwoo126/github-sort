console.log('common.js');

function getFromStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], function(result) {
      return resolve(result[key]);
    });
  });
}

function saveToStorage(keyValue) {
  return new Promise((resolve) => {
    chrome.storage.local.set(keyValue, resolve);
  });
}