import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Loader2 } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

interface AssetsTabProps {
  assets: Asset[];
  onAddAsset: (asset: Omit<Asset, 'id'>) => Promise<void>;
}

export default function InvestiZenAssets({ assets, onAddAsset }: AssetsTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      await onAddAsset({
        name: formData.name,
        type: formData.type,
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        currentPrice: parseFloat(formData.currentPrice || formData.buyPrice),
      });

      // Reset form
      setFormData({
        name: '',
        type: '',
        quantity: '',
        buyPrice: '',
        currentPrice: '',
      });
    } catch (error) {
      console.error('Failed to add asset:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Add Asset Form */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-cyan-400" />
            Add New Asset
          </CardTitle>
          <CardDescription className="text-slate-400">
            Add stocks, mutual funds, crypto, or gold to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">
                  Asset Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Reliance Industries"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-200">
                  Asset Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} required>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="Stock">Stock</SelectItem>
                    <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                    <SelectItem value="Crypto">Crypto</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-200">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyPrice" className="text-slate-200">
                  Buy Price (₹)
                </Label>
                <Input
                  id="buyPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPrice" className="text-slate-200">
                  Current Price (₹) <span className="text-slate-500 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="currentPrice"
                  type="number"
                  step="0.01"
                  placeholder="Same as buy price"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isAdding}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card className="backdrop-blur-xl bg-slate-900/60 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Your Assets</CardTitle>
          <CardDescription className="text-slate-400">
            Total: {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assets.length > 0 ? (
              assets.map((asset) => {
                const value = asset.quantity * asset.currentPrice;
                const invested = asset.quantity * asset.buyPrice;
                const pl = value - invested;
                const plPercent = (pl / invested) * 100;

                return (
                  <div
                    key={asset.id}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{asset.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">
                          {asset.type} • {asset.quantity} units
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold text-lg">{formatCurrency(value)}</div>
                        <div className={`text-sm font-medium ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pl >= 0 ? '+' : ''}{formatCurrency(pl)} ({pl >= 0 ? '+' : ''}{plPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Buy Price:</span>
                        <span className="text-white ml-2">{formatCurrency(asset.buyPrice)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Current Price:</span>
                        <span className="text-white ml-2">{formatCurrency(asset.currentPrice)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400">
                No assets yet. Add your first asset above to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
