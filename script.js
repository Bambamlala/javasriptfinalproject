document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results-container');
    const bookNowBtn = document.querySelector('.book-now-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupBtn = document.getElementById('close-popup-btn');

    if (searchBtn && resetBtn && searchInput && resultsContainer) {
        function fetchRecommendations(query) {
            fetch('travel_recommendation_api.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const lowerCaseQuery = query.toLowerCase();
                    let results = [];

                    if (lowerCaseQuery.includes('beach')) {
                        results = data.beaches;
                    } else if (lowerCaseQuery.includes('temple')) {
                        results = data.temples;
                    } else if (lowerCaseQuery.includes('country') || lowerCaseQuery.includes('countries')) {
                        data.countries.forEach(country => {
                            results.push(...country.cities);
                        });
                    } else {
                        data.countries.forEach(country => {
                            country.cities.forEach(city => {
                                if (city.name.toLowerCase().includes(lowerCaseQuery) || country.name.toLowerCase().includes(lowerCaseQuery)) {
                                    results.push(city);
                                }
                            });
                        });
                    }
                    displayResults(results, lowerCaseQuery);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    resultsContainer.innerHTML = `<p>Sorry, an error occurred while fetching data. Please try again later.</p>`;
                    popupOverlay.style.display = 'flex';
                });
        }

        function displayResults(results, query) {
            resultsContainer.innerHTML = '';
            if (results.length === 0) {
                resultsContainer.innerHTML = `<p>No recommendations found for "${query}".</p>`;
            } else {
                results.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'recommendation-card';
                    
                    let time = '';
                    if (item.name.includes('Sydney')) {
                        time = getCountryTime('Australia/Sydney');
                    } else if (item.name.includes('Tokyo')) {
                        time = getCountryTime('Asia/Tokyo');
                    } else if (item.name.includes('Rio de Janeiro')) {
                        time = getCountryTime('America/Sao_Paulo');
                    }
                    
                    card.innerHTML = `
                        <img src="${item.imageUrl}" alt="${item.name}">
                        <div class="card-content">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            ${time ? `<p class="country-time">Current time: ${time}</p>` : ''}
                        </div>
                    `;
                    resultsContainer.appendChild(card);
                });
            }

            popupOverlay.style.display = 'flex';
        }

        function clearResults() {
            resultsContainer.innerHTML = '';
            searchInput.value = '';
            popupOverlay.style.display = 'none'; // Hide the pop-up
        }

        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                fetchRecommendations(query);
            } else {
                alert('Please enter a keyword to search.');
            }
        });

        resetBtn.addEventListener('click', clearResults);

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', () => {
                popupOverlay.style.display = 'none';
            });
        }

        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Thank you for your interest! Booking features are coming soon.');
            });
        }
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your message has been sent successfully!');
            contactForm.reset();
        });
    }

    function getCountryTime(timeZone) {
        const date = new Date();
        const options = {
            timeZone: timeZone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        return date.toLocaleString('en-US', options);
    }
});