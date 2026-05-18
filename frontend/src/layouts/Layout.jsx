import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
export default function Layout() {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadCollections();
  }, [location]); // Reload collections occasionally or just once

  const loadCollections = async () => {
    try {
      const data = await api("GET", "/collections");
      setCollections(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const navItemClass = ({ isActive }) =>
    ` nav-item ${isActive ? "active" : ""};`;
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#000a] z-[99] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 w-[260px] h-screen bg-surface border-r border-border flex flex-col z-[100] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-border">
          <div className="font-syne text-2xl font-extrabold bg-gradient-to-br from-accent to-accent2 bg-clip-text text-transparent">
            TASKER
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <div className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase px-3 py-1 mb-2">
              Workspace
            </div>
            <NavLink to="/" className={navItemClass} end>
              <span className="text-lg w-5 text-center">✅</span> All Todos
            </NavLink>
            <NavLink to="/collections" className={navItemClass}>
              <span className="text-lg w-5 text-center">📁</span> Collections
            </NavLink>
            <NavLink to="/feedback" className={navItemClass}>
              <span className="text-lg w-5 text-center">💬</span> Feedback
            </NavLink>
          </div>

          <div className="mb-6">
            <div className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase px-3 py-1 mb-2">
              My Collections
            </div>
            {collections.map((c) => (
              <button
                key={c._id}
                className="nav-item"
                onClick={() => {
                  navigate(`/?collection=${c._id}`);
                  setSidebarOpen(false);
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: c.color }}
                ></span>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div
            className="flex items-center gap-3 p-3 bg-surface2 rounded-xl cursor-pointer hover:bg-surface transition-colors"
            onClick={() => navigate("/profile")}
          >
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {currentUser?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {currentUser?.name || "User"}
              </div>
              <div className="text-xs text-muted">View Profile</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 text-xs text-muted hover:text-danger py-2 text-left px-3 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between p-5 md:px-8 border-b border-border bg-bg sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 bg-surface border border-border rounded-lg flex flex-col gap-1"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="w-5 h-0.5 bg-text rounded-full"></span>
              <span className="w-5 h-0.5 bg-text rounded-full"></span>
              <span className="w-5 h-0.5 bg-text rounded-full"></span>
            </button>
            <div className="font-syne text-xl font-bold capitalize">
              {location.pathname === "/"
                ? "All Todos"
                : location.pathname.substring(1)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/?new=true")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-accent to-[#5b4fd4] rounded-xl text-white font-sans text-sm cursor-pointer hover:opacity-90 whitespace-nowrap"
            >
              ＋ New Todo
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
