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
        "Snap a photo. AI extracts items, totals, and merchant name in seconds. No manual entry.",
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
      image: "/group.png",
      gradient: "from-emerald-500 to-teal-600",
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
                  <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl font-bold text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 overflow-hidden">
                    Split a Bill
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>

                  <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 hover:border-white/50 rounded-2xl font-bold text-lg transition-all duration-300">
                    Sign In
                  </button>
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
