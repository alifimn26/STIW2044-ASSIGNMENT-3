document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const selectLanguage = document.getElementById('select-language');
    const translateBtn = document.getElementById('translate-btn');
    const outputText = document.getElementById('output-text');

    translateBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        const language = selectLanguage.value;

        if (text === '') {
            outputText.textContent = 'Please enter text to translate.';
            return;
        }

        translateText(text, language);
    });

    function translateText(text, language) {
        const apiKey = 'AIzaSyDu5D-EHR68NY02UpZCBfN-fysK8QJgf4M'; // Replace with your Google Translate API key
        const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

        const data = {
            q: text,
            target: language
        };

        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.data && data.data.translations && data.data.translations.length > 0) {
                const translatedText = data.data.translations[0].translatedText;
                outputText.textContent = translatedText;
            } else {
                outputText.textContent = 'Translation failed. Please try again later.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            outputText.textContent = 'Translation failed. Please try again later.';
        });
    }
});
