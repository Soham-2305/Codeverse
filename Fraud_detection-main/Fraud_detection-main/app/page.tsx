// import { StatCards } from "@/components/dashboard/stat-cards"
// import { RiskTimeline } from "@/components/dashboard/risk-timeline"
// import { RecentAlerts } from "@/components/dashboard/recent-alerts"
// import dbConnect from "@/lib/db"
// import Transaction from "@/models/Transaction"
// import Alert from "@/models/Alert"

// async function getDashboardData() {
//   await dbConnect()

//   const [transactions, alerts] = await Promise.all([
//     Transaction.find().sort({ createdAt: -1 }).limit(50).lean(),
//     Alert.find().sort({ createdAt: -1 }).limit(5).lean(),
//   ])

//   const stats = {
//     total: await Transaction.countDocuments(),
//     fraud: await Transaction.countDocuments({ decision: "BLOCK" }),
//     flagged: await Transaction.countDocuments({ decision: "FLAG" }),
//     avgRisk: 0,
//   }

//   if (stats.total > 0) {
//     const avgRiskResult = await Transaction.aggregate([{ $group: { _id: null, avgRisk: { $avg: "$riskScore" } } }])
//     stats.avgRisk = avgRiskResult[0]?.avgRisk || 0
//   }

//   // Formatting timeline data
//   const timelineData = transactions
//     .map((t: any) => ({
//       timestamp: t.createdAt,
//       riskScore: t.riskScore,
//     }))
//     .reverse()

//   return { stats, alerts, timelineData }
// }

// export default async function DashboardPage() {
//   const { stats, alerts, timelineData } = await getDashboardData()

//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Fraud Detection Dashboard</h2>
//       </div>

//       <StatCards total={stats.total} fraud={stats.fraud} flagged={stats.flagged} avgRisk={stats.avgRisk} />

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         <RiskTimeline data={timelineData} />
//         <RecentAlerts alerts={alerts} />
//       </div>
//     </div>
//   )
// }

'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  LayoutDashboard,
  Send,
  History,
  Brain,
  Zap,
  Lock,
  Activity,
  ArrowRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">

      {/* --- Navbar --- */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#1e2746] p-1.5 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1e2746]">FraudGuard</span>
        </div>

        <Link href="/auth/login" className="flex items-center gap-2 bg-[#1e2746] text-white px-4 py-2 rounded-lg hover:bg-[#2d3a66] transition">
          <LayoutDashboard className="w-4 h-4" />
          Login/Signup
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">

        {/* --- Hero Section --- */}
        <section className="relative bg-[#1a233a] rounded-[2.5rem] p-12 md:p-16 overflow-hidden shadow-xl text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">
              <ShieldCheck className="w-4 h-4" />
              <span>AI-Powered Fraud Prevention</span>
            </div>

            <AnimatedHeading
              text="Real-Time Credit Card"
              className="text-5xl md:text-6xl font-bold leading-tight"
            />
            <AnimatedHeading
              text="Fraud Detection"
              className="text-5xl md:text-6xl font-bold leading-tight text-[#3b82f6]"
              from={{ opacity: 0, y: 80 }}
              to={{ opacity: 1, y: 0 }}
              delay={30}
              duration={1.6}
              stagger={0.04}
            />

            <p className="text-gray-300 text-lg max-w-lg">
              Protect your transactions with our advanced AI system. Get instant risk assessments and keep your money safe.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-blue-500/30">
                <Send className="w-4 h-4" />
                Send Money
              </button>
              <button className="flex items-center gap-2 bg-transparent border border-gray-500 hover:bg-white/5 text-white px-8 py-3.5 rounded-xl font-medium transition">
                <History className="w-4 h-4" />
                View Transactions
              </button>
            </div>
          </div>
        </section>

        {/* --- Stats Grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard value="99.7%" label="Detection Accuracy" />
          <StatCard value="<2s" label="Analysis Time" />
          <StatCard value="10M+" label="Transactions Protected" />
          <StatCard value="24/7" label="Real-time Monitoring" />
        </section>

        {/* --- Features Section --- */}
        <section className="py-8">
          <div className="text-center mb-12 space-y-2">
            <AnimatedHeading
              text="How We Protect You"
              tag="h2"
              className="text-3xl font-bold text-[#1e2746]"
              splitType="words"
              from={{ opacity: 0, y: 50 }}
              threshold={0.3}
            />
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our multi-layered security system uses cutting-edge technology to keep your money safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-blue-600" />}
              title="AI-Powered Detection"
              desc="Advanced machine learning algorithms analyze transactions in real-time to identify suspicious patterns."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-blue-600" />}
              title="Instant Analysis"
              desc="Get fraud risk assessments within seconds. Every transaction is evaluated instantly."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-blue-600" />}
              title="Multi-Layer Security"
              desc="Multiple security checkpoints ensure your transactions are protected at every step."
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-blue-600" />}
              title="Behavioral Analysis"
              desc="Our system learns your transaction patterns to better identify anomalies and potential threats."
            />
          </div>
        </section>

        {/* --- Footer CTA --- */}
        <section className="text-center py-12 space-y-6">
          <h3 className="text-xl font-semibold text-[#1e2746]">
            Ready to make a secure transaction?
          </h3>
          <button className="inline-flex items-center gap-2 bg-[#1e2746] hover:bg-[#2d3a66] text-white px-8 py-3 rounded-xl font-semibold transition">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

      </main>
    </div>
  );
}

// Reusable AnimatedHeading component
const AnimatedHeading: React.FC<{
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  delay?: number; // ms between each element
  duration?: number;
  stagger?: number; // additional stagger multiplier
  threshold?: number; // 0-1, higher = trigger earlier
}> = ({
  text,
  className = '',
  tag: Tag = 'h1',
  splitType = 'chars',
  from = { opacity: 0, y: 60 },
  to = { opacity: 1, y: 0 },
  delay = 40,
  duration = 1.4,
  stagger = 0.03,
  threshold = 0.2,
}) => {
    const ref = React.useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
      if (!ref.current) return;

      if (!ref.current) return;

      gsap.fromTo(
        ref.current,
        from,
        {
          ...to,
          duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: `top ${85 + (1 - threshold) * 15}%`,
            once: true,
          },
        }
      );
    }, { scope: ref, dependencies: [text] });

    return (
      <Tag ref={ref} className={`split-parent ${className}`}>
        {text}
      </Tag>
    );
  };

// --- Helper Components ---
const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition">
    <span className="text-4xl font-bold text-[#3b82f6] mb-2">{value}</span>
    <span className="text-sm text-gray-500 font-medium">{label}</span>
  </div>
);

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col items-start text-left h-full">
    <div className="bg-blue-50 p-3 rounded-lg mb-4">
      {icon}
    </div>
    <h4 className="text-lg font-bold text-[#1e2746] mb-2">{title}</h4>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

//page.tsx