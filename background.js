chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openSidePanel") {
        chrome.sidePanel.open({ windowId: sender.tab.windowId });
        
        setTimeout(() => {
            chrome.runtime.sendMessage({
                action: "updateSidePanel",
                text: message.text
            });
        }, 100);
    }
}); 