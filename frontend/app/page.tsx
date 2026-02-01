"use client";
import Image from "next/image";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const steps = [
    {
      step: 1,
      title: "Upload Your Receipt",
      desc: "Snap a photo or upload your bill. Our AI instantly extracts all the details needed!",
      gradient: "from-blue-500 to-violet-600",
      image: "/upload.png",
    },
    {
      step: 2,
      title: "Select Your Group",
      description:
        "Choose who's splitting the bill. Create groups for friends, roommates, or coworkers.",
      gradient: "from-purple-500 to-pink-600",
      image: "/group.png",
    },
    {
      step: 3,
      title: "Done! Everyone Gets Notified",
      description:
        "Review your split, confirm, and everyone gets notified instantly with their exact amount. No more chasing payments.",
      gradient: "from-orange-400 to-red-600",
      image: "/confirm.png",
    },
  ];
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/*hero section */}
      <main className="h-screen snap-start grid lg:grid-cols-2 overflow-hidden">
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
      {/*steps */}
      {steps.map((step, index) => {
        const isEven = index % 2 === 0;
        return (
          <section
            key={step.step}
            className={`h-screen snap-start flex items-center justify-center bg-gradient-to-br ${
              isEven ? "from-white to-blue-50" : "from-blue-50 to-indigo-50"
            } relative overflow-hidden`}
          >
            {/*background */}
            <div className="absolute inset-0 opacity-10">
              <div
                className={`absolute ${
                  isEven ? "top-10 right-10" : "bottom-10 left-10"
                } w-96 h-96 bg-gradient-to-r ${
                  step.gradient
                } rounded-full blur-3xl`}
              ></div>
            </div>
            <div className="container mx-auto px-6 z-10">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  !isEven && "lg:flex-row-reverse"
                }`}
              >
                {/*image */}
                <div className={`${!isEven && "lg:order-2"}`}>
                  <div
                    className={`relative bg-gradient-to-br ${step.gradient} rounded-3xl shadow-2xl p-12 aspect-square flex items-center justify-center transform hover:scale-105 transition-transform duration-300`}
                  >
                    <Image
                      src={step.image}
                      alt="upload and extract receipt"
                      width={480}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="h-screen snap-start bg-gradient-to-br from-violet-400 to-indigo-700 py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          {/* heading */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">
            See Billmate in action
          </h2>
          <p className="text-white/80 text-center max-w-xl">
            Watch our founder walk you through how to streamline your billing
            instantly
          </p>
          {/* video */}
          <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
            <video
              src="/demo.mp4"
              controls
              muted
              playsInline
              poster="/thumbnail.png"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>
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
            {/*feature 1 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Per-item split</h3>
              <p className="text-white/80 text-sm">
                Split items individually instead of evenly
              </p>
            </div>

            {/*feature 2 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">
                Receipt-based split suggestions
              </h3>
              <p className="text-white/80 text-sm">
                Let AI suggest splits based on receipts
              </p>
            </div>

            {/*feature 3 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Spending charts</h3>
              <p className="text-white/80 text-sm">
                Visualise your spending over time
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-50 border-t py-4 px-6 text-sm text-gray-500 text-center">
        <p>
          © {new Date().getFullYear()} Billmate. All rights reserved. Follow us
          on{" "}
          <a
            href="http://linkedin.com/company/billmateandmore/about/"
            className="text-violet-500 hover:text-violet-600"
          >
            Linkedin
          </a>
        </p>
      </footer>
    </div>
  );
}
