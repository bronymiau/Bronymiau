const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'reviews.db'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at)`);
});

db.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

db.getUserReview = (userId) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT reviews.*, users.username, users.avatar_url 
             FROM reviews 
             LEFT JOIN users ON reviews.user_id = users.id 
             WHERE reviews.user_id = ?`,
            [userId],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
};

db.getAllReviews = () => {
    return new Promise((resolve, reject) => {
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
};

db.createReview = (userId, content, rating) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO reviews (user_id, content, rating) 
             VALUES (?, ?, ?)`,
            [userId, content, rating],
            function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

db.updateReview = (reviewId, userId, content, rating) => {
    return new Promise((resolve, reject) => {
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
};

module.exports = db; 