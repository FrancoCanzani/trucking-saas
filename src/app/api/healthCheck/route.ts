import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || typeof url !== 'string') {
    return NextResponse.json(
      { message: 'Invalid or missing URL' },
      { status: 400 }
    );
  }

  try {
    // Measure the start time
    const start = performance.now();

    // Perform the health check
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Measure the end time
    const end = performance.now();
    const responseTime = end - start;
    const roundedResponseTime = Math.round(responseTime * 100) / 100;

    const headers = response.headers;

    let status = response.status;
    let message = '';
    let additionalInfo = {};

    switch (true) {
      case status >= 200 && status < 300:
        message = 'OK';
        break;
      case status >= 300 && status < 400:
        message = 'Redirection';
        additionalInfo = { location: headers.get('location') };
        break;
      case status === 400:
        message = 'Bad Request';
        break;
      case status === 401:
        message = 'Unauthorized';
        break;
      case status === 403:
        message = 'Forbidden';
        break;
      case status === 404:
        message = 'Not Found';
        break;
      case status === 500:
        message = 'Internal Server Error';
        break;
      case status === 503:
        message = 'Service Unavailable';
        break;
      default:
        message = 'Unexpected Status Code';
    }

    const resData = {
      status: status,
      statusText: response.statusText,
      message: message,
      responseTime: roundedResponseTime,
      headers: {
        'content-type': headers.get('content-type'),
        date: headers.get('date'),
        link: headers.get('link'),
        server: headers.get('server'),
        'x-powered-by': headers.get('x-powered-by'),
      },
      url: response.url,
      ...additionalInfo,
    };

    return NextResponse.json(resData, { status: 200 });
  } catch (error) {
    console.error('Error performing health check:', error);

    let errorMessage = 'Unknown error occurred';
    let errorStatus = 500;

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Network error or CORS issue';
      errorStatus = 503;
    }

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
