// Builds the HTML for a single comment
function buildCommentHTML(comment) {
    return `<div class="comment"><strong>${comment.user}:</strong> ${comment.text}</div>`;
}

// Runs when the page loads — renders existing comments
document.addEventListener('DOMContentLoaded', () => {
    const commentsList = document.getElementById('commentsList');
    const comments = JSON.parse(localStorage.getItem('forumDiscussion')) || [];

    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="color: var(--text-secondary); font-size: 14px;">No comments yet. Be the first!</p>';
    } else {
        commentsList.innerHTML = comments.map(buildCommentHTML).join('');
    }

    // Handle new comment submission
    document.getElementById('commentForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const player = getCurrentPlayer();
        if (!player) {
            alert('Please register to comment.');
            window.location.href = '../register/register.html';
            return;
        }

        const input = document.getElementById('commentInput');
        const commentText = input.value.trim();
        if (!commentText) return;

        // Save the new comment to localStorage
        const newComment = { user: player.name, text: commentText };
        const allComments = JSON.parse(localStorage.getItem('forumDiscussion')) || [];
        allComments.push(newComment);
        localStorage.setItem('forumDiscussion', JSON.stringify(allComments));

        // Remove the "no comments" placeholder if present
        const placeholder = commentsList.querySelector('p');
        if (placeholder) placeholder.remove();

        // Add the new comment to the page without reloading
        commentsList.innerHTML += buildCommentHTML(newComment);
        input.value = '';
    });
});