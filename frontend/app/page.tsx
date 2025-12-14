"use client";
import Image from "next/image";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  return (
    // <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
    <main className="min-h-screen grid lg:grid-cols-2">
      {/*left section*/}
      <div className="flex flex-col items-center justify-center bg-white px-8 text-center">
        <Image
          src="/logo.png"
          alt="App logo"
          width={200}
          height={200}
          className="mb-3"
        />
        <p className="text-xl text-gray-500 mb-3">
          make your sharing life easier
        </p>
      </div>
      {/*right section */}
      <div className=" flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 to-[#ea6149] px-8 text-white">
        <h2 className="text-2xl sm:text-3xl mb-6 text-center leading-snug ">
          Are you tired of{" "}
          <span className="italic font-semibold">
            <Typewriter
              words={[
                "calculating utility bills every month",
                "tracking who owes you money",
                "splitting bills after every hangout",
                "manually reading receipts",
              ]}
              loop
              cursor
              cursorStyle="|"
              typeSpeed={90}
              deleteSpeed={50}
              delaySpeed={1800}
            />
          </span>
          ?
        </h2>

        <div className="flex gap-4 mt-4">
          <Link
            href="/auth/signup"
            className="bg-white text-violet-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Try Billmate
          </Link>

          <Link
            href="/auth/login"
            className="border border-white px-6 py-2 rounded-full font-semibold hover:bg-white/20 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
    // </div>
  );
}
