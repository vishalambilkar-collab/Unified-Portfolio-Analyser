import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface PortfolioTabProps {
  assets: Asset[];
}

export default function InvestiZenPortfolio({ assets }: PortfolioTabProps) {
  const totalInvestment = assets.reduce((sum, asset) => sum + asset.quantity * asset.buyPrice, 0);
  const currentValue = assets.reduce((sum, asset) => sum + asset.quantity * asset.currentPrice, 0);
  const totalPL = currentValue - totalInvestment;
  const totalPLPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;

  // Asset allocation
  const assetTypes = ['Stock', 'Mutual Fund', 'Crypto', 'Gold'];
  const allocationData = assetTypes.map((type) => {
    const typeValue = assets
      .filter((a) => a.type === type)
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
    const percentage = currentValue > 0 ? (typeValue / currentValue) * 100 : 0;
    return {
      name: type,
      value: typeValue,
      percentage,
    };
  }).filter(item => item.value > 0);

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

  // Historical growth (simulated)
  const growthData = [
    { month: 'Jan', value: totalInvestment * 0.85 },
    { month: 'Feb', value: totalInvestment * 0.9 },
    { month: 'Mar', value: totalInvestment * 0.95 },
    { month: 'Apr', value: totalInvestment * 1.0 },
    { month: 'May', value: totalInvestment * 1.05 },
    { month: 'Jun', value: currentValue },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* P&L Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm font-medium">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalInvestment)}</div>
          </CardContent>
        </Card>

        <Card className={`backdrop-blur-xl ${totalPL >= 0 ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20' : 'bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-500/20'}`}>
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm font-medium">Combined P/L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold flex items-center gap-2 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
              {formatCurrency(Math.abs(totalPL))}
            </div>
            <p className={`text-sm mt-2 ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPL >= 0 ? '+' : '-'}{Math.abs(totalPLPercent).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Breakdown */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Allocation Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div>
              {allocationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentage }) => `${percentage.toFixed(1)}%`}
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
                  No allocation data
                </div>
              )}
            </div>

            {/* Breakdown List */}
            <div className="space-y-4">
              {allocationData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-400">{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="text-right text-white font-semibold">{formatCurrency(item.value)}</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Growth */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Historical Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={growthData}>
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
                formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
