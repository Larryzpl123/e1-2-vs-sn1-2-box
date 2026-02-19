import { useEffect, useRef, useState } from "react";

// Color constants
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#b91c1c";
const GOLD = "#ca8a04";
const SLATE = "#334155";
const GRAY = "#9ca3af";
const ARROW_GRAY = "#94a3b8";
const YES_COLOR = "#16a34a";
const NO_COLOR = "#dc2626";

// ── Reusable box components ──
const StartBox = ({ children, id }) => (
  <div id={id} style={{
    background: "#f1f5f9", border: `2.5px solid ${SLATE}`, borderRadius: 12,
    padding: "12px 28px", fontSize: 17, fontWeight: 700, color: SLATE,
    display: "inline-block", whiteSpace: "nowrap",
  }}>{children}</div>
);

const DegreeBox = ({ children, id }) => (
  <div id={id} style={{
    background: "#f1f5f9", border: `2.5px solid ${SLATE}`, borderRadius: 10,
    padding: "8px 22px", fontSize: 17, fontWeight: 700, color: SLATE,
    display: "inline-block",
  }}>{children}</div>
);

const QuestionBox = ({ children, id }) => (
  <div id={id} style={{
    background: "#f9fafb", border: `2px solid ${GRAY}`, borderRadius: 10,
    padding: "10px 18px", fontSize: 14, fontWeight: 600, color: "#374151",
    display: "inline-block", whiteSpace: "nowrap",
  }}>{children}</div>
);

const ResultBox = ({ children, id, type }) => {
  const styles = {
    sn2: { bg: "#eff6ff", border: BLUE, color: BLUE },
    sn1: { bg: "#f0fdf4", border: GREEN, color: GREEN },
    e2:  { bg: "#fef2f2", border: RED, color: RED },
    e1:  { bg: "#fefce8", border: GOLD, color: GOLD },
  };
  const s = styles[type];
  return (
    <div id={id} style={{
      background: s.bg, border: `3px solid ${s.border}`, borderRadius: 10,
      padding: "10px 22px", fontSize: 16, fontWeight: 700, color: s.color,
      display: "inline-block",
    }}>{children}</div>
  );
};

const YesLabel = () => <div style={{ fontSize: 13, fontWeight: 700, color: YES_COLOR, margin: "4px 0" }}>Yes</div>;
const NoLabel = () => <div style={{ fontSize: 13, fontWeight: 700, color: NO_COLOR, margin: "4px 0" }}>No</div>;

// ── SVG arrow drawing ──
function Arrow({ from, to, color = ARROW_GRAY, svgRef }) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const update = () => {
      const svg = svgRef.current;
      const fromEl = document.getElementById(from);
      const toEl = document.getElementById(to);
      if (!svg || !fromEl || !toEl) return;
      const svgRect = svg.getBoundingClientRect();
      const fRect = fromEl.getBoundingClientRect();
      const tRect = toEl.getBoundingClientRect();
      setCoords({
        x1: fRect.left + fRect.width / 2 - svgRect.left,
        y1: fRect.top + fRect.height - svgRect.top,
        x2: tRect.left + tRect.width / 2 - svgRect.left,
        y2: tRect.top - svgRect.top,
      });
    };
    update();
    window.addEventListener("resize", update);
    const timer = setTimeout(update, 100);
    return () => { window.removeEventListener("resize", update); clearTimeout(timer); };
  }, [from, to, svgRef]);

  if (!coords) return null;
  const { x1, y1, x2, y2 } = coords;
  const markerId = `ah-${from}-${to}`;
  return (
    <>
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1 + 2} x2={x2} y2={y2 - 2}
        stroke={color} strokeWidth={2} markerEnd={`url(#${markerId})`} />
    </>
  );
}

function LabelOnArrow({ from, to, label, color, svgRef }) {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    const update = () => {
      const svg = svgRef.current;
      const fromEl = document.getElementById(from);
      const toEl = document.getElementById(to);
      if (!svg || !fromEl || !toEl) return;
      const svgRect = svg.getBoundingClientRect();
      const fRect = fromEl.getBoundingClientRect();
      const tRect = toEl.getBoundingClientRect();
      const mx = (fRect.left + fRect.width / 2 + tRect.left + tRect.width / 2) / 2 - svgRect.left;
      const my = (fRect.top + fRect.height + tRect.top) / 2 - svgRect.top;
      setPos({ x: mx, y: my });
    };
    update();
    window.addEventListener("resize", update);
    const timer = setTimeout(update, 100);
    return () => { window.removeEventListener("resize", update); clearTimeout(timer); };
  }, [from, to, svgRef]);

  if (!pos) return null;
  return (
    <text x={pos.x + 8} y={pos.y} fill={color} fontSize={12} fontWeight={700}
      fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">{label}</text>
  );
}

// ── Main component ──
export default function Flowchart() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [svgSize, setSvgSize] = useState({ w: 1100, h: 700 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setSvgSize({ w: r.width, h: r.height });
      }
    };
    update();
    const timer = setTimeout(update, 150);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("resize", update); clearTimeout(timer); };
  }, []);

  return (
    <div style={{ background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", padding: "24px 12px 40px", position: "relative" }}>
      <h1 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>
        Substitution &amp; Elimination — Decision Flowchart
      </h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        {[["SN2", BLUE, "#eff6ff"], ["SN1", GREEN, "#f0fdf4"], ["E2", RED, "#fef2f2"], ["E1", GOLD, "#fefce8"]].map(([label, c, bg]) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#555" }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, border: `2.5px solid ${c}`, background: bg, display: "inline-block" }} />
            {label}
          </span>
        ))}
      </div>

      <div ref={containerRef} style={{ position: "relative" }}>
        {/* SVG overlay for arrows */}
        <svg ref={svgRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
          viewBox={`0 0 ${svgSize.w} ${svgSize.h}`} preserveAspectRatio="none">
          {/* Start → Degrees */}
          <Arrow from="start" to="deg0" svgRef={svgRef} />
          <Arrow from="start" to="deg1" svgRef={svgRef} />
          <Arrow from="start" to="deg2" svgRef={svgRef} />
          <Arrow from="start" to="deg3" svgRef={svgRef} />
          <LabelOnArrow from="start" to="deg0" label="0°" color="#64748b" svgRef={svgRef} />
          <LabelOnArrow from="start" to="deg1" label="1°" color="#64748b" svgRef={svgRef} />
          <LabelOnArrow from="start" to="deg2" label="2°" color="#64748b" svgRef={svgRef} />
          <LabelOnArrow from="start" to="deg3" label="3°" color="#64748b" svgRef={svgRef} />

          {/* 0°: deg0 → sn2_0 */}
          <Arrow from="deg0" to="sn2_0" svgRef={svgRef} />

          {/* 1°: deg1 → q1_bulky */}
          <Arrow from="deg1" to="q1_bulky" svgRef={svgRef} />
          <Arrow from="q1_bulky" to="e2_1" color={YES_COLOR} svgRef={svgRef} />
          <Arrow from="q1_bulky" to="sn2_1" color={NO_COLOR} svgRef={svgRef} />

          {/* 2°: deg2 → q2_charge */}
          <Arrow from="deg2" to="q2_charge" svgRef={svgRef} />
          <Arrow from="q2_charge" to="q2a_strong" color={YES_COLOR} svgRef={svgRef} />
          <Arrow from="q2_charge" to="q2b_heat" color={NO_COLOR} svgRef={svgRef} />
          <Arrow from="q2a_strong" to="e2_2" color={YES_COLOR} svgRef={svgRef} />
          <Arrow from="q2a_strong" to="sn2_2" color={NO_COLOR} svgRef={svgRef} />
          <Arrow from="q2b_heat" to="e1_2" color={YES_COLOR} svgRef={svgRef} />
          <Arrow from="q2b_heat" to="sn1_2" color={NO_COLOR} svgRef={svgRef} />

          {/* 3°: deg3 → q3_strong */}
          <Arrow from="deg3" to="q3_strong" svgRef={svgRef} />
          <Arrow from="q3_strong" to="e2_3" color={YES_COLOR} svgRef={svgRef} />
          <Arrow from="q3_strong" to="q3b_heat" color={NO_COLOR} svgRef={svgRef} />
          <Arrow from="q3b_heat" to="e1_3" color={YES_COLOR} svgRef={svgRef} />
          <Arrow from="q3b_heat" to="sn1_3" color={NO_COLOR} svgRef={svgRef} />
        </svg>

        {/* ── HTML Layout ── */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

          {/* Row 0: Start */}
          <div style={{ marginBottom: 40 }}>
            <StartBox id="start">Substrate Carbon Degree?</StartBox>
          </div>

          {/* Row 1: Degree boxes */}
          <div style={{ display: "flex", justifyContent: "center", gap: 100, marginBottom: 40, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DegreeBox id="deg0">0°</DegreeBox>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DegreeBox id="deg1">1°</DegreeBox>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DegreeBox id="deg2">2°</DegreeBox>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DegreeBox id="deg3">3°</DegreeBox>
            </div>
          </div>

          {/* Row 2: Direct results / First questions */}
          <div style={{ display: "flex", justifyContent: "center", gap: 100, marginBottom: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* 0° → SN2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <ResultBox id="sn2_0" type="sn2">SN2</ResultBox>
            </div>
            {/* 1° → Bulky base? */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <QuestionBox id="q1_bulky">Bulky base?</QuestionBox>
            </div>
            {/* 2° → Nu has charge? */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <QuestionBox id="q2_charge">Nu⁻ has charge?</QuestionBox>
            </div>
            {/* 3° → Strong base? */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <QuestionBox id="q3_strong">Strong base?</QuestionBox>
            </div>
          </div>

          {/* Row 3: Second level results / questions */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* 1° results */}
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <YesLabel />
                <ResultBox id="e2_1" type="e2">E2</ResultBox>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <NoLabel />
                <ResultBox id="sn2_1" type="sn2">SN2</ResultBox>
                <div style={{ fontSize: 14, color: "#1a1a1a", fontStyle: "italic", marginTop: 6 }}>(most of the time)</div>
              </div>
            </div>

            <div style={{ width: 40 }} />

            {/* 2° second level: Strong base? and Heat? */}
            <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <YesLabel />
                <QuestionBox id="q2a_strong">Strong base?</QuestionBox>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <NoLabel />
                <QuestionBox id="q2b_heat">Heat?</QuestionBox>
              </div>
            </div>

            <div style={{ width: 40 }} />

            {/* 3° results / Heat? */}
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <YesLabel />
                <ResultBox id="e2_3" type="e2">E2</ResultBox>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <NoLabel />
                <QuestionBox id="q3b_heat">Heat?</QuestionBox>
              </div>
            </div>
          </div>

          {/* Row 4: Final results */}
          <div style={{ display: "flex", justifyContent: "center", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Spacer for 0° and 1° columns */}
            <div style={{ width: 180 }} />

            {/* 2° Strong base results */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <YesLabel />
                <ResultBox id="e2_2" type="e2">E2</ResultBox>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <NoLabel />
                <ResultBox id="sn2_2" type="sn2">SN2</ResultBox>
              </div>
            </div>

            <div style={{ width: 10 }} />

            {/* 2° Heat results */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <YesLabel />
                <ResultBox id="e1_2" type="e1">E1</ResultBox>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <NoLabel />
                <ResultBox id="sn1_2" type="sn1">SN1</ResultBox>
              </div>
            </div>

            <div style={{ width: 30 }} />

            {/* 3° Heat results */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <YesLabel />
                <ResultBox id="e1_3" type="e1">E1</ResultBox>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <NoLabel />
                <ResultBox id="sn1_3" type="sn1">SN1</ResultBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
