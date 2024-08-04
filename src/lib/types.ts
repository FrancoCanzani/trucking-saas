export interface HealthCheckResponse {
  status: number;
  statusText: string;
  message: string;
  responseTime: number; // Response time in milliseconds
  headers: {
    'content-type': string | null;
    date: string | null;
    link: string | null;
    server: string | null;
    'x-powered-by': string | null;
  };
  url: string;
  location?: string; // Optional, included if redirection occurred
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

export interface PageSpeedData {
  id: string;
  analysisUTCTimestamp: string;
  lighthouseResult: LighthouseResult;
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

export interface HealthCheck {
  id: number;
  status: number;
  response_time: number;
  checked_at: string;
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
}
