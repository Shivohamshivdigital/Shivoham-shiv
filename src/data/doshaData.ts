import { QuizQuestion, DoshaProfile } from "../types";

export const mockDoshaQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: "How would you describe your typical body frame and physical joints?",
    options: [
      {
        text: "Slender, tall, or short, with light joints that tend to crack or feel cold.",
        scores: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        text: "Medium, well-formed, with moderate muscular tone and a warm body temperature.",
        scores: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        text: "Sturdy, large, with broad shoulders, strong physical joints, and a tendency to hold water.",
        scores: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 2,
    text: "Which statement best describes your skin texture and hair quality?",
    options: [
      {
        text: "Dry, rough, thin skin that bruises easily; curly, dry, or tangled dark hair.",
        scores: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        text: "Soft, warm, sensitive skin with reddish undertones or moles; fine, fair, or early gray/red hair.",
        scores: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        text: "Thick, oil-prone, smooth skin that stays hydrated; thick, lustrous, wavy hair.",
        scores: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 3,
    text: "How does your digestion and appetite behave on a weekly basis?",
    options: [
      {
        text: "Irregular and delicate. Some days I am hungry instantly, other days I forget to eat, often prone to bloating.",
        scores: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        text: "Intense and strong. I get easily agitated when hungry, digest meals very rapidly, and prefer cold drinks.",
        scores: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        text: "Slow and steady. I can skip meals easily, but my digestion is lethargic and I feel heavy after standard meals.",
        scores: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 4,
    text: "How do you handle rapid changes, deadlines, or stressful surprises?",
    options: [
      {
        text: "I become anxious, start overthinking, and find it incredibly difficult to quiet my focus.",
        scores: { vata: 3, pitta: 1, kapha: 0 }
      },
      {
        text: "I get impatient, frustrated, or aggressive. I take quick command and push harder to finish.",
        scores: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        text: "I remain serene and calm, but tend to withdraw, procrastinate, or shut down internally.",
        scores: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 5,
    text: "How would you describe your typical sleeping pattern and dream states?",
    options: [
      {
        text: "Light, fitful, or interrupted sleep. My dreams are highly active, filled with flying, travel, or fear.",
        scores: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        text: "Moderate, warm, easily falling asleep but woken by hunger or heat. Clear, colorful, or adventurous dreams.",
        scores: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        text: "Deep, long, and heavy. I hate waking up, can sleep 8+ hours easily, and dream of calm lakes or gardens.",
        scores: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  }
];

export const mockDoshaProfiles: Record<"Vata" | "Pitta" | "Kapha", DoshaProfile> = {
  Vata: {
    primary: "Vata",
    scores: { vata: 15, pitta: 0, kapha: 0 },
    description: "Vata is governed by the elements of Air and Space. It is the principle of movement, creativity, and change. When in balance, Vata types are vibrantly creative, empathetic, enthusiastic, and adapt rapidly. When out of balance, they suffer from sudden anxiety, mental scatteredness, insomnia, dry skin, and poor digestion.",
    physicalTraits: [
      "Light, slender skeleture and joints",
      "Tendency to have dry skin and cold hands/feet",
      "Quick speech, active gait, and rapid pulse rate"
    ],
    dietAdvice: [
      "Prioritise warm, cooked, grounding meals with generous healthy fats (ghee, sesame oil).",
      "Choose sweet, sour, and salty flavors to steady your hyper-active nervous currents.",
      "Stay well-hydrated with warm herbal teas (ginger, licorice, cardamom)."
    ],
    avoidFoods: [
      "Dry raw salads, ice-cold beverages, and raw vegetables.",
      "Excessive bitter/astringent elements or heavy caffeinated products."
    ],
    lifestyleAdvice: [
      "Establish strict, repetitive daily meal schedules and sleep regimens.",
      "Practice daily self-massage (Abhyanga) using warm, premium sesame oil.",
      "Focus on slow-moving grounding exercises rather than high-intensity hyper-exhausting workouts."
    ],
    matchingCourseIds: ["mudra-therapy", "corp-wellness"]
  },
  Pitta: {
    primary: "Pitta",
    scores: { vata: 0, pitta: 15, kapha: 0 },
    description: "Pitta is governed by the elements of Fire and Water. It represent conversion, metabolic heat, and razor-sharp intellect. When balanced, Pitta types are powerful leaders, highly focused, logical, courageous, and direct. When out of balance, they struggle with impatience, sharp anger, physical heartburn, systemic rashes, and obsessive overworking.",
    physicalTraits: [
      "Moderate, symmetrical body frame with good muscle response",
      "Warm skin temperature with reddish tendencies, freckles, or sensitivity",
      "Sharp gaze, precise communication, and competitive athletic focus"
    ],
    dietAdvice: [
      "Prioritise cooling, sweet, bitter, and astringent foods to diffuse internal fire elements.",
      "Incorporate hydrating melons, sweet cucumbers, cooling leafy greens, and coconut oil.",
      "Drink refreshing peppermint, fennel, or coriander seed infusions."
    ],
    avoidFoods: [
      "Spicy hot chillies, strong vinegars, fermented foods, and deep-fried dishes.",
      "Excessive alcohol, dark chocolates, and garlic/raw onions."
    ],
    lifestyleAdvice: [
      "Cultivate the art of play without competition. Learn to relax on weekends.",
      "Avoid direct direct sunlight exposure during mid-day heat cycles.",
      "Incorporate daily cooling meditation (Sheetali Pranayama) to quiet heat peaks."
    ],
    matchingCourseIds: ["corp-wellness", "acupressure-therapy"]
  },
  Kapha: {
    primary: "Kapha",
    scores: { vata: 0, pitta: 0, kapha: 15 },
    description: "Kapha is governed by the elements of Earth and Water. It represents physical structure, cellular stability, and long-term stamina. When balanced, Kapha types are exceptionally steady, patient, deeply loyal, loving, and physically robust. When out of balance, they trigger systemic weight retention, sluggish digestion, depression, lung congestion, and severe attachment issues.",
    physicalTraits: [
      "Broad skeletal structures, sturdily built with excellent stamina",
      "Lustrous, moist, cool skin and thick healthy hair strands",
      "Serene, large eyes, a slow and deliberate speaking style, and deep restful voice"
    ],
    dietAdvice: [
      "Prioritise light, warm, dry, and highly spicy dishes to stimulate sluggish digestion.",
      "Choose bitter, pungent, and astringent greens and dry grains (quinoa, millet).",
      "Spice food heavily with black pepper, mustard seeds, ginger, and turmeric."
    ],
    avoidFoods: [
      "Heavy, sweet dairy products, iced creams, white flours, and oily nuts.",
      "Salt-dense snacks and excess refined sugars."
    ],
    lifestyleAdvice: [
      "Engage in vigorous daily aerobic workouts (brisk walks, yoga flows, cycling).",
      "Wake early (before 6:00 AM) to prevent lethargy and cloud-mind feelings.",
      "Incorporate constant variety in your daily surroundings and activities to break routine stalls."
    ],
    matchingCourseIds: ["acupressure-therapy", "kids-eq"]
  }
};
