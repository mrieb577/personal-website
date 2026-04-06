import { stringify } from 'querystring';
import { verifyAccess, type AccessData } from "./fetch-data";

const playlistName = "spotify-obsessions";
const playlistDescription = "A playlist consisting of your current obsessions. Play it on loop or use it for suggestions, up to you! Generated using Spotify Obsessions.";

async function getUserPlaylists(access_data: AccessData){
    try {
        const chunk = 50;
        let off = 0;
        let last_size = chunk;
        while(last_size >= chunk){
            const url = `https://api.spotify.com/v1/me/playlists?` + stringify({
                limit: chunk,
                offset: off
            });
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
            last_size = data["items"].length;

            for(let i = 0; i < data["items"].length; i++){
                if(data["items"][i].name == playlistName)
                    return data["items"][i].id
            }
            off += chunk;
        }
        return null;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function createObsessionsPlaylist(access_data: AccessData){
    try {
        const url = `https://api.spotify.com/v1/me/playlists`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_data["access_token"]}`,
                'Content-Type': 'application/json'
            },
            body: stringify({
                name: playlistName,
                description: playlistDescription
            })
        });
        if (!response.ok) {
            throw new Error(`Data HTTP error, status: ${response.status}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function writeToPlaylist(cd: string, access_data: AccessData){
    try {
        access_data = await verifyAccess(cd, access_data)
        //get existing playlist id
        const existing_id = await getUserPlaylists(access_data);
        if(!existing_id){
            createObsessionsPlaylist(access_data);
        }
        // set the playlist's items to the selected songs
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

export default writeToPlaylist;