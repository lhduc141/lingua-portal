"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Mic, RefreshCw, Square } from "lucide-react";
import type { AssessmentQuestionDto } from "@/types/dto/exercise";

interface SpeakingQuestionProps {
  question: AssessmentQuestionDto;
  // Callback khi user hoàn tất ghi âm — truyền blob lên page để submit
  // null khi user nhấn Re-record (xóa answer)
  onAudioReady: (blob: Blob | null) => void;
}

type RecordingState = "ready" | "recording" | "recorded";

const MAX_RECORDING_SECONDS = 120;

export function SpeakingQuestion({ question, onAudioReady }: SpeakingQuestionProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("ready");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());

        // Notify parent — audio sẵn sàng để submit
        onAudioReady(blob);
        setRecordingState("recorded");
      };

      mediaRecorderRef.current.start();
      setRecordingTime(0);
      setRecordingState("recording");

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= MAX_RECORDING_SECONDS) {
            handleStopRecording();
            return prev + 1;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleReRecord = () => {
    setRecordingState("ready");
    setAudioUrl(null);
    setRecordingTime(0);
    // Xóa answer ở parent
    onAudioReady(null);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        {/* Question */}
        <div className="mb-6">
          <h2 className="mb-3 font-serif text-[24px] text-gray-900">Speaking Task</h2>
          <p className="text-[16px] leading-relaxed text-gray-600">{question.stemText}</p>
        </div>

        {/* Recording area */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-8">
          {recordingState === "ready" && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => void handleStartRecording()}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg transition hover:bg-orange-700 active:scale-95"
              >
                <Mic className="h-8 w-8" />
              </button>
              <p className="text-[14px] text-gray-500">Click to start recording</p>
            </div>
          )}

          {recordingState === "recording" && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleStopRecording}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600 active:scale-95"
              >
                <Square className="h-8 w-8" />
              </button>
              <p className="font-mono text-[28px] font-bold text-orange-600">
                {formatTime(recordingTime)}
              </p>
              <p className="text-[14px] text-gray-500">Recording... Click to stop</p>
              {recordingTime >= 90 && (
                <p className="text-[12px] text-amber-600">
                  {MAX_RECORDING_SECONDS - recordingTime}s remaining
                </p>
              )}
            </div>
          )}

          {recordingState === "recorded" && (
            <div className="flex flex-col gap-4">
              {/* Audio playback */}
              {audioUrl && <audio controls src={audioUrl} className="w-full" />}

              {/* Ready indicator */}
              <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                <p className="text-[13px] text-teal-700">
                  Recording ready. Your response will be analysed after submission.
                </p>
              </div>

              <button
                onClick={handleReRecord}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Re-record
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-4 space-y-2">
          <div className="rounded-lg bg-blue-50 p-3 text-[13px] text-blue-700">
            Your response will be evaluated for fluency, grammar, vocabulary, and pronunciation.
          </div>
          <div className="rounded-lg bg-amber-50 p-3 text-[13px] text-amber-700">
            <span className="font-semibold">Tips:</span> Speak clearly for 30–60 seconds, organise
            your thoughts, and use complete sentences.
          </div>
        </div>
      </div>
    </div>
  );
}