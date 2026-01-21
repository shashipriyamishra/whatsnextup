"use client"

import { loginWithGoogle } from "../lib/auth"
import { useState } from "react"

export default function LoginScreen() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/90 px-4 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full text-center pt-8">
        {/* Decorative top element */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4 mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
            What's Next Up
          </h1>
          <p className="text-white/80 text-base font-medium tracking-widest uppercase">
            Your Personal AI Planning Companion
          </p>
        </div>

        {/* Main Description Card */}
        <div className="space-y-10 mb-16">
          <div className="group px-8 py-8 rounded-3xl bg-gradient-to-br from-white/10 to-purple-500/10 border border-purple-500/30 hover:border-pink-500/50 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-pink-500/20 hover:shadow-2xl">
            <p className="text-lg leading-relaxed font-semibold text-white">
              <span className="text-pink-400 font-bold">
                Planning is hard.
              </span>
              {" "}But with{" "}
              <span className="text-pink-300 font-bold">intelligent</span>{" "}
              AI guidance, you can make better decisions{" "}
              <span className="text-purple-300 font-bold">instantly</span>.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 hover:border-pink-400/60 hover:from-purple-500/30 hover:to-pink-500/20 transition-all duration-300 backdrop-blur-sm cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
              <div className="text-5xl transform group-hover:scale-125 transition-transform duration-300">
                💡
              </div>
              <p className="text-purple-300 text-xs font-bold tracking-widest uppercase">
                Smart
              </p>
              <p className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                AI-powered insights
              </p>
            </div>
            <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 hover:border-pink-400/60 hover:from-purple-500/30 hover:to-pink-500/20 transition-all duration-300 backdrop-blur-sm cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
              <div className="text-5xl transform group-hover:scale-125 transition-transform duration-300">
                🔒
              </div>
              <p className="text-purple-300 text-xs font-bold tracking-widest uppercase">
                Private
              </p>
              <p className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Your data, yours alone
              </p>
            </div>
            <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 hover:border-pink-400/60 hover:from-purple-500/30 hover:to-pink-500/20 transition-all duration-300 backdrop-blur-sm cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
              <div className="text-5xl transform group-hover:scale-125 transition-transform duration-300">
                ⚡
              </div>
              <p className="text-purple-300 text-xs font-bold tracking-widest uppercase">
                Fast
              </p>
              <p className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Instant responses
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 mb-12">
          <button
            onClick={loginWithGoogle}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="w-full group relative px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 overflow-hidden shadow-2xl hover:shadow-pink-500/70 bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3 text-white font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </span>
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-500/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-slate-950 text-purple-300 text-xs font-medium">
                OR
              </span>
            </div>
          </div>

          <p className="text-white/60 text-xs font-medium">
            ✨ No credit card • 100% Private • Unsubscribe anytime
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="pt-12 border-t border-purple-500/30">
          <h3 className="text-white font-bold text-xs mb-6 uppercase tracking-widest">
            Why Choose What's Next Up?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-500/30 hover:border-pink-400/60 hover:shadow-lg hover:shadow-pink-500/20 transition-all group">
              <div className="text-pink-400 font-black text-lg">✨</div>
              <span className="text-white text-sm font-semibold">
                Stop overthinking, start planning with clarity
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-500/30 hover:border-pink-400/60 hover:shadow-lg hover:shadow-pink-500/20 transition-all group">
              <div className="text-pink-400 font-black text-lg">🎯</div>
              <span className="text-white text-sm font-semibold">
                Get AI insights tailored to your goals
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-500/30 hover:border-pink-400/60 hover:shadow-lg hover:shadow-pink-500/20 transition-all group">
              <div className="text-pink-400 font-black text-lg">💪</div>
              <span className="text-white text-sm font-semibold">
                Make decisions you'll be proud of
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 8s infinite;
        }
      `}</style>
    </div>
  )
}
