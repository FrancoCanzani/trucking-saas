import { NextRequest, NextResponse } from 'next/server';
import { PageSpeedData, FormattedPageSpeedData } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const strategy = searchParams.get('strategy') || 'both'; // 'both' to handle both mobile and desktop

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.SPEED_INSIGHTS_API_KEY;

  async function getPageSpeedInfo(
    url: string,
    strategy: string
  ): Promise<PageSpeedData> {
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&key=${apiKey}&strategy=${strategy}`;
    const response = await fetch(pageSpeedUrl);
    const data: PageSpeedData = await response.json();
    if (data.lighthouseResult === undefined) {
      throw new Error('Invalid response from PageSpeed Insights API');
    }
    return data;
  }

  function formatPageSpeedData(
    data: PageSpeedData,
    deviceType: string
  ): FormattedPageSpeedData {
    const { lighthouseResult } = data;

    return {
      timestamp: new Date().toISOString(),
      device: deviceType,
      performanceScore: lighthouseResult.categories.performance.score * 100,
      labMetrics: {
        firstContentfulPaint:
          lighthouseResult.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint:
          lighthouseResult.audits['largest-contentful-paint'].numericValue,
        cumulativeLayoutShift:
          lighthouseResult.audits['cumulative-layout-shift'].numericValue,
        interactive: lighthouseResult.audits.interactive.numericValue,
        totalBlockingTime:
          lighthouseResult.audits['total-blocking-time'].numericValue,
        speedIndex: lighthouseResult.audits['speed-index'].numericValue,
      },
    };
  }

  try {
    const results: { [key: string]: FormattedPageSpeedData } = {};

    if (strategy === 'both' || strategy === 'desktop') {
      const desktopData = await getPageSpeedInfo(url, 'desktop');
      results.desktop = formatPageSpeedData(desktopData, 'desktop');
    }

    if (strategy === 'both' || strategy === 'mobile') {
      const mobileData = await getPageSpeedInfo(url, 'mobile');
      results.mobile = formatPageSpeedData(mobileData, 'mobile');
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching PageSpeed Insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PageSpeed Insights' },
      { status: 500 }
    );
  }
}
