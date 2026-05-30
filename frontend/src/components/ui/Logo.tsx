/** Tooth path — 100×100 viewBox, symmetric molar silhouette */
const ToothPath = () => (
  <path
    d="M50 12C36 12 20 22 20 35C20 44 24 50 28 55L31 72C32 77 35 82 39 82C42 82 44 79 45 75L47 68C48 63 49 61 50 61C51 61 52 63 53 68L55 75C56 79 58 82 61 82C65 82 68 77 69 72L72 55C76 50 80 44 80 35C80 22 64 12 50 12Z"
    fill="white"
  />
);

interface LogoProps {
  /** 'sm' = 24px icon, 'md' = 30px icon (default), 'lg' = 42px icon */
  size?: 'sm' | 'md' | 'lg';
  /** Stack icon + text vertically (for auth pages) */
  vertical?: boolean;
}

export default function Logo({ size = 'md', vertical = false }: LogoProps) {
  const box   = size === 'sm' ? 24 : size === 'md' ? 30 : 42;
  const inner = size === 'sm' ? 13 : size === 'md' ? 17 : 24;
  const r     = size === 'sm' ? 7  : size === 'md' ? 8  : 12;
  const fs    = size === 'sm' ? 14 : size === 'md' ? 16 : 24;
  const ls    = size === 'sm' ? '0.5px' : size === 'md' ? '0.6px' : '1px';

  return (
    <div style={{
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      alignItems: 'center',
      gap: vertical ? '10px' : '10px',
    }}>
      {/* Icon */}
      <div style={{
        width: box, height: box, borderRadius: r,
        backgroundColor: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width={inner} height={inner} viewBox="0 0 100 100" fill="none">
          <ToothPath />
        </svg>
      </div>

      {/* Brand name */}
      <span style={{ lineHeight: 1, userSelect: 'none' }}>
        <span style={{ fontSize: fs, fontWeight: 200, color: '#ffffff', letterSpacing: ls }}>Atelier</span>
        <span style={{ fontSize: fs, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.4px' }}> Dental</span>
      </span>
    </div>
  );
}
