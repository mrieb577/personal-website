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
    const [selected, setSelected] = useState([]);

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

    const trackChecked = (event) => {
        console.log(event.target.id);
        let entry = {
            "uri": `${event.target.id}`,
            "name": `${event.target.value}`
        }
        if (event.target.checked) {
            setSelected([...selected, entry]);
        }
        else {
            setSelected(selected => selected.filter(item => item.uri !== entry.uri));
        }
    }

    const exportObsessions = () => {
        console.log("To be implemented!");
    }

    return (<div className='widget obsessions'>
        <h2>Obsessions</h2>
        {!code ?
            <a href={auth_link}>Login to Spotify</a>
            : <div>
                <button name="fetch" onClick={fetch}>Fetch</button>
                <button className="logout" onClick={logout}>Logout</button>
            </div>}
        {loading ? <p>Loading...</p> : <div></div>}
        <p>{error} </p>
        <div className="data">
            <div>
                <div className='listheader'>
                    <h4 className='listtitle'>Your top tracks recently:</h4>
                </div>
                <ul className='trackList'>
                    {tracks && code ? tracks.map((track) => (
                        <li key={track.uri} className='track'>
                            <input type="checkbox" id={track.uri} value={`${track.name} - ${track.artists[0].name}`} onChange={trackChecked} />
                            <label htmlFor={track.uri} className="trackName">
                                {track.name} - {track.artists[0].name}
                            </label>
                        </li>
                    )) : ""}
                </ul>
            </div>
            <div className="selected">
                <div className='listheader'>
                    <h4 className='listtitle'>Selected tracks: {selected.length} </h4>
                    {code ? <button className='export' onClick={exportObsessions}>Export</button> : ""}
                </div>
                <ul className='trackList'>
                    {selected && tracks && code ? selected.map((track) => (
                        <li key={track.uri} className='track'>
                            <p className="trackName">
                                {track.name}
                            </p>
                        </li>
                    )) : ""}
                </ul>
            </div>
        </div>
    </div>)
}