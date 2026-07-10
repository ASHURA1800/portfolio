import { ImageResponse } from 'next/og';
import { getProfile } from '@/lib/content';

export const runtime = 'edge';
export const alt = 'Portfolio preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const profile = await getProfile();
  const name = profile.name || profile.username || 'Portfolio';
  const title = profile.title || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#08090D',
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(124,77,255,0.35), transparent 55%), radial-gradient(circle at 85% 75%, rgba(34,197,245,0.22), transparent 55%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 28,
            color: '#A0A6B5',
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#2ED573' }} />
          Portfolio
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 84,
            fontWeight: 600,
            color: '#F7F8FA',
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          {name}
        </div>
        {title && (
          <div style={{ marginTop: 20, fontSize: 36, color: '#A0A6B5' }}>{title}</div>
        )}
      </div>
    ),
    { ...size },
  );
}
