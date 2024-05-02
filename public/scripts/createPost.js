/**
 * Handles the form submission for creating a new post.
 */
document.addEventListener("DOMContentLoaded", function () {
    const createPostForm = document.getElementById('createPostForm');
    createPostForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            postTitle: document.getElementById('postTitle').value,
            postText: document.getElementById('postContent').value,
        };

        fetch('/post-timeline', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Post created successfully');
                    window.location.href = '/community'; // Redirect to community page
                } else {
                    alert(data.message || 'Failed to create post');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred');
            });
    });
});
