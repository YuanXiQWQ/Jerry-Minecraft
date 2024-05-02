/**
 * Function to load and display user information on the webpage.
 */
document.addEventListener("DOMContentLoaded", () => {
    const profileInfo = document.querySelector(".profile-info");
    const profileEdit = document.querySelector(".profile-edit");
    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");

    editBtn.addEventListener("click", () => {
        profileInfo.classList.add("hidden");
        profileEdit.classList.remove("hidden");
        editBtn.classList.add("hidden");
        saveBtn.classList.remove("hidden");
    });

    saveBtn.addEventListener("click", () => {
        editProfile();
        profileInfo.classList.remove("hidden");
        profileEdit.classList.add("hidden");
        editBtn.classList.remove("hidden");
        saveBtn.classList.add("hidden");
    });

    loadAndDisplayUserInfo();
});

/**
 * Edits the user profile by sending updated information to the server.
 */
function editProfile() {
    let formData = {
        email: document.getElementById("editEmail").value.trim(),
        firstName: document.getElementById("editFirstName").value.trim(),
        lastName: document.getElementById("editLastName").value.trim(),
        oldPassword: document.getElementById("editPassword-oldPassword").value.trim(),
        newPassword: document.getElementById("editPassword-newPassword").value.trim(),
    };

    fetch('/update-profile', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                loadAndDisplayUserInfo();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/**
 * Function to load and display user information on the webpage.
 */
function loadAndDisplayUserInfo() {
    fetch(`/get-current-user?_=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('usernameInfo-container').textContent = data.username || '';
            document.getElementById('emailInfo-container').textContent = data.email || '';
            document.getElementById('firstNameInfo-container').textContent = data.firstName || '';
            document.getElementById('lastNameInfo-container').textContent = data.lastName || '';
        })
        .catch(error => {
            console.error('Error loading user info:', error);
        });
}
