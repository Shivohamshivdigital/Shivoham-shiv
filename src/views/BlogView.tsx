import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { blogPosts } from "../data/blogData";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";

export default function BlogView() {
  // Ensure we scroll to top on view mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="bg-[#FAFBF7] min-h-screen font-sans selection:bg-green-100 pb-16">
      <SEO
        title="Blog & Vedic Insights | Holistic Wellness — Shivoham Shiv"
        description="Explore educational insights on Vedic wellness, cortisol belly, meditation, mudra therapy classes, acupressure benefits, and child emotional intelligence."
        focusKeyword="cortisol belly fat"
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" }
        ]}
      />

      {/* 1. Full-Width Sunset / Golden-Grass Hero */}
      <section 
        className="relative h-[280px] sm:h-[350px] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&q=80&w=1600')`
        }}
      >
        {/* Dark warm overlay to protect contrast & make white text highly visible */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
        
        <div className="relative text-center z-10 px-4">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight drop-shadow-md">
            Blog
          </h1>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
        </div>
      </section>

      {/* 2. Main Blog Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A] block mb-2">
            Vedic Wisdom & Practical Wellness Guides
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-emerald-900 tracking-tight">
            Latest from Our Blog
          </h2>
          <p className="text-slate-650 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Simple, lineage-backed, and scientifically integrated perspectives for balanced daily living.
          </p>
        </div>

        {/* 3. Responsive 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {blogPosts.map((post) => {
            return (
              <article
                key={post.slug}
                className="bg-white border border-green-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Image Section */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={post.image}
                    alt={`Visual representation of ${post.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-900/90 text-amber-100 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border border-emerald-800/30">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow text-left">
                  {/* Meta Details */}
                  <div className="flex items-center space-x-4 text-xs text-slate-450 font-medium mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>By {post.author}</span>
                    </span>
                  </div>

                  {/* Title (Teal Serif) */}
                  <h3 className="font-serif font-bold text-lg leading-snug text-emerald-800 hover:text-emerald-700 transition-colors mb-3 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt (exactly 3-lines clamped) */}
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Teal "Read More" button */}
                  <div className="pt-2 border-t border-slate-100 mt-auto">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-[#2F5D50] transition-colors group/btn"
                    >
                      <span className="uppercase tracking-wider">Read More</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
