import { NextResponse } from 'next/server';
import { GESTURE_MAP, GESTURE_LIST } from '@/utils/fingerGestures';
import { ISL_MAP } from '@/utils/islGestures';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8008';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(`${BACKEND_URL}/api/signs`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        ...data,
        source: 'python_fastapi_backend',
        islCatalog: Object.values(ISL_MAP).map(item => ({
          id: item.id,
          label: item.label,
          phrase: item.phrase,
          isUtility: item.isUtility,
        })),
      });
    }
  } catch {
    // Backend offline; return static catalog
  }

  return NextResponse.json({
    total_classes: 30,
    supported_letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    special_controls: {
      '1': 'Back Space',
      '2': 'Clear',
      '3': 'Space',
      '4': 'None'
    },
    custom_gestures: Object.values(GESTURE_MAP).map(g => ({
      id: g.id,
      label: g.label,
      emoji: g.emoji,
      description: g.description,
    })),
    islCatalog: Object.values(ISL_MAP).map(item => ({
      id: item.id,
      label: item.label,
      phrase: item.phrase,
      isUtility: item.isUtility,
    })),
    source: 'edge_static_catalog'
  });
}
