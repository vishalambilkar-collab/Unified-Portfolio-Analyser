import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { TrendingUp, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (token: string, user: { email: string; name: string }) => void;
}

export default function InvestiZenLogin({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('investizen_users') || '{}');
      
      if (isSignup) {
        // Signup logic
        if (storedUsers[email]) {
          throw new Error('Email already registered');
        }
        
        // Store new user
        storedUsers[email] = {
          email,
          password, // In production, this should be hashed
          name: name || email.split('@')[0],
        };
        localStorage.setItem('investizen_users', JSON.stringify(storedUsers));
        
        // Show success and switch to login
        setIsSignup(false);
        setError('Account created! Please login.');
        setPassword('');
      } else {
        // Login logic
        const user = storedUsers[email];
        
        if (!user || user.password !== password) {
          throw new Error('Invalid email or password');
        }
        
        // Create session token
        const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Login successful
        onLogin(token, {
          email: user.email,
          name: user.name,
        });
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
      
      <Card className="w-full max-w-md mx-4 backdrop-blur-xl bg-slate-900/80 border-slate-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              InvestiZen
            </CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Portfolio Intelligence Platform
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignup}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="mirajkarayush07@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>

            {error && (
              <div className={`text-sm p-3 rounded-lg ${error.includes('created') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>{isSignup ? 'Create Account' : 'Sign In'}</>
              )}
            </Button>

            <div className="text-center space-y-2">
              {!isSignup && (
                <button
                  type="button"
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Forgot Password?
                </button>
              )}
              
              <div className="text-sm text-slate-400">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}