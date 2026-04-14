import { useState } from 'react';
import { type Track, max_selectable_items } from './spotify-obsessions'

function ListTrack({ track, selected, setSelected }) {
    const [isChecked, setChecked] = useState(false);
    const trackChecked = (event : React.ChangeEvent<HTMLInputElement>) => {
        const entry: Track = {
            uri: `${event.target.id}`,
            name: `${event.target.value}`,
            artists: []
        }
        console.log(`${entry.name} toggled`);
        if (event.target.checked) {
            // add an item to the selected list
            setSelected([...selected, entry]);
            setChecked(true);
        }
        else {
            // remove an item from the selected list
            setSelected(selected => selected.filter(item => item.uri !== entry.uri));
            setChecked(false);
        }
    }

    return (<div>
        <input
            type="checkbox"
            id={track.uri}
            value={`${track.name} - ${track.artists[0].name}`}
            onChange={trackChecked}
            disabled={!isChecked && selected.length >= max_selectable_items}
        />
        <label htmlFor={track.uri} className="trackName">
            {track.name} - {track.artists[0].name}
        </label>
    </div>)
}

export default ListTrack;