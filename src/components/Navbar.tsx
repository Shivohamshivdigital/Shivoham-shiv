import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogIn, LogOut, Sparkles, ArrowRight } from "lucide-react";
import { getSession, clearSession, displayName, onAuthChange, Session } from "../utils/session";

interface NavbarProps {
  onOpenConsultation: () => void;
  updateTrigger?: number;
}

export default function Navbar({ onOpenConsultation, updateTrigger }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSession(getSession());
    return onAuthChange(() => setSession(getSession()));
  }, [location.pathname, updateTrigger]);

  const handleLogout = () => {
    clearSession();
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  // Close drawer on page change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#2F5D50] shadow-md transition-all duration-300">
      {/* Promotional announcement bar (live) */}
      <Link
        to="/weight-loss"
        className="group relative block overflow-hidden bg-gradient-to-r from-[#d97f24] via-[#F0A64E] to-[#d97f24] text-white"
      >
        {/* moving shimmer */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
        <span className="relative flex items-center justify-center gap-2 sm:gap-2.5 px-4 py-2.5 text-center text-[11px] sm:text-xs font-semibold tracking-wide">
          {/* live dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <Sparkles className="hidden sm:inline-block w-3.5 h-3.5 text-white/90 shrink-0" aria-hidden="true" />
          <span className="flex items-center gap-x-1.5 gap-y-0.5 flex-wrap justify-center">
            <span>
              Signup today &amp; start your transformation in <strong className="font-extrabold">24 hrs</strong>
            </span>
            <span className="inline-flex items-center rounded-full bg-white text-[#C2410C] font-extrabold px-2 py-0.5 shadow-sm">
              30% OFF
            </span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-90 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>

      <nav aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">

          {/* Left: Brand Logo in white rounded badge */}
          <Link id="nav-logo" to="/" className="flex items-center group shrink-0" aria-label="Shivoham Shiv Home">
            <div className="h-16 sm:h-20 w-auto px-2 sm:px-2.5 py-1 rounded-xl bg-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src="/shivoham-shiv-logo.jpg"
                alt="Shivoham Shiv logo"
                className="h-full w-auto object-contain rounded-lg"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7">
            
            {/* ABOUT US */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors duration-200 py-2 ${
                  isActive ? "text-amber-200" : "text-white hover:text-amber-100"
                }`
              }
            >
              ABOUT US
            </NavLink>

            {/* MURM DAB CHIKITSA (single link) */}
            <NavLink
              to="/courses/acupressure-therapy"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors duration-200 py-2 ${
                  isActive ? "text-amber-200" : "text-white hover:text-amber-100"
                }`
              }
            >
              Murm Dab Chikitsa
            </NavLink>

            {/* Ayurvedic / Natural Weight Loss */}
            <NavLink
              to="/weight-loss"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors duration-200 py-2 ${
                  isActive ? "text-amber-200" : "text-white hover:text-amber-100"
                }`
              }
            >
              Ayurvedic / Natural Weight Loss
            </NavLink>

            {/* CONTACT US */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors duration-200 py-2 ${
                  isActive ? "text-amber-200" : "text-white hover:text-amber-100"
                }`
              }
            >
              CONTACT US
            </NavLink>

            {/* BLOG */}
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-wider transition-colors duration-200 py-2 ${
                  isActive ? "text-amber-200" : "text-white hover:text-amber-100"
                }`
              }
            >
              BLOG
            </NavLink>

          </div>

          {/* Right Action Widgets */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Account / Login */}
            {session ? (
              <div className="flex items-center space-x-1.5">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
                  title="My Account"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{displayName(session.email)}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all whitespace-nowrap"
                title="Log in"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Start Your 60-Day Journey</span>
              </Link>
            )}

            {/* Whatsapp pill button */}
            <a
              href="https://wa.me/917317778215"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-5 bg-white hover:bg-neutral-50 text-[#2F5D50] rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              {/* WhatsApp Green Icon */}
              <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.945 9.945 0 0 0 4.887 1.277h.005c5.505 0 9.988-4.478 9.989-9.985C22 6.478 17.518 2 12.012 2zm6.05 14.153c-.333.931-1.637 1.77-2.228 1.833-.591.064-1.183.344-3.793-.733-3.132-1.293-5.115-4.47-5.271-4.678-.156-.208-1.254-1.666-1.254-3.178 0-1.513.788-2.257 1.068-2.558.28-.3.61-.375.813-.375h.582c.18 0 .422.016.649.525.234.526.8 1.944.869 2.083.07.139.116.301.023.486-.092.185-.139.3-.277.463-.14.163-.292.366-.417.49-.139.14-.284.293-.122.571.162.278.718 1.184 1.54 1.916.611.544 1.12.822 1.442.97.278.127.44.11.602-.07.162-.185.718-.834.908-1.112.19-.278.379-.232.616-.139.236.093 1.513.714 1.774.843.26.129.431.194.494.301.063.107.063.62-.27 1.551z"/>
              </svg>
              <span>Whatsapp</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Whatsapp pill button (mobile) */}
            <a
              href="https://wa.me/917317778215"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-2.5 bg-white hover:bg-neutral-50 text-[#2F5D50] rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center space-x-1 shrink-0"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.945 9.945 0 0 0 4.887 1.277h.005c5.505 0 9.988-4.478 9.989-9.985C22 6.478 17.518 2 12.012 2zm6.05 14.153c-.333.931-1.637 1.77-2.228 1.833-.591.064-1.183.344-3.793-.733-3.132-1.293-5.115-4.47-5.271-4.678-.156-.208-1.254-1.666-1.254-3.178 0-1.513.788-2.257 1.068-2.558.28-.3.61-.375.813-.375h.582c.18 0 .422.016.649.525.234.526.8 1.944.869 2.083.07.139.116.301.023.486-.092.185-.139.3-.277.463-.14.163-.292.366-.417.49-.139.14-.284.293-.122.571.162.278.718 1.184 1.54 1.916.611.544 1.12.822 1.442.97.278.127.44.11.602-.07.162-.185.718-.834.908-1.112.19-.278.379-.232.616-.139.236.093 1.513.714 1.774.843.26.129.431.194.494.301.063.107.063.62-.27 1.551z"/>
              </svg>
              <span className="hidden min-[350px]:inline">Whatsapp</span>
            </a>

            <Link
              to={session ? "/dashboard" : "/login"}
              className="p-1.5 sm:p-2 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label={session ? "My Account" : "Log in"}
            >
              {session ? <User className="w-4 h-4 sm:w-5 h-5" /> : <LogIn className="w-4 h-4 sm:w-5 h-5" />}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 sm:top-20 left-0 w-full bg-[#2F5D50] border-t border-green-600/30 shadow-2xl py-6 px-5 z-50 animate-fadeIn">
          <div className="flex flex-col space-y-4 text-left">
            
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10`}
            >
              ABOUT US
            </Link>

            {/* Mobile MURM DAB CHIKITSA (single link) */}
            <Link
              to="/courses/acupressure-therapy"
              onClick={() => setIsOpen(false)}
              className="py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10"
            >
              Murm Dab Chikitsa
            </Link>

            <Link
              to="/weight-loss"
              onClick={() => setIsOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10`}
            >
              Ayurvedic / Natural Weight Loss
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10`}
            >
              CONTACT US
            </Link>

            <Link
              to="/blog"
              onClick={() => setIsOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10`}
            >
              BLOG
            </Link>

            {/* Mobile account / login */}
            <div className="pt-4 border-t border-white/15 space-y-3">
              {session ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10"
                  >
                    <User className="w-4 h-4" /> My Account ({displayName(session.email)})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-red-200 hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10"
                >
                  <LogIn className="w-4 h-4" /> Start Your 60-Day Journey
                </Link>
              )}

              <a
                href="https://wa.me/917317778215"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-white hover:bg-neutral-50 text-[#2F5D50] rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.945 9.945 0 0 0 4.887 1.277h.005c5.505 0 9.988-4.478 9.989-9.985C22 6.478 17.518 2 12.012 2zm6.05 14.153c-.333.931-1.637 1.77-2.228 1.833-.591.064-1.183.344-3.793-.733-3.132-1.293-5.115-4.47-5.271-4.678-.156-.208-1.254-1.666-1.254-3.178 0-1.513.788-2.257 1.068-2.558.28-.3.61-.375.813-.375h.582c.18 0 .422.016.649.525.234.526.8 1.944.869 2.083.07.139.116.301.023.486-.092.185-.139.3-.277.463-.14.163-.292.366-.417.49-.139.14-.284.293-.122.571.162.278.718 1.184 1.54 1.916.611.544 1.12.822 1.442.97.278.127.44.11.602-.07.162-.185.718-.834.908-1.112.19-.278.379-.232.616-.139.236.093 1.513.714 1.774.843.26.129.431.194.494.301.063.107.063.62-.27 1.551z"/>
                </svg>
                <span>Whatsapp</span>
              </a>
            </div>
          </div>
        </div>
      )}
      </nav>
    </header>
  );
}
