import { Course } from "../types";

export const mockCourses: Course[] = [
  {
    id: "corp-wellness",
    title: "Corporate & Adult Wellness: Healthy Workplace, Strong Communities",
    tagline: "Reduce institutional burnout and foster resilient, harmonious team environments.",
    category: "Corporate & Adult Wellness",
    description: "Vedic wisdom applied to modern organizational psychology. Learn to harmonise hectic professional workloads with simple, scientifically backable daily rituals (Dinacharya), nervous-system cooling breath sequences, and conscious communication practices designed to align teams.",
    rating: 4.9,
    reviewsCount: 148,
    duration: "6 Weeks (Self-Paced + 4 Live Sessions)",
    schedule: "3 Months · 3 days a week",
    lessonsCount: 18,
    studentCount: 412,
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
    features: [
      "Dinacharya (Vedic daily routine) personalized plan for stress reduction",
      "Somatic corporate breathing blueprints (Pranayama) for urgent focus",
      "4 Live Interactive Group Alignment Calls with certified instructors",
      "Lifetime workspace dashboard and resources access"
    ],
    benefits: [
      "Cut down physical fatigue and mind-fog within 7 days of starting.",
      "Cultivate high-empathy listening and lower interpersonal conflict markers at work.",
      "Achieve full quality sleep cycles naturally without relying on external sleep medicines."
    ],
    syllabus: [
      {
        title: "Module 1: Foundations of Corporate Mindfulness",
        lessons: [
          { id: "corp-1", title: "Identifying Corporate Stress Patterns", duration: "18:24" },
          { id: "corp-2", title: "The Science of Chronic Cortisol and Vedic Antidotes", duration: "24:10" },
          { id: "corp-3", title: "Prana in the Office: Breathing While Sitting", duration: "15:45" }
        ]
      },
      {
        title: "Module 2: Aligning the Daily Routine",
        lessons: [
          { id: "corp-4", title: "Vedic Circadian Optimization (Dinacharya)", duration: "22:15" },
          { id: "corp-5", title: "Mindful Workspace Structuring", duration: "19:30" }
        ]
      },
      {
        title: "Module 3: Relational Harmony & Vedic Expression",
        lessons: [
          { id: "corp-6", title: "Conscious Dialogue (Vachana Yoga)", duration: "28:12" },
          { id: "corp-7", title: "Building Resilient Mini-Communities at Work", duration: "21:40" }
        ]
      }
    ]
  },
  {
    id: "mudra-therapy",
    title: "Mudra Therapy Course: A Path to Holistic Healing",
    tagline: "Channel biological micro-currents through simple gestures. Over 840 healers started here.",
    category: "Mudra Therapy",
    description: "A complete interactive system unlocking the energetic circuitry of your hands. Guided directly by Vedic lineages, learn the neurological basis, precise hand alignments, and timing regimens for 15 essential Hasta Mudras to heal stomach blockages, severe tension, and emotional volatility.",
    rating: 4.95,
    reviewsCount: 212,
    duration: "4 Weeks (Comprehensive Video Modules)",
    schedule: "3 Months · 3 days a week",
    lessonsCount: 15,
    studentCount: 846,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
    features: [
      "Access to the Interactive Mudra Selector Simulator",
      "Visual guides detailing finger-tips energy contact pressure points",
      "Personalized assessment call checklist",
      "Certification of Mudra Therapy Fundamentals"
    ],
    benefits: [
      "Master real-time gestures to soothe systemic inflammation and anxiety.",
      "Unlock the bio-electric principles tying five primal elements to five fingers.",
      "Enhance focus, deep heart presence, and physical immunity."
    ],
    syllabus: [
      {
        title: "Module 1: The Bio-Electric Hand (Tattva Science)",
        lessons: [
          { id: "mudra-1", title: "Five Fingers as Five Base Elements", duration: "14:15" },
          { id: "mudra-2", title: "Biological Micro-Currents and Finger Pressure", duration: "19:40" }
        ]
      },
      {
        title: "Module 2: Practical Mudras for Everyday Calm",
        lessons: [
          { id: "mudra-3", title: "Gyan Mudra (Gesture of Pure Wisdom)", duration: "15:20" },
          { id: "mudra-4", title: "Prana Mudra (Vitality Igniter Gesture)", duration: "18:10" },
          { id: "mudra-5", title: "Apana Mudra (Purification and Digestion)", duration: "21:05" }
        ]
      },
      {
        title: "Module 3: Developing a Self-Healing Practice",
        lessons: [
          { id: "mudra-6", title: "Timing, Breath Ratios and Mudra Bundles", duration: "25:30" },
          { id: "mudra-7", title: "Guided 21-Day Self-Healing Sadhanas", duration: "32:00" }
        ]
      }
    ]
  },
  {
    id: "acupressure-therapy",
    title: "Acupressure Therapy Course: Heal Through Energy Points",
    tagline: "Release locked energy nodes (Marma points) across your meridian lines. Launches next month.",
    category: "Acupressure Therapy",
    altName: "Murm Dab Chikitsa",
    description: "An ancient holistic wellness system detailing key meridian sites of the nervous system. Learn how gentle stimulation of Marma points on the head, feet, hands, and shoulders directly benefits internal organ health, resolves persistent somatic blocks, and triggers immediate endorphin release.",
    rating: 4.8,
    reviewsCount: 88,
    duration: "5 Weeks (Pre-registration open)",
    schedule: "6 Months · 3 days a week",
    lessonsCount: 16,
    studentCount: 194,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200",
    features: [
      "High-definition Marma anatomical chart downloads",
      "Pressure-gauging guidance for home practice",
      "Bonus: Modern neuroscience pairing guides",
      "Early bird enrollment discounts applied"
    ],
    benefits: [
      "Locate and activate 12 essential acupuncture zones on your own body safely.",
      "Clear stubborn energy blocks triggering chronic neck tightness.",
      "Combine acupressure with targeted breathing models to accelerate results."
    ],
    syllabus: [
      {
        title: "Module 1: Sacred Meridian Geographies",
        lessons: [
          { id: "acu-1", title: "The Marma Point System of Vedic Sages", duration: "18:50" },
          { id: "acu-2", title: "Meridians vs. Modern Neural Connective Tissue", duration: "22:15" }
        ]
      },
      {
        title: "Module 2: Practical Upper Body Activation",
        lessons: [
          { id: "acu-3", title: "Cranial Acupressure for Deep Mental Reset", duration: "20:10" },
          { id: "acu-4", title: "Relieving Shoulder Congestion through Marma Points", duration: "18:40" }
        ]
      }
    ],
    isUpcoming: true,
    upcomingStartDate: "July 12, 2026"
  },
  {
    id: "kids-eq",
    title: "EQ Training for Kids: Emotional and Mental Growth",
    tagline: "Empower your child's emotional vocabulary, resilience, and attention. Pre-register today.",
    category: "Kids EQ",
    description: "Designed specifically for parents eager to equip children aged 6-14 with emotional grounding techniques inspired by classical mindfulness. Uses interactive storytelling, dynamic breath-games, and simple creative activities to guide youngsters in expressing complex feelings calmly, reducing digital fatigue, and improving real-world focus.",
    rating: 4.9,
    reviewsCount: 110,
    duration: "4 Weeks (Interactive Video + Parent Manuals)",
    schedule: "3 Months · 2 days a week",
    lessonsCount: 12,
    studentCount: 305,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200",
    features: [
      "Playable, downloadable emotion cards and story sheets",
      "Parenting integration guidebook with modern mental metrics",
      "Short 8-minute sensory micro-breaks for kids",
      "Interactive kids workspace and certification badge"
    ],
    benefits: [
      "Give kids simple somatic check-ins when feeling emotional waves.",
      "Boost active reading attention duration and reduce screen-time attachment.",
      "Establish cooperative family communication rituals."
    ],
    syllabus: [
      {
        title: "Module 1: Emotional Geographies for Kids",
        lessons: [
          { id: "kids-1", title: "Mapping Emotions to Physical Feelings", duration: "12:15" },
          { id: "kids-2", title: "Breath-Play: Interactive Animal Breaths", duration: "14:40" }
        ]
      },
      {
        title: "Module 2: Building Focus in a Digital World",
        lessons: [
          { id: "kids-3", title: "Sensory Awareness & Grounding Exercises", duration: "15:10" },
          { id: "kids-4", title: "Slowing Down Digital Overload", duration: "16:20" }
        ]
      }
    ],
    isUpcoming: false
  }
];
