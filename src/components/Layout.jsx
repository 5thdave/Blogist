import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { getLoggedInUser, logoutUser, subscribeToAuthChanges } from "../services/Auth";

const Layout = () => {
  const [user, setUser] = useState(() => getLoggedInUser());
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => subscribeToAuthChanges(() => setUser(getLoggedInUser())), []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between py-5 px-5">
      {/* nav area */}
      <nav className="sticky w-full z-20 top-0 start-0 border-b border-default bg-cyan-950 text-white rounded-base">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-xl text-heading font-semibold whitespace-nowrap text-white">BloGist</span>
          </NavLink>

          <div className="flex items-center md:order-2 gap-4">
            {!user ? (
              <>
                <NavLink
                  to="/signup"
                  className="py-2 px-3 text-sm font-medium rounded text-white hover:text-blue-300 transition-colors"
                >
                  Sign Up
                </NavLink>
                <NavLink
                  to="/login"
                  className="py-2 px-3 text-sm font-medium rounded text-white hover:text-blue-300 transition-colors"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80 hidden sm:inline">
                  Hi, <strong className="text-blue-300">{user.username}</strong>
                </span>
                <NavLink
                  to="/create"
                  className="block rounded bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-strong transition-colors"
                >
                  Create post
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}

            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="text"
                id="input-group-1"
                className="block w-full ps-9 pe-3 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body text-black"
                placeholder="Search"
              />
            </div>

            <button
              data-collapse-toggle="navbar-search"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
              aria-controls="navbar-search"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
              </svg>
            </button>
          </div>

          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              <li>
                <NavLink to="/" end className="block py-2 px-3 text-white hover:text-blue-300">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="block py-2 px-3 text-white hover:text-blue-300">
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="block py-2 px-3 text-white hover:text-blue-300">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="block py-2 px-3 text-white hover:text-blue-300">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* dynamic space where every page can add their own content */}
      <main>
        <Outlet />
      </main>

      <footer>
        <p className="text-center py-5">
          &copy; Copyright Blogist 2026
        </p>
      </footer>
    </div>
  );
};

export default Layout;
