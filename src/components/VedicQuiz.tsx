import { useState } from "react";
import { mockDoshaQuestions, mockDoshaProfiles } from "../data/doshaData";
import { DoshaProfile } from "../types";
import { Compass, Sparkles, RefreshCw, CheckCircle2, ArrowRight, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface VedicQuizProps {
  onOpenConsultation?: () => void;
}

export default function VedicQuiz({ onOpenConsultation }: VedicQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ vata: 0, pitta: 0, kapha: 0 });
  const [isCompleted, setIsCompleted] = useState(false);
  const [profile, setProfile] = useState<DoshaProfile | null>(null);

  const handleSelectOption = (scoresToAdd: { vata: number; pitta: number; kapha: number }) => {
    // Accumulate scores
    setScores((prev) => ({
      vata: prev.vata + scoresToAdd.vata,
      pitta: prev.pitta + scoresToAdd.pitta,
      kapha: prev.kapha + scoresToAdd.kapha,
    }));

    if (currentStep < mockDoshaQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate final results
      setIsCompleted(true);
      generateResult();
    }
  };

  const generateResult = () => {
    // Determine highest score
    const finalVata = scores.vata;
    const finalPitta = scores.pitta;
    const finalKapha = scores.kapha;

    let primary: "Vata" | "Pitta" | "Kapha" = "Vata";
    let max = finalVata;

    if (finalPitta > max) {
      primary = "Pitta";
      max = finalPitta;
    }
    if (finalKapha > max) {
      primary = "Kapha";
    }

    // Set matching profile
    setProfile({
      ...mockDoshaProfiles[primary],
      scores: { vata: finalVata, pitta: finalPitta, kapha: finalKapha },
    });
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores({ vata: 0, pitta: 0, kapha: 0 });
    setIsCompleted(false);
    setProfile(null);
  };

  // Compute percentages for bar representation
  const getPercentages = () => {
    if (!profile) return { vata: 33, pitta: 33, kapha: 34 };
    const total = profile.scores.vata + profile.scores.pitta + profile.scores.kapha || 1;
    return {
      vata: Math.round((profile.scores.vata / total) * 100),
      pitta: Math.round((profile.scores.pitta / total) * 100),
      kapha: Math.round((profile.scores.kapha / total) * 100),
    };
  };

  const percentages = getPercentages();

  return (
    <div className="bg-white border border-green-100 rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto overflow-hidden relative">
      
      {/* Quiz Progress */}
      {!isCompleted && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700">
              Vedic Alignment Quiz
            </span>
            <span className="text-xs text-slate-700/80 font-mono">
              Question {currentStep + 1} of {mockDoshaQuestions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-green-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-green-700 transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep + 1) / mockDoshaQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <h3 className="font-heading font-bold text-xl text-green-900 mb-6 leading-relaxed">
            {mockDoshaQuestions[currentStep].text}
          </h3>

          {/* Answers options */}
          <div className="flex flex-col space-y-4">
            {mockDoshaQuestions[currentStep].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(option.scores)}
                className="w-full text-left p-5 rounded-2xl border border-green-100 hover:border-green-750 hover:bg-green-50/50 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 duration-200 group flex items-start space-x-3 text-slate-700 font-sans"
              >
                <div className="w-6 h-6 rounded-full border border-green-200 group-hover:border-green-700 text-xs font-bold text-slate-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-green-700 group-hover:text-cream transition-all duration-200">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm sm:text-base font-medium">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completed State */}
      {isCompleted && profile && (
        <div className="animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E8943A]">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8943A]">
              Your Primary Vedic Constitution is
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-green-900 mt-1">
              Dual-Balanced {profile.primary}
            </h2>
          </div>

          {/* Graphical Percentages */}
          <div className="bg-green-50 border border-green-100/60 p-6 rounded-2xl mb-8">
            <h4 className="text-xs font-bold text-green-900 uppercase tracking-widest mb-4">
              Your Complete Dosha Balance Profile
            </h4>
            <div className="space-y-4">
              
              {/* Vata Meter */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span>Vata (Air & Space)</span>
                  <span>{percentages.vata}%</span>
                </div>
                <div className="h-3 w-full bg-cream border border-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-1000"
                    style={{ width: `${percentages.vata}%` }}
                  />
                </div>
              </div>

              {/* Pitta Meter */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span>Pitta (Fire & Water)</span>
                  <span>{percentages.pitta}%</span>
                </div>
                <div className="h-3 w-full bg-cream border border-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-1000"
                    style={{ width: `${percentages.pitta}%` }}
                  />
                </div>
              </div>

              {/* Kapha Meter */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span>Kapha (Earth & Water)</span>
                  <span>{percentages.kapha}%</span>
                </div>
                <div className="h-3 w-full bg-cream border border-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-900 transition-all duration-1000"
                    style={{ width: `${percentages.kapha}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-heading font-bold text-lg text-green-900 mb-2">
              Understanding Your Constitution
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">
              {profile.description}
            </p>
          </div>

          {/* Features / Traits list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 border border-green-100 rounded-2xl bg-white/50">
              <h4 className="font-heading font-bold text-sm text-green-900 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                <span>Physical Traits</span>
              </h4>
              <ul className="space-y-2">
                {profile.physicalTraits.map((trait, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs leading-relaxed text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                    <span>{trait}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 border border-green-100 rounded-2xl bg-white/50">
              <h4 className="font-heading font-bold text-sm text-green-900 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                <span>Optimal Lifestyle Advice</span>
              </h4>
              <ul className="space-y-2">
                {profile.lifestyleAdvice.map((adv, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs leading-relaxed text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dietary Advice Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 bg-green-50 border border-green-100 rounded-2xl">
              <h4 className="font-heading font-bold text-sm text-green-900 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                <span>Beneficial Foods (Ojas)</span>
              </h4>
              <ul className="space-y-2">
                {profile.dietAdvice.map((food, idx) => (
                  <li key={idx} className="text-xs leading-relaxed text-slate-700 flex items-start space-x-1.5">
                    <span>•</span> <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <h4 className="font-heading font-bold text-sm text-amber-500 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                <XCircle className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                <span>Limit / Avoid (Ama Aggregating)</span>
              </h4>
              <ul className="space-y-2">
                {profile.avoidFoods.map((food, idx) => (
                  <li key={idx} className="text-xs leading-relaxed text-slate-700 flex items-start space-x-1.5 font-medium">
                    <span>•</span> <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Pathways & Action CTAs */}
          <div className="border-t border-green-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-green-700 transition-colors py-2 px-4 rounded-xl border border-green-100 hover:bg-green-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              
              <Link
                to="/courses"
                className="px-5 py-2.5 bg-green-700 hover:bg-green-500 text-cream rounded-xl text-xs font-bold uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Explore Recommended Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {onOpenConsultation && (
                <button
                  onClick={onOpenConsultation}
                  className="px-5 py-2.5 bg-cream hover:bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-colors"
                >
                  Request Consultation Analysis
                </button>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
