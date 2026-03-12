import authDecoration from "@/assets/svgs/auth-decoration.svg";
import Image from "next/image";
import { LoginGoogleAccountButton } from "@/components/shared";

import PandaIcon from "@/assets/svgs/panda-icon.svg";

export default function LoginPage() {
  return (
    <section className="flex h-screen w-full">
      {/* Left Section */}
      <section className="relative w-1/2 overflow-hidden">
        <Image src={authDecoration.src} alt="auth-decorator" className="object-cover" fill />
      </section>

      {/* Right Section */}
      <section className="flex w-1/2 flex-col items-center justify-center space-y-8">
        {/*Higher part*/}
        <div
          className="space-y-8 rounded-[20px] bg-white p-10"
          style={{
            boxShadow: "8px 8px 12px rgba(0,0,0,0.25), inset 8px 8px 12px rgba(0,0,0,0.25)",
          }}
        >
          <div
            className={
              "flex w-full flex-col items-center justify-center rounded-2xl bg-teal-100 py-6 font-serif text-[36px]"
            }
          >
            <Image src={PandaIcon} alt={"panda-icon"} />
            <div className={"text-center"}>LinguaPanda</div>
          </div>
          <div className={"text-center font-sans text-[#475569]"}>"Your English, Your Pace"</div>
          <LoginGoogleAccountButton />
        </div>

        {/*Under part*/}
        <div
          className={
            "max-w-xl flex-col items-center justify-center space-y-3 text-center text-body-m"
          }
        >
          <div className={"text-[#94A3B8]"}>
            <div>Our curriculum is aligned with the Common European Framework of</div>
            <div>
              Reference for Languages (CEFR), spanning levels{" "}
              <span className={"font-bold text-[#334155]"}>A1 to C2</span>. Begin your journey
              towards mastery today.
            </div>
          </div>
          <div className={"flex items-center justify-center space-x-8 uppercase text-[#94A3B8]"}>
            <div>Privacy</div>
            <div>Terms</div>
            <div>Help</div>
          </div>
        </div>
      </section>
    </section>
  );
}
