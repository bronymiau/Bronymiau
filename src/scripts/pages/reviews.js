let currentUser = null;
let currentRating = 0;
let editReviewId = null;
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    await loadReviews();
    setupReviewForm();
    setupLogoutButton();
});
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        currentUser = data.user;
        await updateAuthUI();
        console.log('Auth status:', data);
        console.log('Current user:', currentUser);
    } catch (error) {
        console.error('Error checking auth status:', error);
        Notifications.show('Ошибка при проверке статуса авторизации', 'error');
    }
}
async function updateAuthUI() {
    const authSection = document.querySelector('.auth-section');
    const userInfo = document.querySelector('.user-info');
    const reviewFormContainer = document.querySelector('.review-form-container');
    if (currentUser) {
        if (authSection) authSection.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            const avatar = userInfo.querySelector('.user-avatar');
            const username = userInfo.querySelector('.username');
            if (avatar) avatar.src = currentUser.avatar_url;
            if (username) username.textContent = currentUser.username;
        }
        const userReview = await checkUserReview();
        if (reviewFormContainer) {
            reviewFormContainer.style.display = userReview ? 'none' : 'block';
        }
    } else {
        if (authSection) authSection.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (reviewFormContainer) reviewFormContainer.style.display = 'none';
    }
}
async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        await updateReviewsStats(reviews);
        const reviewsList = document.querySelector('.reviews-list');
        reviewsList.innerHTML = reviews.map((review, index) => `
            <div class="review-item" data-review-id="${review.id}" style="--index: ${index}">
                <div class="review-header">
                    <img src="${review.avatar_url}" alt="${review.username}" class="user-avatar">
                    <span class="username">${review.username}</span>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                    </div>
                    ${currentUser && currentUser.id === review.user_id ? `
                        <button class="edit-btn" onclick="startEdit(${review.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    ` : ''}
                </div>
                <div class="review-content">
                    <p>${review.content}</p>
                </div>
                <div class="review-date">
                    ${new Date(review.created_at).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load reviews error:', error);
        Notifications.show('Error loading reviews', 'error');
    }
}
function startEdit(reviewId) {
    const reviewItem = document.querySelector(`[data-review-id="${reviewId}"]`);
    if (!reviewItem) return;
    editReviewId = reviewId;
    const content = reviewItem.querySelector('.review-content p').textContent;
    const rating = reviewItem.querySelector('.review-rating').textContent.split('★').length - 1;
    currentRating = rating;
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <div class="rating-select">
            ${Array.from({length: 5}, (_, i) => `
                <span class="star ${i < rating ? 'active' : ''}" data-rating="${i + 1}">
                    ${i < rating ? '★' : '☆'}
                </span>
            `).join('')}
        </div>
        <textarea>${content}</textarea>
        <div class="edit-buttons">
            <button class="save-btn" onclick="saveEdit(${reviewId})">Save</button>
            <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
        </div>
    `;
    reviewItem.querySelector('.review-content').replaceWith(editForm);
    const stars = editForm.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentRating = index + 1;
            highlightStars(currentRating);
        });
        star.addEventListener('mouseover', () => highlightStars(index + 1));
        star.addEventListener('mouseout', () => highlightStars(currentRating));
    });
    highlightStars(currentRating);
}
function sanitizeText(text) {
    return text
        .replace(/[<>]/g, '') 
        .replace(/[&]/g, '&amp;') 
        .replace(/["']/g, '') 
        .replace(/[`]/g, '') 
        .replace(/javascript:/gi, '') 
        .replace(/on\w+=/gi, '') 
        .replace(/[^\w\s.,!?()-]/g, '') 
        .trim();
}
async function saveEdit(reviewId) {
    const editForm = document.querySelector('.edit-form');
    const content = editForm.querySelector('textarea').value;
    const sanitizedContent = sanitizeText(content);
    
    if (!currentRating) {
        Notifications.show('notifications.review.selectRating', 'warning', 'ru');
        return;
    }

    if (sanitizedContent.length < 10) {
        Notifications.show('notifications.review.minLength', 'warning', 'ru');
        return;
    }

    if (sanitizedContent.length > 500) {
        Notifications.show('notifications.review.maxLength', 'warning', 'ru');
        return;
    }

    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: sanitizedContent,
                rating: currentRating
            })
        });
        if (!response.ok) throw new Error('Failed to update review');
        Notifications.show('notifications.review.updateSuccess', 'success', 'ru');
        await loadReviews();
        editReviewId = null;
    } catch (error) {
        console.error('Update review error:', error);
        Notifications.show('notifications.review.updateError', 'error', 'ru');
    }
}
function cancelEdit() {
    editReviewId = null;
    loadReviews();
}
function setRating(rating) {
    currentRating = rating;
    highlightStars(rating);
}
function highlightStars(count) {
    const stars = document.querySelectorAll('.edit-form .star');
    stars.forEach((star, index) => {
        star.textContent = index < count ? '★' : '☆';
        star.classList.toggle('active', index < count);
    });
}
const additionalStyles = `
.edit-form {
    margin: 1rem 0;
}
.edit-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
}
.save-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}
.save-btn {
    background: rgba(139, 92, 246, 0.2);
    color: #fff;
    border: 1px solid rgba(139, 92, 246, 0.3);
}
.cancel-btn {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
}
.edit-btn {
    background: rgba(139, 92, 246, 0.1);
    color: #9d8ec1;
    border: 1px solid rgba(139, 92, 246, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: auto;
}
.edit-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    transform: translateY(-2px);
}
`;
function setupLogoutButton() {
    const signOutBtn = document.querySelector('.sign-out-btn');
    console.log('Found sign out button:', signOutBtn); 
    if (signOutBtn) {
        signOutBtn.onclick = async function(e) {
            e.preventDefault();
            console.log('Logout button clicked'); 
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Logout response:', response); 
                if (response.ok) {
                    window.location.href = '/reviews'; 
                } else {
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert('Ошибка при выходе из системы'); 
            }
        };
        signOutBtn.style.display = 'block';
        signOutBtn.style.pointerEvents = 'auto';
    }
}
async function updateReviewsStats(reviews) {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
        document.querySelector('.rating-big').textContent = '0.0';
        document.querySelector('.rating-stars').textContent = '☆☆☆☆☆';
        document.querySelector('.reviews-count').textContent = 'No reviews yet';
        return;
    }
    const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating - fullStars >= 0.5;
    const stars = '★'.repeat(fullStars) + (hasHalfStar ? '★' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
    const ratingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    reviews.forEach(review => {
        ratingCounts[review.rating]++;
    });
    document.querySelector('.rating-big').textContent = averageRating;
    document.querySelector('.rating-stars').textContent = stars;
    document.querySelector('.reviews-count').textContent = `${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`;
    Object.entries(ratingCounts).forEach(([rating, count]) => {
        const percentage = (count / totalReviews) * 100;
        const progressBar = document.querySelector(`.rating-bar:nth-child(${6-rating}) .progress`);
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    });
}
async function checkUserReview() {
    if (!currentUser) return null;
    try {
        const response = await fetch('/api/reviews/current');
        const review = await response.json();
        return review;
    } catch (error) {
        console.error('Error checking user review:', error);
        return null;
    }
}
function setupReviewForm() {
    const stars = document.querySelectorAll('.rating-select .star');
    const submitBtn = document.querySelector('.submit-review-btn');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentRating = index + 1;
            updateStars();
        });
        star.addEventListener('mouseover', () => {
            highlightStars(index + 1);
        });
        star.addEventListener('mouseout', () => {
            highlightStars(currentRating);
        });
    });
    if (submitBtn) {
        submitBtn.addEventListener('click', submitReview);
    }
}
function updateStars() {
    const stars = document.querySelectorAll('.rating-select .star');
    stars.forEach((star, index) => {
        star.textContent = index < currentRating ? '★' : '☆';
        star.classList.toggle('active', index < currentRating);
    });
}
async function submitReview() {
    const content = document.querySelector('.review-textarea').value;
    const sanitizedContent = sanitizeText(content);
    
    if (!currentRating) {
        Notifications.show('notifications.review.selectRating', 'warning', 'ru');
        return;
    }

    if (sanitizedContent.length < 10) {
        Notifications.show('notifications.review.minLength', 'warning', 'ru');
        return;
    }

    if (sanitizedContent.length > 500) {
        Notifications.show('notifications.review.maxLength', 'warning', 'ru');
        return;
    }

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: sanitizedContent,
                rating: currentRating
            })
        });
        if (response.ok) {
            Notifications.show('notifications.review.success', 'success', 'ru');
            await loadReviews();
            await updateAuthUI();
            document.querySelector('.review-textarea').value = '';
            currentRating = 0;
            updateStars();
        } else {
            throw new Error('Failed to submit review');
        }
    } catch (error) {
        console.error('Submit review error:', error);
        Notifications.show('notifications.review.error', 'error', 'ru');
    }
} 
