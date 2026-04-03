import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  HiOutlineHome,
  HiOutlineMap,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChatBubbleLeft,
  HiOutlineBookmark,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2"
import { LiaMountainSolid } from "react-icons/lia"
import "./SideBar.css"

function SideBarMenu() {
  const user = useSelector(state => state.session.user)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => {
    if (path === "/?page=1") return location.pathname === "/" || location.search.includes("page=")
    return location.pathname === path
  }

  const navItems = [
    { label: "Home", path: "/?page=1", icon: <HiOutlineHome /> },
    { label: "Route Finder", path: "/route-finder", icon: <HiOutlineMap /> },
  ]

  const authNavItems = user ? [
    { label: "Questions", path: "/user-questions", icon: <HiOutlineChatBubbleLeftRight /> },
    { label: "Comments", path: "/user-comments", icon: <HiOutlineChatBubbleLeft /> },
    { label: "Saved Questions", path: "/saved-questions", icon: <HiOutlineBookmark /> },
  ] : []

  return (
    <div className="sidebar_container">
      {/* Logo */}
      <div className="sidebar_logo" onClick={() => navigate("/?page=1")}>
        <LiaMountainSolid className="sidebar_logo_icon" />
        <span className="sidebar_logo_text">BetaOverflow</span>
      </div>

      {/* User Profile */}
      {user && (
        <div className="sidebar_profile">
          <div className="sidebar_profile_avatar">
            {user.first_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="sidebar_profile_info">
            <span className="sidebar_profile_name">{user.first_name} {user.last_name}</span>
            <span className="sidebar_profile_username">@{user.username}</span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="sidebar_divider" />

      {/* Nav Items */}
      <nav className="sidebar_nav">
        {[...navItems, ...authNavItems].map(({ label, path, icon }) => (
          <button
            key={path}
            className={`sidebar_nav_item ${isActive(path) ? "active" : ""}`}
            onClick={() => navigate(path)}
          >
            <span className="sidebar_nav_icon">{icon}</span>
            <span className="sidebar_nav_label">{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar_bottom">
        <div className="sidebar_divider" />
        <button className="sidebar_nav_item" onClick={() => navigate("/about")}>
          <span className="sidebar_nav_icon"><HiOutlineQuestionMarkCircle /></span>
          <span className="sidebar_nav_label">About</span>
        </button>
      </div>
    </div>
  )
}

export default SideBarMenu
