import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bell, AlertTriangle, TrendingDown, PieChart } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface AlertsTabProps {
  assets: Asset[];
}

export default function InvestiZenAlerts({ assets }: AlertsTabProps) {
  const currentValue = assets.reduce((sum, asset) => sum + asset.quantity * asset.currentPrice, 0);
  
  const cryptoValue = assets
    .filter((a) => a.type === 'Crypto')
    .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const cryptoPercent = currentValue > 0 ? (cryptoValue / currentValue) * 100 : 0;

  const stockValue = assets
    .filter((a) => a.type === 'Stock')
    .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const stockPercent = currentValue > 0 ? (stockValue / currentValue) * 100 : 0;

  const lossMakingAssets = assets.filter((a) => a.currentPrice < a.buyPrice);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const alerts = [];

  // Risk alerts
  if (cryptoPercent > 30) {
    alerts.push({
      id: 'crypto-risk',
      type: 'Risk Alert',
      severity: 'high',
      icon: AlertTriangle,
      title: 'High Cryptocurrency Risk',
      message: `Your crypto exposure is ${cryptoPercent.toFixed(1)}%, significantly above the recommended 20% limit. This increases portfolio volatility.`,
      timestamp: new Date().toISOString(),
    });
  }

  if (stockPercent > 70) {
    alerts.push({
      id: 'stock-concentration',
      type: 'Risk Alert',
      severity: 'medium',
      icon: AlertTriangle,
      title: 'High Stock Concentration',
      message: `${stockPercent.toFixed(1)}% of your portfolio is in stocks. Consider diversifying to reduce market risk.`,
      timestamp: new Date().toISOString(),
    });
  }

  // Loss alerts
  lossMakingAssets.forEach((asset) => {
    const loss = asset.quantity * (asset.buyPrice - asset.currentPrice);
    const lossPercent = ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
    
    if (Math.abs(lossPercent) > 10) {
      alerts.push({
        id: `loss-${asset.id}`,
        type: 'Loss Alert',
        severity: Math.abs(lossPercent) > 20 ? 'high' : 'medium',
        icon: TrendingDown,
        title: `${asset.name} Down ${Math.abs(lossPercent).toFixed(1)}%`,
        message: `${asset.name} has declined ${Math.abs(lossPercent).toFixed(1)}% from your buy price. Current loss: ${formatCurrency(loss)}`,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Imbalance alerts
  const assetTypes = ['Stock', 'Mutual Fund', 'Crypto', 'Gold'];
  const allocationMap: Record<string, number> = {};
  assetTypes.forEach((type) => {
    const typeValue = assets
      .filter((a) => a.type === type)
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
    allocationMap[type] = currentValue > 0 ? (typeValue / currentValue) * 100 : 0;
  });

  const maxAllocation = Math.max(...Object.values(allocationMap));
  const dominantType = Object.entries(allocationMap).find(([, value]) => value === maxAllocation)?.[0];

  if (maxAllocation > 60 && dominantType) {
    alerts.push({
      id: 'imbalance',
      type: 'Imbalance Alert',
      severity: 'medium',
      icon: PieChart,
      title: 'Portfolio Imbalance Detected',
      message: `${dominantType} represents ${maxAllocation.toFixed(1)}% of your portfolio. A more balanced allocation is recommended.`,
      timestamp: new Date().toISOString(),
    });
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          border: 'border-red-500/30',
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          badge: 'bg-red-500/20 text-red-400',
        };
      case 'medium':
        return {
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400',
          badge: 'bg-yellow-500/20 text-yellow-400',
        };
      default:
        return {
          border: 'border-cyan-500/30',
          bg: 'bg-cyan-500/10',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/20 text-cyan-400',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-cyan-400" />
            Portfolio Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-slate-300">
              {alerts.length} active {alerts.length === 1 ? 'alert' : 'alerts'} require your attention
            </p>
            <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold">
              {alerts.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            const styles = getSeverityStyles(alert.severity);
            
            return (
              <Card
                key={alert.id}
                className={`backdrop-blur-xl border ${styles.border} ${styles.bg}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-slate-800/50 ${styles.text}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-white font-semibold text-lg">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${styles.badge}`}>
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed mb-3">{alert.message}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(alert.timestamp).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
                <Bell className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">All Clear!</h3>
              <p className="text-slate-400">
                No alerts at the moment. Your portfolio looks good!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
