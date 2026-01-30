// // app/register/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Mail, Lock, User, Briefcase, Loader2 } from "lucide-react";
// import toast from "react-hot-toast";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user");
//   const [isLoading, setIsLoading] = useState(false);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ name, email, password, role }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error(data?.error || "Something went wrong. Please try again.");
//         return;
//       }

//       toast.success("Account created successfully! Please log in.");
//       router.push("/login");
//     } catch (err) {
//       toast.error("Network error. Please check your connection and try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-bold text-gray-900">JobPortal</h1>
//           <p className="text-gray-600 mt-2">
//             Join thousands finding their dream job
//           </p>
//         </div>

//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-8">
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
//             Create your account
//           </h2>
//           <p className="text-center text-gray-600 mb-8">
//             Start your journey today
//           </p>

//           <form onSubmit={submit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="John Doe"
//                   className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Create a strong password"
//                   minLength={6}
//                   className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 I am signing up as
//               </label>
//               <div className="grid grid-cols-2 gap-4">
//                 <label
//                   className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
//                     role === "user"
//                       ? "border-blue-600 bg-blue-50 shadow-md"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                 >
//                   <Briefcase className="w-10 h-10 mb-3 text-blue-600" />
//                   <span className="font-medium text-gray-800">Job Seeker</span>
//                   <span className="text-sm text-gray-600 mt-1">
//                     Looking for jobs
//                   </span>
//                   <input
//                     type="radio"
//                     name="role"
//                     value="user"
//                     checked={role === "user"}
//                     onChange={(e) => setRole(e.target.value)}
//                     className="sr-only"
//                   />
//                 </label>

//                 <label
//                   className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
//                     role === "recruiter"
//                       ? "border-green-600 bg-green-50 shadow-md"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                 >
//                   <svg
//                     className="w-10 h-10 mb-3 text-green-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                     />
//                   </svg>
//                   <span className="font-medium text-gray-800">Recruiter</span>
//                   <span className="text-sm text-gray-600 mt-1">
//                     Hiring talent
//                   </span>
//                   <input
//                     type="radio"
//                     name="role"
//                     value="recruiter"
//                     checked={role === "recruiter"}
//                     onChange={(e) => setRole(e.target.value)}
//                     className="sr-only"
//                   />
//                 </label>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   Creating Account...
//                 </span>
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//           </form>

//           <p className="text-center mt-8 text-gray-600">
//             Already have an account?{" "}
//             <a
//               href="/login"
//               className="text-blue-600 font-semibold hover:underline"
//             >
//               Log in
//             </a>
//           </p>

//           <div className="mt-8 flex items-center gap-4">
//             <div className="flex-1 h-px bg-gray-300"></div>
//             <span className="text-sm text-gray-500">or</span>
//             <div className="flex-1 h-px bg-gray-300"></div>
//           </div>

//           <button className="mt-6 w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-3">
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.94 3.28-5.09 3.28-8.09z"
//               />
//               <path
//                 fill="#34A853"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="#EA4335"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//             Continue with Google
//           </button>
//         </div>

//         <p className="text-center text-gray-500 text-sm mt-8">
//           By creating an account, you agree to our{" "}
//           <a href="#" className="underline">
//             Terms of Service
//           </a>{" "}
//           and{" "}
//           <a href="#" className="underline">
//             Privacy Policy
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast"; // or use react-hot-toast if preferred
import { Users } from "lucide-react"; // Add this to your existing imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for Google signup
  const handleGoogleSignup = () => {
    toast("Google signup coming soon!");
    // toast.info("Google signup coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Sign up as</Label>
              <RadioGroup
                value={role}
                onValueChange={setRole}
                disabled={isLoading}
              >
                <div className="grid grid-cols-2 gap-3">
                  {/* Job Seeker - Blue Theme */}
                  <Label
                    htmlFor="user"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 dark:[&:has([data-state=checked])]:bg-blue-950/30"
                  >
                    <RadioGroupItem
                      value="user"
                      id="user"
                      className="sr-only"
                    />
                    <User className="mb-2 h-8 w-8 text-blue-600 [&[data-state=checked]_&]:text-blue-600" />
                    <span className="font-medium">Job Seeker</span>
                    <span className="text-xs text-muted-foreground">
                      Looking for jobs
                    </span>
                  </Label>

                  {/* Recruiter - Green Theme */}
                  <Label
                    htmlFor="recruiter"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all [&:has([data-state=checked])]:border-green-600 [&:has([data-state=checked])]:bg-green-50 dark:[&:has([data-state=checked])]:bg-green-950/30"
                  >
                    <RadioGroupItem
                      value="recruiter"
                      id="recruiter"
                      className="sr-only"
                    />
                    <Users className="mb-2 h-8 w-8 text-green-600" />
                    <span className="font-medium">Recruiter</span>
                    <span className="text-xs text-muted-foreground">
                      Hiring talent
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{" "}
            <Button
              variant="link"
              className="px-1 font-medium text-blue-600"
              onClick={() => router.push("/login")}
            >
              Log in
            </Button>
          </p>

          <p className="text-center text-xs text-muted-foreground px-8">
            By signing up, you agree to our{" "}
            <Button variant="link" className="px-1 text-xs underline">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="px-1 text-xs underline">
              Privacy Policy
            </Button>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
