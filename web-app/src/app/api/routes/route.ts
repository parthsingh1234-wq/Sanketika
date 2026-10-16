import { NextResponse } from 'next/server';

export async function GET() {
  const routes = [
    {
      path: '/',
      name: 'Home',
      title: 'Sanketika (संकेतिका) - Accessible Sign AI & Inclusive Services',
      description: 'Landing page featuring Assistive Technology suite, regional language preview, and core architectural capabilities.',
      badge: 'Public'
    },
    {
      path: '/live',
      name: 'Live Engine',
      title: 'Live Recognition & Inclusive Services',
      description: 'Real-time ASL and ISL hand gesture recognition, sensory sonification, 12 regional languages, AAC digital services, and single-switch scanning.',
      badge: 'Interactive'
    },
    {
      path: '/call',
      name: 'Video Call',
      title: 'Accessible Peer Video Call',
      description: 'Peer-to-peer WebRTC video calling with real-time gesture recognition overlay and automated speech synthesis.',
      badge: 'Communication'
    },
    {
      path: '/about',
      name: 'About',
      title: 'About Sanketika (संकेतिका) Architecture',
      description: 'Overview of edge neural mapping, 120 FPS WebGL pipeline, and kinesthetic interaction philosophy.',
      badge: 'Documentation'
    },
    {
      path: '/motives',
      name: 'Motives',
      title: 'Our Mission & Motives',
      description: 'Democratizing communication, removing hardware bottlenecks, and advancing spatial computing for people with disabilities.',
      badge: 'Mission'
    },
    {
      path: '/privacy',
      name: 'Privacy Policy',
      title: 'Edge Privacy & Telemetry Guarantee',
      description: 'Guaranteed local sandboxed video processing with zero frame transmission to servers.',
      badge: 'Legal'
    },
    {
      path: '/terms',
      name: 'Terms of Service',
      title: 'Terms of Use & License',
      description: 'Acceptable use guidelines, experimental software license, and service modification policies.',
      badge: 'Legal'
    }
  ];

  return NextResponse.json({
    total: routes.length,
    routes,
    apiEndpoints: [
      { path: '/api/health', method: 'GET', description: 'Checks Python ML backend and edge fallback status.' },
      { path: '/api/predict', method: 'POST', description: 'Runs gesture prediction against ASL_model.p or fallback.' },
      { path: '/api/emergency', method: 'POST', description: 'Dispatches emergency SOS beacon telemetry.' },
      { path: '/api/translate', method: 'POST', description: 'Translates signs across 12 regional languages.' },
      { path: '/api/signs', method: 'GET', description: 'Returns unified dictionary of sign gestures.' },
      { path: '/api/routes', method: 'GET', description: 'Directory of all system pages and API routes.' }
    ]
  });
}
