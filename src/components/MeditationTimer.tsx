import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Wind, Heart, Sparkles } from "lucide-react";

type BreathState = "Inhale" | "Hold (Full)" | "Exhale" | "Hold (Empty)";

export default function MeditationTimer() {
  const [isActive, setIsActive] = useState(false);
  const [breathState, setBreathState] = useState<BreathState>("Inhale");
  const [secondsLeft, setSecondsLeft] = useState(4); // 4 seconds per phase (Sama Vritti)
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalSessionSeconds = useRef(0);

  // Audio synthesis using Web Audio API (completely client-side, elegant harmonic drone)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(136.1, audioCtxRef.current.currentTime); // 136.1 Hz is the OM cosmic wavelength (frequency of Earth year)
      
      gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime); // Start silent

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    }
  };

  const handleToggleAudio = () => {
    initAudio();
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setAudioEnabled(!audioEnabled);
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetVolume = audioEnabled && isActive ? 0.08 : 0;
      gainNodeRef.current.gain.setTargetAtTime(targetVolume, audioCtxRef.current.currentTime, 1.5);
    }
  }, [audioEnabled, isActive]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        // Log total session time
        totalSessionSeconds.current += 1;
        setElapsedMinutes(Math.floor(totalSessionSeconds.current / 60));
        setElapsedSeconds(totalSessionSeconds.current % 60);

        // Manage Phase countdowns
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Trigger phase transition
            setBreathState((currentState) => {
              switch (currentState) {
                case "Inhale":
                  return "Hold (Full)";
                case "Hold (Full)":
                  return "Exhale";
                case "Exhale":
                  return "Hold (Empty)";
                case "Hold (Empty)":
                default:
                  return "Inhale";
              }
            });
            return 4; // Reset to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handlePlayPause = () => {
    initAudio();
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setBreathState("Inhale");
    setSecondsLeft(4);
    setElapsedMinutes(0);
    setElapsedSeconds(0);
    totalSessionSeconds.current = 0;
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    }
  };

  // Clean up audio oscillator on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Determine scaling classes based on phase states
  const getCircleScaleClass = () => {
    if (!isActive) return "scale-100 bg-green-50";
    switch (breathState) {
      case "Inhale":
        return "scale-115 bg-green-100 shadow-teal-100 shadow-2xl";
      case "Hold (Full)":
        return "scale-115 bg-green-200/80 shadow-green-200 shadow-2xl animate-pulse";
      case "Exhale":
        return "scale-90 bg-cream/70 shadow-none";
      case "Hold (Empty)":
        return "scale-90 bg-cream/90 shadow-none border-dashed border-green-300";
    }
  };

  const getBreathDirectiveInstruction = () => {
    switch (breathState) {
      case "Inhale":
        return "Draw cosmic prana slowly from the navel up to your throat...";
      case "Hold (Full)":
        return "Sustaining prana in the chest core. Still the mind, sit in ease...";
      case "Exhale":
        return "Release all thoughts, tension, and worldly distractions...";
      case "Hold (Empty)":
        return "Rest in void stillness before the cycle restarts...";
    }
  };

  return (
    <div className="bg-cream border border-green-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center max-w-md mx-auto relative overflow-hidden">
      
      {/* Decorative BG mandala */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-green-100/30 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center space-x-2 mb-2 p-1.5 px-3 bg-green-50 rounded-full border border-green-100">
        <Wind className="w-4 h-4 text-green-700 animate-pulse" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8943A]">
          Interactive Pranayama Cycle
        </span>
      </div>
      <h3 className="font-heading font-bold text-xl text-green-900 mb-1">
        Sama Vritti (Box Breathing)
      </h3>
      <p className="text-xs text-slate-700 mb-8 max-w-xs leading-relaxed">
        Balances nervous impulses, lowering adrenal fatigue in 3 minutes of rhythmic breathing.
      </p>

      {/* Visual breathing circle focus */}
      <div className="relative w-56 h-56 flex items-center justify-center mb-8">
        
        {/* Pulsing wave circles */}
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-green-100/40 animate-ping duration-1500 pointer-events-none" />
        )}
        
        {/* Main interactive expanding circle */}
        <div
          className={`w-44 h-44 rounded-full border border-green-200 flex flex-col items-center justify-center transition-all duration-4000 ease-in-out cursor-pointer select-none ${getCircleScaleClass()}`}
          onClick={handlePlayPause}
        >
          {/* Phase name */}
          <span className="text-xs text-[#E8943A] uppercase tracking-widest font-bold mb-1">
            {isActive ? breathState : "Paused"}
          </span>

          {/* Time Countdown */}
          <span className="text-4xl font-heading font-bold text-green-900">
            {isActive ? secondsLeft : "4"}s
          </span>

          {/* Prompt */}
          <span className="text-[10px] text-slate-700/80 mt-1 font-medium italic">
            {isActive ? "Release & Align" : "Tap to Begin"}
          </span>
        </div>
      </div>

      {/* Dynamic Guideline Text */}
      <div className="h-12 flex flex-col justify-center mb-6 px-4">
        <p className="text-xs text-slate-700 font-medium leading-relaxed italic transition-all duration-300">
          {isActive ? getBreathDirectiveInstruction() : "Click 'Start Sadhana' to initialize the harmonic OM drone and breathing counter."}
        </p>
      </div>

      {/* Elapsed Session Timer */}
      <div className="flex items-center space-x-1.5 text-[11px] text-slate-700 font-mono bg-white px-3 py-1 border border-green-150 rounded-full mb-8">
        <Heart className="w-3.5 h-3.5 text-[#E8943A]" />
        <span>Session Duration: {elapsedMinutes.toString().padStart(2, "0")}:{elapsedSeconds.toString().padStart(2, "0")}</span>
      </div>

      {/* Interface Actions */}
      <div className="flex items-center justify-center space-x-4 w-full">
        <button
          onClick={handleToggleAudio}
          className={`p-3 rounded-full border transition-all ${
            audioEnabled
              ? "bg-[#E8943A]/10 border-[#E8943A] text-[#E8943A]"
              : "bg-white border-green-100 text-slate-705 hover:bg-green-50"
          }`}
          title={audioEnabled ? "Mute Cosmic Drone" : "Unmute Cosmic Drone"}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={handlePlayPause}
          className="px-6 py-2.5 bg-green-700 hover:bg-green-500 text-cream rounded-full font-medium text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 text-cream" />
              <span>Pause Sadhana</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-cream text-cream" />
              <span>Start Sadhana</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-3 rounded-full bg-white border border-green-100 text-slate-705 hover:bg-green-50 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
