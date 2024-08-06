import { NextResponse } from 'next/server';

const DEFAULT_TIMEOUT = 10000; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const timeout = parseInt(searchParams.get('timeout') ?? DEFAULT_TIMEOUT.toString(), 10);

  if (!url || typeof url !== 'string') {
    return NextResponse.json(
      { message: 'Invalid or missing URL' },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const start = performance.now();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const end = performance.now();
    const responseTime = Math.round((end - start) * 100) / 100;

    const headers = Object.fromEntries(response.headers.entries());
    const status = response.status;

    let message = getStatusMessage(status);
    let additionalInfo = {};

    if (status >= 300 && status < 400) {
      additionalInfo = { location: headers['location'] };
    }

    const resData = {
      status,
      statusText: response.statusText,
      message,
      responseTime,
      headers,
      url: response.url,
      ...additionalInfo,
    };

    return NextResponse.json(resData, { status: 200 });
  } catch (error) {
    console.error('Error performing health check:', error);

    const { errorMessage, errorStatus } = handleError(error);

    return NextResponse.json(
      {
        message: 'Health Check Failed',
        error: errorMessage,
        status: errorStatus,
      },
      { status: errorStatus }
    );
  }
}

function getStatusMessage(status: number): string {
  const statusMessages: { [key: number]: string } = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    503: 'Service Unavailable',
  };

  return statusMessages[status] || 'Unexpected Status Code';
}

function handleError(error: unknown): { errorMessage: string; errorStatus: number } {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return { errorMessage: 'Network error or CORS issue', errorStatus: 503 };
  }
  if (error instanceof DOMException && error.name === 'AbortError') {
    return { errorMessage: 'Request timed out', errorStatus: 504 };
  }
  return { errorMessage: 'Unknown error occurred', errorStatus: 500 };
}