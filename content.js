const button = document.createElement('button');
button.className = 'explbot-button';
button.textContent = 'ExplBot';
document.body.appendChild(button);

document.addEventListener('mouseup', function(e) {
    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText.length > 0) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        button.style.display = 'block';
        button.style.top = `${window.scrollY + rect.bottom + 5}px`;
        button.style.left = `${window.scrollX + rect.left}px`;
    }
});

document.addEventListener('mousedown', function(e) {
    if (e.target !== button) {
        button.style.display = 'none';
    }
});

button.addEventListener('click', async function() {
    const selectedText = window.getSelection().toString().trim();
    
    const formattedText = selectedText.replace(
        /\*\*(.*?)\*\*/g, 
        '<span style="font-weight: bold; font-size: 1.2em;">$1</span>'
    );

    //console.log(formattedText);
    
    await chrome.runtime.sendMessage({
        action: "openSidePanel",
        text: formattedText,
        isHTML: true
    });
}); 