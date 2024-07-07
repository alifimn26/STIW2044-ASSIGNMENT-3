// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // API key for accessing the NewsAPI
    const apiKey = 'b0737b738ea880b5b877ac8b56c9a7c4'; // Replace with your NewsAPI key

    // URLs for fetching news articles
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&apikey=${apiKey}`;

    // Function to record user interactions and store them in localStorage
    function recordInteraction(functionName) {
        // Retrieve existing interactions from localStorage or initialize an empty array
        const interactions = JSON.parse(localStorage.getItem('userInteractions')) || [];

        // Create a new interaction object with the current date and function name
        const interaction = {
            date: new Date().toISOString(),
            functionUsed: functionName
        };

        // Add the new interaction to the array of interactions
        interactions.push(interaction);

        // Save the updated array back to localStorage
        localStorage.setItem('userInteractions', JSON.stringify(interactions));

        // Display the interactions
        displayInteractions();
    }

    // Function to display the latest 10 interactions
    function displayInteractions() {
        const interactions = JSON.parse(localStorage.getItem('userInteractions')) || [];
        const latestInteractions = interactions.slice(-10).reverse(); // Get the latest 10 interactions, reversed
        const interactionContainer = document.getElementById('interaction-container');
        
        // Clear previous interactions
        interactionContainer.innerHTML = '';

        // Iterate over each interaction and create HTML elements to display them
        latestInteractions.forEach(interaction => {
            const interactionItem = document.createElement('div');
            interactionItem.className = 'interaction-item';

            interactionItem.innerHTML = `
                <p>${new Date(interaction.date).toLocaleString()}</p>
                <p>Function Used: ${interaction.functionUsed}</p>
            `;

            interactionContainer.appendChild(interactionItem);
        });
    }

    // Fetch news articles from the specified URLs
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const articles = data.articles.slice(0, 15); // Limit to 15 articles
            const newsContainer = document.getElementById('news-container');

            // Iterate over each article and create HTML elements to display them
            articles.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';

                newsItem.innerHTML = `
                    <img src="${article.image}" alt="${article.title}">
                    <div class="content">
                        <h2>${article.title}</h2>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank">Read more</a>
                    </div>
                `;

                newsContainer.appendChild(newsItem);
            });

            // Record the interaction after displaying the news articles
            recordInteraction('displayNews');
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });

    // Display interactions on page load
    displayInteractions();
});
