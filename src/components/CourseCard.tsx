import React from "react";
import { Course } from "../types";
import { Star, Clock, BookOpen, Bookmark, BookmarkCheck, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  key?: string;
  course: Course;
  isEnrolled?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (e: React.MouseEvent, id: string) => void;
}

export default function CourseCard({
  course,
  isEnrolled = false,
  isBookmarked = false,
  onToggleBookmark
}: CourseCardProps) {
  const { id, title, tagline, category, rating, reviewsCount, duration, lessonsCount, studentCount, image, isUpcoming, upcomingStartDate, schedule, altName } = course;

  const getCoursePath = (uid: string) => {
    if (uid === "corp-wellness") return "/courses/corporate-wellness";
    if (uid === "mudra-therapy") return "/courses/mudra-therapy";
    if (uid === "acupressure-therapy") return "/courses/acupressure-therapy";
    if (uid === "kids-eq") return "/courses/mindfulness-kids";
    return `/courses/${uid}`;
  };

  const coursePath = getCoursePath(id);

  // Star mapping helper
  const renderStars = (ratingVal: number) => {
    const stars = [];
    const floor = Math.floor(ratingVal);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < floor ? "fill-amber-500 text-amber-500" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  let borderAccent = "border-b-4 border-b-green-500";
  if (category === "Mudra Therapy" || category.includes("Mudra")) {
    borderAccent = "border-b-4 border-b-amber-500";
  } else if (category === "Corporate & Adult Wellness" || category.includes("Wellness")) {
    borderAccent = "border-b-4 border-b-green-700";
  } else if (category === "Kids EQ" || category.includes("EQ") || category.includes("Kids")) {
    borderAccent = "border-b-4 border-b-green-900";
  }

  return (
    <div key={id} className={`group relative bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full ${borderAccent}`}>
      {/* Category Tag & Bookmark */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cream shadow-sm text-green-900 border border-green-100 uppercase tracking-widest">
          {category}
        </span>
      </div>

      {onToggleBookmark && (
        <button
          onClick={(e) => onToggleBookmark(e, id)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-cream text-slate-700 hover:text-green-700 shadow-sm hover:scale-105 transition-all"
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Course"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 fill-green-700 text-green-70s hover:scale-105 transition-all" />
          ) : (
            <Bookmark className="w-4 h-4 hover:scale-105 transition-all" />
          )}
        </button>
      )}

      {/* Image Banner */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={`Thumbnail for course: ${title}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isUpcoming && (
          <div className="absolute inset-0 bg-green-950/80 flex flex-col justify-center items-center text-center p-4">
            <span className="bg-[#E8943A] text-cream text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-2">
              Upcoming Pre-Release
            </span>
            <p className="text-white text-xs font-medium">Starts {upcomingStartDate}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Rating and Metadata */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {renderStars(rating)}
            <span className="text-xs text-slate-700 font-semibold">{rating}</span>
            <span className="text-[10px] text-gray-400">({reviewsCount})</span>
          </div>
          <span className="text-[11px] font-medium text-slate-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
            {studentCount}+ enrolled
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-heading font-bold text-lg text-green-900 mb-1 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
          <Link to={coursePath}>{title}</Link>
        </h3>
        {altName && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8943A] mb-2">
            {altName}
          </p>
        )}
        <p className="text-xs text-slate-700 font-medium mb-4 italic leading-relaxed line-clamp-2">
          "{tagline}"
        </p>

        {/* Class schedule */}
        {schedule && (
          <div className="flex items-center gap-1.5 mb-4 px-3 py-2 rounded-xl bg-green-50 border border-green-100 text-[11px] font-semibold text-green-900">
            <CalendarDays className="w-3.5 h-3.5 text-green-700 shrink-0" />
            <span>{schedule}</span>
          </div>
        )}

        {/* Details Footer */}
        <div className="mt-auto border-t border-green-50 pt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-slate-750">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-green-700" />
              <span>{duration.split(" ")[0]} {duration.split(" ")[1]}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-green-700" />
              <span>{lessonsCount} lessons</span>
            </div>
          </div>

          {isEnrolled && (
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full border border-green-200">
                Enrolled
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
