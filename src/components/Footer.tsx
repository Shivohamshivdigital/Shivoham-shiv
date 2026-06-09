import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUp, ArrowRight } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const treatments = [
    { name: "Acupressure Therapy", path: "/courses/acupressure-therapy" },
    { name: "Corporate & Adult Wellness", path: "/courses/corporate-wellness" },
    { name: "Mudra Therapy Course", path: "/courses/mudra-therapy" },
    { name: "Mindfulness & Focus Training for Kids", path: "/courses/mindfulness-kids" },
  ];

  return (
    <footer className="bg-[#2F5D50] text-white border-t border-green-600/30 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Four Column Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col space-y-5 text-left">
            <div className="flex items-center space-x-3">
              <Link to="/" className="h-16 w-auto px-1.5 rounded-xl bg-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shrink-0" aria-label="Shivoham Shiv Home">
                <img
                  src="/shivoham-shiv-logo.svg"
                  alt="Shivoham Shiv logo"
                  loading="lazy"
                  className="h-full w-auto object-contain rounded-lg"
                />
              </Link>
              <span className="font-heading font-bold text-lg leading-tight tracking-wide text-white">
                Shivoham Shiv
              </span>
            </div>
            
            <p className="text-sm leading-relaxed text-emerald-50">
              Explore The Timeless Knowledge Of Vedas. Over 1,258 learners have already turned daily stress into profound inner stillness.
            </p>
            

          </div>

          {/* Column 2: Links */}
          <div className="text-left">
            <h4 className="font-heading font-bold text-white text-xs tracking-wider uppercase mb-5">
              General Links
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/courses" className="text-emerald-50 hover:text-amber-200 transition-colors">Courses</Link>
              </li>
              <li>
                <Link to="/contact" className="text-emerald-50 hover:text-amber-200 transition-colors">Contact Us</Link>
              </li>
              <li>
                <a href="#privacy" className="text-emerald-50 hover:text-amber-200 transition-colors">Privacy & Policy</a>
              </li>
              <li>
                <a href="#terms" className="text-emerald-50 hover:text-amber-200 transition-colors">Terms & Condition</a>
              </li>
              <li>
                <Link to="/blog" className="text-emerald-50 hover:text-amber-200 transition-colors">Blogs</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Other Treatment */}
          <div className="text-left">
            <h4 className="font-heading font-bold text-white text-xs tracking-wider uppercase mb-5">
              Other Treatment
            </h4>

            <ul className="space-y-3.5 text-sm">
              {treatments.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="text-emerald-50 hover:text-amber-200 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/treatments"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-200 hover:text-amber-100 transition-colors"
            >
              View All Treatments
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Column 4: Contacts */}
          <div className="text-left space-y-4">
            <h4 className="font-heading font-bold text-white text-xs tracking-wider uppercase mb-5">
              Reach Out
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-200 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-emerald-50">
                  Arya Kanya Chowraha, Sipri Bazar, Jhansi, Uttar Pradesh 284003
                </span>
              </li>
              
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-200 shrink-0" />
                <span className="text-emerald-50 font-semibold">+91 7317778215</span>
              </li>

              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-200 shrink-0" />
                <a href="mailto:info@shivohamshiv.com" className="text-emerald-50 hover:text-amber-200 transition-colors break-all">
                  info@shivohamshiv.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip & Back to Top */}
        <div className="border-t border-green-600/30 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-50">
          <p>© 2025 Created with ShivohamShiv Digital. All Rights Reserved.</p>
          <button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 flex items-center space-x-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-colors cursor-pointer text-white text-xs font-bold"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
