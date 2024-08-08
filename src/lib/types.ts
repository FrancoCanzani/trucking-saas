export interface HealthCheckResponse {
  status: number;
  statusText: string;
  message: string;
  responseTime: number; // Response time in milliseconds
  headers: {
    [key: string]: string | null;
  };
  url: string;
  location?: string; // Optional, included if redirection occurred
  error?: string; // Optional, included if an error occurred
  browserInfo?: {
    name: string;
    version?: string;
  };
  performanceMetrics?: {
    [key: string]: number;
  };
}

// Adjusting and consolidating interfaces
export interface PageSpeedData {
  id: string;
  analysisUTCTimestamp: string;
  lighthouseResult: LighthouseResult;
}

export interface LighthouseResult {
  categories: {
    performance: { score: number };
    accessibility?: { score: number };
    'best-practices'?: { score: number };
    seo?: { score: number };
  };
  audits: {
    'first-contentful-paint': { numericValue: number };
    'largest-contentful-paint': { numericValue: number };
    'cumulative-layout-shift': { numericValue: number };
    interactive: { numericValue: number };
    'total-blocking-time': { numericValue: number };
    'speed-index': { numericValue: number };
  };
}

export interface FormattedPageSpeedData {
  timestamp: string;
  device: string;
  performanceScore: number;
  labMetrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    interactive: number;
    totalBlockingTime: number;
    speedIndex: number;
  };
}

export interface PageSpeedInsightsResponse {
  desktop: FormattedPageSpeedData;
  mobile: FormattedPageSpeedData;
}


export interface HealthCheck {
  id: number;
  status: number;
  response_time: number;
  checked_at: string;
}

export interface SpeedInsight {
  id: number;
  device: 'desktop' | 'mobile';
  performanceScore: number;
  labMetrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    interactive: number;
    totalBlockingTime: number;
    speedIndex: number;
  };
  checkedAt: string;
}

export interface HealthCheck {
  id: number;
  status: number;
  response_time: number;
  checked_at: string;
}

export interface Percentiles {
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface Website {
  id: number;
  user_id: string;
  url: string;
  check_interval: number;
  notify_email: string;
  created_at: string;
  updated_at: string;
  healthChecks: HealthCheck[];
  percentiles: Percentiles;
}
