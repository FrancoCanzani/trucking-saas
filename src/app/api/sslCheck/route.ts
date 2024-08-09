import { NextResponse } from 'next/server';
import { z } from 'zod';
import sslChecker from 'ssl-checker';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // Validate the host parameter
    const hostnameSchema = z.string().min(1);
    hostnameSchema.parse(params.host);

    const getSslDetails = async (hostname: string) => {
      try {
        const details = await sslChecker(hostname);
        return details;
      } catch (err) {
        if (err instanceof Error) {
          console.error(`Failed to fetch SSL details: ${err.message}`);
          throw new Error(`Failed to fetch SSL details: ${err.message}`);
        } else {
          console.error(`An unknown error occurred`);
          throw new Error(`An unknown error occurred`);
        }
      }
    };

    const sslDetails = await getSslDetails(params.host);

    return NextResponse.json(sslDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof z.ZodError ? error.errors : (error as Error).message,
      },
      { status: 400 }
    );
  }
}
