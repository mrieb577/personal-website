import './content.css'
import { Right } from './columns/right';
import { Center } from './columns/center/center';
import { Left } from './columns/left';

export function Content() {
    return (<div className="content-container">
        <Right/>
        <Center/>
        <Left/>
    </div>);
}