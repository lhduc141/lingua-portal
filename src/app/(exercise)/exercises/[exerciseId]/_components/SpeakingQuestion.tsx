"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Info, Loader2, Mic, RefreshCw, Square, Volume2 } from "lucide-react";
import type { AssessmentQuestionDto } from "@/types/dto/exercise";
import type { PronunciationScores } from "@/types/dto/exercise/exercise-result.dto";
import { useTranscribeAudio } from "@/hooks/exercise";

interface SpeakingQuestionProps {
  question: AssessmentQuestionDto;
  textAnswer: string;
  onAnswerChange: (text: string) => void;
  onPronunciationScoresChange?: (scores: PronunciationScores | null) => void;
}

type RecordingState = "ready" | "recording" | "transcribing" | "recorded";

const MAX_RECORDING_SECONDS = 120;

export function SpeakingQuestion({
                                   question,
                                   textAnswer,
                                   onAnswerChange,
                                   onPronunciationScoresChange,
                                 }: SpeakingQuestionProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("ready");
  const [transcript, setTranscript] = useState(textAnswer);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [pronunciationPreview, setPronunciationPreview] = useState<PronunciationScores | null>(
    null
  );

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
            const scores = data.pronunciationScores ?? null;

            setTranscript(text);
            onAnswerChange(text);
            setPronunciationPreview(scores);
            onPronunciationScoresChange?.(scores);
            setRecordingState("recorded");
          },
          onError: (error) => {
            console.error("[Transcribe] Request failed:", error);
            setRecordingState("recorded");
          },
        });
      };

      mediaRecorderRef.current.start();
      setRecordingTime(0);
      setTranscript("");
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
    setTranscript("");
    setAudioUrl(null);
    setRecordingTime(0);
    setPronunciationPreview(null);
    onAnswerChange("");
    onPronunciationScoresChange?.(null);
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
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

          {recordingState === "transcribing" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
              <p className="text-[14px] font-medium text-orange-600">
                Transcribing and analysing pronunciation...
              </p>
              <p className="text-[12px] text-gray-400">This may take a few seconds</p>
            </div>
          )}

          {recordingState === "recorded" && (
            <div className="flex flex-col gap-4">
              {audioUrl && <audio controls src={audioUrl} className="w-full" />}

              {/* Pronunciation preview — chỉ show khi Azure trả về kết quả */}
              {pronunciationPreview && pronunciationPreview.pronComposite > 0 && (
                <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-orange-600">
                    Pronunciation Preview
                  </p>
                  <div className="flex gap-4 text-[13px] text-gray-700">
                    <span>
                      Accuracy:{" "}
                      <span className="font-semibold text-orange-700">
                        {pronunciationPreview.accuracyScore}%
                      </span>
                    </span>
                    <span>
                      Fluency:{" "}
                      <span className="font-semibold text-orange-700">
                        {pronunciationPreview.fluencyScore}%
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {transcript && !pronunciationPreview && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Info className="h-4 w-4 shrink-0 text-gray-400" />
                  <p className="text-[12px] text-gray-500">
                    Pronunciation analysis unavailable for this recording. Your transcript will still be graded.
                  </p>
                </div>
              )}

              {transcript ? (
                <div className="rounded-lg border border-teal-100 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Transcript
                    </p>
                    <button
                      onClick={() => speakText(transcript)}
                      className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-teal-600"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Listen
                    </button>
                  </div>
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