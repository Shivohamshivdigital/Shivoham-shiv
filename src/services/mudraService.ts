import { Mudra } from "../types";
import { mockMudras } from "../data/mudraData";

const LATENCY = 200;

export async function getMudras(): Promise<Mudra[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockMudras]);
    }, LATENCY);
  });
}

export async function getMudraById(id: string): Promise<Mudra | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mudra = mockMudras.find((m) => m.id === id);
      resolve(mudra);
    }, LATENCY);
  });
}

export async function getMudrasByElement(element: string): Promise<Mudra[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (element === "All") {
        resolve([...mockMudras]);
      } else {
        const filtered = mockMudras.filter((m) => m.element === element);
        resolve(filtered);
      }
    }, LATENCY);
  });
}
