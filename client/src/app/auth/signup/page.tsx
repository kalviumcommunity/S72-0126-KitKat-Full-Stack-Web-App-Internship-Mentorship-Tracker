import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center rounded-full bg-slate-900/60 px-4 py-1 border border-slate-700/70 shadow-md shadow-slate-900/50">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            <p className="text-xs font-medium tracking-wide text-slate-200">
              Unified Internship & Mentorship Portal
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Create your account
          </h2>
          <p className="text-sm text-slate-300">
            Join to apply for internships, get matched with mentors, and track progress.
          </p>
        </div>

        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-black/60 rounded-2xl p-6 sm:p-8 space-y-6">
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-200">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="block w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition"
                  placeholder="Jane"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-200">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="block w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="block text-sm font-medium text-slate-200">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition"
                defaultValue="STUDENT"
              >
                <option value="STUDENT">Student</option>
                <option value="MENTOR">Mentor</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition"
                placeholder="Create a strong password"
              />
              <p className="text-[11px] text-slate-400">
                Must be at least 8 characters and include uppercase, lowercase, and a number.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition"
                placeholder="Re-enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus-visible:ring-emerald-500"
                  required
                />
                <span>I agree to the Terms and Privacy Policy</span>
              </label>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">
                Secure • Encrypted • Private
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold shadow-lg shadow-emerald-500/30"
              size="lg"
            >
              Create account
            </Button>

            <p className="text-xs text-center text-slate-400">
              By creating an account, you agree to our {" "}
              <a href="#" className="text-emerald-400 hover:text-emerald-300">
                Terms
              </a>{" "}
              and {" "}
              <a href="#" className="text-emerald-400 hover:text-emerald-300">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-slate-300">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-medium text-emerald-400 hover:text-emerald-300"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
