import { NextRequest, NextResponse } from 'next/server';
import { translateSignToRegional, getLocaleForLang, type SupportedRegionalLang } from '@/utils/regionalLanguages';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8008';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetLang } = body;

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Both "text" and "targetLang" fields are required.' },
        { status: 400 }
      );
    }

    // Attempt python backend translation first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          ...data,
          source: 'python_fastapi_backend'
        });
      }
    } catch {
      // Backend not running; use internal regionalLanguages dictionary
    }

    // Local regionalLanguages lookup
    const localResult = translateSignToRegional(text, targetLang as SupportedRegionalLang);
    const bcpLocale = getLocaleForLang(targetLang as SupportedRegionalLang);

    return NextResponse.json({
      originalText: text,
      targetLang,
      translatedText: localResult.text,
      phoneticGuide: localResult.phonetic,
      bcp47Locale: bcpLocale,
      isDictionaryMatch: localResult.isDictionaryMatch,
      source: 'edge_regional_engine'
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Translation service failure.' },
      { status: 500 }
    );
  }
}
