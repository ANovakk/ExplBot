const GEMINI_API_KEY = 'AIzaSyDIMYa8Z6fSk56vSuGkc2MT_dRWGdlyJjQ';

async function analyzeText(text) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Analyze the following text and provide: 
                        1. Key points and their explanations
                        2. Important concepts explained
                        3. Relevant sources and references if applicable
                        
                        Text: ${text}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error details:', error);
        return `Error analyzing text: ${error.message}. Please check the console for more details.`;
    }
}

function formatText(text) {
    formatted_text = text
        .replace(/##(.*?)(?:\n|$)/g, '<span style="font-weight: bold; font-size: 1.5em;">$1</span>\n')
        .replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold; font-size: 1.2em;">$1<br></span>')
        .replace(/^\*\s*(.+)$/gm, '• $1')
        .replace(/\n/g, '<br>');
    return formatted_text;
}

function displayResponse(response) {
    const gptResponse = document.getElementById('gpt-response');
    gptResponse.innerHTML = formatText(response);
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "updateSidePanel") {
        const selectedTextElement = document.getElementById('selected-text');
        selectedTextElement.innerHTML = formatText(message.text);
        
        const gptResponse = document.getElementById('gpt-response');
        gptResponse.innerHTML = '<div class="loading">Analyzing text...</div>';
        
        const analysis = await analyzeText(message.text);
        displayResponse(analysis);
    }
}); 