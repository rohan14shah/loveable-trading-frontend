import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Alert {
  id: string;
  ticker: string;
  signalType: 'Buy' | 'Sell';
  confidence: number;
  triggerTime: string;
  signalName: string;
  price: number;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    ticker: 'AAPL',
    signalType: 'Buy',
    confidence: 85,
    triggerTime: '2 min ago',
    signalName: 'Smart MCDX Golden Cross',
    price: 182.52
  },
  {
    id: '2',
    ticker: 'TSLA',
    signalType: 'Sell',
    confidence: 78,
    triggerTime: '5 min ago',
    signalName: 'Resistance Breakout Failed',
    price: 248.87
  },
  {
    id: '3',
    ticker: 'NVDA',
    signalType: 'Buy',
    confidence: 92,
    triggerTime: '12 min ago',
    signalName: 'Support Trendline Bounce',
    price: 875.34
  },
  {
    id: '4',
    ticker: 'AMZN',
    signalType: 'Sell',
    confidence: 71,
    triggerTime: '18 min ago',
    signalName: 'Volume Divergence',
    price: 145.67
  },
  {
    id: '5',
    ticker: 'MSFT',
    signalType: 'Buy',
    confidence: 83,
    triggerTime: '25 min ago',
    signalName: 'Smart MCDX Signal',
    price: 415.28
  }
];

export default function Notifications() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trading Alerts</h1>
          <p className="text-sm text-muted-foreground">Real-time technical signals</p>
        </div>
        <Badge variant="outline" className="text-primary">
          {mockAlerts.length} Active
        </Badge>
      </div>

      <div className="space-y-3">
        {mockAlerts.map((alert) => (
          <Link key={alert.id} to={`/analysis/${alert.ticker}`}>
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{alert.ticker}</span>
                    {alert.signalType === 'Buy' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <Badge 
                      variant={alert.signalType === 'Buy' ? 'default' : 'destructive'}
                      className={alert.signalType === 'Buy' ? 'bg-success text-success-foreground' : ''}
                    >
                      {alert.signalType}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium mb-1">{alert.signalName}</p>
                  <p className="text-sm text-muted-foreground">Price: ${alert.price}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <span className="text-xs font-medium">{alert.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{alert.triggerTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full ${alert.signalType === 'Buy' ? 'bg-success' : 'bg-destructive'} animate-pulse`}></div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}