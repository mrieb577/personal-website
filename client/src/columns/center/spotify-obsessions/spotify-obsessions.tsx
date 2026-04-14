import '../../widget.css'
import './spotify-obsessions.css'

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { stringify } from 'querystring';
import fetchSpotifyData, { type AccessData, CLIENT_ID, REDIRECT_URI, verifyAccess } from './fetch-data'
import writeToPlaylist from './write-data';
import ListTrack from './list-track';

const SCOPE = 'user-top-read user-read-private user-read-email playlist-modify-public';
export const max_selectable_items = 10;

export type Artist = {
    name: string
}

export type Track = {
    uri: string,
    name: string,
    artists: Artist[]
}

export function SpotifyObsessions() {
    const [code, setCode] = useState("");
    const [access_data, setAccessData] = useState<AccessData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [get_vals] = useSearchParams();

    const [tracks, setTracks] = useState<Track[]>([]);
    const [selected, setSelected] = useState<Track[]>([]);

    // user auth
    const auth_link = `https://accounts.spotify.com/authorize?` + stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI
    });

    useEffect(() => {
        const hash = get_vals.get("code");
        let cd = window.localStorage.getItem("code");

        if (!cd && hash) {
            cd = hash;
            window.localStorage.setItem("code", cd);
        }
        setCode(cd ?? ''); // save the code that is in the return url
    }, [get_vals]);

    const logout = () => {
        setCode("");
        window.localStorage.removeItem("code");
    }

    const fetch = async () => {
        setError("");
        setLoading(true);
        const endpoint = "me/top/tracks?limit=50&time_range=short_term";
        const result = await fetchSpotifyData(code, access_data, endpoint);
        if (result){
            console.log(result[1]);
            if (result[0]) setAccessData(result[0]);
            if (result[1]) setTracks(result[1]["items"]);
        }
        else {
            setError("Spotify session ended!");
            logout();
        }
        setLoading(false);
    }

    const exportObsessions = async () => {
        setLoading(true);
        console.log("Under construction");
        const result = await writeToPlaylist(code, selected, access_data);
        setLoading(false);
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
            <div className='top'>
                <div className='listheader'>
                    <h4 className='listtitle'>Your top tracks recently:</h4>
                </div>
                <ul className='trackList'>
                    {tracks && code ? tracks.map((track: Track) => (
                        <li key={track.uri} className='track'>
                            <ListTrack track={track} selected={selected} setSelected={setSelected}></ListTrack>
                        </li>
                    )) : ""}
                </ul>
            </div>
            <div className="selected">
                <div className='listheader'>
                    <h4 className='listtitle'>Selected tracks: {selected.length}/10</h4>
                    {code ? <button className='export' onClick={exportObsessions}>Export</button> : ""}
                </div>
                <ul className='trackList playlist'>
                    {selected && tracks && code ? selected.map((track: Track) => (
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