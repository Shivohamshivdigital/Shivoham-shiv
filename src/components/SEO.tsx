import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  focusKeyword?: string;
  isCourseDetail?: boolean;
  courseData?: {
    name: string;
    description: string;
    imageUrl?: string;
    lessonsCount?: number;
    sku?: string;
  };
  isFAQPage?: boolean;
  faqs?: Array<{ q: string; a: string }>;
  isBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ name: string; url: string }>;
}

export default function SEO({
  title,
  description,
  focusKeyword,
  isCourseDetail = false,
  courseData,
  isFAQPage = false,
  faqs,
  isBreadcrumb = false,
  breadcrumbItems
}: SEOProps) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const siteUrl = "https://shivohamshiv.com";
  // The full canonical URL (hash-routing friendly and clean fallback representation)
  const canonicalUrl = `${siteUrl}${location.pathname === "/" ? "" : location.pathname}${location.search}`;

  // 1. Sitewide Schema Graph: Organization and LocalBusiness
  const organizationSchema = {
    "@type": "Organization",
    "@id": "https://shivohamshiv.com/#organization",
    "name": "Shivoham Shiv",
    "url": "https://shivohamshiv.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://shivohamshiv.com/shivoham-shiv-logo.jpg"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9682051868",
      "contactType": "customer service"
    }
  };

  const localBusinessSchema = {
    "@type": ["LocalBusiness", "MedicalBusiness"],
    "@id": "https://shivohamshiv.com/#localbusiness",
    "name": "Shivoham Shiv Vedic Wellness Center",
    "url": "https://shivohamshiv.com",
    "logo": "https://shivohamshiv.com/shivoham-shiv-logo.jpg",
    "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
    "telephone": "+91 9682051868",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Arya Kanya Chowraha, Sipri Bazar",
      "addressLocality": "Jhansi",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "284003",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.4484",
      "longitude": "78.5685"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    }
  };

  // Base graph containing standard organization and local business
  const schemas: any[] = [organizationSchema, localBusinessSchema];

  // 2. Course detail Schema Page
  if (isCourseDetail && courseData) {
    const courseSchema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": courseData.name,
      "description": courseData.description,
      "provider": {
        "@type": "Organization",
        "name": "Shivoham Shiv",
        "sameAs": "https://shivohamshiv.com"
      },
      "image": courseData.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
    };
    schemas.push(courseSchema);
  }

  // 3. FAQPage Schema
  if (isFAQPage && faqs && faqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };
    schemas.push(faqSchema);
  }

  // 4. BreadcrumbList Schema for inner routes
  if (isBreadcrumb && breadcrumbItems && breadcrumbItems.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": item.name,
        "item": item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`
      }))
    };
    schemas.push(breadcrumbSchema);
  } else if (location.pathname !== "/") {
    // Generate standard breadcrumb automatically based on pathname
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      const items = [{ name: "Home", url: `${siteUrl}/` }];
      let cumulativePath = "";
      pathSegments.forEach((segment) => {
        cumulativePath += `/${segment}`;
        const cleanName = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        items.push({ name: cleanName, url: `${siteUrl}${cumulativePath}` });
      });

      const autoBreadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": item.name,
          "item": item.url
        }))
      };
      schemas.push(autoBreadcrumbSchema);
    }
  }

  // Final structured data payload wrapped in a single @graph syntax structure
  const graphPayload = {
    "@context": "https://schema.org",
    "@graph": schemas
  };

  return (
    <Helmet>
      {/* Search Engine Optimization Base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {focusKeyword && <meta name="keywords" content={`${focusKeyword}, vedic wellness, mudra therapy, holistic healing, ayurveda Jhansi, Pooja Chaturvedi`} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph System */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content="https://shivohamshiv.com/shivoham-shiv-logo.jpg" />
      <meta property="og:site_name" content="Shivoham Shiv" />

      {/* Twitter Cards platform */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://shivohamshiv.com/shivoham-shiv-logo.jpg" />

      {/* Embedded Rich Structured JSON-LD Data */}
      <script type="application/ld+json">
        {JSON.stringify(graphPayload)}
      </script>
    </Helmet>
  );
}
