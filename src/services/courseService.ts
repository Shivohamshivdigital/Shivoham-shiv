import { Course } from "../types";
import { mockCourses } from "../data/coursesData";

// Simulate network latency for high-fidelity loading states
const LATENCY = 300;

export async function getCourses(): Promise<Course[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockCourses]);
    }, LATENCY);
  });
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const course = mockCourses.find((c) => c.id === id);
      resolve(course);
    }, LATENCY);
  });
}

export async function getUpcomingCourses(): Promise<Course[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const upcoming = mockCourses.filter((c) => c.isUpcoming === true);
      resolve(upcoming);
    }, LATENCY);
  });
}

export async function getFeaturedCourses(): Promise<Course[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const active = mockCourses.filter((c) => !c.isUpcoming);
      resolve(active);
    }, LATENCY);
  });
}
