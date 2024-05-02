/**
 * This script fetches the details of a post and displays it on the page.
 */
document.addEventListener('DOMContentLoaded', function () {
    // get postId from URL
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');

    if (!postId) {
        console.error('Post ID is missing');
        return;
    }

    // get post-details based on postId
    fetch(`/get-post-details?postId=${postId}`)
        .then(response => response.json())
        .then(post => {
            document.getElementById('postTitle').textContent = post.post_title;
            document.getElementById('postUser').textContent = post.user_name;
            document.getElementById('postText').textContent = post.post_text;
            document.getElementById('postDate').textContent = new Date(post.post_date).toLocaleDateString();
            document.getElementById('postTime').textContent = post.post_time;
            document.getElementById('postViews').textContent += post.post_views;
        })
        .catch(error => {
            console.error('Error loading post:', error);
        });
});
