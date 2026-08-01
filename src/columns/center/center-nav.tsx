import "../widget.css"
import "./center-nav.css"

interface CenterNavbarParams {
  setTab: (tab: string) => void;
}

export default function CenterNavbar({ setTab } : CenterNavbarParams) {
    return (<div className="widget">
        <button className="navbar_button" onClick={() => setTab("blog")}>Blog</button>
        <button className="navbar_button" onClick={() => setTab("blog")}>Coming Soon...</button>
    </div>)
}