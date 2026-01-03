// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     setLoading(false);

//     if (res.ok) {
//       const data = await res.json();

//       // store JWT
//       localStorage.setItem("token", data.token);

//       router.push("/dashboard");
//     } else {
//       const data = await res.json();
//       alert(data.error || "Login failed");
//     }
//   }

//   return (
//     <main style={{ maxWidth: 400, margin: "100px auto" }}>
//       <h2>Login</h2>

//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </main>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Shield, Mail, Lock, ArrowRight } from "lucide-react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleLogin() {
//     setLoading(true);

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     setLoading(false);

//     if (res.ok) {
//       const data = await res.json();
//       localStorage.setItem("token", data.token);
//       // Add router.push("/dashboard") after importing useRouter
//     } else {
//       const data = await res.json();
//       alert(data.error || "Login failed");
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
//       <div className="relative w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
//             <Shield className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">FraudGuard</h1>
//           <p className="text-slate-400">AI-Powered Fraud Prevention</p>
//         </div>

//         <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
//             <p className="text-slate-400">Sign in to access your account</p>
//           </div>

//           <div className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="email"
//                   placeholder="soham23@ok.com"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="password"
//                   placeholder="••••••••"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center text-slate-300 cursor-pointer">
//                 <input type="checkbox" className="mr-2 rounded border-slate-600 bg-slate-900" />
//                 Remember me
//               </label>
//               <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
//                 Forgot password?
//               </a>
//             </div>

//             <button
//               onClick={handleLogin}
//               disabled={loading}
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
//             >
//               {loading ? (
//                 "Signing in..."
//               ) : (
//                 <>
//                   Login
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </div>

//           <div className="mt-6 text-center text-slate-400">
//             Don't have an account?{" "}
//             <a href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
//               Sign up
//             </a>
//           </div>
//         </div>

//         <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-sm">
//           <div className="flex items-center gap-2">
//             <Shield className="w-4 h-4 text-blue-400" />
//             <span>Secure Login</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Lock className="w-4 h-4 text-blue-400" />
//             <span>Encrypted</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      const data = await res.json();
      alert(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FraudGuard</h1>
          <p className="text-slate-400">AI-Powered Fraud Prevention</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to access your account</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="soham23@ok.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-300 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-slate-600 bg-slate-900" />
                Remember me
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-slate-400">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign up
            </a>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}