import { PronunciationScores } from "@/types";
import { ScoreBar } from "@/app/(exercise)/exercises/[exerciseId]/result/_components/ScoreBar";
import { MessageSquare, Volume2 } from "lucide-react";

const FUNCTION_WORDS = new Set([
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "and",
  "or",
  "but",
  "at",
  "by",
  "for",
  "with",
  "on",
  "as",
  "is",
  "it",
  "its",
  "be",
  "do",
  "up",
  "so",
  "i",
  "my",
  "we",
  "he",
  "she",
  "they",
  "you",
  "me",
  "us",
  "this",
  "that",
  "these",
  "those",
  "not",
  "no",
  "nor",
  "from",
  "into",
  "than",
  "then",
  "are",
  "was",
  "were",
  "has",
  "have",
  "had",
  "will",
  "would",
  "can",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "must",
]);

interface PronunciationDetailProps {
  scores: PronunciationScores;
  onSpeak: (text: string, rate?: number) => void;
}

export function PronunciationDetail({ scores, onSpeak }: PronunciationDetailProps) {
  const problemWords = (scores.words ?? [])
    .filter(
      (w) =>
        w.errorType === "Mispronunciation" &&
        w.accuracyScore > 0 &&
        w.accuracyScore < 65 &&
        w.word.length > 2 &&
        !FUNCTION_WORDS.has(w.word.toLowerCase())
    )
    .sort((a, b) => a.accuracyScore - b.accuracyScore)
    .slice(0, 10);

  const accuracyBg = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-600 border-red-200";
  };

  return (
    <div className="space-y-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-orange-600" />
        <p className="text-[13px] font-semibold text-orange-700">Pronunciation Detail</p>
        <span className="rounded bg-orange-200 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">
          Azure Speech
        </span>
      </div>

      {/* Score bars */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreBar label="Accuracy" value={scores.accuracyScore} />
        <ScoreBar label="Fluency" value={scores.fluencyScore} />
        <ScoreBar label="Completeness" value={scores.completenessScore} />
      </div>

      {/* Problem words */}
      {problemWords.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[12px] font-semibold text-orange-700">Words to practise:</p>
          <div className="flex flex-wrap gap-2">
            {problemWords.map((word, idx) => (
              <button
                key={word.word + idx}
                onClick={() => onSpeak(word.word, 0.6)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] transition hover:shadow-sm ${accuracyBg(word.accuracyScore)}`}
              >
                <span className="font-medium">{word.word}</span>
                <Volume2 className="h-3 w-3 opacity-70" />
                <span className="font-mono text-[11px] opacity-80">{word.accuracyScore}%</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-orange-600">
            Click each word to hear the correct pronunciation.
          </p>
        </div>
      ) : (
        <p className="text-[12px] text-orange-600">
          No significant mispronunciations detected in content words.
        </p>
      )}

      <p className="text-[11px] text-orange-500">
        Estimated IELTS Pronunciation Band:{" "}
        <span className="font-semibold">{scores.estimatedBand.toFixed(1)}</span> — assessed via
        Azure Speech SDK, not official IELTS scoring.
      </p>
    </div>
  );
}
