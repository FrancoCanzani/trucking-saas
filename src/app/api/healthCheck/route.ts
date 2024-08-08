import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define Zod schema for the expected parameters
const QuerySchema = z.object({
  url: z.string().url(),
  timeout: z.string().optional()
});

const DEFAULT_TIMEOUT = 10000;

// Define Zod schema for the response
const ResponseSchema = z.object({
  status: z.number(),
  responseTime: z.number(),
  date: z.string().optional()
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // Validate request parameters using Zod
    const validatedParams = QuerySchema.parse(params);

    const url = validatedParams.url;
    const timeout = validatedParams.timeout ? parseInt(validatedParams.timeout, 10) : DEFAULT_TIMEOUT;

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

    if (status > 203) {
      throw new Error(`Unexpected status code: ${status}`);
    }

    const resData = {
      status,
      responseTime,
      date: headers['date']
    };

    // Validate the response data using Zod
    const validatedResponse = ResponseSchema.parse(resData);

    return NextResponse.json(validatedResponse, { status: 200 });
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

function handleError(error: unknown): { errorMessage: string; errorStatus: number } {
  if (error instanceof z.ZodError) {
    return { errorMessage: 'Invalid input parameters', errorStatus: 400 };
  }
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return { errorMessage: 'Network error or CORS issue', errorStatus: 503 };
  }
  if (error instanceof DOMException && error.name === 'AbortError') {
    return { errorMessage: 'Request timed out', errorStatus: 504 };
  }
  if (error instanceof Error && error.message.startsWith('Unexpected status code:')) {
    return { errorMessage: error.message, errorStatus: 502 };
  }
  return { errorMessage: 'Unknown error occurred', errorStatus: 500 };
}
