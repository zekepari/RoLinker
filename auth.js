import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export function generateState() {
    return crypto.randomBytes(16).toString('hex');
}

export async function getUserInfo(accessToken) {
    try {
        const userInfoResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const userInfoData = await userInfoResponse.json();

        if (userInfoResponse.ok) {
            return userInfoData;
        } else {
            throw new Error('Failed to fetch user info');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function exchangeCodeForToken(code) {
    try {
        const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: process.env.ROBLOX_OAUTH_CLIENT,
                client_secret: process.env.ROBLOX_OAUTH_KEY,
                grant_type: 'authorization_code',
                code: code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok) {
            return tokenData;
        } else {
            throw new Error('Failed to exchange code for token');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
