import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCourses, getCourseById } from "../services/courseService";
import { getUserStats, enrollInCourse, toggleBookmark } from "../services/userService";
import { Course, UserStats } from "../types";
import { Search, Star, Clock, BookOpen, Layers, CheckCircle2, Bookmark, Flame, Play, Eye, X, HelpCircle, Lock } from "lucide-react";
import CourseCard from "../components/CourseCard";
import SEO from "../components/SEO";

interface CoursesViewProps {
  onSetBanner: (message: string) => void;
  onStatsUpdated: () => void;
}

export default function CoursesView({ onSetBanner, onStatsUpdated }: CoursesViewProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter queries
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selected course for curriculum detail audit drawer/overlay
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeSyllabusTab, setActiveSyllabusTab] = useState<string>("");

  useEffect(() => {
    // Initial load
    Promise.all([getCourses(), getUserStats()]).then(([courseList, stats]) => {
      setCourses(courseList);
      setUserStats(stats);

      // Check if selected URL query param exists (e.g. ?selected=mudra-therapy)
      const selectedId = searchParams.get("selected");
      if (selectedId) {
        const found = courseList.find((c) => c.id === selectedId);
        if (found) {
          setSelectedCourse(found);
          if (found.syllabus && found.syllabus.length > 0) {
            setActiveSyllabusTab(found.syllabus[0].title);
          }
        }
      }
    });
  }, [searchParams]);

  const handleToggleBookmark = async (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    const updatedStats = await toggleBookmark(courseId);
    setUserStats(updatedStats);
    onStatsUpdated();
    
    const isBookmarkedNow = updatedStats.bookmarks.includes(courseId);
    onSetBanner(
      isBookmarkedNow
        ? "Course successfully added to your bookmarks database."
        : "Course removed from your bookmarks database."
    );
  };

  const handleEnroll = async (courseId: string) => {
    const updatedStats = await enrollInCourse(courseId);
    setUserStats(updatedStats);
    onStatsUpdated();
    
    const course = courses.find((c) => c.id === courseId);
    onSetBanner(`Success! You have officially enrolled in "${course?.title}". Check your Learner Dashboard to view lectures!`);
    
    // Close drawer or keep open to allow entry
    if (selectedCourse?.id === courseId) {
      setSelectedCourse({ ...selectedCourse });
    }
  };

  // Filtered course catalog list
  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleOpenCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setSearchParams({ selected: course.id });
    if (course.syllabus && course.syllabus.length > 0) {
      setActiveSyllabusTab(course.syllabus[0].title);
    }
  };

  const handleCloseCourseDetail = () => {
    setSelectedCourse(null);
    setSearchParams({});
  };

  const categories = ["All", "Corporate & Adult Wellness", "Mudra Therapy", "Acupressure Therapy", "Kids EQ"];

  // Dynamic SEO data depending on whether a course is selected
  let seoTitle = "Wellness & Healing Courses Online | Mudra Therapy, Acupressure & More";
  let seoDescription = "Browse Shivoham Shiv's Vedic wellness courses — corporate wellness, mudra therapy, acupressure and mindfulness & EQ training for kids.";
  let seoKeyword = "online wellness healing courses";
  let isCourseDetail = false;
  let courseDataForSeoObj = undefined;

  if (selectedCourse) {
    isCourseDetail = true;
    courseDataForSeoObj = {
      name: selectedCourse.title,
      description: selectedCourse.description,
      imageUrl: selectedCourse.image,
      lessonsCount: selectedCourse.lessonsCount
    };

    if (selectedCourse.id === "mudra-therapy") {
      seoTitle = "Mudra Therapy Course Online | Holistic Healing — Shivoham Shiv";
      seoDescription = "Learn ancient mudra therapy online to reduce stress, balance energy and support holistic well-being. Beginner-friendly Vedic course.";
      seoKeyword = "mudra therapy course online";
    } else if (selectedCourse.id === "acupressure-therapy") {
      seoTitle = "Acupressure Therapy Course | Natural Energy Healing — Shivoham Shiv";
      seoDescription = "Discover acupressure therapy for natural pain relief, energy balance and stress reduction. Live course coming soon at Shivoham Shiv.";
      seoKeyword = "acupressure therapy course";
    } else if (selectedCourse.id === "corp-wellness") {
      seoTitle = "Corporate Wellness Program | Workplace Well-Being — Shivoham Shiv";
      seoDescription = "Holistic corporate & adult wellness programs that reduce workplace stress, improve focus and support employee well-being.";
      seoKeyword = "corporate wellness program";
    } else if (selectedCourse.id === "kids-eq") {
      seoTitle = "Mindfulness & EQ Training for Kids | Emotional Intelligence — Shivoham Shiv";
      seoDescription = "Gentle mindfulness and emotional intelligence (EQ) training for kids to build focus, calm and confidence.";
      seoKeyword = "EQ training for kids";
    }
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" }
  ];
  if (selectedCourse) {
    breadcrumbItems.push({ name: selectedCourse.title, url: `/courses?selected=${selectedCourse.id}` });
  }

  return (
    <div className="bg-[#FAFBF7] min-h-screen py-12 font-sans relative">
      <SEO
        title={seoTitle}
        description={seoDescription}
        focusKeyword={seoKeyword}
        isCourseDetail={isCourseDetail}
        courseData={courseDataForSeoObj}
        isBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8943A]">
            Discover Vedic Wisdom Pipelines
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-green-900 mt-2 mb-4 leading-tight">
            Comprehensive Online Course Pathways
          </h1>
          <p className="text-sm leading-relaxed text-slate-705">
            Audit high-quality Vedic courses featuring complete curriculums, checkable exercises, and clinical assessments. Begin learning now – offline state triggers are persistent!
          </p>
        </div>

        {/* Directory Operations: Filter and Search Widget */}
        <div className="bg-white border border-green-100 p-6 rounded-2xl shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Categories select pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors duration-200 ${
                  selectedCategory === cat
                    ? "bg-green-700 text-cream border-green-750 font-bold"
                    : "bg-[#F2F9F2] text-slate-700 border-green-100 hover:bg-green-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-green-700" />
            <input
              type="text"
              placeholder="Search courses, mudras, benefits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-green-150 text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((c) => {
            const isEnrolled = userStats?.enrollments.includes(c.id) || false;
            const isBookmarked = userStats?.bookmarks.includes(c.id) || false;
            return (
              <div
                key={c.id}
                onClick={() => handleOpenCourseDetail(c)}
                className="cursor-pointer"
              >
                <CourseCard
                  course={c}
                  isEnrolled={isEnrolled}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={handleToggleBookmark}
                />
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-green-100 p-6">
            <HelpCircle className="w-12 h-12 text-[#E8943A] mx-auto mb-4 animate-pulse" />
            <h3 className="font-heading font-bold text-lg text-green-900">No Corresponding Pathways Found</h3>
            <p className="text-xs text-slate-700 mt-2 max-w-sm mx-auto">
              We couldn't locate courses matching your criteria. Try resetting filtering states or try search term variations!
            </p>
          </div>
        )}

      </div>

      {/* 5. INTERACTIVE ACCORDION REVIEWS & SYLLABUS DETAIL DRAWER / MODAL OVERLAY */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-cream border border-green-100 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-scaleUp">
            
            {/* Close button */}
            <button
              onClick={handleCloseCourseDetail}
              className="absolute top-6 right-6 p-2 rounded-full bg-white hover:bg-green-100 border border-green-100 text-green-900 hover:text-green-700 transition-colors z-10 cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header image & Overview details */}
            <div className="relative aspect-[31/10] overflow-hidden min-h-[220px]">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-955/40 to-transparent p-6 sm:p-10 flex flex-col justify-end text-cream">
                <span className="px-3 py-1 bg-[#EFAF3C] text-[#FAFBF7] text-[9px] font-bold tracking-widest uppercase rounded-full w-fit mb-2">
                  {selectedCourse.category}
                </span>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight leading-snug">
                  {selectedCourse.title}
                </h2>
                <p className="text-xs sm:text-sm text-green-100 tracking-wide font-medium italic mt-1">
                  "{selectedCourse.tagline}"
                </p>
              </div>
            </div>

            {/* Drawer Body content split */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left detail column - syllabus details */}
              <div className="lg:col-span-8 flex flex-col space-y-6">
                
                {/* description */}
                <div>
                  <h3 className="text-xs uppercase font-bold tracking-widest text-[#E8943A] mb-2">
                    Pathway Overview
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-705">
                    {selectedCourse.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="bg-white border border-green-100/60 p-6 rounded-2xl">
                  <h3 className="font-heading font-bold text-sm text-green-900 uppercase tracking-widest mb-4">
                    Tangible Benefits
                  </h3>
                  <div className="space-y-2">
                    {selectedCourse.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs leading-relaxed text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Syllabus Modules Audit */}
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#E8943A] uppercase tracking-widest mb-4">
                    Course Syllabus / Curriculum
                  </h3>
                  
                  {/* Tabs layout */}
                  <div className="flex border-b border-green-150 mb-4 overflow-x-auto gap-3">
                    {selectedCourse.syllabus.map((section) => (
                      <button
                        key={section.title}
                        onClick={() => setActiveSyllabusTab(section.title)}
                        className={`pb-2.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 ${
                          activeSyllabusTab === section.title
                            ? "text-green-900 border-green-750 font-bold"
                            : "text-slate-700 border-transparent hover:text-green-700"
                        }`}
                      >
                        {section.title.split(":")[0]}
                      </button>
                    ))}
                  </div>

                  {/* Syllabus Active tab detail */}
                  <div className="bg-white rounded-2xl border border-green-100 p-5 space-y-3 shadow-inner">
                    <p className="text-[11px] font-bold text-green-900 uppercase tracking-wide">
                      {activeSyllabusTab} lectures
                    </p>
                    
                    <div className="space-y-2.5">
                      {selectedCourse.syllabus
                        .find((s) => s.title === activeSyllabusTab)
                        ?.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-3 bg-[#FAFBF7] border border-green-50 rounded-xl flex items-center justify-between text-xs transition-transform duration-200"
                          >
                            <div className="flex items-center space-x-2">
                              <Play className="w-3.5 h-3.5 text-green-750 shrink-0" />
                              <span className="font-medium text-slate-700">{lesson.title}</span>
                            </div>
                            <div className="flex items-center space-x-2 font-mono text-slate-700">
                              <span>{lesson.duration} mins</span>
                              <Lock className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Customer Reviews */}
                <div>
                  <h3 className="font-heading font-bold text-sm text-green-900 uppercase tracking-widest mb-4">
                    Verified Learner Endorsements
                  </h3>
                  <div className="space-y-3.5">
                    {[
                      { name: "Devanshi Patel", comment: "The detailed step checks on finger contact structures is fantastic! This is the most practical therapy guide I've seen as a physiotherapist.", rating: 5, date: "June 2026" },
                      { name: "Vikram Sengupta", comment: "My systemic stress bloating cleared within 5 days of holding Apana Mudra as recommended in Module 2! Strongly recommended.", rating: 5, date: "May 2026" }
                    ].map((rev, i) => (
                      <div key={i} className="p-4 bg-white border border-green-50 rounded-2xl text-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-green-900">{rev.name}</div>
                          <div className="text-amber-500">★ ★ ★ ★ ★</div>
                        </div>
                        <p className="text-slate-705 leading-relaxed">"{rev.comment}"</p>
                        <div className="text-right text-[9px] text-gray-400 mt-2">{rev.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right panel checkouts CTAs cards */}
              <div className="lg:col-span-4 bg-white border border-green-100 rounded-2xl p-6 shadow-sm sticky top-24">
                <h4 className="font-heading font-bold text-xs text-[#E8943A] uppercase tracking-widest mb-4 border-b border-green-50 pb-2">
                  Enrollment Panel
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="text-slate-700 font-semibold">Mode:</span>
                    <span className="font-bold text-green-900">Unrestricted Online Video</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="text-slate-700 font-semibold">Difficulty:</span>
                    <span className="font-bold text-green-900 uppercase">{selectedCourse.level}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="text-slate-700 font-semibold">Lectures Count:</span>
                    <span className="font-bold text-green-900">{selectedCourse.lessonsCount} lessons</span>
                  </div>
                </div>

                {/* Course resources notification */}
                <div className="my-4">
                  <p className="text-[10px] text-green-750 font-semibold leading-relaxed flex items-center space-x-1">
                    <span>✔ Dynamic updates and lifetime resources access included.</span>
                  </p>
                </div>

                {/* Course core checklist bullets */}
                <div className="space-y-2 mb-6">
                  {selectedCourse.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5 text-[10px] leading-relaxed text-slate-700">
                      <span className="text-green-700 font-bold shrink-0">✔</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                {userStats?.enrollments.includes(selectedCourse.id) ? (
                  <div className="space-y-2">
                    <span className="block text-center text-xs text-green-700 font-bold bg-green-50 py-3.5 border border-green-200 rounded-xl">
                      ✔ You are active in this path.
                    </span>
                    <button
                      onClick={() => handleCloseCourseDetail()}
                      className="w-full py-4 bg-green-750 text-white rounded-xl text-xs font-bold uppercase tracking-wider block text-center shadow-md bg-green-700 hover:bg-green-500 transition-colors cursor-pointer"
                    >
                      Browse other courses
                    </button>
                  </div>
                ) : selectedCourse.isUpcoming ? (
                  <button
                    onClick={() => handleEnroll(selectedCourse.id)}
                    className="w-full py-4.5 bg-[#E8943A] text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-101 border border-amber-300"
                  >
                    Pre-Register / Reserve Space
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(selectedCourse.id)}
                    className="w-full py-4.5 bg-green-700 hover:bg-green-500 text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-101 cursor-pointer"
                  >
                    Lock Pathway Access
                  </button>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
