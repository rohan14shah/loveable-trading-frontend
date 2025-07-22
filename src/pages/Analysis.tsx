import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  Brain,
  FileText,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import chartImage from '@/assets/stock-chart.jpg';

interface Trade {
  id: string;
  type: 'Buy' | 'Sell';
  price: number;
  timestamp: string;
  confidence: number;
  profit?: number;
}

interface AnalysisData {
  ticker: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  prediction: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  recommendation: string;
  fundamentalAnalysis: {
    sentiment: string;
    reasoning: string;
    keyInsights: string[];
  };
  recentTrades: Trade[];
  news: Array<{
    title: string;
    source: string;
    time: string;
  }>;
}

const mockData: Record<string, AnalysisData> = {
  'AAPL': {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 182.52,
    change: 2.45,
    changePercent: 1.36,
    prediction: 'Positive',
    confidence: 87,
    recommendation: 'Consider Buying - Strong fundamentals with AI momentum',
    fundamentalAnalysis: {
      sentiment: 'Bullish',
      reasoning: 'FinBERT analysis of Q4 earnings shows positive sentiment around iPhone 15 sales and Services revenue growth. 10-K filing indicates strong cash position and increased R&D spending on AI initiatives.',
      keyInsights: [
        'iPhone 15 demand exceeding expectations',
        'Services revenue growing at 16% YoY',
        'Strong cash flow supporting dividends',
        'AI integration across product lineup'
      ]
    },
    recentTrades: [
      { id: '1', type: 'Buy', price: 180.25, timestamp: '2 hours ago', confidence: 85, profit: 2.27 },
      { id: '2', type: 'Sell', price: 178.90, timestamp: '1 day ago', confidence: 78, profit: -1.35 },
      { id: '3', type: 'Buy', price: 175.40, timestamp: '3 days ago', confidence: 82, profit: 7.12 }
    ],
    news: [
      { title: 'Apple Reports Strong Q4 Results', source: 'Reuters', time: '2h ago' },
      { title: 'iPhone 15 Sales Beat Estimates', source: 'Bloomberg', time: '4h ago' },
      { title: 'Apple AI Strategy Outlined', source: 'TechCrunch', time: '6h ago' }
    ]
  }
};

export default function Analysis() {
  const { ticker } = useParams<{ ticker: string }>();
  const data = mockData[ticker || 'AAPL'] || mockData['AAPL'];

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{data.ticker}</h1>
          <p className="text-sm text-muted-foreground">{data.name}</p>
        </div>
      </div>

      {/* Price Card */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">${data.currentPrice}</div>
            <div className={`text-sm flex items-center gap-1 ${
              data.change >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {data.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant="outline" 
              className={`${
                data.prediction === 'Positive' ? 'text-success border-success/50' :
                data.prediction === 'Negative' ? 'text-destructive border-destructive/50' :
                'text-muted-foreground border-muted-foreground/50'
              } mb-2`}
            >
              {data.prediction} ({data.confidence}%)
            </Badge>
          </div>
        </div>
      </Card>

      {/* Chart */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4" />
          <h3 className="font-semibold">Price Chart</h3>
        </div>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted/20">
          <img 
            src={chartImage} 
            alt="Stock Chart" 
            className="w-full h-full object-cover"
          />
        </div>
      </Card>

      {/* Recommendation */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary mb-1">AI Recommendation</h3>
            <p className="text-sm">{data.recommendation}</p>
          </div>
        </div>
      </Card>

      {/* Recent Trades */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Recent Algorithm Trades
        </h3>
        <div className="space-y-3">
          {data.recentTrades.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={trade.type === 'Buy' ? 'default' : 'destructive'}
                  className={trade.type === 'Buy' ? 'bg-success text-success-foreground' : ''}
                >
                  {trade.type}
                </Badge>
                <div>
                  <div className="text-sm font-medium">${trade.price}</div>
                  <div className="text-xs text-muted-foreground">{trade.timestamp}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  trade.profit && trade.profit > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {trade.profit ? (trade.profit > 0 ? '+' : '') + trade.profit.toFixed(2) : '--'}
                </div>
                <div className="text-xs text-muted-foreground">{trade.confidence}% confidence</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Fundamental Analysis */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          FinBERT Fundamental Analysis
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Sentiment:</span>
              <Badge 
                variant="outline"
                className={`${
                  data.fundamentalAnalysis.sentiment === 'Bullish' ? 'text-success border-success/50' :
                  data.fundamentalAnalysis.sentiment === 'Bearish' ? 'text-destructive border-destructive/50' :
                  'text-muted-foreground border-muted-foreground/50'
                }`}
              >
                {data.fundamentalAnalysis.sentiment}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.fundamentalAnalysis.reasoning}
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Key Document Insights:</h4>
            <ul className="space-y-1">
              {data.fundamentalAnalysis.keyInsights.map((insight, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* News Section */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Related News
        </h3>
        <div className="space-y-3">
          {data.news.map((article, index) => (
            <div key={index} className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-2">{article.title}</p>
                <p className="text-xs text-muted-foreground">{article.source}</p>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {article.time}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}