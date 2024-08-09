import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setGeolocation({ latitude: 37.7749, longitude: -122.4194 }); // San Francisco

    await page.goto('https://example.com');
    const content = await page.content();

    await browser.close();
    return new NextResponse(content, { status: 200 });
  } catch (error) {
    console.error(error)
  }
}
