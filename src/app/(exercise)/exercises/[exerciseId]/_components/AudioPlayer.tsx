"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Headphones, Pause, Play } from "lucide-react";
import { cn } from "@/lib";

interface AudioPlayerProps {
  audioUrl: string;
  transcript?: string | null;
  title?: string | null;
}

export function AudioPlayer({ audioUrl, transcript, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      void audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mx-auto mb-6 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Headphones className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            Listening
          </p>
          {title && <p className="truncate text-[14px] font-semibold text-gray-900">{title}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayPause}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all active:scale-95",
            isPlaying
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-emerald-600 hover:bg-emerald-700"
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-white" />
          ) : (
            <Play className="h-4 w-4 fill-white" />
          )}
        </button>

        <div className="flex flex-1 flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600"
            style={{
              background: `linear-gradient(to right, #059669 ${progress}%, #a7f3d0 ${progress}%)`,
            }}
          />
          <div className="flex justify-between text-[11px] text-emerald-700">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>
      </div>

      {transcript && (
        <div className="mt-3 border-t border-emerald-200 pt-3">
          <button
            onClick={() => setShowTranscript((p) => !p)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 hover:text-emerald-900"
          >
            {showTranscript ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>

          {showTranscript && (
            <div className="mt-3 max-h-48 overflow-y-auto rounded-lg bg-white p-4 text-[13px] leading-relaxed text-gray-700">
              {transcript.split("\n").map((line, i) => (
                <p
                  key={i}
                  className={cn("mb-1", line.startsWith("A:") ? "text-gray-900" : "text-gray-700")}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
