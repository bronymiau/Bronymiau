const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const db = require('../database/db');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = 'https://bronymiau.com/api/auth/discord/callback';

async function getDiscordToken(code) {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
        }),
    });

    if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error('Failed to get Discord token');
    }

    return tokenResponse.json();
}

async function getDiscordUser(accessToken) {
    const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!userResponse.ok) {
        const error = await userResponse.text();
        throw new Error('Failed to get Discord user');
    }

    return userResponse.json();
}

router.get('/discord', (req, res) => {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'identify',
    });

    res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

router.get('/discord/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            throw new Error('No code provided');
        }

        const tokenResponse = await getDiscordToken(code);

        const userResponse = await getDiscordUser(tokenResponse.access_token);

        await new Promise((resolve, reject) => {
            db.run(
                `INSERT OR REPLACE INTO users (id, username, avatar_url) 
                 VALUES (?, ?, ?)`,
                [
                    userResponse.id,
                    userResponse.username,
                    userResponse.avatar 
                        ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png`
                        : 'https://cdn.discordapp.com/embed/avatars/0.png'
                ],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });

        const user = {
            id: userResponse.id,
            username: userResponse.username,
            avatar_url: userResponse.avatar 
                ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png`
                : 'https://cdn.discordapp.com/embed/avatars/0.png'
        };

        req.session.user = user;

        req.session.save((err) => {
            if (err) {
                return res.redirect('/reviews?error=session_error');
            }
            res.redirect('/reviews');
        });

    } catch (error) {
        res.redirect('/reviews?error=auth_failed');
    }
});

router.get('/status', (req, res) => {
    res.json({
        user: req.session.user || null,
        isAuthenticated: !!req.session.user
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/reviews');
    });
});

module.exports = router; 