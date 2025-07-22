import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stock {
  ticker: string;
  name: string;
  prediction: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  sparklineData: number[];
}

const mockStocks: Stock[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    prediction: 'Positive',
    confidence: 87,
    currentPrice: 182.52,
    change: 2.45,
    changePercent: 1.36,
    sparklineData: [178, 180, 179, 181, 183, 182, 183]
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    prediction: 'Neutral',
    confidence: 64,
    currentPrice: 248.87,
    change: -3.21,
    changePercent: -1.27,
    sparklineData: [252, 250, 251, 249, 248, 250, 249]
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    prediction: 'Positive',
    confidence: 92,
    currentPrice: 875.34,
    change: 12.45,
    changePercent: 1.44,
    sparklineData: [860, 865, 870, 875, 872, 878, 875]
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    prediction: 'Negative',
    confidence: 78,
    currentPrice: 145.67,
    change: -2.89,
    changePercent: -1.94,
    sparklineData: [149, 148, 147, 146, 145, 146, 146]
  }
];

const getPredictionColor = (prediction: string) => {
  switch (prediction) {
    case 'Positive': return 'text-success';
    case 'Negative': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
};

const getPredictionIcon = (prediction: string) => {
  switch (prediction) {
    case 'Positive': return <TrendingUp className="h-4 w-4 text-success" />;
    case 'Negative': return <TrendingDown className="h-4 w-4 text-destructive" />;
    default: return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const Sparkline = ({ data }: { data: number[] }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1] > data[0];
  
  return (
    <svg width="60" height="20" className="opacity-80">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function Watchlist() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Watchlist</h1>
          <p className="text-sm text-muted-foreground">Powered by FinBERT sentiment analysis</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {mockStocks.map((stock) => (
          <Link key={stock.ticker} to={`/analysis/${stock.ticker}`}>
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{stock.ticker}</span>
                    {getPredictionIcon(stock.prediction)}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getPredictionColor(stock.prediction)}`}
                    >
                      {stock.prediction}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <span className="text-xs font-medium">{stock.confidence}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold">${stock.currentPrice}</div>
                  <div className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Sparkline data={stock.sparklineData} />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}