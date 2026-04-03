import '../column.css'
import './center.css'

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { stringify } from 'querystring';
import fetchSpotifyData, { CLIENT_ID, REDIRECT_URI } from './fetchData'

const SCOPE = 'user-top-read user-read-private user-read-email';

export function Center() {
    const [code, setCode] = useState("");
    const [tracks, setTracks] = useState([]);
    const [get_vals] = useSearchParams();

    // user auth
    const auth_link = `https://accounts.spotify.com/authorize?` + stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI
    });

    useEffect(() => {
        const hash = get_vals.get("code");
        let code = window.localStorage.getItem("code");

        if (!code && hash) {
            code = hash;
            window.localStorage.setItem("code", code);
        }
        setCode(code);
    }, []);

    const logout = () => {
        setCode("");
        window.localStorage.removeItem("code");
    }

    // button onclick function
    const fetch = async () => {
        const endpoint = "me/top/tracks?limit=50&time_range=short_term";
        const result = await fetchSpotifyData(code, endpoint);
        console.log(result);
        setTracks(result["items"]);
    }

    return (<div className='column'>
        <h4>Obsessions</h4>
        {!code ?
            <a href={auth_link}>Login to Spotify</a>
            : <div>
                <button type="button" name="fetch" onClick={fetch}>Fetch</button>
                <button className="logout" onClick={logout}>Logout</button>
            </div>}
        <div className="data">
            <div className="found">
                <h4>Your top tracks recently:</h4>
                <ul>
                    {tracks ? tracks.map((track) => (
                        <li key={track.id}>
                            <input type="checkbox" id={track.id} value={track.name} />
                            <label htmlFor={track.id} className="trackName">{track.name} - {track.artists[0].name}</label>
                        </li>
                    )) : ""}
                </ul>
            </div>
            <div className="selected">
                <h4>Selected tracks:</h4>
            </div>
        </div>
    </div>)
}