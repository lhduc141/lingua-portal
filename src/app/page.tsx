import Image from "next/image";
import GetStartedButton from "@/components/shared/auth/GetStartedButton";

export default function LandingPage() {
  return (
    <div className={"bg-teal-800"}>
      {/*Header - Navigation*/}
      <section className={"flex w-screen items-center justify-between bg-teal-50 px-6 py-5"}>
        <div className={"flex items-center space-x-2"}>
          <Image
            src={"/icons/icon.svg"}
            height={25}
            width={25}
            alt="logo"
            className={"h-[41px] w-[41px] rounded-lg bg-teal-100 p-2"}
          />
          <p className={"font-serif text-2xl"}>LinguaPanda</p>
        </div>

        {/*Navigation*/}
        <div className={"flex items-center space-x-8 text-[14px]"}>
          <button>Features</button>
          <button>How it works</button>
        </div>

        <div className={"flex items-center space-x-8 text-[14px]"}>
          <button className={"font-sans font-bold"}>Sign In</button>
          <GetStartedButton />
        </div>
      </section>

      {/*Introduction Information*/}
      <section>
        <section className={"text-teal-800"}></section>
      </section>
    </div>
  );
}
