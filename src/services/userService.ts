import { UserStats } from "../types";

const STORAGE_KEY = "shivoham_user_stats";

// Default baseline profile
const DEFAULT_STATS: UserStats = {
  enrollments: [],
  bookmarks: [],
  completedLessons: [],
  dailyStreak: 3, // Start with a 3-day streak to encourage the learner!
  lastVisitDate: new Date().toISOString().split("T")[0],
  name: "Learner",
  registeredEmail: ""
};

export async function getUserStats(): Promise<UserStats> {
  return new Promise((resolve) => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as UserStats;
        resolve(parsed);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATS));
        resolve(DEFAULT_STATS);
      }
    } catch (e) {
      resolve(DEFAULT_STATS);
    }
  });
}

export async function saveUserStats(stats: UserStats): Promise<UserStats> {
  return new Promise((resolve) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      resolve(stats);
    } catch (e) {
      resolve(stats);
    }
  });
}

export async function enrollInCourse(courseId: string): Promise<UserStats> {
  const current = await getUserStats();
  if (!current.enrollments.includes(courseId)) {
    current.enrollments.push(courseId);
  }
  return saveUserStats(current);
}

export async function toggleBookmark(courseId: string): Promise<UserStats> {
  const current = await getUserStats();
  const index = current.bookmarks.indexOf(courseId);
  if (index > -1) {
    current.bookmarks.splice(index, 1);
  } else {
    current.bookmarks.push(courseId);
  }
  return saveUserStats(current);
}

export async function completeLesson(lessonId: string): Promise<UserStats> {
  const current = await getUserStats();
  if (!current.completedLessons.includes(lessonId)) {
    current.completedLessons.push(lessonId);
  } else {
    // Toggle off
    const index = current.completedLessons.indexOf(lessonId);
    current.completedLessons.splice(index, 1);
  }
  return saveUserStats(current);
}

export async function registerUser(name: string, email: string): Promise<UserStats> {
  const current = await getUserStats();
  current.name = name;
  current.registeredEmail = email;
  if (current.enrollments.length === 0) {
    // Auto-enroll them in the Mudra Therapy course as a free welcome gift!
    current.enrollments.push("mudra-therapy");
  }
  return saveUserStats(current);
}

export async function incrementStreak(): Promise<UserStats> {
  const current = await getUserStats();
  current.dailyStreak += 1;
  current.lastVisitDate = new Date().toISOString().split("T")[0];
  return saveUserStats(current);
}
