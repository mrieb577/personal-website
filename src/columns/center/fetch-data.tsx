import { Buffer } from 'buffer';
import { stringify } from 'querystring';

export const CLIENT_ID = "28c075c91c8141dcb65598d301a7b9d8";
const SECRET_ID = "05bc1edc3d30465bbb3e70f5865b95b3";
export const REDIRECT_URI_IPV4 = "http://127.0.0.1:5173";
export const REDIRECT_URI_IPV6 = "http://[::1]:5173";

export type AccessData = {
    "access_token": null,
    "expires_in": number;
    "refresh_token": null,
    "grant_time": number
}

async function setupAccessToken(cd: string){
    try{
        if(!cd) throw new Error("Code was not given!");
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
                redirect_uri: REDIRECT_URI_IPV6,
            })
        });
        if (!response.ok) {
            throw new Error(`Data HTTP error, status: ${response.status}`)
        }
        const t_data = await response.json();
        t_data["grant_time"] = Date.now();
        return t_data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function refreshAccessToken(cd: string, access_data : AccessData){
    try{
        if(!cd) throw new Error("Code was not given!");
        if(!access_data["refresh_token"]) throw new Error("Access data was not given!");
        const url = `https://accounts.spotify.com/api/token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: stringify({
                grant_type: 'refresh_token',
                refresh_token: access_data["refresh_token"],
                client_id: CLIENT_ID
            })
        });
        if (!response.ok) {
            throw new Error(`Data HTTP error, status: ${response.status}`)
        }
        const t_data = await response.json();
        access_data["access_token"] = t_data["access_token"];
        access_data["refresh_token"] = t_data["refresh_token"];
        access_data["grant_time"] = Date.now();
        return access_data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

export async function verifyAccess(cd: string, access_data : AccessData) {
    if(!access_data || !access_data["access_token"]) 
        return await setupAccessToken(cd);
    if(Date.now() - access_data["grant_time"] >= access_data["expires_in"] * 1000) 
        return await refreshAccessToken(cd, access_data);
}

async function fetchSpotifyData(cd: string, access_data : AccessData, endpoint: string) {
    try {
        access_data = await verifyAccess(cd, access_data);
        
        const url = `https://api.spotify.com/v1/${endpoint}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_data["access_token"]}`,
            }
        });
        if (!response.ok) {
            throw new Error(`Data HTTP error, status: ${response.status}`)
        }
        const data = await response.json();
        return [access_data, data];
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

export default fetchSpotifyData;