import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, Flame } from "lucide-react";
import { getUserStats } from "../services/userService";
import { UserStats } from "../types";

interface NavbarProps {
  onOpenConsultation: () => void;
  updateTrigger?: number;
}

export default function Navbar({ onOpenConsultation, updateTrigger }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const location = useLocation();

  useEffect(() => {
    getUserStats().then(setUserStats);
  }, [location.pathname, updateTrigger]);

  // Close drawer and dropdowns on page change
  useEffect(() => {
    setIsOpen(false);
    setCoursesDropdownOpen(false);
    setMobileCoursesOpen(false);
  }, [location.pathname]);

  const coursesList = [
    { name: "Acupressure Therapy", path: "/courses/acupressure-therapy" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#2F5D50] shadow-md transition-all duration-300">
      <nav aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Logo in small white rounded square/badge */}
          <Link id="nav-logo" to="/" className="flex items-center group shrink-0" aria-label="Shivoham Shiv Home">
            <div className="h-12 sm:h-16 w-auto px-1 sm:px-1.5 rounded-xl bg-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src="/shivoham-shiv-logo.svg"
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

            {/* COURSES DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <button
                className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1 py-3 text-white hover:text-amber-100 focus:outline-none transition-colors ${
                  location.pathname === "/courses" ? "text-amber-200" : ""
                }`}
              >
                <span>Murm dab Chikitsha</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${coursesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Popover Menu */}
              {coursesDropdownOpen && (
                <div className="absolute top-10 left-0 w-80 bg-white border border-green-100 rounded-2xl shadow-xl py-3 z-50 text-left animate-fadeIn">
                  {coursesList.map((course, idx) => (
                    <Link
                      key={idx}
                      to={course.path}
                      onClick={() => setCoursesDropdownOpen(false)}
                      className={`block px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-green-50 hover:text-[#2F5D50] transition-colors last:border-t last:border-green-100 last:font-bold last:text-green-700 ${
                        idx === coursesList.length - 1 ? "mt-1 pt-3" : ""
                      }`}
                    >
                      {course.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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
            
            {/* Dashboard Badge representing active stats */}
            <Link
              to="/dashboard"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
              title="Learner Space Dashboard"
            >
              <User className="w-3.5 h-3.5" />
              <span>{userStats?.name || "Learner"}</span>
              {userStats && userStats.dailyStreak > 0 && (
                <div className="flex items-center space-x-0.5 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{userStats.dailyStreak}d</span>
                </div>
              )}
            </Link>

            {/* Whatsapp pill button */}
            <a
              href="https://wa.me/919682051868"
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
              href="https://wa.me/919682051868"
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
              to="/dashboard"
              className="p-1.5 sm:p-2 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Dashboard"
            >
              <User className="w-4 h-4 sm:w-5 h-5" />
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

            {/* Mobile Expandable COURSES */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 focus:outline-none"
              >
                <span>Murm dab Chikitsha</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCoursesOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileCoursesOpen && (
                <div className="flex flex-col pl-6 mt-1 space-y-2 border-l border-white/20">
                  {coursesList.map((course, idx) => (
                    <Link
                      key={idx}
                      to={course.path}
                      onClick={() => setIsOpen(false)}
                      className="py-1.5 px-2 rounded-lg text-xs font-semibold text-white/90 hover:bg-white/5 transition-colors"
                    >
                      {course.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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

            {/* Mobile WhatsApp CTA Button */}
            <div className="pt-4 border-t border-white/15">
              <a
                href="https://wa.me/919682051868"
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
