import { Buffer } from 'buffer';
import { stringify } from 'querystring';

export const CLIENT_ID = "28c075c91c8141dcb65598d301a7b9d8";
const SECRET_ID = "05bc1edc3d30465bbb3e70f5865b95b3";
export const REDIRECT_URI = "http://127.0.0.1:5173";

async function fetchSpotifyData(cd: string, endpoint: string) {
    try {
        const url = `https://accounts.spotify.com/api/token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + SECRET_ID).toString("base64")),
            },
            body: stringify({
                grant_type: 'authorization_code',
                code: cd,
                redirect_uri: REDIRECT_URI,
            })
        });
        if (!response.ok) {
            throw new Error(`Data HTTP error, status: ${response.status}`)
        }
        const t_data = await response.json();
        const token = t_data["access_token"];

        const q_url = `https://api.spotify.com/v1/${endpoint}`;
        const q_response = await fetch(q_url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error(`Data HTTP error, status: ${response.status}`)
        }
        const data = await q_response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

export default fetchSpotifyData;