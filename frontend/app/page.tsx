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
          <div className="grid gap-12 lg:grid-cols-3">
            {/*step 1 */}
            <div className="flex flex-col items-center text-center">
              {/*frame */}
              <div
                className="w-72 h-96 bg-white rounded-2xl shadow-md 
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
                className="w-72 h-96 bg-white rounded-2xl shadow-md 
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
                className="relative w-72 h-96 bg-white rounded-2xl shadow-md 
                          flex items-center justify-center mb-6"
              >
                <Image
                  src="/view.png"
                  alt="view dashboard"
                  fill
                  className="object-contain"
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
                See who owes what and payment status at a glance on dashboard
                page
              </p>
            </div>
          </div>
        </div>
      </section>
      {/*future features */}
      <section className="w-full bg-gradient-to-br from-violet-500 to-violet-700 py-20 px-6">
        <div className="max-w-lg lg:max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            More powerful features on the way
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-12">
            We're building smarter tools to make bill sharing effortless
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Per-item split</h3>
              <p className="text-white/80 text-sm">
                Split items individually instead of evenly
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">
                Receipt-based split suggestions
              </h3>
              <p className="text-white/80 text-sm">
                Let AI suggest splits based on receipts
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Spending charts</h3>
              <p className="text-white/80 text-sm">
                Visualise your spending over time
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
