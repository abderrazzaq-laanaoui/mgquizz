// background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    // Additionally, you can check for changeInfo.status

    if (/^https:\/\/www.google.com/.test(tab.url)) {  
        chrome.action.setPopup({ popup: "./popup.html"})
    } else {
        chrome.action.setPopup({ popup: "" })
    }
});