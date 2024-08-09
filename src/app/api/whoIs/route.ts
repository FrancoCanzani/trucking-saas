import { NextResponse } from 'next/server';
import { z } from 'zod';
const whois = require('whois-json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const data = await whois(params.host);
    console.log(data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof z.ZodError ? error.errors : (error as Error).message,
      },
      { status: 400 }
    );
  }
}
