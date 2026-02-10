"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  {
    /*hero keywords */
  }
  const words = [
    "awkward money talks",
    "calculator math",
    "chasing payments",
    "receipt confusion",
  ];
  {
    /*how it works steps */
  }
  const steps = [
    {
      step: 1,
      title: "Upload Your Receipt",
      description:
        "Snap a photo or upload your bill. Our AI instantly extracts all the details needed!",
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
        "Review your split, confirm, and everyone gets notified instantly with their exact amount.",
      gradient: "from-orange-400 to-red-600",
      image: "/confirm.png",
    },
  ];
  {
    /*features */
  }
  const features = [
    {
      title: "AI Receipt Scanning",
      description:
        "Snap a photo. AI extracts details in seconds. No manual entry.",
      stat: "94% accuracy",
      image: "/ai.png",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Smart Split Options",
      description: "Split evenly or by item. Perfect for any scenario",
      stat: "Two flexible splitting options",
      image: "/options.png",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Payment Tracking",
      description:
        "See who owes what and who's paid. Mark payments and keep everyone accountable.",
      stat: "Real-time updates",
      image: "/tracking.png",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Group Management",
      description:
        "Create groups for roommates, friends, or coworkers. Perfect for rent, utilities, or weekly dinners.",
      stat: "Reuse for recurring bills",
      image: "/group-feature.png",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  {
    /*mouse move */
  }
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {/*hero section */}
      <main className="relative snap-start h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/*glowing circle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"
            style={{
              transform: `translate(${mousePosition.x - 192}px, ${
                mousePosition.y - 192
              }px)`,
            }}
          ></div>
        </div>
        {/*container */}
        <div className="relative z-10 h-full max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 h-full items-center">
            {/*left section*/}
            <div className="space-y-12 text-white">
              {/*logo*/}
              <div className="inline-block">
                <Image
                  src="/logo-main.png"
                  alt="Logo"
                  width={180}
                  height={100}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  Say goodbye to
                </h2>
                <div className="h-32 sm:h-36">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent italic">
                    <Typewriter
                      words={words}
                      loop
                      cursor
                      cursorStyle="|"
                      typeSpeed={90}
                      deleteSpeed={50}
                      delaySpeed={1800}
                    />
                  </span>
                </div>
                {/*action btns */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/auth/signup"
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl font-bold text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 overflow-hidden"
                  >
                    Split a Bill
                  </Link>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 hover:border-white/50 rounded-2xl font-bold text-lg transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
            {/*right section*/}
            <div className="relative hidden lg:block">
              {/*cards*/}
              <div className="relative h-[600px]">
                {/*receipt card*/}
                <div className="absolute top-0 left-12 w-72 bg-white rounded-3xl shadow-2xl p-6 rotate-[-8deg] hover:rotate-[-4deg] transition-all duration-500 hover:scale-105 cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <p className="font-bold text-gray-900">Vapiano Italian</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pasta</span>
                      <span className="font-semibold">$28.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pizza</span>
                      <span className="font-semibold">$32.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Beers</span>
                      <span className="font-semibold">$24.00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">$84.50</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                    <span className="font-semibold">AI Extracted ✓</span>
                  </div>
                </div>

                {/*split card*/}
                <div className="absolute top-32 right-0 w-80 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl shadow-2xl p-6 rotate-[6deg] hover:rotate-[3deg] transition-all duration-500 hover:scale-105 cursor-pointer">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <p className="font-bold">Split Comfirmed</p>
                    </div>
                    <div className="space-y-3">
                      {["Lisa", "Kim", "Harry"].map((name, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                              {name[0]}
                            </div>
                            <span className="font-medium">{name}</span>
                          </div>
                          <span className="font-bold text-lg">$28.17</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/*spending card*/}
                <div className="absolute bottom-0 left-24 w-64 bg-white rounded-3xl shadow-2xl p-6 rotate-[4deg] hover:rotate-[2deg] transition-all duration-500 hover:scale-105 cursor-pointer">
                  <p className="text-sm text-gray-500 mb-2">This Month</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    $1,450
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bills split</span>
                      <span className="font-bold">23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="container mx-auto px-6 z-10">
              <div
                className={`grid lg:grid-cols-2 gap-10 items-center ${
                  !isEven && "lg:flex-row-reverse"
                }`}
              >
                {/*image container */}
                <div className={`${!isEven && "lg:order-2"}`}>
                  {/*background container */}
                  <div
                    className={`relative bg-gradient-to-br ${step.gradient} rounded-3xl shadow-2xl p-12 aspect-square flex items-center justify-center transform hover:scale-105 transition-transform duration-300`}
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={480}
                      height={400}
                      className="rounded-3xl"
                    />
                  </div>
                </div>
                {/*content */}
                <div>
                  <div className={`space-y-6 ${!isEven && "lg:order-1"}`}>
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gray-200">
                      <span
                        className={`w-2 h-2 bg-gradient-to-r ${step.gradient} rounded-full`}
                      ></span>
                      <span className="text-sm font-bold text-gray-600">
                        STEP {step.step}
                      </span>
                    </div>
                    <h2 className="text-5xl font-bold text-gray-900 lg:leading-tight">
                      {step.title}
                    </h2>
                    <p className="text-2xl text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                    {/*progress indicator */}
                    <div className="flex items-center gap-3 pt-4">
                      {steps.map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === index
                              ? `w-12 bg-gradient-to-r ${step.gradient}`
                              : "w-2 bg-gray-300"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/*features */}
      <section className="min-h-screen snap-start bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/*header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900  px-6 py-3 rounded-full  shadow-sm text-sm text-white/90 font-bold uppercase tracking-wide">
              Features
            </span>
          </div>
          {/*features grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              return (
                <div key={index} className="group relative">
                  {/*card */}
                  <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 group-hover:border-transparent">
                    {/*gradient bar */}
                    <div
                      className={`h-2 bg-gradient-to-r ${feature.gradient}`}
                    ></div>
                    <div className="p-8 space-y-6">
                      {/*title */}
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {feature.title}
                          </h3>
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.gradient} text-white shadow-sm`}
                          >
                            {feature.stat}
                          </div>
                        </div>
                      </div>
                      {/*image */}
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={400}
                        height={400}
                        className="rounded"
                      />
                      {/*desc */}
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
