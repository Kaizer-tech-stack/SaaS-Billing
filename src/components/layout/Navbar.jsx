import { useState } from "react";
import {
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  CheckCircle2,
  AlertTriangle,
  X,
  Menu,
} from "lucide-react";

function Navbar({ page, duplicates = [], onMenuClick, isMobileSidebarOpen }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const hasDuplicates = duplicates.length > 0;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          type="button"
          onClick={onMenuClick}
          aria-label={
            isMobileSidebarOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMobileSidebarOpen}
          aria-controls="app-sidebar"
        >
          {isMobileSidebarOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <span>Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <b>{page}</b>
      </div>

      <div className="topbar-right">
        <div className="topbar-date">November 2026</div>

        <div className="navbar-menu">
          <button
            className="icon-btn notification-btn"
            type="button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <Bell size={18} />
            {hasDuplicates && <span className="notification-dot" />}
          </button>

          {showNotifications && (
            <div className="dropdown-panel notification-panel">
              <div className="dropdown-heading">
                <div>
                  <b>Notifications</b>
                  <small>Your billing activity</small>
                </div>

                <button
                  className="dropdown-close"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>

              {hasDuplicates ? (
                <div className="notification-item warning">
                  <AlertTriangle size={19} />

                  <div>
                    <b>Duplicate records detected</b>
                    <p>
                      {duplicates.length} duplicate event
                      {duplicates.length === 1 ? "" : "s"} require review.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="notification-empty">
                  <CheckCircle2 size={25} />
                  <b>You're all caught up!</b>
                  <p>No duplicate records need your attention.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="navbar-menu">
          <button
            className="profile-trigger"
            type="button"
            aria-label="Admin profile"
            aria-expanded={showProfile}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <span className="avatar">AD</span>
            <ChevronDown size={13} />
          </button>

          {showProfile && (
            <div className="dropdown-panel profile-panel">
              <div className="profile-info">
                <span className="avatar profile-avatar">AD</span>

                <div>
                  <b>Admin User</b>
                  <small>Administrator</small>
                </div>
              </div>

              <div className="profile-detail">
                <UserRound size={16} />
                <span>Account: Administrator</span>
              </div>

              <div className="profile-detail">
                <Settings size={16} />
                <span>System access: Full access</span>
              </div>

              <button
                className="profile-close"
                onClick={() => setShowProfile(false)}
                type="button"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
