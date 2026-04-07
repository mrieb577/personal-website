import { type Track } from './spotify-obsessions'

type list_track_params = {
    track: Track,
    onCheckChanged: () => void,
    isFull: boolean
};

function ListTrack({ track, onCheckChanged, isFull }: list_track_params) {
    return (<div>
        <input type="checkbox" id={track.uri} value={`${track.name} - ${track.artists[0].name}`} onChange={onCheckChanged} disabled={isFull} />
        <label htmlFor={track.uri} className="trackName">
            {track.name} - {track.artists[0].name}
        </label>
    </div>)
}

export default ListTrack;