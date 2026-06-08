import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Compass, Sparkles, X, Heart, HelpCircle, PhoneCall, CheckCircle, Bell, ArrowRight } from "lucide-react";
import { bookConsultation } from "./services/consultationService";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./views/HomeView";
import CoursesView from "./views/CoursesView";
import CourseDetailView from "./views/CourseDetailView";
import DashboardView from "./views/DashboardView";
import AboutView from "./views/AboutView";
import WeightLossView from "./views/WeightLossView";
import ContactView from "./views/ContactView";
import BlogView from "./views/BlogView";
import BlogPostView from "./views/BlogPostView";
import VedicQuiz from "./components/VedicQuiz";
import MudraExplorer from "./components/MudraExplorer";
import SEO from "./components/SEO";

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

function AppContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [statsUpdateTrigger, setStatsUpdateTrigger] = useState(0);

  // Modal contact inputs
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalWhatsapp, setModalWhatsapp] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const location = useLocation();
  const isWeightLossPage = location.pathname === "/weight-loss";

  // Trigger banner auto-destruct
  useEffect(() => {
    if (bannerMessage) {
      const t = setTimeout(() => {
        setBannerMessage(null);
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [bannerMessage]);

  const handleStatsUpdated = () => {
    setStatsUpdateTrigger((prev) => prev + 1);
  };

  const handleOpenConsultationModal = () => {
    setModalOpen(true);
    setModalSuccess(false);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName || !modalEmail || !modalWhatsapp) return;
    setModalSubmitting(true);

    await bookConsultation(modalName, modalEmail, modalWhatsapp, modalMessage);

    setModalSubmitting(false);
    setModalSuccess(true);
    handleStatsUpdated();

    // Trigger toast notification
    setBannerMessage(`Pranama, ${modalName}! Your consultation space is reserved. Check your Dashboard!`);

    // Reset fields
    setModalName("");
    setModalEmail("");
    setModalWhatsapp("");
    setModalMessage("");

    setTimeout(() => {
      setModalOpen(false);
      setModalSuccess(false);
    }, 4000);
  };

  return (
    <div className="bg-cream min-h-screen flex flex-col font-sans selection:bg-green-700/10 selection:text-green-900">
      
      {/* Global Toast Alert Banner */}
      {bannerMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-green-900 border border-green-850 shadow-2xl p-4.5 rounded-2xl flex items-start space-x-3.5 text-cream animate-slideUp">
          <div className="p-1.5 bg-green-800 rounded-lg text-amber-500 shrink-0 mt-0.5">
            <Bell className="w-4 h-4 animate-ping" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A] block mb-0.5">Vedic System Status</span>
            <p className="text-xs leading-relaxed font-semibold">{bannerMessage}</p>
          </div>
          <button
            onClick={() => setBannerMessage(null)}
            className="p-1 text-green-200 hover:text-white transition-opacity"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global sticky Header Navigation */}
      <Navbar onOpenConsultation={handleOpenConsultationModal} updateTrigger={statsUpdateTrigger} />

      {/* Core router screens */}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                onOpenConsultation={handleOpenConsultationModal}
                onSetBanner={setBannerMessage}
              />
            }
          />
          
          <Route
            path="/courses"
            element={
              <CoursesView
                onSetBanner={setBannerMessage}
                onStatsUpdated={handleStatsUpdated}
              />
            }
          />

          <Route
            path="/courses/:slug"
            element={
              <CourseDetailView />
            }
          />

          <Route
            path="/mudras"
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <SEO
                  title="Mudra Therapy Course Online | Holistic Healing — Shivoham Shiv"
                  description="Learn ancient mudra therapy online to reduce stress, balance energy and support holistic well-being. Beginner-friendly Vedic course."
                  focusKeyword="mudra therapy course online"
                  isBreadcrumb={true}
                  breadcrumbItems={[
                    { name: "Home", url: "/" },
                    { name: "Mudra Explorer", url: "/mudras" }
                  ]}
                />
                <div className="max-w-3xl mx-auto mb-10 text-center">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Interactive Energetic Circuits</span>
                  <h1 className="font-heading font-bold text-3xl sm:text-4xl text-green-900 mt-2 mb-4 leading-tight">
                    Classical Hasta Mudra Explorer
                  </h1>
                  <p className="text-sm leading-relaxed text-slate-705">
                    Explore five classical hand Mudras aligned directly with Ayurvedic elements (Air, Fire, Earth, Space, All). Adjust your fingers, trace steps, and practice holding to restore balance.
                  </p>
                </div>
                <MudraExplorer />
              </div>
            }
          />

          <Route
            path="/dosha-quiz"
            element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <SEO
                  title="Vedic Body-Mind constitution Quiz | Discover your Prakriti — Shivoham Shiv"
                  description="Discover your unique Ayurvedic mind-body type (Vata, Pitta, Kapha) with our online constitution quiz to harmonize digestive heat and inner balance."
                  focusKeyword="vedic wellness courses online"
                  isBreadcrumb={true}
                  breadcrumbItems={[
                    { name: "Home", url: "/" },
                    { name: "Dosha Quiz", url: "/dosha-quiz" }
                  ]}
                />
                <div className="max-w-3xl mx-auto mb-10 text-center animate-fadeIn">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Self-Discovery Alignment Quiz</span>
                  <h1 className="font-heading font-bold text-3xl sm:text-4xl text-green-900 mt-2 mb-4 leading-tight">
                    Calculate Your Vedic Body-Mind Constitution
                  </h1>
                  <p className="text-sm leading-relaxed text-[#4A7C59] font-medium max-w-xl mx-auto">
                    "When you stabilize the elements, vitality returns naturally." Use our multi-choice Ayurvedic quiz to balance your primary energies!
                  </p>
                </div>
                <VedicQuiz onOpenConsultation={handleOpenConsultationModal} />
              </div>
            }
          />

          <Route
            path="/dashboard"
            element={
              <DashboardView
                onSetBanner={setBannerMessage}
                onStatsUpdated={handleStatsUpdated}
                updateTrigger={statsUpdateTrigger}
              />
            }
          />

          <Route path="/about" element={<AboutView />} />
          
          <Route path="/weight-loss" element={<WeightLossView />} />

          <Route path="/contact" element={<ContactView onSetBanner={setBannerMessage} />} />
          
          <Route path="/blog" element={<BlogView />} />
          <Route path="/blog/:slug" element={<BlogPostView />} />
          
          {/* Catch all fallback rerouting to Home */}
          <Route
            path="*"
            element={
              <HomeView
                onOpenConsultation={handleOpenConsultationModal}
                onSetBanner={setBannerMessage}
              />
            }
          />
        </Routes>
      </main>

      {/* Global Footer markup */}
      <Footer />

      {/* GLOBAL CONSULTATION DRAWER MODAL OVERLAY */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-green-100 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-md w-full relative animate-scaleUp">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-neutral-100 text-gray-400 transition-colors cursor-pointer"
              aria-label="Close and cancel"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-heading font-bold text-xl text-green-900">
                Ayur-Wellness Consultation
              </h3>
              <p className="text-xs text-slate-705 mt-1 leading-relaxed">
                Reserve a personalized wellness mapping dialogue with chief certified counselors. Securely logged in the client storage.
              </p>
            </div>

            {modalSuccess ? (
              <div className="p-6 bg-green-50 border border-green-200 text-green-900 rounded-2xl text-center">
                <CheckCircle className="w-10 h-10 text-green-700 mx-auto mb-3" />
                <h4 className="font-bold text-sm mb-1">Pranama secured successfully!</h4>
                <p className="text-xs">
                  Inquiry registered inside client local storage. We will review details and make contact via WhatsApp shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1.5" htmlFor="modal-name">
                    Full Name *
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-green-150 text-xs focus:ring-2 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1.5" htmlFor="modal-email">
                    Email Address *
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    placeholder="aditi@sharma.com"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-green-150 text-xs focus:ring-2 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1.5" htmlFor="modal-whatsapp">
                    WhatsApp Mobile *
                  </label>
                  <input
                    id="modal-whatsapp"
                    type="tel"
                    required
                    placeholder="+91 9452 342921"
                    value={modalWhatsapp}
                    onChange={(e) => setModalWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-green-150 text-xs focus:ring-2 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1.5" htmlFor="modal-message">
                    Symptoms or Wellness Request (Optional)
                  </label>
                  <textarea
                    id="modal-message"
                    rows={3}
                    placeholder="State bloating, fatigue, sleep interruptions..."
                    value={modalMessage}
                    onChange={(e) => setModalMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-green-150 text-xs focus:ring-2 focus:ring-green-500 bg-[#FAFBF7] focus:outline-none text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="w-full py-3.5 bg-green-700 hover:bg-green-500 text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg mt-2 cursor-pointer"
                >
                  {modalSubmitting ? "Registering Space..." : "Secure Free Diagnostic Session"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* FLOATING WIDGETS */}
      {/* WhatsApp Chat Bubble bottom-LEFT */}
      <a
        href="https://wa.me/917317778215"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 bg-white border border-[#2F5D50]/25 hover:border-[#2F5D50]/50 shadow-xl rounded-full p-1.5 sm:p-2 flex items-center max-w-[280px] sm:max-w-xs transition-all duration-300 hover:-translate-y-1 group"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-slate-100 bg-white flex items-center justify-center shrink-0 shadow-md relative">
          <img
            src="/shivoham-shiv-logo.webp"
            alt="Shivoham Shiv logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
          {/* Subtle WhatsApp indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] rounded-full border border-white" />
        </div>
        <div className="ml-2.5 mr-3 text-left hidden sm:block">
          <p className="text-[9px] font-bold text-[#2F5D50] uppercase tracking-wider leading-none">Shivoham Shiv</p>
          <p className="text-xs text-slate-700 font-semibold mt-0.5 leading-none">Hi, how can we help?</p>
        </div>
      </a>

      {/* "Contact us" bubble bottom-RIGHT */}
      <button
        onClick={handleOpenConsultationModal}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#2F5D50] hover:bg-[#23483E] text-cream p-3 sm:px-5 sm:py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center space-x-2 border border-green-600/20 cursor-pointer"
        title="Contact Us"
      >
        <PhoneCall className="w-4 h-4 text-cream animate-pulse shrink-0" />
        <span className="hidden sm:inline">Contact us</span>
      </button>

    </div>
  );
}
