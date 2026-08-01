import { useState } from 'react';
import CenterNavbar from './center/center-nav';
import Blog from './center/blog/blog';

export function Center() {
    const [tab, setTab] = useState("blog");

    return (<div>
        <CenterNavbar setTab={setTab} />
        {tab === "blog" ?
            <Blog />
            :
            <div/>
        }
    </div>);
}