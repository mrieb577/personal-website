import "../../widget.css"

interface BlogEntryParams {
    entry: string | null;
}

export default function BlogEntry({ entry } : BlogEntryParams) {
    return (<div className="widget">
        <p>
            {entry}
        </p>
    </div>)
}