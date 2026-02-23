import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, ShieldAlert, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface RiskAnalysisTabProps {
  assets: Asset[];
}

export default function InvestiZenRiskAnalysis({ assets }: RiskAnalysisTabProps) {
  const currentValue = assets.reduce((sum, asset) => sum + asset.quantity * asset.currentPrice, 0);
  
  // Calculate risk metrics
  const cryptoValue = assets
    .filter((a) => a.type === 'Crypto')
    .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const cryptoPercent = currentValue > 0 ? (cryptoValue / currentValue) * 100 : 0;

  const stockValue = assets
    .filter((a) => a.type === 'Stock')
    .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const stockPercent = currentValue > 0 ? (stockValue / currentValue) * 100 : 0;

  // Risk score calculation
  const calculateRiskScore = () => {
    let score = 0;
    if (cryptoPercent > 30) score += 40;
    else if (cryptoPercent > 15) score += 20;
    else score += 10;

    if (stockPercent > 60) score += 30;
    else if (stockPercent > 40) score += 15;
    else score += 5;

    const lossMakingAssets = assets.filter(a => a.currentPrice < a.buyPrice);
    score += Math.min(lossMakingAssets.length * 10, 30);

    return Math.min(score, 100);
  };

  const riskScore = calculateRiskScore();

  const getRiskLevel = () => {
    if (riskScore >= 70) return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (riskScore >= 40) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const riskLevel = getRiskLevel();

  // Sector concentration (simulated)
  const sectorData = [
    { name: 'Technology', value: 35, color: '#06b6d4' },
    { name: 'Finance', value: 25, color: '#8b5cf6' },
    { name: 'Healthcare', value: 20, color: '#10b981' },
    { name: 'Others', value: 20, color: '#f59e0b' },
  ];

  // Loss-making assets
  const lossMakingAssets = assets.filter((a) => a.currentPrice < a.buyPrice);
  const totalLoss = lossMakingAssets.reduce(
    (sum, a) => sum + (a.quantity * (a.buyPrice - a.currentPrice)),
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <Card className={`backdrop-blur-xl border ${riskLevel.bg} border-opacity-20`}>
        <CardHeader>
          <CardTitle className="text-white">Portfolio Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-6xl font-bold ${riskLevel.color}`}>{riskScore}</div>
              <div className={`text-xl font-semibold mt-2 ${riskLevel.color}`}>{riskLevel.level} Risk</div>
            </div>
            <div className={`p-6 rounded-full ${riskLevel.bg}`}>
              <ShieldAlert className={`h-16 w-16 ${riskLevel.color}`} />
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${riskScore >= 70 ? 'bg-red-500' : riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Crypto Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${cryptoPercent > 30 ? 'text-red-400' : cryptoPercent > 15 ? 'text-yellow-400' : 'text-green-400'}`}>
              {cryptoPercent.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {cryptoPercent > 30 ? 'High risk - Consider reducing' : cryptoPercent > 15 ? 'Moderate exposure' : 'Within safe limits'}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Loss-Making Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{lossMakingAssets.length}</div>
            <p className="text-xs text-slate-500 mt-2">
              Total Loss: {formatCurrency(totalLoss)}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Stock Concentration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stockPercent > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
              {stockPercent.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {stockPercent > 60 ? 'High concentration' : 'Well diversified'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sector Concentration */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Sector Concentration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {sectorData.map((sector) => (
                <div key={sector.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                    <span className="text-white">{sector.name}</span>
                  </div>
                  <span className="text-slate-400 font-semibold">{sector.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High-Risk Holdings */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            High-Risk Holdings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lossMakingAssets.length > 0 ? (
              lossMakingAssets.map((asset) => {
                const loss = asset.quantity * (asset.buyPrice - asset.currentPrice);
                const lossPercent = ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
                return (
                  <div key={asset.id} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-400" />
                          {asset.name}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">{asset.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-red-400 font-semibold">-{formatCurrency(loss)}</div>
                        <div className="text-red-400 text-sm">{lossPercent.toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-green-400">
                ✓ No loss-making assets. Portfolio is performing well!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Over-exposure Warnings */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Over-Exposure Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cryptoPercent > 30 && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-semibold">High Crypto Exposure</h4>
                  <p className="text-slate-300 text-sm mt-1">
                    Your cryptocurrency allocation is {cryptoPercent.toFixed(1)}%, which is considered high risk. 
                    Consider reducing to below 20%.
                  </p>
                </div>
              </div>
            )}
            {stockPercent > 60 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-semibold">Stock Concentration</h4>
                  <p className="text-slate-300 text-sm mt-1">
                    {stockPercent.toFixed(1)}% of your portfolio is in stocks. Consider diversifying into other asset classes.
                  </p>
                </div>
              </div>
            )}
            {cryptoPercent <= 30 && stockPercent <= 60 && (
              <div className="text-center py-8 text-green-400">
                ✓ No major over-exposure detected. Portfolio is well balanced!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
