import React, { useState, useEffect } from "react";
import { getMudras } from "../services/mudraService";
import { Mudra } from "../types";
import { Flame, Wind, Globe, ShieldQuestion, HelpCircle, Check, Timer, ArrowRight, Play, Square } from "lucide-react";

export default function MudraExplorer() {
  const [mudras, setMudras] = useState<Mudra[]>([]);
  const [selectedMudra, setSelectedMudra] = useState<Mudra | null>(null);
  const [activeElementFilter, setActiveElementFilter] = useState<string>("All");
  const [stepProgress, setStepProgress] = useState<Record<string, boolean>>({});
  
  // Timer for mudra holds
  const [isHolding, setIsHolding] = useState(false);
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(300); // 5 minutes standard hold default
  const TimerIntervalRef = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getMudras().then((data) => {
      setMudras(data);
      if (data.length > 0) {
        setSelectedMudra(data[0]);
      }
    });
  }, []);

  // Filter mudras
  const filteredMudras = activeElementFilter === "All"
    ? mudras
    : mudras.filter((m) => m.element === activeElementFilter);

  const handleSelectMudra = (m: Mudra) => {
    setSelectedMudra(m);
    setStepProgress({});
    setIsHolding(false);
    setHoldSecondsLeft(300);
  };

  const toggleStepCheckbox = (index: number) => {
    if (!selectedMudra) return;
    const key = `${selectedMudra.id}-${index}`;
    setStepProgress((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Timer logic
  useEffect(() => {
    let t: any;
    if (isHolding && holdSecondsLeft > 0) {
      t = setInterval(() => {
        setHoldSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (holdSecondsLeft === 0) {
      setIsHolding(false);
      // Trigger short visual alert context
    }
    return () => clearInterval(t);
  }, [isHolding, holdSecondsLeft]);

  const toggleHoldTimer = () => {
    setIsHolding(!isHolding);
  };

  const resetHoldTimer = () => {
    setIsHolding(false);
    setHoldSecondsLeft(300);
  };

  const formatTimerValue = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const elementalIcons: Record<string, React.ReactNode> = {
    Air: <Wind className="w-3.5 h-3.5" />,
    Fire: <Flame className="w-3.5 h-3.5" />,
    Earth: <Globe className="w-3.5 h-3.5" />,
    Space: <ShieldQuestion className="w-3.5 h-3.5" />,
    All: <HelpCircle className="w-3.5 h-3.5" />
  };

  const elements = ["All", "Air", "Fire", "Earth", "Space"];

  return (
    <div className="bg-white border border-green-100 rounded-3xl p-6 sm:p-8 shadow-sm">
      
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {elements.map((el) => (
          <button
            key={el}
            onClick={() => setActiveElementFilter(el)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border tracking-wide uppercase transition-all duration-200 cursor-pointer ${
              activeElementFilter === el
                ? "bg-green-700 text-cream border-green-700 font-bold shadow-sm"
                : "bg-[#F2F9F2] text-slate-700 border-green-100/60 hover:bg-green-100"
            }`}
          >
            <div className="flex items-center space-x-1.5">
              {elementalIcons[el]}
              <span>{el} Tattva</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column - Mini directory card catalog */}
        <div className="lg:col-span-4 flex flex-col space-y-3 max-h-[500px] overflow-y-auto pr-2 border-r border-green-50">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">
            Hasta Mudra Directory ({filteredMudras.length})
          </h4>
          {filteredMudras.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelectMudra(m)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center space-x-3 group ${
                selectedMudra?.id === m.id
                  ? "bg-green-50 border-green-750/60 shadow-sm"
                  : "bg-white border-green-100 hover:bg-green-50/55"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#FAFBF7] group-hover:scale-105 border border-green-150 flex items-center justify-center text-xl shadow-sm">
                {m.image}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-heading font-semibold text-sm text-green-900 group-hover:text-green-700 truncate">
                  {m.name}
                </h5>
                <p className="text-[11px] text-slate-700 truncate">
                  {m.translation}
                </p>
              </div>
            </button>
          ))}
          {filteredMudras.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-6">
              No mudras match this filter right now. Explore other tattvas!
            </p>
          )}
        </div>

        {/* Right column - Deep mudra explorer display panel */}
        <div className="lg:col-span-8 bg-cream/35 border border-green-100/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          {selectedMudra ? (
            <div className="animate-fadeIn">
              
              {/* Header block */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-green-100 pb-5 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-green-150 flex items-center justify-center text-3xl shadow-sm shrink-0">
                    {selectedMudra.image}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A]">
                      {selectedMudra.element} Element Alignment
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-green-900">
                      {selectedMudra.name}
                    </h3>
                    <p className="text-xs text-[#E8943A] font-medium font-sans">
                      "{selectedMudra.translation}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-white px-3 py-1 border border-green-100 rounded-full text-xs font-medium text-slate-700 shrink-0">
                  <Timer className="w-3.5 h-3.5 text-[#E8943A]" />
                  <span>{selectedMudra.practiceDuration.split(" ")[0]} mins</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-755 mb-2">
                  Energetic Synthesis
                </h4>
                <p className="text-sm leading-relaxed text-slate-700">
                  {selectedMudra.description}
                </p>
              </div>

              {/* Step checklist */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-755 mb-3">
                  Align Your Fingers (Double-Tap steps to tracking progress)
                </h4>
                <div className="space-y-2.5">
                  {selectedMudra.steps.map((st, index) => {
                    const isChecked = stepProgress[`${selectedMudra.id}-${index}`] === true;
                    return (
                      <div
                        key={index}
                        onClick={() => toggleStepCheckbox(index)}
                        className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                          isChecked
                            ? "bg-green-100/50 border-green-300 text-slate-900"
                            : "bg-white border-green-100 text-slate-700 hover:border-green-300"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isChecked ? "bg-green-700 border-green-750 text-cream" : "border-green-300 bg-white"
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs leading-relaxed font-medium">
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Benefits pill items */}
              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-755 mb-3">
                  Therapeutic Benefits
                </h4>
                <div className="flex flex-col space-y-2">
                  {selectedMudra.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs leading-relaxed text-slate-700">
                      <span className="text-amber-500 font-bold shrink-0">🕉️</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sandbox Sadhana Hold Timer Widget! */}
              <div className="border-t border-green-100 pt-6 mt-6 bg-white/40 p-5 rounded-2xl border border-green-100/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-700/10 text-green-700 rounded-lg">
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-green-900 uppercase">
                        Sadhana Hold Session
                      </h5>
                      <span className="text-[10px] text-slate-700">
                        Practice holding this mudra with our audio drone or breath guide.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold font-mono text-green-950">
                      {formatTimerValue(holdSecondsLeft)}
                    </span>

                    <button
                      onClick={toggleHoldTimer}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors ${
                        isHolding
                          ? "bg-amber-500 text-cream"
                          : "bg-green-700 hover:bg-green-500 text-cream"
                      }`}
                    >
                      {isHolding ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-cream" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-cream" />
                          <span>Hold Mudra</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={resetHoldTimer}
                      className="p-2 border border-green-100 hover:bg-green-50 text-slate-700 rounded-lg text-xs"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
              <p>Select a hand mudra from the directory catalog to reveal its inner energies.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
