import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface DashboardProps {
  assets: Asset[];
}

export default function InvestiZenDashboard({ assets }: DashboardProps) {
  // Calculate portfolio metrics
  const totalInvestment = assets.reduce((sum, asset) => sum + asset.quantity * asset.buyPrice, 0);
  const currentValue = assets.reduce((sum, asset) => sum + asset.quantity * asset.currentPrice, 0);
  const totalPL = currentValue - totalInvestment;
  const totalPLPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;

  // Calculate risk level
  const getRiskLevel = () => {
    const cryptoValue = assets
      .filter((a) => a.type === 'Crypto')
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
    const cryptoPercent = currentValue > 0 ? (cryptoValue / currentValue) * 100 : 0;

    if (cryptoPercent > 30) return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (cryptoPercent > 15) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/10' };
  };

  const riskLevel = getRiskLevel();

  // Portfolio performance data (simulated historical data)
  const performanceData = [
    { month: 'Jan', value: totalInvestment * 0.85 },
    { month: 'Feb', value: totalInvestment * 0.9 },
    { month: 'Mar', value: totalInvestment * 0.95 },
    { month: 'Apr', value: totalInvestment * 1.0 },
    { month: 'May', value: totalInvestment * 1.05 },
    { month: 'Jun', value: currentValue },
  ];

  // Asset allocation data
  const assetTypes = ['Stock', 'Mutual Fund', 'Crypto', 'Gold'];
  const allocationData = assetTypes.map((type) => {
    const typeValue = assets
      .filter((a) => a.type === type)
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
    return {
      name: type,
      value: typeValue,
    };
  }).filter(item => item.value > 0);

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

  // P/L by asset type
  const plByTypeData = assetTypes.map((type) => {
    const typeAssets = assets.filter((a) => a.type === type);
    const invested = typeAssets.reduce((sum, a) => sum + a.quantity * a.buyPrice, 0);
    const current = typeAssets.reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
    return {
      name: type,
      pl: current - invested,
    };
  }).filter(item => Math.abs(item.pl) > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">Total Wealth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(currentValue)}</div>
            <p className="text-xs text-slate-400 mt-2">
              Invested: {formatCurrency(totalInvestment)}
            </p>
          </CardContent>
        </Card>

        <Card className={`backdrop-blur-xl ${totalPL >= 0 ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20' : 'bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-500/20'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">Total P/L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold flex items-center gap-2 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
              {formatCurrency(Math.abs(totalPL))}
            </div>
            <p className={`text-xs mt-2 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : '-'}{Math.abs(totalPLPercent).toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className={`backdrop-blur-xl border ${riskLevel.bg} border-opacity-20`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold flex items-center gap-2 ${riskLevel.color}`}>
              <AlertTriangle className="h-6 w-6" />
              {riskLevel.level}
            </div>
            <p className="text-xs text-slate-400 mt-2">Based on portfolio allocation</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance */}
        <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e1e7ef' }}
                  formatter={(value: number) => [formatCurrency(value), 'Value']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {allocationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No assets to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* P/L by Asset Type */}
        <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Profit/Loss by Asset Type</CardTitle>
          </CardHeader>
          <CardContent>
            {plByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={plByTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e1e7ef' }}
                    formatter={(value: number) => [formatCurrency(value), 'P/L']}
                  />
                  <Bar dataKey="pl" radius={[8, 8, 0, 0]}>
                    {plByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pl >= 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No P/L data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Asset Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Current Value</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">P/L %</th>
                </tr>
              </thead>
              <tbody>
                {assets.length > 0 ? (
                  assets.map((asset) => {
                    const pl = ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
                    const value = asset.quantity * asset.currentPrice;
                    return (
                      <tr key={asset.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="py-3 px-4 text-white font-medium">{asset.name}</td>
                        <td className="py-3 px-4 text-slate-300">{asset.type}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{asset.quantity}</td>
                        <td className="py-3 px-4 text-right text-white font-medium">
                          {formatCurrency(value)}
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pl >= 0 ? '+' : ''}{pl.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No holdings yet. Add assets to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
