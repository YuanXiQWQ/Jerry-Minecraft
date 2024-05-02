/**
 * Loads posts from the server and displays them on the page
 */
document.addEventListener('DOMContentLoaded', function () {
    fetch('/get-posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.querySelector('.post-container');
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postLink = document.createElement('a');
                postLink.href = `/Post?postId=${post.id}`;
                postLink.classList.add('post-link', 'black', 'undecorated');

                const postElement = document.createElement('div');
                postElement.classList.add('posts');

                // User name
                const postUser = document.createElement('div');
                postUser.classList.add('post-details', 'postUser');
                postUser.textContent = post.user_name;

                // Post title
                const postTitle = document.createElement('div');
                postTitle.classList.add('post-details', 'postTitle');
                postTitle.textContent = post.post_title;

                // Post text
                const postText = document.createElement('div');
                postText.classList.add('post-details', 'postText');
                postText.textContent = post.post_text;

                // Post info(date, time, views)
                const postInfo = document.createElement('div');
                postInfo.classList.add('post-details', 'postInfo');

                const postDateAndTime = document.createElement('div');
                postDateAndTime.classList.add('postDateAndTime');

                const postDate = document.createElement('div');
                postDate.classList.add('postDate');
                postDate.textContent = new Date(post.post_date).toLocaleDateString();

                const postTime = document.createElement('div');
                postTime.classList.add('postTime');
                postTime.textContent = post.post_time;

                const postViews = document.createElement('div');
                postViews.classList.add('postViews');
                postViews.innerHTML = `<span>views:</span> ${post.post_views}`;

                // Concatenate date and time
                postDateAndTime.appendChild(postDate);
                postDateAndTime.appendChild(postTime);
                postInfo.appendChild(postDateAndTime);
                postInfo.appendChild(postViews);

                // Add username, post title, post text, and post info to the post-element
                postElement.appendChild(postUser);
                postElement.appendChild(postTitle);
                postElement.appendChild(postText);
                postElement.appendChild(postInfo);

                // Add the post-element to the post-link
                postLink.appendChild(postElement);
                postsContainer.appendChild(postLink);
            });
        })
        .catch(error => console.error('Failed to load posts:', error));
});
