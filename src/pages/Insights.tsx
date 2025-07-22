import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Brain, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Insights() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">AI Insights</h1>
        <p className="text-sm text-muted-foreground">Market analysis & performance metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-success/10 border-success/20">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-success">74%</div>
          <div className="text-xs text-success/80">Last 30 days</div>
        </Card>

        <Card className="p-3 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI Confidence</span>
          </div>
          <div className="text-2xl font-bold text-primary">82%</div>
          <div className="text-xs text-primary/80">Average score</div>
        </Card>
      </div>

      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          Market Sentiment Analysis
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Bullish Sentiment</span>
              <span className="text-success">65%</span>
            </div>
            <Progress value={65} className="h-2 bg-muted" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Bearish Sentiment</span>
              <span className="text-destructive">25%</span>
            </div>
            <Progress value={25} className="h-2 bg-muted" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Neutral Sentiment</span>
              <span className="text-muted-foreground">10%</span>
            </div>
            <Progress value={10} className="h-2 bg-muted" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Risk Assessment
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Portfolio Risk Level</span>
            <Badge variant="outline" className="text-warning border-warning/50">Moderate</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Market Volatility</span>
            <Badge variant="outline" className="text-destructive border-destructive/50">High</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Sector Concentration</span>
            <Badge variant="outline" className="text-success border-success/50">Low</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <h3 className="font-semibold mb-3">Recent Performance</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Signals</span>
            <span className="font-medium">47</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-success">Successful Trades</span>
            <span className="font-medium text-success">35</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-destructive">Failed Trades</span>
            <span className="font-medium text-destructive">12</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm font-medium">Net Performance</span>
            <span className="font-bold text-success">+12.4%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}