import { NextResponse } from 'next/server';
import { z } from 'zod';
const whois = require('whois'); // or import whois from 'whois' if you use ES modules

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const host = params.host;

    if (!host) {
      throw new Error('Host is required');
    }

    // Perform WHOIS lookup
    const data = await new Promise((resolve, reject) => {
      whois.lookup(host, (err: any, data: any) => {
        if (err) reject(err);
        resolve(data);
      });
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof z.ZodError ? error.errors : (error as Error).message,
      },
      { status: 400 }
    );
  }
}
