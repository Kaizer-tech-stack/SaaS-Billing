import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Activity,
  FileText,
  BarChart3,
  UserRound,
  Settings,
  ShieldCheck,
  FlaskConical,
} from "lucide-react";

function Sidebar({ page, setPage, nav, duplicates }) {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const icons = {
    Dashboard: LayoutDashboard,
    Customers: Users,
    "Usage Records": Activity,
    Invoices: FileText,
    Reports: BarChart3,
    "Algorithm Lab": FlaskConical,
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="sidebar">
      <button
        className="brand brand-button"
        type="button"
        onClick={() => setPage("Dashboard")}
        aria-label="Go to Dashboard"
      >
        <img
          className="brand-icon"
          src="/bilyntra-icon.webp"
          alt="Bilyntra logo"
        />

        <div className="brand-text">
          <b>Bilyntra</b>
          <small>INTELLIGENT BILLING</small>
        </div>
      </button>

      <p className="nav-label">WORKSPACE</p>

      <nav>
        {nav.map(([label]) => {
          const Icon = icons[label];

          if (!Icon) return null;

          return (
            <button
              key={label}
              className={`nav-item ${page === label ? "active" : ""}`}
              onClick={() => setPage(label)}
              type="button"
            >
              <Icon size={18} />
              <span>{label}</span>

              {label === "Usage Records" && duplicates.length > 0 && (
                <small className="nav-count">{duplicates.length}</small>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom-wrapper" ref={profileRef}>
        <button
          className="sidebar-bottom"
          type="button"
          onClick={() => setShowProfile((previous) => !previous)}
          aria-expanded={showProfile}
        >
          <div className="admin-avatar">AD</div>

          <div className="admin-user-text">
            <b>Admin User</b>
            <small>Administrator</small>
          </div>
        </button>

        {showProfile && (
          <div className="sidebar-profile-menu">
            <div className="profile-menu-header">
              <div className="profile-large-avatar">AD</div>

              <div>
                <b>Admin User</b>
                <small>Administrator</small>
              </div>
            </div>

            <div className="profile-menu-info">
              <div>
                <UserRound size={15} />
                <span>Administrator account</span>
              </div>

              <div>
                <ShieldCheck size={15} />
                <span>Local demo account</span>
              </div>
            </div>

            <div className="profile-menu-footer">
              <Settings size={15} />
              <span>Account settings coming soon</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
