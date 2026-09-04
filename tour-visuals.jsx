/* ═══════════════════════════════════════════════════════════
   INTER SG — TOUR DA MARCA · VISUAIS PRIMITIVOS
   Silhuetas blueprint: camisa, ônibus, estádio, telefone, CT.
   Cada peça destaca a zona onde a marca do patrocinador entra.
   ═══════════════════════════════════════════════════════════ */

// BrandStamp — selo "SUA MARCA" que pousa em cima de uma zona.
// Animação: invisível → flash + overshoot scale → assenta.
function BrandStamp({
  text, color = '#ffffff',
  width = 280, height = 86,
  landAt = 0,
  fontSize,
  letterSpacing = '0.04em',
  weight = 700,
  style: extraStyle,
  hue,
}) {
  const { localTime } = useSprite();
  const t = clamp((localTime - landAt) / 0.55, 0, 1);
  const tFlash = clamp((localTime - landAt) / 0.25, 0, 1);
  const visible = localTime >= landAt;

  const scale = visible ? 0.7 + Easing.easeOutBack(t) * 0.3 : 1;
  const opacity = visible ? clamp(t * 1.8, 0, 1) : 0;
  const flashOpacity = visible ? (1 - tFlash) * 0.8 : 0;
  const fs = fontSize || Math.min(width * 0.22, height * 0.55);

  return (
    <div style={{
      position: 'absolute',
      width, height,
      transform: `translate(-50%,-50%) scale(${scale})`,
      transformOrigin: 'center',
      opacity,
      willChange: 'transform, opacity',
      pointerEvents: 'none',
      ...extraStyle,
    }}>
      {/* flash backdrop */}
      <div style={{
        position: 'absolute', inset: '-20%',
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 60%)`,
        opacity: flashOpacity,
        filter: 'blur(20px)',
        mixBlendMode: 'screen',
      }} />
      {/* mark itself */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
        fontSize: fs,
        fontWeight: weight,
        letterSpacing,
        textTransform: 'uppercase',
        textShadow: `0 0 12px ${color}55, 0 0 28px ${color}33`,
        whiteSpace: 'nowrap',
      }}>
        {text}
      </div>
    </div>
  );
}

// ZoneHighlight — moldura piscante sobre a zona de exposição,
// com cantos HUD e label "MARCA AQUI →"
function ZoneHighlight({
  x, y, w, h,
  appearAt = 0,
  fadeAt,
  label,
  color = 'oklch(0.78 0.26 258)',
  pulse = true,
}) {
  const { localTime } = useSprite();
  const t = clamp((localTime - appearAt) / 0.4, 0, 1);
  const tFade = fadeAt != null ? clamp((localTime - fadeAt) / 0.5, 0, 1) : 0;
  const opacity = clamp(t - tFade, 0, 1);
  const pulseAmt = pulse ? 0.5 + 0.5 * Math.sin(localTime * 4) : 1;

  return (
    <div style={{
      position: 'absolute',
      left: x - w / 2, top: y - h / 2,
      width: w, height: h,
      opacity,
      pointerEvents: 'none',
    }}>
      {['TL', 'TR', 'BL', 'BR'].map((corner) => {
        const isTop = corner.startsWith('T');
        const isLeft = corner.endsWith('L');
        return (
          <div key={corner} style={{
            position: 'absolute',
            width: 18, height: 18,
            top: isTop ? -2 : 'auto',
            bottom: !isTop ? -2 : 'auto',
            left: isLeft ? -2 : 'auto',
            right: !isLeft ? -2 : 'auto',
            borderTop: isTop ? `2px solid ${color}` : 'none',
            borderBottom: !isTop ? `2px solid ${color}` : 'none',
            borderLeft: isLeft ? `2px solid ${color}` : 'none',
            borderRight: !isLeft ? `2px solid ${color}` : 'none',
            filter: `drop-shadow(0 0 6px ${color})`,
            opacity: pulseAmt,
          }} />
        );
      })}
      {/* dashed inner frame */}
      <div style={{
        position: 'absolute', inset: 4,
        border: `1px dashed ${color}`,
        opacity: 0.55 * pulseAmt,
      }} />
      {label && (
        <div style={{
          position: 'absolute',
          top: -28, left: 0,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 11,
          letterSpacing: '0.25em',
          color,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>{label}</div>
      )}
    </div>
  );
}

// Connector line from zone to a callout — animated draw-in.
function Connector({ x1, y1, x2, y2, appearAt = 0, color = 'oklch(0.78 0.26 258)' }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - appearAt) / 0.6, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  return (
    <div style={{
      position: 'absolute',
      left: x1, top: y1,
      width: length, height: 0,
      borderTop: `1px solid ${color}`,
      transformOrigin: '0 0',
      transform: `rotate(${angle}deg) scaleX(${eased})`,
      opacity: 0.7,
      filter: `drop-shadow(0 0 4px ${color})`,
    }}>
      <div style={{
        position: 'absolute',
        right: 0, top: -3,
        width: 6, height: 6,
        background: color,
        borderRadius: '50%',
        boxShadow: `0 0 8px ${color}`,
        opacity: eased,
      }} />
    </div>
  );
}

// JerseyShape — soccer jersey silhouette (front or back) with stripes.
// Inter SG colors: black + white vertical stripes.
function JerseyShape({ width = 520, view = 'front', accent = 'oklch(0.78 0.26 258)', drawIn = 0 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - drawIn) / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const height = width * 1.18;

  const tShape = 'polygon(0 18%, 14% 18%, 24% 4%, 36% 0, 64% 0, 76% 4%, 86% 18%, 100% 18%, 100% 40%, 86% 44%, 86% 100%, 14% 100%, 14% 44%, 0 40%)';

  return (
    <div style={{
      position: 'relative',
      width, height,
      transform: `scale(${0.92 + 0.08 * eased})`,
      opacity: eased,
      filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.5))`,
    }}>
      {/* base shape with stripes */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(
          90deg,
          #0a0e1e 0 ${width * 0.07}px,
          #f1f3ff ${width * 0.07}px ${width * 0.14}px
        )`,
        clipPath: tShape,
      }} />
      {/* subtle inner shading */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.45) 90%)`,
        clipPath: tShape,
        mixBlendMode: 'multiply',
      }} />
      {/* highlight rim */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 30%)`,
        clipPath: tShape,
      }} />
      {/* collar accent */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '0%',
        width: '24%', height: '8%',
        transform: 'translateX(-50%)',
        background: accent,
        clipPath: 'polygon(0 100%, 20% 0, 80% 0, 100% 100%, 70% 80%, 30% 80%)',
        opacity: 0.85,
      }} />
      {/* number on back */}
      {view === 'back' && (
        <div style={{
          position: 'absolute',
          left: '50%', top: '38%',
          transform: 'translateX(-50%)',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: width * 0.28,
          color: '#0a0e1e',
          textShadow: '2px 2px 0 rgba(255,255,255,0.15)',
          letterSpacing: '-0.05em',
        }}>09</div>
      )}
      {/* tiny inter SG crest hint */}
      {view === 'front' && (
        <div style={{
          position: 'absolute',
          left: '76%', top: '23%',
          width: width * 0.07, height: width * 0.085,
          background: accent,
          clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)',
          opacity: 0.85,
        }} />
      )}
    </div>
  );
}

// StadiumScene — top-down arc of LED panels around a pitch.
function StadiumScene({ width = 900, drawIn = 0 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - drawIn) / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const height = width * 0.55;

  return (
    <div style={{
      position: 'relative',
      width, height,
      transform: `perspective(1400px) rotateX(52deg) scale(${0.9 + 0.1 * eased})`,
      transformOrigin: 'center 60%',
      opacity: eased,
    }}>
      {/* outer terrain ring */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0c1224 0%, #050810 100%)',
        borderRadius: '50%',
        border: '1px solid rgba(120, 160, 255, 0.18)',
      }} />
      {/* pitch */}
      <div style={{
        position: 'absolute',
        left: '12%', right: '12%', top: '14%', bottom: '14%',
        background: `
          repeating-linear-gradient(90deg, oklch(0.32 0.08 145) 0 6%, oklch(0.28 0.08 145) 6% 12%),
          oklch(0.30 0.08 145)
        `,
        border: '2px solid rgba(255,255,255,0.7)',
        borderRadius: '50%',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 2, background: 'rgba(255,255,255,0.7)',
          transform: 'translateX(-50%)',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: '20%', aspectRatio: '1',
          border: '2px solid rgba(255,255,255,0.7)',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
        }} />
      </div>
    </div>
  );
}

// LedBoard — wide LED strip with scrolling sponsor name.
function LedBoard({ width = 1100, text, color = '#ffffff', drawIn = 0, startScrollAt = 0 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - drawIn) / 0.5, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const scrollT = Math.max(0, localTime - startScrollAt);
  const scrollX = ((scrollT * 240) % (width + 400)) - 400;
  const height = 96;

  return (
    <div style={{
      position: 'relative',
      width, height,
      transform: `scaleX(${eased})`,
      transformOrigin: 'center',
      opacity: eased,
    }}>
      {/* LED panel */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #050810 0%, #0a0e20 50%, #050810 100%)',
        border: '2px solid #1a2240',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: `inset 0 0 40px rgba(0,0,0,0.8), 0 0 30px ${color}30`,
      }}>
        {/* LED dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle, ${color}20 1px, transparent 1.5px)`,
          backgroundSize: '8px 8px',
          opacity: 0.4,
        }} />
        {/* scrolling text */}
        <div style={{
          position: 'absolute',
          left: scrollX, top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 64,
          color,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          textShadow: `0 0 12px ${color}, 0 0 28px ${color}80`,
          mixBlendMode: 'screen',
        }}>
          {text} · {text} · {text}
        </div>
      </div>
    </div>
  );
}

// BusShape — side-view bus silhouette.
function BusShape({ width = 700, drawIn = 0, driveIn = false }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - drawIn) / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const driveX = driveIn ? interpolate([0, 1], [-200, 0])(eased) : 0;
  const height = width * 0.36;

  return (
    <div style={{
      position: 'relative',
      width, height,
      transform: `translateX(${driveX}px)`,
      opacity: eased,
    }}>
      {/* body */}
      <div style={{
        position: 'absolute', inset: '6% 0 12% 0',
        background: 'linear-gradient(180deg, #f1f3ff 0%, #c8cfe8 100%)',
        borderRadius: '18px 24px 6px 6px',
        boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.18), 0 12px 30px rgba(0,0,0,0.5)',
        border: '1px solid rgba(120,160,255,0.3)',
      }}>
        {/* windows row */}
        <div style={{
          position: 'absolute',
          top: '12%', left: '6%', right: '18%', height: '32%',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 6,
        }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{
              background: 'linear-gradient(180deg, #0a0e1e 0%, #1a2240 100%)',
              borderRadius: 4,
              border: '1px solid rgba(120,160,255,0.4)',
            }}/>
          ))}
        </div>
        {/* door */}
        <div style={{
          position: 'absolute',
          right: '4%', top: '14%', bottom: '8%',
          width: '10%',
          background: 'linear-gradient(180deg, #0a0e1e 0%, #1a2240 100%)',
          border: '1px solid rgba(120,160,255,0.4)',
          borderRadius: 4,
        }}/>
        {/* stripe along body where sponsor goes */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0,
          top: '52%', height: '20%',
          background: 'oklch(0.78 0.26 258 / 0.15)',
          borderTop: '1px solid oklch(0.78 0.26 258 / 0.4)',
          borderBottom: '1px solid oklch(0.78 0.26 258 / 0.4)',
        }}/>
      </div>
      {/* wheels */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '12%',
        width: height * 0.32, height: height * 0.32,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #1a2240 30%, #04060d 70%)',
        border: '3px solid #2a3050',
      }}/>
      <div style={{
        position: 'absolute',
        bottom: 0, right: '12%',
        width: height * 0.32, height: height * 0.32,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #1a2240 30%, #04060d 70%)',
        border: '3px solid #2a3050',
      }}/>
      {/* tiny inter SG crest */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '4%',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
        letterSpacing: '0.2em',
        color: 'oklch(0.45 0.18 258)',
      }}>INTER · SG</div>
    </div>
  );
}

// CtBuilding — facade silhouette with signage strip above entrance.
function CtBuilding({ width = 600, drawIn = 0 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - drawIn) / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const height = width * 0.7;

  return (
    <div style={{
      position: 'relative',
      width, height,
      opacity: eased,
      transform: `translateY(${(1 - eased) * 16}px)`,
    }}>
      {/* main facade */}
      <div style={{
        position: 'absolute',
        inset: '12% 0 0 0',
        background: 'linear-gradient(180deg, #1a2240 0%, #0a0e1e 100%)',
        border: '1px solid rgba(120,160,255,0.25)',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.5)',
      }}>
        {/* windows grid */}
        <div style={{
          position: 'absolute',
          inset: '28% 8% 30% 8%',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          {Array.from({ length: 21 }).map((_, i) => (
            <div key={i} style={{
              background: i % 4 === 0
                ? 'linear-gradient(180deg, oklch(0.78 0.26 258 / 0.4), oklch(0.45 0.18 258 / 0.2))'
                : 'rgba(120,160,255,0.06)',
              border: '1px solid rgba(120,160,255,0.15)',
            }}/>
          ))}
        </div>
        {/* entrance */}
        <div style={{
          position: 'absolute',
          left: '40%', right: '40%',
          bottom: 0, height: '20%',
          background: 'linear-gradient(180deg, oklch(0.78 0.26 258 / 0.3), transparent)',
          borderTop: '1px solid oklch(0.78 0.26 258)',
          borderLeft: '1px solid rgba(120,160,255,0.4)',
          borderRight: '1px solid rgba(120,160,255,0.4)',
        }}/>
      </div>
      {/* signage strip above */}
      <div style={{
        position: 'absolute',
        left: '10%', right: '10%',
        top: '2%', height: '14%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        border: '1px solid oklch(0.78 0.26 258 / 0.5)',
        boxShadow: '0 0 30px oklch(0.78 0.26 258 / 0.4)',
        backdropFilter: 'blur(4px)',
      }}/>
    </div>
  );
}

// PhoneShape — phone with Instagram-style branded post.
function PhoneShape({ width = 340, sponsorName, sponsorColor = '#ffffff', drawIn = 0 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - drawIn) / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const height = width * 2.05;

  // typing animation for caption
  const caption = `@intersg + ${sponsorName.toLowerCase()}: novo capítulo da base.`;
  const charsShown = Math.floor(clamp((localTime - drawIn - 0.8) / 1.4, 0, 1) * caption.length);
  const typed = caption.slice(0, charsShown);

  return (
    <div style={{
      position: 'relative',
      width, height,
      opacity: eased,
      transform: `translateY(${(1 - eased) * 24}px) rotate(${(1 - eased) * 4}deg)`,
      filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
    }}>
      {/* device bezel */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #1a1a24 0%, #0a0a12 100%)',
        borderRadius: 36,
        padding: 10,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* screen */}
        <div style={{
          position: 'relative',
          width: '100%', height: '100%',
          background: '#fff',
          borderRadius: 28,
          overflow: 'hidden',
        }}>
          {/* status bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 22px 8px',
            fontSize: 11, fontWeight: 600,
            color: '#000',
            fontFamily: 'Space Grotesk, system-ui',
          }}>
            <span>9:41</span>
            <span>● ● ●</span>
          </div>
          {/* IG header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 16px',
            borderBottom: '1px solid #eee',
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #f9d423, #ff4e50, #be3df0, #4e91ff, #f9d423)',
              padding: 2,
            }}>
              <div style={{
                width: '100%', height: '100%',
                borderRadius: '50%',
                background: '#0a0e1e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
                fontFamily: 'Space Grotesk',
                fontSize: 10,
                fontWeight: 700,
              }}>SG</div>
            </div>
            <div style={{ fontFamily: 'Space Grotesk, system-ui', fontSize: 12, color: '#000', fontWeight: 600 }}>
              intersgoficial
              <div style={{ fontSize: 9, color: '#888', fontWeight: 400 }}>São Gotardo, MG</div>
            </div>
          </div>
          {/* post image area — co-branded */}
          <div style={{
            position: 'relative',
            width: '100%', aspectRatio: '1',
            background: 'linear-gradient(135deg, #0a0e1e 0%, #1a2240 100%)',
            overflow: 'hidden',
          }}>
            {/* striped placeholder */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(45deg, rgba(120,160,255,0.06) 0 12px, transparent 12px 24px)',
            }}/>
            {/* big crest hint */}
            <div style={{
              position: 'absolute',
              left: '8%', bottom: '8%',
              fontFamily: 'Space Grotesk',
              fontSize: 22, fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}>INTER SG</div>
            {/* co-brand stamp */}
            <div style={{
              position: 'absolute',
              right: '8%', top: '8%',
              padding: '8px 14px',
              border: `1px solid ${sponsorColor}`,
              fontFamily: 'Space Grotesk',
              fontSize: 13, fontWeight: 700,
              color: sponsorColor,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: `${sponsorColor}10`,
              backdropFilter: 'blur(4px)',
              opacity: localTime > drawIn + 0.6 ? 1 : 0,
              transition: 'opacity 300ms',
            }}>{sponsorName}</div>
            {/* hashtag bottom */}
            <div style={{
              position: 'absolute',
              right: '8%', bottom: '8%',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.1em',
            }}>#CICLO26</div>
          </div>
          {/* engagement bar */}
          <div style={{
            display: 'flex', gap: 12, padding: '10px 16px',
            fontSize: 16,
            color: '#000',
          }}>
            <span>♡</span><span>💬</span><span>↗</span>
          </div>
          <div style={{ padding: '0 16px', fontFamily: 'Space Grotesk', fontSize: 10, color: '#000' }}>
            <div style={{ fontWeight: 600 }}>2.847 curtidas</div>
            <div style={{ marginTop: 6, color: '#000', minHeight: 28 }}>
              <span style={{ fontWeight: 600 }}>intersgoficial</span>{' '}
              <span>{typed}</span>
              {typed.length < caption.length && (
                <span style={{ opacity: 0.5 }}>▍</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* notch */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 14,
        transform: 'translateX(-50%)',
        width: 90, height: 22,
        background: '#000',
        borderRadius: 12,
      }}/>
    </div>
  );
}

// PressWall — step-and-repeat backdrop.
function PressWall({ width = 800, height = 460, sponsorName, sponsorColor, drawIn = 0 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - drawIn) / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);

  const cols = 5, rows = 4;
  return (
    <div style={{
      position: 'relative',
      width, height,
      opacity: eased,
      transform: `scale(${0.94 + 0.06 * eased})`,
      filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0c1224 0%, #050810 100%)',
        border: '1px solid rgba(120,160,255,0.25)',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: 1,
        padding: 16,
      }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const isSponsor = (i + Math.floor(i / cols)) % 2 === 0;
          const cellAppearAt = drawIn + 0.4 + (i * 0.04);
          const cellT = clamp((localTime - cellAppearAt) / 0.4, 0, 1);
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed rgba(120,160,255,0.12)',
              opacity: cellT,
              transform: `scale(${0.85 + 0.15 * cellT})`,
            }}>
              {isSponsor ? (
                <div style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: 18, fontWeight: 700,
                  color: sponsorColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textShadow: `0 0 8px ${sponsorColor}60`,
                }}>{sponsorName}</div>
              ) : (
                <div style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: 14, fontWeight: 500,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.15em',
                }}>INTER · SG</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  BrandStamp, ZoneHighlight, Connector,
  JerseyShape, StadiumScene, LedBoard,
  BusShape, CtBuilding, PhoneShape, PressWall,
});
