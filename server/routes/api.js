const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { body, validationResult } = require('express-validator');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

const csrfProtection = csrf({ cookie: true });

const reviewLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: { error: 'Слишком много запросов. Попробуйте позже.' },
    standardHeaders: true,
    legacyHeaders: false
});


const validateReview = [
    body('content')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Отзыв должен содержать от 10 до 500 символов')
        .escape(),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Оценка должна быть от 1 до 5'),
];

function sanitizeText(text) {
    return text
        .replace(/[<>]/g, '') 
        .replace(/[&]/g, '&amp;') 
        .replace(/["']/g, '') 
        .replace(/[`]/g, '')
        .replace(/javascript:/gi, '') 
        .replace(/on\w+=/gi, '') 
        .trim();
}

const checkAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

router.get('/auth/status', (req, res) => {
    try {
        res.json({
            user: req.session.user || null,
            isAuthenticated: !!req.session.user
        });
    } catch (error) {
        console.error('Auth status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/reviews', async (req, res) => {
    try {
        const reviews = await new Promise((resolve, reject) => {
            db.all(
                `SELECT reviews.*, users.username, users.avatar_url 
                 FROM reviews 
                 LEFT JOIN users ON reviews.user_id = users.id 
                 ORDER BY reviews.created_at DESC`,
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        const currentUserId = req.session.user ? req.session.user.id : null;
        const reviewsWithOwnership = reviews.map(review => ({
            ...review,
            is_own: review.user_id === currentUserId
        }));

        res.json(reviewsWithOwnership);
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/reviews/current', checkAuth, async (req, res) => {
    try {
        const review = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM reviews WHERE user_id = ?',
                [req.session.user.id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
        res.json(review || null);
    } catch (error) {
        console.error('Get current review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/reviews', checkAuth, async (req, res) => {
    try {
        const { content, rating } = req.body;
        const userId = req.session.user.id;
        
        const existingReview = await db.getUserReview(userId);
        if (existingReview) {
            return res.status(400).json({ error: 'Review already exists' });
        }

        const reviewId = await db.createReview(userId, content, rating);
        
        res.status(201).json({ 
            success: true,
            id: reviewId 
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/reviews/:id', checkAuth, async (req, res) => {
    try {
        const { content, rating } = req.body;
        const reviewId = req.params.id;
        const userId = req.session.user.id;

        const result = await new Promise((resolve, reject) => {
            db.run(
                `UPDATE reviews 
                 SET content = ?, rating = ?, updated_at = datetime('now')
                 WHERE id = ? AND user_id = ?`,
                [content, rating, reviewId, userId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });

        if (result === 0) {
            return res.status(404).json({ error: 'Review not found or not owned by user' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/auth/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            res.clearCookie('connect.sid', {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
            
            res.json({ success: true });
        });
    } else {
        res.json({ success: true });
    }
});

module.exports = router; 