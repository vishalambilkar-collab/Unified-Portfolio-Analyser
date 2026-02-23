import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, TrendingDown, PieChart, AlertCircle } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface InsightsTabProps {
  assets: Asset[];
}

export default function InvestiZenInsights({ assets }: InsightsTabProps) {
  const currentValue = assets.reduce((sum, asset) => sum + asset.quantity * asset.currentPrice, 0);
  const totalInvestment = assets.reduce((sum, asset) => sum + asset.quantity * asset.buyPrice, 0);

  // Calculate insights
  const cryptoValue = assets
    .filter((a) => a.type === 'Crypto')
    .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const cryptoPercent = currentValue > 0 ? (cryptoValue / currentValue) * 100 : 0;

  const stockValue = assets
    .filter((a) => a.type === 'Stock')
    .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const stockPercent = currentValue > 0 ? (stockValue / currentValue) * 100 : 0;

  // Loss-making assets
  const lossMakingAssets = assets.filter((a) => a.currentPrice < a.buyPrice);
  const totalLoss = lossMakingAssets.reduce(
    (sum, a) => sum + (a.quantity * (a.buyPrice - a.currentPrice)),
    0
  );
  const lossContribution = totalInvestment > 0 ? (totalLoss / totalInvestment) * 100 : 0;

  // Top loss contributor
  const topLossAsset = lossMakingAssets.sort((a, b) => {
    const lossA = a.quantity * (a.buyPrice - a.currentPrice);
    const lossB = b.quantity * (b.buyPrice - b.currentPrice);
    return lossB - lossA;
  })[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const insights = [
    {
      id: 1,
      type: 'diversification',
      icon: PieChart,
      color: 'cyan',
      title: 'Portfolio Diversification',
      message: assets.length < 5
        ? 'Consider adding more assets for better diversification. Aim for at least 5-10 different holdings.'
        : 'Good diversification with multiple asset types. Continue monitoring allocation balance.',
      severity: assets.length < 5 ? 'warning' : 'success',
    },
    {
      id: 2,
      type: 'crypto-exposure',
      icon: AlertCircle,
      color: 'yellow',
      title: 'Cryptocurrency Exposure',
      message: cryptoPercent > 30
        ? `High crypto exposure at ${cryptoPercent.toFixed(1)}%. Consider reducing to below 20% for better risk management.`
        : cryptoPercent > 15
        ? `Moderate crypto exposure at ${cryptoPercent.toFixed(1)}%. Monitor volatility closely.`
        : cryptoPercent > 0
        ? `Crypto exposure at ${cryptoPercent.toFixed(1)}% is within recommended limits.`
        : 'No cryptocurrency exposure. Consider small allocation for growth potential.',
      severity: cryptoPercent > 30 ? 'critical' : cryptoPercent > 15 ? 'warning' : 'info',
    },
    {
      id: 3,
      type: 'sector-concentration',
      icon: TrendingDown,
      color: 'purple',
      title: 'Sector Concentration',
      message: stockPercent > 60
        ? `Stock concentration is high at ${stockPercent.toFixed(1)}%. Consider diversifying into mutual funds or gold.`
        : 'Stock allocation appears balanced. Maintain diversification across sectors.',
      severity: stockPercent > 60 ? 'warning' : 'success',
    },
  ];

  if (topLossAsset) {
    insights.push({
      id: 4,
      type: 'exit-alert',
      icon: TrendingDown,
      color: 'red',
      title: 'Exit Alert',
      message: `"${topLossAsset.name}" contributes ${((topLossAsset.quantity * (topLossAsset.buyPrice - topLossAsset.currentPrice) / totalLoss) * 100).toFixed(1)}% of your total loss. Consider reviewing this position.`,
      severity: 'critical',
    });
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      default:
        return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
    }
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      cyan: 'text-cyan-400',
      yellow: 'text-yellow-400',
      purple: 'text-purple-400',
      red: 'text-red-400',
      green: 'text-green-400',
    };
    return colors[color] || 'text-cyan-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-cyan-400" />
            Smart Portfolio Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            AI-powered recommendations to optimize your portfolio performance and manage risk effectively.
          </p>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <Card
              key={insight.id}
              className={`backdrop-blur-xl border ${getSeverityStyles(insight.severity)}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-slate-800/50 ${getIconColor(insight.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{insight.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
              <p className="text-slate-300">
                <span className="text-white font-semibold">Maintain diversification</span> across at least 4-5 asset classes 
                to reduce overall portfolio risk.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
              <p className="text-slate-300">
                <span className="text-white font-semibold">Keep high-risk assets (crypto)</span> below 20% of total portfolio 
                for long-term stability.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
              <p className="text-slate-300">
                <span className="text-white font-semibold">Allocate 10-15% to safe haven assets</span> like gold or bonds 
                for portfolio stability during market downturns.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
              <p className="text-slate-300">
                <span className="text-white font-semibold">Review and rebalance</span> your portfolio quarterly 
                to maintain target allocation percentages.
              </p>
            </div>
            {lossMakingAssets.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2"></div>
                <p className="text-slate-300">
                  <span className="text-red-400 font-semibold">Exit underperforming assets:</span> Consider exiting 
                  assets that have been consistently losing value to prevent further losses.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
