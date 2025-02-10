chrome.storage.local.get(['selectedText'], function(result) {
    if (result.selectedText) {
        document.getElementById('selected-text').textContent = result.selectedText;
    }
}); 