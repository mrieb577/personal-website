import "../widget.css"
import "./center-nav.css"

export default function CenterNavbar({ setTab }) {
    return (<div className="widget">
        <button className="navbar_button" onClick={() => setTab("projects")}>Projects</button>
        <button className="navbar_button" onClick={() => setTab("blog")}>Blog</button>
    </div>)
}