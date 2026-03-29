import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Navigation } from 'lucide-react';

interface SignInProps {
  onSignIn: (email: string) => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignIn(email);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-200"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Navigation className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Sign In</h2>
            <p className="text-slate-500 font-medium">Access your NavSight account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                required
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-6 h-6" />
            Sign In
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Sign Up</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
