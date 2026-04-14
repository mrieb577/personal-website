import { useState } from 'react';
import CenterNavbar from './center/center-nav';
import { SpotifyObsessions } from './center/spotify-obsessions/spotify-obsessions';
import Blog from './center/blog/blog';

export function Center() {
    const [tab, setTab] = useState("projects");
    return (<div>
        <CenterNavbar setTab={setTab} />
        {tab === "projects" ?
            <SpotifyObsessions />
            :
            <div/>
        }
        {tab === "blog" ?
            <Blog />
            :
            <div/>
        }
    </div>);
}