/*construction.html
* */

/**
 * Fetches and displays construction data from the server.
 */
function fetchAndDisplayConstructions() {
    fetch('/get-constructionList-data')
        .then(response => response.json())
        .then(data => {
            const listContainer = document.getElementById('constructionListContainer');
            listContainer.innerHTML = '';
            data.buildings.forEach(building => {
                const buildingHTML = `
                    <div class="construction-item">
                        <h2>${building.Name}</h2>
                        <p>Status: ${building.Status}</p>
                        <p>Registration Number: ${building.RegistrationNumber}</p>
                        <p>Registration Event: ${building.RegistrationEvent}</p>
                        <p>Location: ${building.Location}</p>
                    </div>
                `;
                listContainer.innerHTML += buildingHTML;
            });
        })
        .catch(error => console.error('Error loading construction data:', error));
}

/**
 * Adds a new construction to the server.
 */
document.getElementById('addConstructionForm').addEventListener('submit', e => {
    e.preventDefault();

    // Collect form data
    const formData = {
        Name: document.getElementById('name').value,
        Status: document.getElementById('status').value,
        RegistrationNumber: document.getElementById('registrationNumber').value,
        RegistrationEvent: document.getElementById('registrationEvent').value,
        Location: document.getElementById('location').value,
    };

    // Post data
    fetch('/add-construction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.text())
        .then(responseText => {
            console.log(responseText);
            fetchAndDisplayConstructions();
        })
        .catch(error => console.error('Error adding construction:', error));
});

/**
 * Loads and inserts the construction list from the server.
 */
function loadAndInsertConstructionList() {
    fetch('/get-constructionList')
        .then(response => response.text())
        .then(html => {
            document.getElementById('constructionListContainer').innerHTML = html;
        })
        .catch(error => console.error('Error loading construction list:', error));
}

/**
 * Event listener for DOMContentLoaded event.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadAndInsertConstructionList();
    fetchAndDisplayConstructions();
});
