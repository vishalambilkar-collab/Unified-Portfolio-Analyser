import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Mail, Calendar, TrendingUp } from 'lucide-react';

interface ProfileTabProps {
  user: {
    name: string;
    email: string;
  };
}

export default function InvestiZenProfile({ user }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white mb-1">{user.name}</CardTitle>
              <p className="text-cyan-400 font-medium">Portfolio Investor</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User Information */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
              <Mail className="h-5 w-5 text-cyan-400" />
              <div className="flex-1">
                <p className="text-slate-400 text-sm">Email Address</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
              <Calendar className="h-5 w-5 text-cyan-400" />
              <div className="flex-1">
                <p className="text-slate-400 text-sm">Member Since</p>
                <p className="text-white font-medium">January 2024</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <div className="flex-1">
                <p className="text-slate-400 text-sm">Investor Type</p>
                <p className="text-white font-medium">Active Trader</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Features */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Platform Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Portfolio Analytics</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Risk Analysis</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Smart Insights</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Real-time Alerts</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About InvestiZen */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">About InvestiZen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 leading-relaxed">
            InvestiZen is your comprehensive portfolio intelligence platform. We help you track, 
            analyze, and optimize your investments across stocks, mutual funds, cryptocurrencies, 
            and precious metals. Our smart analytics and risk management tools empower you to make 
            informed investment decisions.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-sm">Version 1.0.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
