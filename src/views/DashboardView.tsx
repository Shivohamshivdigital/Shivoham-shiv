import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserStats, completeLesson, incrementStreak } from "../services/userService";
import { getCourses } from "../services/courseService";
import { getBookings } from "../services/consultationService";
import { UserStats, Course, ConsultationBooking } from "../types";
import { Compass, Sparkles, Star, Calendar, Clock, BookOpen, CheckCircle, Flame, Target, PlayCircle, ToggleLeft, ArrowRight, UserCheck } from "lucide-react";
import SEO from "../components/SEO";

interface DashboardViewProps {
  onSetBanner: (message: string) => void;
  onStatsUpdated: () => void;
  updateTrigger?: number;
}

export default function DashboardView({ onSetBanner, onStatsUpdated, updateTrigger }: DashboardViewProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [activeTab, setActiveTab] = useState<"courses" | "bookmarks" | "bookings">("courses");
  
  // Selected course to study inside the dashboard space
  const [activeStudyCourse, setActiveStudyCourse] = useState<Course | null>(null);
  
  // Streak limits check
  const [checkedInToday, setCheckedInToday] = useState(false);

  const loadData = () => {
    Promise.all([getUserStats(), getCourses(), getBookings()]).then(([stats, courseList, bookingList]) => {
      setUserStats(stats);
      setCourses(courseList);
      setBookings(bookingList);
      
      // Auto-select first enrolled course if none selected
      if (stats.enrollments.length > 0 && !activeStudyCourse) {
        const firstActive = courseList.find((c) => stats.enrollments.includes(c.id));
        if (firstActive) {
          setActiveStudyCourse(firstActive);
        }
      }
    });
  };

  useEffect(() => {
    loadData();
    // Reset check in limit on load
    const todayStr = new Date().toISOString().split("T")[0];
    if (userStats?.lastVisitDate === todayStr) {
      setCheckedInToday(true);
    }
  }, [updateTrigger]);

  const handleToggleLessonComplete = async (lessonId: string) => {
    const updatedStats = await completeLesson(lessonId);
    setUserStats(updatedStats);
    onStatsUpdated();
    onSetBanner("Lecture progress updated. Keep going on your sadhana!");
  };

  const handleDailyCheckIn = async () => {
    if (checkedInToday) return;
    
    const updatedStats = await incrementStreak();
    setUserStats(updatedStats);
    setCheckedInToday(true);
    onStatsUpdated();
    onSetBanner(`Pranama! Daily check-in complete. Your Vedic commitment streak increased to ${updatedStats.dailyStreak} days! 🕉️`);
  };

  // Helper: compute active courses
  const enrolledCourses = courses.filter((c) => userStats?.enrollments.includes(c.id));
  const bookmarkedCourses = courses.filter((c) => userStats?.bookmarks.includes(c.id));

  // Helper: compute progress percentage for a course
  const getCourseProgress = (course: Course) => {
    if (!userStats) return 0;
    
    // Collect all lesson ids in this course
    const lessons = course.syllabus.flatMap((sec) => sec.lessons);
    if (lessons.length === 0) return 0;

    const completedInCourse = lessons.filter((l) => userStats.completedLessons.includes(l.id));
    return Math.round((completedInCourse.length / lessons.length) * 100);
  };

  return (
    <div className="bg-[#FAFBF7] min-h-screen py-12 font-sans">
      <SEO
        title="Learner Workspace & Sadhana Dashboard | Shivoham Shiv"
        description="Track your daily Sadhana streak, manage your enrolled online Vedic wellness courses, save bookmarks, and view consultation statuses."
        focusKeyword="online meditation course"
        isBreadcrumb={true}
        breadcrumbItems={[
          { name: "Home", url: "/" },
          { name: "Dashboard", url: "/dashboard" }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Welcome User details */}
          <div className="lg:col-span-8 flex items-center space-x-4 bg-white border border-green-100 p-6 sm:p-8 rounded-3xl shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-green-700 text-cream flex items-center justify-center font-bold text-2xl shadow-md">
              {userStats?.name?.substr(0, 2) || "SS"}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-green-700">
                Self-Efficacy Space
              </span>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-green-900 mt-0.5">
                Welcome back, {userStats?.name || "Student"}!
              </h1>
              <p className="text-xs text-slate-705 mt-1 leading-relaxed">
                Registered Email: {userStats?.registeredEmail || "guest_learner@gmail.com"} • Account status: <span className="font-bold text-green-700">Live Active</span>
              </p>
            </div>
          </div>

          {/* Daily Sadhana Streak Tracker */}
          <div className="lg:col-span-4 bg-green-900 border border-green-800 text-cream p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#E8943A]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] tracking-wide font-bold uppercase text-amber-500">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Sadhana Commitment</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#EFFFDF]">{userStats?.dailyStreak || 3}-Day Streak</span>
            </div>

            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="flex flex-col text-left">
                <span className="text-xl font-heading font-bold text-white leading-none">
                  Check-In Practice
                </span>
                <span className="text-[10px] text-green-100/70 mt-1">Increase alignment streak count.</span>
              </div>

              <button
                onClick={handleDailyCheckIn}
                disabled={checkedInToday}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transform hover:-translate-y-0.5 transition-all text-center ${
                  checkedInToday
                    ? "bg-green-800 border border-green-700 text-green-200/50 pointer-events-none"
                    : "bg-[#E8943A] hover:bg-[#EFAF3C] text-cream border border-amber-300"
                }`}
              >
                {checkedInToday ? "Aligned Today" : "Check-In"}
              </button>
            </div>
          </div>

        </div>

        {/* Categories Tabs Selector */}
        <div className="flex border-b border-green-100 gap-6 mb-10 overflow-x-auto">
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-4 text-xs font-bold uppercase tracking-widest cursor-pointer border-b-2 transition-all ${
              activeTab === "courses"
                ? "text-green-900 border-green-750"
                : "text-slate-700 border-transparent hover:text-green-700"
            }`}
          >
            Active Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`pb-4 text-xs font-bold uppercase tracking-widest cursor-pointer border-b-2 transition-all ${
              activeTab === "bookmarks"
                ? "text-green-900 border-green-750"
                : "text-slate-700 border-transparent hover:text-green-700"
            }`}
          >
            Saved Bookmarks ({bookmarkedCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-4 text-xs font-bold uppercase tracking-widest cursor-pointer border-b-2 transition-all ${
              activeTab === "bookings"
                ? "text-green-900 border-green-750"
                : "text-slate-700 border-transparent hover:text-green-700"
            }`}
          >
            Consultation Bookings ({bookings.length})
          </button>
        </div>

        {/* Tab content containers */}
        {activeTab === "courses" && (
          <div>
            {enrolledCourses.length === 0 ? (
              <div className="bg-white border border-green-100 p-8 sm:p-14 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
                <Target className="w-12 h-12 text-[#E8943A] mx-auto animate-bounce" />
                <h3 className="font-heading font-bold text-lg text-green-900">No Program locked yet</h3>
                <p className="text-xs text-slate-705 leading-relaxed">
                  You are not currently enrolled in any Vedic structures. Head to our complete course directory to lock a signature course pathway!
                </p>
                <Link
                  to="/courses"
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-500 text-[#FAFBF7] rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-1.5"
                >
                  <span>Explore Course Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Enrolled Courses sidebar */}
                <div className="lg:col-span-4 flex flex-col space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E8943A] mb-1">
                    Your Active Curriculums
                  </h3>
                  
                  {enrolledCourses.map((c) => {
                    const prog = getCourseProgress(c);
                    const isActive = activeStudyCourse?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveStudyCourse(c)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 text-slate-700 ${
                          isActive
                            ? "bg-white border-green-750 shadow-md"
                            : "bg-[#FAFBF7] border-green-100/60 hover:bg-white"
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-green-700">{c.category}</span>
                        <h4 className="font-heading font-semibold text-sm text-green-900 mt-0.5 leading-snug line-clamp-1">
                          {c.title}
                        </h4>
                        
                        {/* Course visual progression */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center text-[10px] text-slate-700 mb-1">
                            <span>Completeness Profile</span>
                            <span className="font-bold">{prog}%</span>
                          </div>
                          <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all duration-300 rounded-full"
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active workspace reader area */}
                <div className="lg:col-span-8 bg-white border border-green-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  {activeStudyCourse ? (
                    <div>
                      
                      {/* Course summary header */}
                      <div className="border-b border-green-50 pb-5 mb-6">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-green-700">Learner Workspace Portal</span>
                        <h2 className="font-heading font-bold text-2xl text-green-950 mt-1 leading-snug">
                          {activeStudyCourse.title}
                        </h2>
                        <p className="text-xs text-slate-705 italic mt-1 leading-relaxed">
                          "{activeStudyCourse.tagline}"
                        </p>
                      </div>

                      {/* Video lectures checklist */}
                      <div className="space-y-6">
                        <h3 className="font-heading font-bold text-sm text-green-900 uppercase tracking-widest mb-3">
                          Verify Lectures & Sadhanas Completed
                        </h3>

                        {activeStudyCourse.syllabus.map((sect) => (
                          <div key={sect.title} className="space-y-3.5">
                            <h4 className="font-heading font-semibold text-xs text-slate-700 bg-[#F2F9F2] px-3.5 py-1.5 rounded-lg border border-green-100">
                              {sect.title}
                            </h4>
                            
                            <div className="space-y-2">
                              {sect.lessons.map((les) => {
                                const isChecked = userStats?.completedLessons.includes(les.id) || false;
                                return (
                                  <div
                                    key={les.id}
                                    onClick={() => handleToggleLessonComplete(les.id)}
                                    className={`p-3.5 pr-6 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                                      isChecked
                                        ? "bg-green-50/50 border-green-300 text-slate-900"
                                        : "bg-white border-green-100 text-slate-705 hover:bg-neutral-50/40"
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium">
                                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                        isChecked ? "bg-green-700 border-green-75" : "border-green-300 bg-white"
                                      }`}>
                                        {isChecked && <CheckCircle className="w-3.5 h-3.5 text-cream fill-green-700" />}
                                      </div>
                                      <span>{les.title}</span>
                                    </div>

                                    <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-705">
                                      <span>{les.duration} mins</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-400">
                      <p>Select a learning program on the left to display its lecture files.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div>
            {bookmarkedCourses.length === 0 ? (
              <div className="bg-white border border-green-100 p-8 sm:p-14 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
                <BookOpen className="w-12 h-12 text-[#E8943A] mx-auto opacity-70" />
                <h3 className="font-heading font-bold text-lg text-green-900">No bookmarked pathways</h3>
                <p className="text-xs text-slate-705">
                  Bookmarked items from the catalog will render here for quick overview reference.
                </p>
                <Link
                  to="/courses"
                  className="px-6 py-2.5 bg-green-700 text-[#FAFBF7] hover:bg-green-500 rounded-xl text-xs font-bold uppercase tracking-wider inline-block text-center"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookmarkedCourses.map((c) => (
                  <Link key={c.id} to={`/courses?selected=${c.id}`}>
                    <div className="bg-white border border-green-100 rounded-2xl p-5 hover:border-green-750 transition-colors">
                      <span className="text-[10px] text-green-700 uppercase font-bold tracking-widest">{c.category}</span>
                      <h4 className="font-heading font-bold text-green-900 text-base mt-1 line-clamp-1">{c.title}</h4>
                      <p className="text-xs text-slate-705 mt-1 line-clamp-2">"{c.tagline}"</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            {bookings.length === 0 ? (
              <div className="bg-white border border-green-100 p-8 sm:p-14 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
                <Calendar className="w-12 h-12 text-[#E8943A] mx-auto opacity-70" />
                <h3 className="font-heading font-bold text-lg text-green-900">No consultations Booked</h3>
                <p className="text-xs text-slate-705">
                  Secure your personal Ayurvedic wellness mapping sessions. Submissions will populate here in real-time.
                </p>
                <a
                  href="#contact-healing"
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-500 text-cream rounded-xl text-xs font-bold uppercase tracking-wider inline-block"
                >
                  Submit Inquiry Now
                </a>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#E8943A]">
                  Active consultation Bookings ({bookings.length})
                </h3>
                
                {bookings.map((b) => (
                  <div key={b.id} className="bg-white border border-green-100 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] bg-green-100 border border-green-200 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          Confirmed State (Mock)
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">Reference: {b.id}</span>
                      </div>
                      <h4 className="font-heading font-bold text-lg text-green-900">
                        {b.fullName}
                      </h4>
                      <p className="text-xs text-slate-705 font-mono">
                        WhatsApp Contact: {b.whatsapp} • Preferred Schedule: {b.preferredTime}
                      </p>
                      {b.message && (
                        <p className="text-xs text-slate-704 italic border-l border-green-100 pl-3 mt-1.5">
                          "{b.message}"
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 block font-mono">Booked on</span>
                      <span className="text-xs font-bold text-slate-710 font-mono">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
