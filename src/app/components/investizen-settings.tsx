import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Settings, Bell, Shield, Palette } from 'lucide-react';

export default function InvestiZenSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-cyan-400" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            Manage your preferences and account settings
          </p>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-cyan-400" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Portfolio Alerts</p>
                <p className="text-slate-400 text-sm">Get notified about portfolio changes</p>
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                Enabled
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Risk Warnings</p>
                <p className="text-slate-400 text-sm">Alerts for high-risk situations</p>
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                Enabled
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Insights Updates</p>
                <p className="text-slate-400 text-sm">Weekly portfolio insights</p>
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                Enabled
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-slate-400 text-sm">Add an extra layer of security</p>
              </div>
              <div className="px-3 py-1 bg-slate-600/50 text-slate-400 rounded-full text-xs font-semibold">
                Setup
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Change Password</p>
                <p className="text-slate-400 text-sm">Update your account password</p>
              </div>
              <div className="px-3 py-1 bg-slate-600/50 text-slate-400 rounded-full text-xs font-semibold">
                Update
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="h-5 w-5 text-cyan-400" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Theme</p>
                <p className="text-slate-400 text-sm">Dark mode enabled</p>
              </div>
              <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                Dark
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
