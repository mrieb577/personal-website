import '../widget.css'
import './spotify-obsessions.css'

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { stringify } from 'querystring';
import fetchSpotifyData, { CLIENT_ID, REDIRECT_URI } from './fetch-data'

const SCOPE = 'user-top-read user-read-private user-read-email';

export function SpotifyObsessions() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [get_vals] = useSearchParams();

    const [tracks, setTracks] = useState([]);

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
        setError("");
        setLoading(true);
        const endpoint = "me/top/tracks?limit=50&time_range=short_term";
        const result = await fetchSpotifyData(code, endpoint);
        console.log(result);
        if (result) setTracks(result["items"]);
        else {
            setError("Spotify session ended!");
            logout();
        }
        setLoading(false);
    }

    return (<div className='widget obsessions'>
        <h2>Obsessions</h2>
        {!code ?
            <a href={auth_link}>Login to Spotify</a>
            : <div>
                <button type="button" name="fetch" onClick={fetch}>Fetch</button>
                <button className="logout" onClick={logout}>Logout</button>
            </div>}
        {loading ? <p>Loading...</p> : <div></div>}
        <p>{error} </p>
        <div className="data">
            <div>
                <h4>Your top tracks recently:</h4>
                <ul className='trackList'>
                    {tracks ? tracks.map((track) => (
                        <li key={track.id} className='track'>
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