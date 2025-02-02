const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(session({
    store: new SQLiteStore({
        db: 'sessions.db',
        dir: path.join(__dirname, 'database')
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../src')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/styles', express.static(path.join(__dirname, '../src/styles')));
app.use('/scripts', express.static(path.join(__dirname, '../src/scripts')));
app.use('/src/components', express.static(path.join(__dirname, '../src/components')));

const logRequest = (req, res, next) => {
    next();
};

app.use(logRequest);

app.use('/api/auth', require('./auth/discord'));
app.use('/api', require('./routes/api'));

app.post('/api/auth/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to logout' });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true });
        });
    } else {
        res.json({ success: true });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/index.html'));
});

app.get('/:page', (req, res, next) => {
    const pageName = req.params.page;
    const pagePath = path.join(__dirname, '../src/pages', `${pageName}.html`);

    console.log(`Checking file: ${pagePath}`);

    if (fs.existsSync(pagePath)) {
        console.log(`File found: ${pagePath}`);
        res.sendFile(pagePath);
    } else {
        console.log(`File not found: ${pagePath}`);
        next();
    }
});

app.get('/:page.html', (req, res, next) => {
    const pageName = req.params.page;
    const pagePath = path.join(__dirname, '../src/pages', `${pageName}.html`);

    console.log(`Checking file: ${pagePath}`);

    if (fs.existsSync(pagePath)) {
        console.log(`File found: ${pagePath}`);
        res.sendFile(pagePath);
    } else {
        console.log(`File not found: ${pagePath}`);
        next();
    }
});

app.use((req, res) => {
    console.log(`404 Error - Page not found: ${req.url}`);
    res.status(404).sendFile(path.join(__dirname, '../src/pages/404.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 10044;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    const pagesDir = path.join(__dirname, '../src/pages');
    fs.readdirSync(pagesDir)
        .filter(file => file.endsWith('.html'))
        .forEach(file => console.log(`- ${file}`));
});