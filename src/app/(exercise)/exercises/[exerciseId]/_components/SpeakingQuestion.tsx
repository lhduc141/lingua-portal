"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Loader2, Mic, RefreshCw, Square } from "lucide-react";
import type { AssessmentQuestionDto } from "@/types/dto/exercise";
import { useTranscribeAudio } from "@/hooks/exercise";

interface SpeakingQuestionProps {
  question: AssessmentQuestionDto;
  textAnswer: string;
  onAnswerChange: (text: string) => void;
}

type RecordingState = "ready" | "recording" | "transcribing" | "recorded";

export function SpeakingQuestion({ question, textAnswer, onAnswerChange }: SpeakingQuestionProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("ready");
  const [transcript, setTranscript] = useState(textAnswer);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const transcribeMutation = useTranscribeAudio();

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((t) => t.stop());

        setRecordingState("transcribing");
        transcribeMutation.mutate(audioBlob, {
          onSuccess: (data) => {
            const text = data.transcript ?? "";
            setTranscript(text);
            onAnswerChange(text);
            setRecordingState("recorded");
          },
          onError: () => {
            setRecordingState("recorded");
          },
        });
      };

      mediaRecorderRef.current.start();
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((p) => p + 1), 1000);
      setTranscript("");
      setRecordingState("recording");
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
    setTranscript("");
    setAudioUrl(null);
    setRecordingTime(0);
    onAnswerChange("");
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
          {/* READY */}
          {recordingState === "ready" && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => void handleStartRecording()}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition hover:bg-teal-700 active:scale-95"
              >
                <Mic className="h-8 w-8" />
              </button>
              <p className="text-[14px] text-gray-500">Click to start recording</p>
            </div>
          )}

          {/* RECORDING */}
          {recordingState === "recording" && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleStopRecording}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600 active:scale-95"
              >
                <Square className="h-8 w-8" />
              </button>
              <p className="font-mono text-[28px] font-bold text-teal-600">
                {formatTime(recordingTime)}
              </p>
              <p className="text-[14px] text-gray-500">Recording... Click to stop</p>
            </div>
          )}

          {/* TRANSCRIBING */}
          {recordingState === "transcribing" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
              <p className="text-[14px] font-medium text-teal-600">Transcribing your audio...</p>
              <p className="text-[12px] text-gray-400">This may take a few seconds</p>
            </div>
          )}

          {/* RECORDED */}
          {recordingState === "recorded" && (
            <div className="flex flex-col gap-4">
              {audioUrl && <audio controls src={audioUrl} className="w-full" />}

              {transcript ? (
                <div className="rounded-lg border border-teal-100 bg-white p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Transcript
                  </p>
                  <p className="text-[14px] leading-relaxed text-gray-700">{transcript}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                    <p className="text-[13px] text-amber-700">
                      Transcription failed. Please type your response below.
                    </p>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Type what you said here..."
                    className="w-full resize-none rounded-lg border border-gray-200 p-3 text-[13px] text-gray-700 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
                    onChange={(e) => {
                      setTranscript(e.target.value);
                      onAnswerChange(e.target.value);
                    }}
                  />
                </div>
              )}

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

        {/* Info */}
        <div className="mt-4 space-y-2">
          <div className="rounded-lg bg-blue-50 p-3 text-[13px] text-blue-700">
            Your response will be evaluated by AI for fluency, grammar, and vocabulary.
          </div>
          <div className="rounded-lg bg-amber-50 p-3 text-[13px] text-amber-700">
            <span className="font-semibold">Tips:</span> Speak clearly for 30–60 seconds, organize
            your thoughts, and use complete sentences.
          </div>
        </div>
      </div>
    </div>
  );
}
