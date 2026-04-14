import { stringify } from 'querystring';
import { verifyAccess, type AccessData } from "./fetch-data";
import { max_selectable_items, type Track } from './spotify-obsessions';

const playlistName = "spotify-obsessions";
const playlistDescription = "A playlist consisting of your current obsessions. Play it on loop or use it for suggestions, up to you! Generated using Spotify Obsessions.";

async function getUserPlaylists(access_data: AccessData | null){
    if (!access_data) throw new Error("Insufficient access data to get user playlists!");
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
                if (data["items"][i].name == playlistName)
                    return data["items"][i].id;
            }
            off += chunk;
        }
        return null;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function createObsessionsPlaylist(access_data: AccessData | null) : Promise<string> {
    if (!access_data) throw new Error("Insufficient access data to create the playlist!");
    try {
        const url = `https://api.spotify.com/v1/me/playlists`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_data["access_token"]}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                description: playlistDescription
            })
        });
        if (!response.ok) {
            throw new Error(`Data HTTP error, status: ${response.status}`)
        }
        const data = await response.json();
        return data["id"];
    } catch (error) {
        console.error("Fetch error:", error);
    }
    return "";
}

async function clearExistingPlaylist(playlist_id: string, access_data: AccessData | null) {
    if (!access_data) throw new Error("Insufficient access data to create the playlist!");
    try {
        const url = `https://api.spotify.com/v1/playlists/${playlist_id}/items`;
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
        const playlist_items = data["items"];
        if (playlist_items.length == 0) return;

        const delete_uris = [];
        for (let i = 0; i < playlist_items.length; i++)
            delete_uris.push({ "uri": playlist_items[i]["item"]["uri"] } );
        const delete_response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${access_data["access_token"]}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: delete_uris
            })
        });
        if (!delete_response.ok) {
            throw new Error(`Data HTTP error, status: ${response.status}`)
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function writePlaylistContent(playlist_id: string, tracks: Track[], access_data: AccessData | null) {
    if (!access_data) throw new Error("Insufficient access data to create the playlist!");
    try {
        const track_uris: string[] = [];
        for (let i = 0; i < tracks.length; i++)
            track_uris.push(tracks[i].uri);
        const url = `https://api.spotify.com/v1/playlists/${playlist_id}/items`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_data["access_token"]}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: track_uris
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

async function writeToPlaylist(cd: string, selected: Track[], access_data: AccessData | null){
    try {
        access_data = await verifyAccess(cd, access_data);
        if (!access_data) throw new Error("Unable to get access data, cannot write!");

        //get existing playlist id
        const existing_id = await getUserPlaylists(access_data);
        if (!existing_id) {
            // create a new playlist
            const new_id = await createObsessionsPlaylist(access_data);
            await writePlaylistContent(new_id, selected, access_data);
        } else {
            await clearExistingPlaylist(existing_id, access_data);
            // set the existing playlist's items to the selected songs
            await writePlaylistContent(existing_id, selected, access_data);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

export default writeToPlaylist;