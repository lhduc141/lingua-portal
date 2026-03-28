import { GreenCheckIcon } from "@/components";

interface PlacementIntroViewProps {
  handleStartTest: () => void;
  handleSkip: () => void;
}

export function PlacementIntroView({ handleStartTest, handleSkip }: PlacementIntroViewProps) {
  return (
    <section className="flex min-w-[480px] flex-col items-center justify-center space-y-4 rounded-lg border bg-white p-8 text-center">
      {/*Sub section*/}
      <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-teal-100">
        <GreenCheckIcon />
      </div>
      <div className="space-y-3">
        <div className={"font-serif text-4xl text-teal-700"}>You&apos;re all set</div>
        <div className="max-w-[400px] text-center text-gray-600">
          Your learning profile is ready. Now let&apos;s find your exact English level with a quick
          adaptive test.
        </div>
      </div>

      {/*Main Button */}
      <div className="space-y-8">
        <div className="w-full min-w-[400px] space-y-6 rounded-xl bg-teal-700 p-6 text-left">
          <div>
            <div className="text-body-l font-bold text-white">Take Placement Test</div>
            <div className="text-[12px] font-normal text-white">
              ~10-15 questions · Adapts to your level · Takes 5 minutes
            </div>
          </div>
          <button
            onClick={handleStartTest}
            className="flex w-full items-center justify-center rounded-full bg-white py-3 font-bold text-teal-700"
          >
            Start Assessment
          </button>
        </div>

        <div className="w-full min-w-[400px] space-y-6 rounded-xl bg-gray-100 p-6 text-left">
          <div>
            <div className="text-body-l font-bold text-black">Take Placement Test</div>
            <div className="text-[12px] font-normal text-[#9CA3AF]">
              Go straight to your dashboard. You can take the test later.
            </div>
          </div>
          <button
            onClick={() => void handleSkip()}
            className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white py-3 text-teal-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
