/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description?: string;
  isLocked?: boolean;
}

export interface SyllabusSection {
  title: string;
  lessons: Lesson[];
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  category: "Corporate & Adult Wellness" | "Kids EQ" | "Meditation" | "Mudra Therapy" | "Murm Dab Chikitsa";
  description: string;
  rating: number;
  reviewsCount: number;
  duration: string;
  lessonsCount: number;
  studentCount: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  image: string;
  features: string[];
  syllabus: SyllabusSection[];
  benefits: string[];
  isUpcoming?: boolean;
  upcomingStartDate?: string;
  // Class schedule shown on course blocks, e.g. "3 Months · 3 days a week".
  schedule?: string;
  // Optional alternate / regional name, e.g. "Murm Dab Chikitsa" for Acupressure.
  altName?: string;
}

export interface Mudra {
  id: string;
  name: string;
  translation: string;
  shortDescription: string;
  description: string;
  steps: string[];
  benefits: string[];
  practiceDuration: string;
  element: "Air" | "Fire" | "Earth" | "Water" | "Space" | "All";
  image: string;
}

export interface DoshaAttribute {
  name: "Vata" | "Pitta" | "Kapha";
  percentage: number;
  description: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    scores: { vata: number; pitta: number; kapha: number };
  }[];
}

export interface DoshaProfile {
  primary: "Vata" | "Pitta" | "Kapha";
  secondary?: "Vata" | "Pitta" | "Kapha";
  scores: { vata: number; pitta: number; kapha: number };
  description: string;
  physicalTraits: string[];
  dietAdvice: string[];
  avoidFoods: string[];
  lifestyleAdvice: string[];
  matchingCourseIds: string[];
}

export interface ConsultationBooking {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  message?: string;
  preferredTime?: string;
  status: "pending" | "confirmed";
  createdAt: string;
}

export interface UserStats {
  enrollments: string[]; // Course IDs
  bookmarks: string[]; // Course IDs
  completedLessons: string[]; // Lesson IDs e.g. "courseId-lessonId"
  dailyStreak: number;
  lastVisitDate?: string;
  name?: string;
  registeredEmail?: string;
}
