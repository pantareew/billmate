"use client";
import Image from "next/image";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  return (
    <div>
      {/*hero section */}
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
          <p className="text-xl text-gray-400 mb-3">
            sharing expenses made simple
          </p>
        </div>
        {/*right section */}
        <div className=" flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 to-[#ea6149] px-8 text-white">
          <h2 className="text-2xl sm:text-3xl mb-6 text-center leading-snug ">
            Say goodbye to{" "}
            <span className="italic font-semibold">
              <Typewriter
                words={[
                  "splitting bills manually",
                  "tracking debts in chats",
                  "doing post-hangout math",
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
          </h2>
          {/*action buttons */}
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
      {/*how it works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            How it works
          </h2>
          {/*steps */}
          <div className="grid gap-12 md:grid-cols-3">
            {/*step 1 */}
            <div className="flex flex-col items-center text-center">
              {/*frame */}
              <div
                className="w-70 h-96 bg-white rounded-2xl shadow-md 
                          flex items-center justify-center mb-6"
              >
                <Image
                  src="/upload.png"
                  alt="upload and extract receipt"
                  width={400}
                  height={380}
                />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-7 h-7 rounded-full bg-violet-600 text-white 
                 text-sm font-semibold flex items-center justify-center"
                >
                  1
                </span>
                <h3 className="font-semibold text-lg text-gray-900">
                  Upload a bill
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                Our AI reads and extracts merchant name and totals from your
                bill
              </p>
            </div>

            {/*step 2 */}
            <div className="flex flex-col items-center text-center">
              {/*frame */}
              <div
                className="w-70 h-96 bg-white rounded-2xl shadow-md 
                          flex items-center justify-center mb-6"
              >
                <Image
                  src="/group.png"
                  alt="group and member selection"
                  width={400}
                  height={350}
                />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-7 h-7 rounded-full bg-violet-600 text-white 
                 text-sm font-semibold flex items-center justify-center"
                >
                  2
                </span>

                <h3 className="font-semibold text-lg text-gray-900">
                  Choose your group
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                Select the group and members involved in the bill
              </p>
            </div>

            {/*step 3 */}
            <div className="flex flex-col items-center text-center">
              {/*frame */}
              <div
                className="w-70 h-96 bg-white rounded-2xl shadow-md 
                          flex items-center justify-center mb-6"
              >
                <Image
                  src="/view.png"
                  alt="view dashboard"
                  width={300}
                  height={300}
                />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-7 h-7 rounded-full bg-violet-600 text-white 
                 text-sm font-semibold flex items-center justify-center"
                >
                  3
                </span>

                <h3 className="font-semibold text-lg text-gray-900">
                  Track payments
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                See who owes what and payment status at a glance
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
