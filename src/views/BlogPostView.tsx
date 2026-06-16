import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SEO from "../components/SEO";
import { blogPosts, BlogPost, normalizePost } from "../data/blogData";
import { Calendar, User, ArrowLeft, Send } from "lucide-react";

// Robust inline markdown link parser that returns Styled Terracotta links
function renderContentText(text: string) {
  if (!text) return "";
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const index = match.index;
    const [full, anchor, url] = match;

    if (index > lastIndex) {
      elements.push(text.substring(lastIndex, index));
    }

    const isExternal = url.includes(":") || url.startsWith("//");
    if (isExternal) {
      elements.push(
        <a
          key={`ext-${index}`}
          href={url}
          target={url.startsWith("mailto:") || url.startsWith("tel:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="text-[#C2410C] hover:text-[#A03504] font-bold underline transition-colors"
        >
          {anchor}
        </a>
      );
    } else {
      elements.push(
        <Link
          key={`int-${index}`}
          to={url}
          className="text-[#C2410C] hover:text-[#A03504] font-bold underline transition-colors"
        >
          {anchor}
        </Link>
      );
    }
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? <>{elements}</> : text;
}

export default function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();

  // Static (bundled) posts render instantly; admin posts are fetched.
  const staticPost = blogPosts.find((p) => p.slug === slug);
  const [dynamicPost, setDynamicPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(!staticPost);

  // Ensure page scrolls to top instantly when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  // Always check the database so admin edits/deletes are reflected. A bundled
  // post (if any) renders instantly while the DB version loads and overrides it.
  useEffect(() => {
    let active = true;
    if (!staticPost) setLoading(true);
    fetch(`/api/blog?slug=${encodeURIComponent(slug || "")}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active) return;
        setDynamicPost(data?.post ? normalizePost(data.post) : null);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setDynamicPost(null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, staticPost]);

  // Prefer the admin-managed (database) version; fall back to the bundled post.
  const post = dynamicPost || staticPost;

  if (loading) {
    return (
      <div className="bg-[#FAFBF7] min-h-screen flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="w-10 h-10 border-2 border-green-200 border-t-green-700 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Loading article…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#FAFBF7] min-h-screen flex flex-col items-center justify-center p-8 text-center font-sans">
        <h2 className="text-3xl font-serif font-bold text-emerald-950 mb-3">
          Article Not Found
        </h2>
        <p className="text-slate-650 max-w-sm mb-6">
          The requested wellness article could not be located. It may have been relocated or updated.
        </p>
        <Link
          to="/blog"
          className="px-6 py-3 bg-green-700 hover:bg-green-600 text-cream text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
        >
          Return to Blog Listing
        </Link>
      </div>
    );
  }

  // Related articles: 2-3 other articles as defined by relatedSlugs, fallback to slice if undefined or empty
  const relatedPosts = post.relatedSlugs && post.relatedSlugs.length > 0
    ? blogPosts.filter((p) => post.relatedSlugs.includes(p.slug))
    : blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Structuring the JSON-LD BlogPosting schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.meta,
    "image": post.image,
    "datePublished": "2026-06-05T13:00:00Z", // aligned with contemporary timeline
    "author": {
      "@type": "Person",
      "name": "Shivoham Shiv",
      "url": "https://shivohamshiv.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shivoham Shiv",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shivohamshiv.com/shivoham-shiv-logo.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://shivohamshiv.com/blog/${post.slug}`
    }
  };

  return (
    <div className="bg-[#FAFBF7] min-h-screen font-sans selection:bg-green-100 pb-16">
      {/* 1. Helmet & SEO Components */}
      <SEO
        title={`${post.title} — Shivoham Shiv`}
        description={post.meta}
        focusKeyword={post.keyword}
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` }
        ]}
      />

      <Helmet>
        <link rel="canonical" href={`https://shivohamshiv.com/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} — Shivoham Shiv`} />
        <meta property="og:description" content={post.meta} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={`https://shivohamshiv.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(blogPostingSchema)}
        </script>
      </Helmet>

      {/* 2. Full-Width Featured Image Hero (Relevant topic header) */}
      <section 
        className="relative h-[300px] sm:h-[400px] bg-cover bg-center flex items-end overflow-hidden"
        style={{
          backgroundImage: `url('${post.image}')`
        }}
        aria-label={post.title}
      >
        {/* Soft elegant warm-to-dark backdrop gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10 text-left z-10">
          {/* Back to blog breadcrumb indicator */}
          <Link
            to="/blog"
            className="inline-flex items-center space-x-1.5 text-xs text-amber-100 hover:text-white uppercase font-bold tracking-wider mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to listing</span>
          </Link>

          {/* Title - Single H1 */}
          <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug drop-shadow-sm max-w-3xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center space-x-4 sm:space-x-6 text-xs text-amber-200/90 font-medium mt-4 pt-4 border-t border-white/20">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-amber-200/70" />
              <span>{post.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <span>Shivoham Shiv • Wellness</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. Article Core reading container: width ~720px */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 mt-12 sm:mt-16 text-left">
        <div className="bg-white border border-green-50 rounded-3xl p-6 sm:p-10 shadow-sm">
          {post.sections.map((sec, idx) => {
            switch (sec.type) {
              case "paragraph":
                return (
                  <p 
                    key={idx} 
                    className="text-base sm:text-[17px] text-[#2D312E] leading-relaxed mb-6 font-sans font-[400]"
                  >
                    {renderContentText(sec.text || "")}
                  </p>
                );
              case "heading":
                return (
                  <h2 
                    key={idx} 
                    className="text-xl sm:text-2xl font-serif font-semibold text-emerald-800 mt-10 mb-4 tracking-tight leading-snug border-b border-[#EFFFDF] pb-2"
                  >
                    {sec.text}
                  </h2>
                );
              case "bullet_list":
                return (
                  <ul 
                    key={idx} 
                    className="list-disc pl-6 space-y-3 mb-8 text-[#2D312E] text-base"
                  >
                    {sec.bullets?.map((bullet, bidx) => (
                      <li key={bidx} className="leading-relaxed font-sans">
                        {renderContentText(bullet)}
                      </li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}

          {/* 4. Elegant CTA Box linking course or weight-loss page */}
          <div className="bg-[#FAF9F5] border border-green-100 rounded-2xl p-6 sm:p-8 mt-12 text-center shadow-inner">
            <div className="w-12 h-12 bg-emerald-950 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-5 h-5 text-amber-300" />
            </div>
            
            <h3 className="font-serif font-bold text-lg sm:text-xl text-emerald-950 mb-2">
              Book a Free Evaluation Call
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-650 max-w-md mx-auto mb-6 leading-relaxed">
              Begin your path of restorative alignment. Discuss your unique challenges, discover your energetic profile, and build a personalized routine withPojo Chaturvedi.
            </p>

            <Link
              to={post.ctaLink}
              className="inline-block px-6 py-3.5 bg-[#E8943A] hover:bg-[#d07b22] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all uppercase"
            >
              {post.ctaText}
            </Link>
          </div>
        </div>
      </div>

      {/* 5. "Related Articles" row (2-3 other cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 border-t border-green-100 pt-16">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A] block mb-2">
            Continue Reading
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-emerald-950">
            Related Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map((rPost) => (
            <article
              key={rPost.slug}
              className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full text-left"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={rPost.image}
                  alt={`Cover graphic of ${rPost.title}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
                  {rPost.category}
                </span>
                
                <h3 className="font-serif font-bold text-base text-emerald-800 hover:text-emerald-700 transition-colors mb-2 line-clamp-2">
                  <Link to={`/blog/${rPost.slug}`}>
                    {rPost.title}
                  </Link>
                </h3>
                
                <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2">
                  {rPost.excerpt}
                </p>
                
                <Link
                  to={`/blog/${rPost.slug}`}
                  className="text-xs font-bold text-emerald-800 hover:text-[#2F5D50] transition-colors mt-auto flex items-center space-x-1"
                >
                  <span>Read Article</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
