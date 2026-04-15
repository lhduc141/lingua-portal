"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, RefreshCw, Square } from "lucide-react";
import type { AssessmentQuestionDto } from "@/types/dto/exercise";

interface SpeakingQuestionProps {
  question: AssessmentQuestionDto;
  textAnswer: string;
  onAnswerChange: (text: string) => void;
}

type RecordingState = "ready" | "recording" | "recorded";

export function SpeakingQuestion({ question, textAnswer, onAnswerChange }: SpeakingQuestionProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("ready");
  const [transcript, setTranscript] = useState(textAnswer);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          if (finalTranscript) {
            setTranscript((prev) => prev + finalTranscript);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();

      // Start Speech Recognition
      if (recognitionRef.current) {
        setTranscript("");
        recognitionRef.current.start();
      }

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      setRecordingState("recording");
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Save transcript to answer
    // onAnswerChange(transcript);
    recognitionRef.current.stop();
    setRecordingState("recorded");
  };

  // Re-record
  const handleReRecord = () => {
    setRecordingState("ready");
    setTranscript("");
    setAudioUrl(null);
    setRecordingTime(0);
    onAnswerChange("");
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        {/* Question */}
        <div className="mb-6">
          <h3 className="mb-3 font-serif text-h2 text-gray-900">Speaking Task</h3>
          <p className="text-body-l text-gray-700">{question.stemText}</p>
        </div>

        {/* Recording controls */}
        <div className="mb-6 flex flex-col items-center justify-center gap-4 rounded-lg bg-gray-50 py-12">
          {recordingState === "ready" && (
            <>
              <button
                onClick={handleStartRecording}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-600 transition-transform hover:scale-105 hover:bg-teal-700"
              >
                <Mic className="h-10 w-10 text-white" />
              </button>
              <p className="text-body-m text-gray-600">Click to start recording</p>
            </>
          )}

          {recordingState === "recording" && (
            <>
              <button
                onClick={handleStopRecording}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 transition-transform hover:scale-105 hover:bg-red-700"
              >
                <Square className="h-8 w-8 text-white" />
              </button>
              <p className="font-mono text-h2 text-teal-600">{formatTime(recordingTime)}</p>
              <p className="text-body-m text-gray-600">Recording... Click to stop</p>
            </>
          )}

          {recordingState === "recorded" && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Mic className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-body-m font-medium text-green-600">
                Recording completed ({formatTime(recordingTime)})
              </p>
            </>
          )}
        </div>

        {/* Transcript (read-only khi recorded) */}
        {recordingState === "recorded" && transcript && (
          <div className="mb-6">
            <h4 className="mb-2 text-body-m font-semibold text-gray-900">Transcript</h4>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-body-l text-gray-700">{transcript}</p>
            </div>
          </div>
        )}

        {/* Audio playback */}
        {recordingState === "recorded" && audioUrl && (
          <div className="mb-6">
            <h4 className="mb-2 text-body-m font-semibold text-gray-900">Playback</h4>
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}

        {/* Re-record button */}
        {recordingState === "recorded" && (
          <div className="flex justify-center">
            <button
              onClick={handleReRecord}
              className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-2 text-body-m font-medium text-gray-700 transition-colors hover:border-gray-400"
            >
              <RefreshCw className="h-4 w-4" />
              Re-record
            </button>
          </div>
        )}

        {/* AI Notice */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-body-m text-blue-900">
            This response will be evaluated by AI for pronunciation, fluency, grammar, and
            vocabulary.
          </p>
        </div>

        {/* Tips */}
        <div className="mt-4 rounded-lg bg-amber-50 p-4">
          <p className="text-body-m text-amber-900">
            <span className="font-semibold">Tips:</span> Speak clearly for 15-30 seconds, organize
            your thoughts, and use complete sentences.
          </p>
        </div>
      </div>
    </div>
  );
}
