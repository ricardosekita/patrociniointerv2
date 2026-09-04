/* ═══════════════════════════════════════════════════════════
   INTER SG — TOUR DA MARCA · CENAS
   8 cenas (~55s total): cada uma estampa a marca em um
   ponto de exposição diferente.
   ═══════════════════════════════════════════════════════════ */

const PALETTE = {
  ink: '#04060d',
  ink2: '#080b16',
  paper: '#f3f5ff',
  paperDim: '#c8cfe8',
  mute: '#6b7499',
  blue: 'oklch(0.68 0.22 258)',
  blueHot: 'oklch(0.78 0.26 258)',
  blueDim: 'oklch(0.45 0.18 258)',
  blueGhost: 'oklch(0.68 0.22 258 / 0.12)',
};

// ── Shared chrome elements ────────────────────────────────────

function HudTop({ chapter, num, total = 8 }) {
  return (
    <div style={{
      position: 'absolute', top: 38, left: 64, right: 64,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 12, letterSpacing: '0.22em',
      color: PALETTE.paperDim,
      textTransform: 'uppercase',
      zIndex: 6,
    }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: PALETTE.blueHot,
          boxShadow: `0 0 12px ${PALETTE.blueHot}`,
          animation: 'sigPulse 2s ease-in-out infinite',
        }}/>
        <span>SIG/TX · TOUR DA MARCA · {chapter}</span>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <span style={{ color: PALETTE.blueHot }}>REC ●</span>
        <span>FRAME {String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

function HudBottom({ left, mid, right }) {
  return (
    <div style={{
      position: 'absolute', bottom: 100, left: 64, right: 64,
      display: 'flex', justifyContent: 'space-between',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11, letterSpacing: '0.24em',
      color: PALETTE.mute,
      textTransform: 'uppercase',
      zIndex: 6,
    }}>
      <span>{left}</span>
      <span style={{ color: PALETTE.paperDim }}>{mid}</span>
      <span>{right}</span>
    </div>
  );
}

// Eyebrow + title pair, animated in on appearAt.
function TitleBlock({ eyebrow, children, appearAt = 0, x, y, maxWidth = 700, align = 'left' }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - appearAt) / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      maxWidth, opacity: eased,
      transform: `translateY(${(1 - eased) * 18}px)`,
      textAlign: align,
      zIndex: 5,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13, letterSpacing: '0.3em',
        color: PALETTE.blue,
        textTransform: 'uppercase',
        marginBottom: 18,
      }}>{eyebrow}</div>
      <h2 style={{
        margin: 0,
        fontFamily: 'Space Grotesk, system-ui',
        fontSize: 78,
        fontWeight: 500,
        lineHeight: 0.96,
        letterSpacing: '-0.035em',
        color: PALETTE.paper,
      }}>
        {children}
      </h2>
    </div>
  );
}

// Italic accent word (Fraunces)
const Em = ({ children, color = PALETTE.blueHot }) => (
  <em style={{
    fontFamily: 'Fraunces, serif',
    fontStyle: 'italic',
    fontWeight: 300,
    color,
  }}>{children}</em>
);

// Stat callout — small box with eyebrow + value + sub
function StatCallout({ x, y, eyebrow, value, sub, appearAt = 0, width = 280 }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - appearAt) / 0.6, 0, 1);
  const eased = Easing.easeOutCubic(t);

  // counter animation
  const numVal = (typeof value === 'number')
    ? Math.floor(value * eased).toLocaleString('pt-BR')
    : value;

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y, width,
      opacity: eased,
      transform: `translateY(${(1 - eased) * 12}px)`,
      padding: '18px 22px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
      border: '1px solid rgba(120,160,255,0.2)',
      backdropFilter: 'blur(20px)',
      zIndex: 5,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, letterSpacing: '0.28em',
        color: PALETTE.blue,
        textTransform: 'uppercase',
      }}>/ {eyebrow}</div>
      <div style={{
        fontFamily: 'Space Grotesk',
        fontSize: 42, fontWeight: 500,
        letterSpacing: '-0.03em',
        color: PALETTE.paper,
        marginTop: 6,
        lineHeight: 1,
      }}>{numVal}</div>
      {sub && (
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10, letterSpacing: '0.18em',
          color: PALETTE.mute,
          textTransform: 'uppercase',
          marginTop: 8,
        }}>{sub}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE 01 — INTRO
// ─────────────────────────────────────────────────────────────
function SceneIntro({ start, end, tweaks }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, progress }) => {
        const titleT = clamp(localTime / 0.9, 0, 1);
        const subT = clamp((localTime - 0.6) / 0.8, 0, 1);
        const gridT = clamp((localTime - 2.0) / 0.9, 0, 1);
        const fadeT = clamp((localTime - 4.4) / 0.5, 0, 1);
        const titleE = Easing.easeOutCubic(titleT) * (1 - fadeT);
        const subE = Easing.easeOutCubic(subT) * (1 - fadeT);
        const gridE = Easing.easeOutCubic(gridT) * (1 - fadeT);

        const cells = [
          'CAMISA MASTER', 'CAMISA COSTAS', 'MANGA', 'CALÇÃO',
          'PLACAS LED', 'CT INTER SG', 'ÔNIBUS', 'REDES SOCIAIS',
        ];

        return (
          <>
            <HudTop chapter="01 — INÍCIO DA TRANSMISSÃO" num={1} />

            {/* big mark up top */}
            <div style={{
              position: 'absolute',
              left: '50%', top: '24%',
              transform: `translate(-50%, ${(1 - titleE) * 20}px)`,
              opacity: titleE,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13, letterSpacing: '0.32em',
              color: PALETTE.blue,
              textTransform: 'uppercase',
            }}>/ TOUR DE EXPOSIÇÃO · CICLO 2026</div>

            <div style={{
              position: 'absolute',
              left: '50%', top: '32%',
              transform: `translate(-50%, ${(1 - titleE) * 28}px)`,
              opacity: titleE,
              fontFamily: 'Space Grotesk',
              fontSize: 132, fontWeight: 500,
              letterSpacing: '-0.045em',
              lineHeight: 0.92,
              color: PALETTE.paper,
              textAlign: 'center',
              width: '100%',
            }}>
              Onde a sua marca<br/>
              <Em>vai estar.</Em>
            </div>

            <div style={{
              position: 'absolute',
              left: '50%', top: '58%',
              transform: `translate(-50%, ${(1 - subE) * 16}px)`,
              opacity: subE,
              fontFamily: 'Fraunces, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 26,
              color: PALETTE.paperDim,
              textAlign: 'center',
              maxWidth: 900,
            }}>
              Oito pontos de contato. Um ecossistema inteiro<br/>
              respirando do lado da sua marca.
            </div>

            {/* 8 placeholder pills — preview of the tour */}
            <div style={{
              position: 'absolute',
              left: '50%', top: '72%',
              transform: 'translate(-50%, 0)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              opacity: gridE,
              width: 1100,
            }}>
              {cells.map((c, i) => {
                const cellT = clamp((localTime - 2.0 - i * 0.08) / 0.4, 0, 1);
                return (
                  <div key={c} style={{
                    padding: '14px 18px',
                    border: `1px solid rgba(120,160,255,${0.15 + 0.4 * cellT})`,
                    background: `rgba(120,160,255,${0.04 * cellT})`,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    color: PALETTE.paperDim,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    opacity: cellT,
                    transform: `translateY(${(1 - cellT) * 10}px)`,
                  }}>
                    <span style={{ color: PALETTE.blue }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ marginLeft: 8 }}>{c}</span>
                  </div>
                );
              })}
            </div>

            <HudBottom left="INTER SG · SÃO GOTARDO, MG" mid="PROPOSTA CONFIDENCIAL" right="SG-TRANSMIT::START" />
          </>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE 02 — CAMISA MASTER (frontal)
// ─────────────────────────────────────────────────────────────
function SceneJerseyMaster({ start, end, tweaks }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const fadeT = clamp((localTime - 7.2) / 0.5, 0, 1);
        const op = 1 - fadeT;
        return (
          <>
            <HudTop chapter="02 — CAMISA · MASTER FRONTAL" num={2} />

            <div style={{ opacity: op, position: 'absolute', inset: 0 }}>
              <TitleBlock
                eyebrow="/ O ALVO #1"
                x={100} y={210}
                appearAt={0.1}
              >
                Master <Em>frontal</Em><br/>
                da camisa.
              </TitleBlock>

              <div style={{
                position: 'absolute',
                left: 100, top: 470,
                maxWidth: 540,
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 22,
                lineHeight: 1.45,
                color: PALETTE.paperDim,
                opacity: clamp((localTime - 0.6) / 0.8, 0, 1),
                zIndex: 5,
              }}>
                O ativo de maior valor. Aparece em cada cobertura
                de TV, em cada foto de gol, em cada feed do torcedor.
                <span style={{ color: PALETTE.blueHot }}> Toda a temporada.</span>
              </div>

              {/* jersey + brand */}
              <div style={{
                position: 'absolute',
                left: '58%', top: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <JerseyShape width={560} view="front" drawIn={0.1} />
              </div>

              {/* zone highlight on chest — fades out once brand lands */}
              <div style={{ position: 'absolute', left: '58%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ position: 'relative', width: 560, height: 660 }}>
                  <ZoneHighlight x={280} y={290} w={280} h={120}
                    appearAt={1.0} fadeAt={2.6}
                    label="ZONA MASTER · 280 × 120 MM" />
                </div>
              </div>

              {/* brand stamp lands on chest */}
              <div style={{ position: 'absolute', left: '58%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ position: 'relative', width: 560, height: 660 }}>
                  <div style={{ position: 'absolute', left: 280, top: 290 }}>
                    <BrandStamp
                      text={tweaks.sponsorName}
                      color={tweaks.sponsorColor}
                      width={260} height={90}
                      landAt={2.4}
                    />
                  </div>
                </div>
              </div>

              {/* stat callouts */}
              <StatCallout x={100} y={690} appearAt={3.2}
                eyebrow="JOGOS / ANO" value="84" sub="oficiais + amistosos" width={200} />
              <StatCallout x={320} y={690} appearAt={3.5}
                eyebrow="EXPOSIÇÃO" value="TV + STREAMING" sub="cobertura nacional" width={260} />
              <StatCallout x={600} y={690} appearAt={3.8}
                eyebrow="ATLETAS" value="120" sub="vestindo a marca" width={200} />

              <HudBottom left="ATIVO · 01 / 08" mid={`CAMISA × ${tweaks.sponsorName}`} right="SG-TRANSMIT::CHEST" />
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE 03 — CAMISA COSTAS + MANGA + CALÇÃO
// ─────────────────────────────────────────────────────────────
function SceneJerseyBack({ start, end, tweaks }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const fadeT = clamp((localTime - 6.4) / 0.5, 0, 1);
        const op = 1 - fadeT;
        return (
          <>
            <HudTop chapter="03 — COSTAS · MANGA · CALÇÃO" num={3} />

            <div style={{ opacity: op, position: 'absolute', inset: 0 }}>
              <TitleBlock
                eyebrow="/ LADOS COMPLEMENTARES"
                x={100} y={210}
                appearAt={0.1}
              >
                Mais três<br/>
                <Em>superfícies.</Em>
              </TitleBlock>

              <div style={{
                position: 'absolute',
                left: 100, top: 440,
                maxWidth: 480,
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 20,
                lineHeight: 1.45,
                color: PALETTE.paperDim,
                opacity: clamp((localTime - 0.6) / 0.8, 0, 1),
                zIndex: 5,
              }}>
                Costas para os replays e a torcida no estádio.
                Manga e calção para visibilidade em ângulos de jogada.
              </div>

              {/* back jersey */}
              <div style={{
                position: 'absolute',
                left: '50%', top: '52%',
                transform: 'translate(-58%, -50%)',
              }}>
                <JerseyShape width={420} view="back" drawIn={0.1} />
                <div style={{ position: 'absolute', inset: 0 }}>
                  <ZoneHighlight x={210} y={195} w={240} h={70}
                    appearAt={0.9} fadeAt={2.2}
                    label="OMNI-COSTAS" />
                  <div style={{ position: 'absolute', left: 210, top: 195 }}>
                    <BrandStamp text={tweaks.sponsorName} color={tweaks.sponsorColor}
                      width={220} height={56} landAt={2.0} fontSize={28} />
                  </div>
                  {/* sleeve */}
                  <ZoneHighlight x={50} y={150} w={70} h={56}
                    appearAt={2.8} fadeAt={3.8}
                    label="MANGA" />
                  <div style={{ position: 'absolute', left: 50, top: 150 }}>
                    <BrandStamp text={tweaks.sponsorName} color={tweaks.sponsorColor}
                      width={60} height={44} landAt={3.6} fontSize={11} letterSpacing="0.02em" />
                  </div>
                </div>
              </div>

              {/* shorts on the side */}
              <div style={{
                position: 'absolute',
                left: '76%', top: '54%',
                transform: 'translate(-50%, -50%)',
              }}>
                <div style={{
                  position: 'relative',
                  width: 260, height: 260,
                  background: `repeating-linear-gradient(90deg, #0a0e1e 0 18px, #f1f3ff 18px 36px)`,
                  clipPath: 'polygon(0 0, 100% 0, 100% 25%, 86% 100%, 50% 65%, 14% 100%, 0 25%)',
                  opacity: clamp((localTime - 0.4) / 0.6, 0, 1),
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                }}/>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <ZoneHighlight x={70} y={70} w={80} h={50}
                    appearAt={4.3} fadeAt={5.6}
                    label="CALÇÃO L" />
                  <div style={{ position: 'absolute', left: 70, top: 70 }}>
                    <BrandStamp text={tweaks.sponsorName} color={tweaks.sponsorColor}
                      width={70} height={36} landAt={5.0} fontSize={11} letterSpacing="0.02em" />
                  </div>
                </div>
              </div>

              <HudBottom left="ATIVO · 02-04 / 08" mid="3 PEÇAS · 3 SUPERFÍCIES" right="SG-TRANSMIT::CLOTH" />
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE 04 — PLACAS LED / ESTÁDIO
// ─────────────────────────────────────────────────────────────
function SceneStadium({ start, end, tweaks }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const fadeT = clamp((localTime - 6.4) / 0.5, 0, 1);
        const op = 1 - fadeT;
        return (
          <>
            <HudTop chapter="04 — PLACAS LED · ESTÁDIO" num={4} />

            <div style={{ opacity: op, position: 'absolute', inset: 0 }}>
              <TitleBlock
                eyebrow="/ EXPOSIÇÃO EM CAMPO"
                x={100} y={210}
                appearAt={0.1}
              >
                90 minutos<br/>
                <Em>na linha de fundo.</Em>
              </TitleBlock>

              <div style={{
                position: 'absolute',
                left: 100, top: 440,
                maxWidth: 460,
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 20,
                lineHeight: 1.45,
                color: PALETTE.paperDim,
                opacity: clamp((localTime - 0.6) / 0.8, 0, 1),
                zIndex: 5,
              }}>
                Sua marca rodando no LED durante todo o tempo de bola
                em campo. Estádios próprios e visitantes.
              </div>

              {/* stadium scene */}
              <div style={{
                position: 'absolute',
                left: '60%', top: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <StadiumScene width={800} drawIn={0.2} />
              </div>

              {/* LED board front and center */}
              <div style={{
                position: 'absolute',
                left: '50%', top: '76%',
                transform: 'translate(-50%, -50%)',
              }}>
                <LedBoard
                  width={1200}
                  text={tweaks.sponsorName}
                  color={tweaks.sponsorColor}
                  drawIn={1.0}
                  startScrollAt={1.6}
                />
              </div>

              <StatCallout x={100} y={710} appearAt={3.0}
                eyebrow="MINUTOS / JOGO" value="90" sub="visibilidade contínua" width={210} />
              <StatCallout x={330} y={710} appearAt={3.3}
                eyebrow="JOGOS / ANO" value="42" sub="só em casa" width={210} />

              <HudBottom left="ATIVO · 05 / 08" mid={`LED × ${tweaks.sponsorName}`} right="SG-TRANSMIT::FIELD" />
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE 05 — CT + ÔNIBUS
// ─────────────────────────────────────────────────────────────
function SceneInfra({ start, end, tweaks }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const fadeT = clamp((localTime - 6.4) / 0.5, 0, 1);
        const op = 1 - fadeT;
        return (
          <>
            <HudTop chapter="05 — INFRAESTRUTURA · CT + ÔNIBUS" num={5} />

            <div style={{ opacity: op, position: 'absolute', inset: 0 }}>
              <TitleBlock
                eyebrow="/ NAMING + FROTA"
                x={100} y={210}
                appearAt={0.1}
              >
                Sua marca<br/>
                em <Em>concreto.</Em>
              </TitleBlock>

              <div style={{
                position: 'absolute',
                left: 100, top: 460,
                maxWidth: 460,
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 20,
                lineHeight: 1.45,
                color: PALETTE.paperDim,
                opacity: clamp((localTime - 0.6) / 0.8, 0, 1),
                zIndex: 5,
              }}>
                Naming do Centro de Treinamento e a frota oficial.
                Visibilidade urbana em toda viagem da equipe.
              </div>

              {/* CT building */}
              <div style={{
                position: 'absolute',
                left: '60%', top: '40%',
                transform: 'translate(-50%, -50%)',
              }}>
                <CtBuilding width={520} drawIn={0.2} />
                <div style={{ position: 'absolute', inset: 0 }}>
                  <ZoneHighlight x={260} y={36} w={400} h={50}
                    appearAt={1.0} fadeAt={2.4}
                    label="NAMING DO CT" />
                  <div style={{ position: 'absolute', left: 260, top: 36 }}>
                    <BrandStamp text={`CT ${tweaks.sponsorName}`} color={tweaks.sponsorColor}
                      width={380} height={42} landAt={2.2} fontSize={22} />
                  </div>
                </div>
              </div>

              {/* bus */}
              <div style={{
                position: 'absolute',
                left: '60%', top: '76%',
                transform: 'translate(-50%, -50%)',
              }}>
                <BusShape width={620} drawIn={3.0} driveIn />
                <div style={{ position: 'absolute', inset: 0 }}>
                  <ZoneHighlight x={310} y={130} w={420} h={44}
                    appearAt={3.6} fadeAt={4.8}
                    label="FAIXA LATERAL" />
                  <div style={{ position: 'absolute', left: 310, top: 130 }}>
                    <BrandStamp text={tweaks.sponsorName} color={tweaks.sponsorColor}
                      width={400} height={36} landAt={4.4} fontSize={26} />
                  </div>
                </div>
              </div>

              <HudBottom left="ATIVO · 06 / 08" mid="CT + FROTA" right="SG-TRANSMIT::URBAN" />
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE 06 — REDES SOCIAIS
// ─────────────────────────────────────────────────────────────
function SceneSocial({ start, end, tweaks }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const fadeT = clamp((localTime - 6.4) / 0.5, 0, 1);
        const op = 1 - fadeT;
        return (
          <>
            <HudTop chapter="06 — REDES SOCIAIS · CO-BRANDED" num={6} />

            <div style={{ opacity: op, position: 'absolute', inset: 0 }}>
              <TitleBlock
                eyebrow="/ CONTEÚDO PERMANENTE"
                x={100} y={210}
                appearAt={0.1}
              >
                Sua marca no<br/>
                <Em>feed</Em> da torcida.
              </TitleBlock>

              <div style={{
                position: 'absolute',
                left: 100, top: 460,
                maxWidth: 480,
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 20,
                lineHeight: 1.45,
                color: PALETTE.paperDim,
                opacity: clamp((localTime - 0.6) / 0.8, 0, 1),
                zIndex: 5,
              }}>
                Posts co-assinados, série semanal de bastidor,
                stories nos dias de jogo. Sempre em <span style={{ color: PALETTE.blueHot }}>primeiro plano.</span>
              </div>

              {/* phone center-right */}
              <div style={{
                position: 'absolute',
                left: '62%', top: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <PhoneShape
                  width={340}
                  sponsorName={tweaks.sponsorName}
                  sponsorColor={tweaks.sponsorColor}
                  drawIn={0.2}
                />
              </div>

              <StatCallout x={100} y={690} appearAt={2.5}
                eyebrow="SEGUIDORES" value={15000} sub="+ 8% por mês" width={210} />
              <StatCallout x={330} y={690} appearAt={2.8}
                eyebrow="ENGAJAMENTO" value="7.2%" sub="2× a média do setor" width={210} />
              <StatCallout x={1450} y={300} appearAt={3.1}
                eyebrow="POSTS / MÊS" value="12" sub="co-assinados" width={200} />
              <StatCallout x={1450} y={460} appearAt={3.4}
                eyebrow="STORIES" value="40+" sub="por temporada" width={200} />

              <HudBottom left="ATIVO · 07 / 08" mid={`@intersgoficial × ${tweaks.sponsorName}`} right="SG-TRANSMIT::SOCIAL" />
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE 07 — EVENTOS / PRESS WALL
// ─────────────────────────────────────────────────────────────
function SceneEvents({ start, end, tweaks }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const fadeT = clamp((localTime - 5.4) / 0.5, 0, 1);
        const op = 1 - fadeT;
        return (
          <>
            <HudTop chapter="07 — EVENTOS · PRESENCIAL" num={7} />

            <div style={{ opacity: op, position: 'absolute', inset: 0 }}>
              <TitleBlock
                eyebrow="/ PRESENÇA FÍSICA"
                x={100} y={210}
                appearAt={0.1}
              >
                Coletivas, eventos,<br/>
                <Em>hospitalidade.</Em>
              </TitleBlock>

              <div style={{
                position: 'absolute',
                left: 100, top: 440,
                maxWidth: 460,
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 20,
                lineHeight: 1.45,
                color: PALETTE.paperDim,
                opacity: clamp((localTime - 0.6) / 0.8, 0, 1),
                zIndex: 5,
              }}>
                Press wall em toda coletiva. Ativações presenciais.
                Day with the team. Sua marca atrás de cada microfone.
              </div>

              {/* press wall */}
              <div style={{
                position: 'absolute',
                left: '62%', top: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <PressWall
                  width={820} height={500}
                  sponsorName={tweaks.sponsorName}
                  sponsorColor={tweaks.sponsorColor}
                  drawIn={0.2}
                />
              </div>

              <StatCallout x={100} y={700} appearAt={2.5}
                eyebrow="EVENTOS / ANO" value="8" sub="ativações próprias" width={210} />
              <StatCallout x={330} y={700} appearAt={2.8}
                eyebrow="COLETIVAS" value="32+" sub="press walls / ano" width={210} />

              <HudBottom left="ATIVO · 08 / 08" mid="PRESENÇA FÍSICA" right="SG-TRANSMIT::IRL" />
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────
// SCENE 08 — RESUMO + CTA
// ─────────────────────────────────────────────────────────────
function SceneSummary({ start, end, tweaks }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => {
        const eyebrowT = clamp(localTime / 0.6, 0, 1);
        const titleT = clamp((localTime - 0.3) / 0.8, 0, 1);
        const gridT = clamp((localTime - 1.0) / 0.6, 0, 1);
        const ctaT = clamp((localTime - 4.5) / 0.7, 0, 1);

        const placements = [
          { n: '01', label: 'CAMISA MASTER', value: '280×120mm' },
          { n: '02', label: 'CAMISA COSTAS', value: 'OMNI' },
          { n: '03', label: 'MANGA', value: '70×56' },
          { n: '04', label: 'CALÇÃO', value: 'LATERAL' },
          { n: '05', label: 'PLACAS LED', value: '90 MIN' },
          { n: '06', label: 'CT · NAMING', value: 'PERMANENTE' },
          { n: '07', label: 'ÔNIBUS', value: 'FROTA OFICIAL' },
          { n: '08', label: 'REDES SOCIAIS', value: '15k+ ENGAJADOS' },
        ];

        return (
          <>
            <HudTop chapter="08 — FECHAMENTO" num={8} />

            <div style={{
              position: 'absolute',
              left: 100, top: 180,
              opacity: Easing.easeOutCubic(eyebrowT),
              transform: `translateY(${(1 - eyebrowT) * 18}px)`,
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13, letterSpacing: '0.3em',
                color: PALETTE.blue,
                textTransform: 'uppercase',
              }}>/ RESUMO DA OPERAÇÃO</div>
            </div>

            <div style={{
              position: 'absolute',
              left: 100, top: 230,
              opacity: Easing.easeOutCubic(titleT),
              transform: `translateY(${(1 - titleT) * 18}px)`,
              fontFamily: 'Space Grotesk',
              fontSize: 92, fontWeight: 500,
              lineHeight: 0.94,
              letterSpacing: '-0.04em',
              color: PALETTE.paper,
            }}>
              Oito frentes.<br/>
              Uma <Em>aliança.</Em>
            </div>

            {/* placement grid */}
            <div style={{
              position: 'absolute',
              left: 100, right: 100, top: 480,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 14,
              opacity: gridT,
            }}>
              {placements.map((p, i) => {
                const cellAppear = 1.0 + i * 0.08;
                const cellT = clamp((localTime - cellAppear) / 0.5, 0, 1);
                return (
                  <div key={p.n} style={{
                    padding: '20px 22px',
                    border: '1px solid rgba(120,160,255,0.25)',
                    background: 'linear-gradient(135deg, rgba(120,160,255,0.06), rgba(120,160,255,0.02))',
                    opacity: cellT,
                    transform: `translateY(${(1 - cellT) * 14}px) scale(${0.96 + 0.04 * cellT})`,
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    }}>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11, letterSpacing: '0.3em',
                        color: PALETTE.blue,
                      }}>/ {p.n}</span>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 9, letterSpacing: '0.2em',
                        color: PALETTE.mute,
                      }}>{p.value}</span>
                    </div>
                    <div style={{
                      fontFamily: 'Space Grotesk',
                      fontSize: 22, fontWeight: 500,
                      letterSpacing: '-0.02em',
                      color: PALETTE.paper,
                      marginTop: 18,
                      lineHeight: 1.05,
                    }}>{p.label}</div>
                    {/* sponsor mark mini */}
                    <div style={{
                      marginTop: 14,
                      padding: '6px 10px',
                      border: `1px solid ${tweaks.sponsorColor}40`,
                      fontFamily: 'Space Grotesk',
                      fontSize: 12, fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: tweaks.sponsorColor,
                      display: 'inline-block',
                    }}>{tweaks.sponsorName}</div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div style={{
              position: 'absolute',
              left: 100, top: 770,
              opacity: ctaT,
              transform: `translateY(${(1 - ctaT) * 18}px)`,
              display: 'flex', alignItems: 'baseline', gap: 24,
            }}>
              <div style={{
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic', fontWeight: 300,
                fontSize: 64, lineHeight: 1,
                letterSpacing: '-0.02em',
                color: PALETTE.blueHot,
              }}>Vamos lapidar juntos?</div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 14, letterSpacing: '0.24em',
                color: PALETTE.paperDim,
              }}>parcerias@intersg.com.br</div>
            </div>

            <HudBottom left="INTER SG // FIM DA TRANSMISSÃO" mid="CICLO 2026" right="SG-TRANSMIT::END" />
          </>
        );
      }}
    </Sprite>
  );
}

Object.assign(window, {
  SceneIntro, SceneJerseyMaster, SceneJerseyBack,
  SceneStadium, SceneInfra, SceneSocial,
  SceneEvents, SceneSummary,
  HudTop, HudBottom, TitleBlock, StatCallout, Em, PALETTE,
});
