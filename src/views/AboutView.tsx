import React from "react";
import { Compass, Sparkles, Award, Globe, Users, Heart, GraduationCap, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";

export default function AboutView() {
  return (
    <div className="bg-[#FAFBF7] min-h-screen font-sans selection:bg-green-100">
      <SEO
        title="About Shivoham Shiv | Authentic Vedic Wellness & Holistic Healing"
        description="Shivoham Shiv brings ancient Vedic wisdom to modern life through holistic wellness, mudra therapy and EQ training, guided by founder Pooja Chaturvedi."
        focusKeyword="vedic holistic wellness"
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "About Us", url: "/about" }
        ]}
      />
      
      {/* 1. Dark Hero Band */}
      <section className="bg-green-950 text-cream py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#E8943A]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900 rounded-full text-[#EFFFDF] text-xs font-bold uppercase tracking-widest border border-green-800">
            <Sparkles className="w-3.5 h-3.5 text-[#E8943A] fill-[#E8943A]" />
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-none">
            About
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-green-100/90 leading-relaxed max-w-3xl mx-auto">
            At Shivoham Shiv, we bring ancient Vedic wisdom to modern life — through Corporate & Adult 
            Wellness, Mudra Therapy, Meditation, and Mindfulness & Emotional Intelligence (EQ) Training 
            for Kids — guiding individuals toward balance, clarity, and holistic well-being. Our mission 
            is to make timeless healing accessible to all, helping you harmonize mind, body, and spirit.
          </p>
        </div>
      </section>

      {/* 2. "About Us – Shivoham Shiv" text left, image right */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233] leading-tight">
              About Us – Shivoham Shiv
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                We believe that ancient India's wisdom is the absolute key to modern well-being. Daily stress, 
                mental fatigue, digestive discomfort, and emotional reactivity are struggles of our fast-paced times. 
                Our sacred practices and structured programs are built to return individuals to their original state 
                of balance, calmness, and profound inner alignment.
              </p>
              <p>
                Our mission is to empower, enlighten, and heal by beautifully blending the Vedas with modern lifestyles. 
                Through our comprehensive methodologies, we make authentic Vedic sciences, Hasta Mudra algorithms, 
                and energy maps fully accessible to everyone—from seekers of deep inner peace to busy corporate heads—via 
                structured online courses, personalized guided sessions, and trusted, expert mentorship.
              </p>
            </div>

            {/* Stats row with real numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pt-6 border-t border-green-100">
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-bold text-[#E8943A] font-heading">1,258+</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-600 font-medium">Happy Healing Souls</span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-bold text-[#2F5233] font-heading">12+</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-600 font-medium">Workshops &amp; Retreats</span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-bold text-green-700 font-heading">95%</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-600 font-medium font-sans">Positive transformation</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="w-full aspect-square bg-[#FAFBF7] rounded-[32px] overflow-hidden border-8 border-white shadow-xl relative">
              <img
                src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200"
                alt="A serene landscape showcasing meditation silence during a deep nature sunset for spiritual recovery"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#4A7C59]/10 pointer-events-none" />
            </div>
            {/* Hanging visual design badge */}
            <div className="absolute -bottom-4 -left-4 bg-[#E8943A] text-white py-3 px-5 rounded-2xl shadow-lg text-xs font-bold leading-none select-none">
              Est. 8+ Years
            </div>
          </div>

        </div>
      </section>

      {/* 3. Purpose & Path (eyebrow "Values") */}
      <section className="bg-[#F2F9F2] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E3F1E3]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-2 mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233]">Purpose &amp; Path</h2>
          </div>

          {/* Vertical Timeline with two cards */}
          <div className="relative border-l-2 border-[#4A7C59]/30 ml-4 md:ml-32 space-y-12">
            
            {/* Timeline node 1: Our Mission */}
            <div className="relative pl-8 sm:pl-12">
              <div className="absolute -left-3.5 top-1.5 w-7 h-7 bg-white border-2 border-[#4A7C59] rounded-full flex items-center justify-center text-[#E8943A] font-bold text-[10px] shadow-sm">
                1
              </div>
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-green-100 shadow-sm text-left hover:shadow-md transition-shadow">
                <span className="text-xs uppercase font-bold text-[#E8943A] tracking-wider block mb-2">Our Calling</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#2F5233] mb-4">Our Mission</h3>
                <p className="text-sm text-slate-705 leading-relaxed">
                  To revive ancient Indian wisdom through practical, science-backed learning that inspires real transformation; 
                  to make holistic healing simple and accessible; to empower people to build emotional balance, mental clarity, 
                  and physical vitality; and to help them naturally heal, prevent chronic illness, and live with true wellness.
                </p>
              </div>
            </div>

            {/* Timeline node 2: Our Vision */}
            <div className="relative pl-8 sm:pl-12">
              <div className="absolute -left-3.5 top-1.5 w-7 h-7 bg-white border-2 border-[#4A7C59] rounded-full flex items-center justify-center text-[#E8943A] font-bold text-[10px] shadow-sm">
                2
              </div>
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-green-100 shadow-sm text-left hover:shadow-md transition-shadow">
                <span className="text-xs uppercase font-bold text-green-700 tracking-wider block mb-2">Our Vision</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#2F5233] mb-4">Our Vision</h3>
                <p className="text-sm text-slate-705 leading-relaxed">
                  To become a global hub for authentic Vedic learning and holistic wellness where ancient wisdom and modern 
                  thinking meet; to use traditional Indian practices as practical tools for healing, peace, and purpose; 
                  and to bridge spirituality with science through research, innovation, and community.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Meet Our Founder – Pooja Chaturvedi */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Creator image left */}
          <div className="lg:col-span-5 relative">
            <div className="w-full aspect-[4/5] bg-[#FAFBF7] rounded-[32px] overflow-hidden border-8 border-white shadow-xl relative">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200"
                alt="Pooja Chaturvedi — Certified Yoga Expert, Meditation Coach and Vedic Wellness Guide at Shivoham Shiv"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-green-950/95 backdrop-blur-md p-4 rounded-2xl text-cream border border-green-900">
                <span className="text-[10px] uppercase font-semibold text-[#E8943A] tracking-widest block mb-0.5">Lineage Guide</span>
                <p className="text-xs font-serif italic text-white">"Transforming lifestyles from the organic roots of the Himalayas."</p>
              </div>
            </div>
          </div>

          {/* Bio text right */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The Heart Behind Shivoham Shiv</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233] leading-tight">
              Meet Our Founder – Pooja Chaturvedi
            </h2>
            <div className="p-4.5 bg-[#F2F9F2] rounded-2xl border border-green-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <GraduationCap className="w-10 h-10 text-[#4A7C59] shrink-0" />
              <div>
                <h4 className="font-bold text-green-900 text-sm">Pooja Chaturvedi</h4>
                <p className="text-xs text-slate-700">Certified Yoga Expert, Meditation Coach, and Holistic Wellness Practitioner with 8+ years of experience.</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed text-slate-705">
              <p>
                Driven by a deep, innate curiosity about ancient Indian holistic healing and traditional medicine, 
                Pooja spent years of intense learning and personal transformation studying classical scriptures, 
                Sanskrit commentary structures, and elemental hand gestures. Through this profound individual path, 
                she founded Shivoham Shiv to bring timeless, precise Vedic science directly to the modern world.
              </p>
              <p>
                Her teaching and guiding style beautifully blends authentic Himalayan ancient techniques with 
                compassionate, practical guidance that fits perfectly within the fast-paced modern timetable. Over the 
                last 8+ years, her practices have addressed the root biological causes of systemic health imbalance, 
                empowering individuals through personalized self-awareness, responsive mindfulness, and structural Vedic science.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Our Philosophy – The Shivoham Way (dark band) */}
      <section className="bg-green-950 text-cream py-20 px-4 sm:px-6 lg:px-8 border-y-4 border-[#E8943A]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The core principles</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
              Our Philosophy – The Shivoham Way
            </h2>
            <p className="text-sm text-green-150 leading-relaxed">
              We anchor our entire system on the timeworn Sanskrit principle: <span className="font-serif italic font-bold text-white text-base">"Shivoham — I am Divine Consciousness"</span>. 
              We hold the unshakeable belief that each individual possesses an innate, powerful blueprint to heal, grow, and transform naturally once the energetic elements align.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                title: "Corporate & Adult Wellness",
                desc: "Relieve stress, reduce muscular pain, and promote sustainable workplace wellness through customized desk breathing and sensory relaxation maps.",
                icon: "🌿"
              },
              {
                title: "Mudra Therapy",
                desc: "Balance the body's primary neurological and five element structures through highly precise, traditional hand energetic finger circuits.",
                icon: "🖐️"
              },
              {
                title: "EQ Training for Kids",
                desc: "Support classroom focus, emotional balance, and healthy psychological growth in young minds through story-based Vedic mindfulness.",
                icon: "👶"
              },
              {
                title: "Murm Dab Chikitsa",
                desc: "Stimulate localized nerve feedback loops and energy points to naturally relieve stress, remove blocks, and support whole-body recovery.",
                icon: "✨"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-green-900 border border-green-800 p-6 rounded-2xl flex flex-col justify-between hover:bg-green-800 hover:border-green-700 transition-all text-cream">
                <div className="space-y-4">
                  <span className="text-4xl block">{item.icon}</span>
                  <h3 className="font-heading font-semibold text-lg text-white leading-snug">{item.title}</h3>
                  <p className="text-xs text-green-100/80 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Why Choose Shivoham Shiv? */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The Difference</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#2F5233]">
            Why Choose Shivoham Shiv?
          </h2>
          <p className="text-sm text-slate-705 leading-relaxed">
            We provide structured, deep-dive academic study tracks instead of surface-level lifestyle listicles. Here is how we guarantee real transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            {
              title: "Authentic Vedic Knowledge",
              desc: "100% textbook-faithful translations of Upanishads, Yoga Sutras, and Hasta scriptures, fully cleared of superficial guesswork.",
              icon: <Globe className="w-6 h-6 text-[#4A7C59]" />
            },
            {
              title: "Personalized Learning Path",
              desc: "Our interactive quizzes and elemental profiling adjust directly to your unique body composition (Prakriti) and current imbalances.",
              icon: <Compass className="w-6 h-6 text-[#4A7C59]" />
            },
            {
              title: "Global Learning Community",
              desc: "Join a passionate, cooperative network of over 1,258 active seekers who encourage and support each other's evolutionary journey.",
              icon: <Users className="w-6 h-6 text-[#4A7C59]" />
            },
            {
              title: "Mind-Body-Soul Harmony",
              desc: "A completely holistic combination of physical postures, metabolic advice, energy hand mudras, and mental meditation locks.",
              icon: <Award className="w-6 h-6 text-[#4A7C59]" />
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#4A7C59] transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#E3F1E3] rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-heading font-bold text-base text-[#2F5233] leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Our Commitment to You (soft-green band, image left) */}
      <section className="bg-[#E3F1E3]/60 py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E3F1E3]">
        <div className="max-w-6xl mx-auto bg-white rounded-[32px] border border-green-100 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
          
          {/* Image left */}
          <div className="lg:col-span-5 relative min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1200"
              alt="Himalayan flowing sacred river representing clean energy paths and natural Vedic rejuvenation"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#4A7C59]/15" />
          </div>

          {/* Text right */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center text-left space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">The Promise</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#2F5233]">
              Our Commitment to You
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">
              We're not just an educational platform — we're a movement to bring the essence of the Vedas back 
              into everyday life. Every course, session, and resource is designed with compassion and authenticity 
              for true transformation — from the inside out. Our promise is to walk beside you throughout your journey.
            </p>
            <div className="inline-flex items-center gap-2.5 text-xs text-green-700 font-bold tracking-wide">
              <CheckCircle2 className="w-5 h-5 text-[#E8943A] fill-amber-100/50" />
              Structured Sadhana Tracking • Complete Mentorship Sphere
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
