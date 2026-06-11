import React, { useState } from "react";
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2, Sparkles } from "lucide-react";
import { bookConsultation } from "../services/consultationService";
import SEO from "../components/SEO";

interface ContactViewProps {
  onSetBanner: (message: string) => void;
}

export default function ContactView({ onSetBanner }: ContactViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !whatsapp) return;

    setIsSubmitting(true);
    try {
      await bookConsultation(name, email, whatsapp, `[CONTACT FORM] ${message}`);
      setIsSubmitting(false);
      setIsSuccess(true);
      onSetBanner(`Pranama, ${name}! Your message has been sent successfully.`);
      
      setName("");
      setEmail("");
      setWhatsapp("");
      setMessage("");

      setTimeout(() => {
        setIsSuccess(false);
      }, 6000);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFBF7] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Contact Shivoham Shiv | Book a Free Wellness Consultation"
        description="Get in touch with Shivoham Shiv in Jhansi for Vedic wellness courses and a free consultation. Call +91 7317778215."
        focusKeyword="book wellness consultation"
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact" }
        ]}
      />
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center space-x-1.5 bg-green-100 border border-green-200/60 rounded-full px-4.5 py-1.5 text-green-900 text-xs font-bold uppercase tracking-widest leading-none">
            <Sparkles className="w-3.5 h-3.5 text-[#E8943A] fill-[#E8943A]" />
            <span>Harmonise Your Energy</span>
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-green-900 mt-3 mb-4 leading-tight">
            Connect With Us
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Have questions about our courses, natural weight loss programs, or customized therapies? Reach out to the Shivoham Shiv team. We are here to guide you back to wellness.
          </p>
        </div>

        {/* Contact Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-green-100 p-8 rounded-3xl shadow-sm space-y-8">
              <h2 className="font-heading font-bold text-2xl text-green-900">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                
                {/* Physical Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-green-900 uppercase tracking-wider mb-1">
                      Our Location
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Arya Kanya Chowraha, Sipri Bazar, Jhansi, Uttar Pradesh 284003, India
                    </p>
                  </div>
                </div>

                {/* Telephone Connect */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-green-900 uppercase tracking-wider mb-1">
                      Direct Whatsapp & Phone
                    </h3>
                    <p className="text-sm text-slate-700 font-semibold">
                      +91 7317778215
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Available Mon-Sat (9:00 AM - 7:00 PM IST)
                    </p>
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 shrink-0 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-green-900 uppercase tracking-wider mb-1">
                      Email Address
                    </h3>
                    <p className="text-sm text-slate-755 font-medium hover:text-green-700">
                      <a href="mailto:info@shivohamshiv.com">info@shivohamshiv.com</a>
                    </p>
                  </div>
                </div>

              </div>

              {/* Directly WhatsApp CTA */}
              <div className="border-t border-green-100 pt-6 mt-6">
                <a
                  href="https://wa.me/919682051868"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd5b] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Start Live WhatsApp Chat</span>
                </a>
              </div>

            </div>
          </div>

          {/* Column 2: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-green-100 p-8 rounded-3xl shadow-sm">
              <h2 className="font-heading font-bold text-2xl text-green-900 mb-6">
                Send a Message
              </h2>

              {isSuccess ? (
                <div className="p-8 bg-green-50 border border-green-200 text-green-900 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-700 mx-auto" />
                  <h3 className="font-heading font-bold text-xl">Pranama, Message Saved!</h3>
                  <p className="text-sm max-w-md mx-auto">
                    Your inquiry is saved in our secure consultation database. A wellness counselor will review your information and get back to you via WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1.5" htmlFor="name">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="e.g. Rohini Roy"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-green-150 text-xs text-slate-707 bg-[#FAFBF7] focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1.5" htmlFor="email">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="rohini@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-green-150 text-xs text-slate-707 bg-[#FAFBF7] focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1.5" htmlFor="whatsapp">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      required
                      placeholder="+91 73177 78215"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-green-150 text-xs text-slate-707 bg-[#FAFBF7] focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E8943A] mb-1.5" htmlFor="message">
                      Your Wellness Quest / Question
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      placeholder="What courses are you interested in? Or describe any symptoms you are facing..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-green-150 text-xs text-slate-707 bg-[#FAFBF7] focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#2F5D50] hover:bg-[#23483E] text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? "Sending..." : "Submit Message"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
