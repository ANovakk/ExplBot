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
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold; font-size: 1.2em;">$1</span>');
}

function displayResponse(response) {
    const gptResponse = document.getElementById('gpt-response');
    gptResponse.innerHTML = formatText(response);
}

chrome.storage.local.get(['selectedText'], async function(result) {
    if (result.selectedText) {
        const selectedTextElement = document.getElementById('selected-text');
        selectedTextElement.innerHTML = formatText(result.selectedText);

        const analysis = await analyzeText(result.selectedText);
        displayResponse(analysis);
    }
}); 