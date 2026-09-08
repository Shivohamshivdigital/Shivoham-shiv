import React from "react";
import { Link } from "react-router-dom";
import { Compass, Sparkles, Award, Globe, Users, Heart, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import CertificateGallery from "../components/CertificateGallery";

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
      <section className="bg-green-950 text-cream py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#EF8321]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900 rounded-full text-[#EFFFDF] text-xs font-bold uppercase tracking-widest border border-green-800">
            <Sparkles className="w-3.5 h-3.5 text-[#EF8321] fill-[#EF8321]" />
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-none">
            About
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-green-100/90 leading-relaxed max-w-3xl mx-auto">
            Shivoham Shiv is dedicated to reviving, modernizing and sharing the healing wisdom of the Vedas —
            natural, drug-free wellness practices such as Mudra Therapy, Ayurvedic Acupressure, Meditation and
            Pranayama. We believe in the body's innate capacity to find balance, and we help you support it through
            authentic practices designed for modern life — alongside, not in place of, professional medical care.
          </p>
        </div>
      </section>

      {/* 2. "About Us – Shivoham Shiv" text left, image right */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#004C53] leading-tight">
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
                <span className="block text-2xl sm:text-3xl font-bold text-[#EF8321] font-heading">1,258+</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-600 font-medium">Happy Healing Souls</span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-bold text-[#004C53] font-heading">12+</span>
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
              <div className="absolute inset-0 bg-[#005461]/10 pointer-events-none" />
            </div>
            {/* Hanging visual design badge */}
            <div className="absolute -bottom-4 -left-4 bg-[#EF8321] text-white py-3 px-5 rounded-2xl shadow-lg text-xs font-bold leading-none select-none">
              Est. 8+ Years
            </div>
          </div>

        </div>
      </section>

      {/* 3. Purpose & Path (eyebrow "Values") */}
      <section className="bg-[#EEF6F6] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#D6E9EA]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-2 mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#004C53]">Purpose &amp; Path</h2>
          </div>

          {/* Vertical Timeline with two cards */}
          <div className="relative border-l-2 border-[#005461]/30 ml-4 md:ml-32 space-y-12">
            
            {/* Timeline node 1: Our Mission */}
            <div className="relative pl-8 sm:pl-12">
              <div className="absolute -left-3.5 top-1.5 w-7 h-7 bg-white border-2 border-[#005461] rounded-full flex items-center justify-center text-[#EF8321] font-bold text-[10px] shadow-sm">
                1
              </div>
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-green-100 shadow-sm text-left hover:shadow-md transition-shadow">
                <span className="text-xs uppercase font-bold text-[#EF8321] tracking-wider block mb-2">Our Calling</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#004C53] mb-4">Our Mission</h3>
                <p className="text-sm text-slate-705 leading-relaxed">
                  To make India's traditional, drug-free wellness knowledge — Mudra Therapy, Ayurvedic Acupressure,
                  Meditation, Pranayama and Yoga — practical and accessible for modern life. We help people support
                  the body's natural capacity for balance through authentic practices, build healthier everyday
                  habits, and train aspiring practitioners to carry this knowledge forward responsibly — always as a
                  complement to, not a replacement for, professional medical care.
                </p>
              </div>
            </div>

            {/* Timeline node 2: Our Vision */}
            <div className="relative pl-8 sm:pl-12">
              <div className="absolute -left-3.5 top-1.5 w-7 h-7 bg-white border-2 border-[#005461] rounded-full flex items-center justify-center text-[#EF8321] font-bold text-[10px] shadow-sm">
                2
              </div>
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-green-100 shadow-sm text-left hover:shadow-md transition-shadow">
                <span className="text-xs uppercase font-bold text-green-700 tracking-wider block mb-2">Our Vision</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#004C53] mb-4">Our Vision</h3>
                <p className="text-sm text-slate-705 leading-relaxed">
                  A world where authentic Vedic wellness practices — Mudra, Ayurvedic Acupressure, Meditation and
                  Pranayama — are widely understood and used as natural, drug-free ways to support everyday health and
                  wellbeing. We envision anyone, anywhere learning to care for themselves, and a new generation of
                  responsible practitioners carrying this knowledge forward — blending traditional wisdom with modern
                  understanding, alongside professional medical care.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3b. Five Pillars of Our Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">How We Do It</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#004C53]">Five Pillars of Our Mission</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            We pursue our vision through five focused areas — all rooted in natural, drug-free practice and a
            responsible scope of care.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {[
            { icon: "🌿", title: "Natural, Drug-Free Wellness", desc: "Support the body's own capacity for balance through traditional practices — as a complement to, not a replacement for, medical care." },
            { icon: "🖐️", title: "Mudra for Everyday Support", desc: "Teach simple hand mudras used in tradition to support calm, focus and everyday relief as part of a daily routine." },
            { icon: "🎯", title: "Marma for Ongoing Wellbeing", desc: "Use gentle Ayurvedic acupressure and Marma practices to support the body through long-standing, lifestyle-related concerns." },
            { icon: "🧘", title: "Holistic Mind-Body Balance", desc: "Integrate guided Meditation and Pranayama to help ease stress, restore emotional harmony and sustain everyday vitality." },
            { icon: "🎓", title: "Educate & Empower", desc: "Bridge scriptural heritage with a modern understanding of anatomy and safety, certifying confident, responsible practitioners." },
            { icon: "🤝", title: "Responsible Scope of Practice", desc: "Be transparent about what these practices can and can't do, and about when to seek professional medical advice." },
          ].map((p) => (
            <div key={p.title} className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#005461] transition-all">
              <span className="text-3xl block mb-3">{p.icon}</span>
              <h3 className="font-heading font-bold text-base text-[#004C53] leading-snug mb-1.5">{p.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{p.desc}</p>
            </div>
          ))}
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
                <span className="text-[10px] uppercase font-semibold text-[#EF8321] tracking-widest block mb-0.5">Lineage Guide</span>
                <p className="text-xs font-serif italic text-white">"Transforming lifestyles from the organic roots of the Himalayas."</p>
              </div>
            </div>
          </div>

          {/* Bio text right */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">The Heart Behind Shivoham Shiv</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#004C53] leading-tight">
              Meet Our Founder – Pooja Chaturvedi
            </h2>
            <div className="p-4.5 bg-[#EEF6F6] rounded-2xl border border-green-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <GraduationCap className="w-10 h-10 text-[#005461] shrink-0" />
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
      <section className="bg-green-950 text-cream py-20 px-4 sm:px-6 lg:px-8 border-y-4 border-[#EF8321]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">The core principles</span>
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
                title: "Ayurvedic Acupressure",
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
          <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">The Difference</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#004C53]">
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
              icon: <Globe className="w-6 h-6 text-[#005461]" />
            },
            {
              title: "Personalized Learning Path",
              desc: "Our interactive quizzes and elemental profiling adjust directly to your unique body composition (Prakriti) and current imbalances.",
              icon: <Compass className="w-6 h-6 text-[#005461]" />
            },
            {
              title: "Global Learning Community",
              desc: "Join a passionate, cooperative network of over 1,258 active seekers who encourage and support each other's evolutionary journey.",
              icon: <Users className="w-6 h-6 text-[#005461]" />
            },
            {
              title: "Mind-Body-Soul Harmony",
              desc: "A completely holistic combination of physical postures, metabolic advice, energy hand mudras, and mental meditation locks.",
              icon: <Award className="w-6 h-6 text-[#005461]" />
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#005461] transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#D6E9EA] rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-heading font-bold text-base text-[#004C53] leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6b. Founder's Credentials & Certifications */}
      <section className="bg-[#EEF6F6] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#D6E9EA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">Trained &amp; Certified</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#004C53]">Founder's Credentials</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Our founder, <strong>Pooja Chaturvedi</strong>, has formal training across Yoga, Ayurveda and
              traditional energy therapies — so every practice we share is rooted in real, certified study.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="w-6 h-6 text-[#005461]" />,
                title: "Yoga Alliance USA — RYS 200",
                body: "200-Hour Yoga Teacher Training (Yoga Teachers Training Programme)",
                org: "Arogya Yogshala, New Delhi",
                year: "2025 · Yoga Alliance Reg. ID 277005",
              },
              {
                icon: <GraduationCap className="w-6 h-6 text-[#005461]" />,
                title: "Master Diploma in Acupressure",
                body: "Master Diploma in Acupressure Therapy (M.D. Acu.)",
                org: "Vishvas Alternative Treatment & Training Centre",
                year: "2018",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#005461]" />,
                title: "Diploma in Panchakarma Therapy",
                body: "Diploma in Panchakarma Therapy (D.Phk.)",
                org: "Vishvas Alternative Treatment & Training Centre",
                year: "2018",
              },
              {
                icon: <GraduationCap className="w-6 h-6 text-[#005461]" />,
                title: "Diploma in Electro-Acupuncture",
                body: "Diploma in Electro-Acupuncture Therapy — TCM (D.Ac.)",
                org: "Vishvas Alternative Treatment & Training Centre",
                year: "2018",
              },
              {
                icon: <Heart className="w-6 h-6 text-[#005461]" />,
                title: "Reiki — 2nd Degree Healer",
                body: "2nd Degree in Reiki Therapy (Reiki Healer)",
                org: "Vishvas Alternative Treatment & Training Centre",
                year: "2018",
              },
            ].map((c, idx) => (
              <div
                key={idx}
                className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#005461] transition-all flex flex-col"
              >
                <div className="w-12 h-12 bg-[#D6E9EA] rounded-xl flex items-center justify-center mb-4">
                  {c.icon}
                </div>
                <h3 className="font-heading font-bold text-base text-[#004C53] leading-snug mb-1">{c.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed flex-1">{c.body}</p>
                <div className="mt-4 pt-3 border-t border-green-100">
                  <p className="text-xs font-semibold text-[#004C53]">{c.org}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.year}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <CertificateGallery />
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-8 max-w-2xl mx-auto">
            Vishvas Alternative Treatment &amp; Training Centre is registered with the Govt. of Rajasthan
            (Reg. No. 40/2002-2003).
          </p>
        </div>
      </section>

      {/* 7. Our Commitment to You (soft-green band, image left) */}
      <section className="bg-[#D6E9EA]/60 py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D6E9EA]">
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
            <div className="absolute inset-0 bg-[#005461]/15" />
          </div>

          {/* Text right */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center text-left space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">The Promise</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#004C53]">
              Our Commitment to You
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">
              We're not just an educational platform — we're a movement to bring the essence of the Vedas back 
              into everyday life. Every course, session, and resource is designed with compassion and authenticity 
              for true transformation — from the inside out. Our promise is to walk beside you throughout your journey.
            </p>
            <div className="inline-flex items-center gap-2.5 text-xs text-green-700 font-bold tracking-wide">
              <CheckCircle2 className="w-5 h-5 text-[#EF8321] fill-amber-100/50" />
              Structured Sadhana Tracking • Complete Mentorship Sphere
            </div>
          </div>

        </div>
      </section>

      {/* 8. Our Core Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">What We Stand For</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#004C53]">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {[
            { icon: "📖", title: "Ancient Wisdom First", desc: "We honour thousands of years of Vedic knowledge and time-tested wellness traditions." },
            { icon: "🔬", title: "Grounded & Responsible", desc: "We pair traditional practice with a modern understanding of anatomy, safety and wellbeing — no magical claims." },
            { icon: "🌿", title: "Natural & Drug-Free", desc: "We focus on natural, drug-free wellness practices that support the body — alongside professional medical care." },
            { icon: "💪", title: "Practical Application", desc: "Knowledge without action is incomplete. We focus on real-world, practical learning and habits." },
            { icon: "🤝", title: "Transparent & Ethical", desc: "We practise with honesty, clear scope-of-practice boundaries and professional integrity." },
            { icon: "🌍", title: "Accessibility", desc: "Authentic Vedic wellness should be available to everyone, everywhere, whatever their background." },
          ].map((v) => (
            <div key={v.title} className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#005461] transition-all">
              <span className="text-3xl block mb-3">{v.icon}</span>
              <h3 className="font-heading font-bold text-base text-[#004C53] leading-snug mb-1.5">{v.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ — About Shivoham Shiv */}
      <section className="bg-[#EEF6F6] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#D6E9EA]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#EF8321]">Good to Know</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#004C53]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Is Shivoham Shiv anti-medicine?", a: "No. We teach natural, drug-free wellness practices that support the body's own balance — as a complement to professional medical care, never a replacement. For any medical condition or emergency, always consult a qualified doctor." },
              { q: "Are your methods scientifically proven?", a: "Our programs combine traditional practice with a modern understanding of anatomy, safety and wellbeing. We teach time-tested techniques responsibly and are always clear about what these practices can and can't do — we don't teach 'magical thinking'." },
              { q: "Can Mudra therapy replace emergency medicine?", a: "No. Mudra and acupressure are supportive wellness practices, not emergency care. In any medical emergency, call your local emergency number or go to a hospital immediately." },
              { q: "How is this different from regular yoga or wellness programs?", a: "Alongside yoga and meditation, we specialise in specific traditional practices — Mudra and Ayurvedic Acupressure / Marma — taught through structured, responsible programs rather than general lifestyle content." },
              { q: "Who is qualified to teach these methods?", a: "Only people who complete our certified training programs. We keep strict standards because these practices require proper knowledge, ethics and a clear understanding of scope of practice." },
              { q: "Can these practices support long-term health?", a: "Many people use them as part of a healthy daily routine to support everyday wellbeing. They are not a substitute for medication or medical treatment, and we're always clear about when to seek professional medical advice." },
            ].map((f, i) => (
              <details key={i} className="group bg-white border border-green-100 rounded-2xl px-5 py-4 shadow-sm">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-heading font-bold text-sm text-[#004C53]">
                  {f.q}
                  <span className="text-[#EF8321] shrink-0 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="text-sm text-slate-700 leading-relaxed mt-3 pt-3 border-t border-green-100">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="bg-green-950 text-cream py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-[#EF8321]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">Begin Your Natural Wellness Journey</h2>
          <p className="text-sm sm:text-base text-green-100/90 leading-relaxed max-w-2xl mx-auto">
            Whether you want to transform your own health or become a certified practitioner, Shivoham Shiv gives you a
            structured, responsible path rooted in authentic Vedic tradition. Start your journey toward natural,
            drug-free wellness today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/wellness-programs" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#EF8321] hover:bg-[#F49B3E] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">
              Explore Our Programs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/academy" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#004C53] hover:bg-green-50 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Join Our Academy <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider rounded-full transition-all">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-green-100/80 pt-4">
            {["Certified, experienced instructors", "Rooted in authentic Vedic tradition", "Live + recorded classes", "Clear, responsible scope of practice"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#EF8321]" /> {t}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
