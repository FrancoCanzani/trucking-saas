'use client'

import { useEffect, useState } from 'react';

export default function ScraperComponent() {
  const [content, setContent] = useState('');

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/pupeteer');
        const result = await response.text();
        setContent(result);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    }
    fetchContent();
  }, []);

  console.log(content);
  
  return (
    <div>
      <h1>Scraped Content</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
