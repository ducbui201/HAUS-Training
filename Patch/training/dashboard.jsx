/* ============================================================
   HAUS Training — Dashboard (training mode)
   4-column flow: Khu vực → Máy → Hoá chất → Dụng cụ
   Selected package drives connection lines.
   ============================================================ */

const { useState, useEffect, useMemo, useRef, useCallback } = React;

function FlowEntity({ id, name, type, icon, isActive, isOn, isDim, onClick, areaStyle = false }) {
  return (
    <div
      id={id}
      className={`ent${areaStyle ? " area" : ""}${isActive ? " is-active" : ""}${isOn ? " is-on" : ""}${isDim ? " is-dim" : ""}`}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      data-comment-anchor={id}
    >
      <div className="thumb">
        <Icon name={icon} size={areaStyle ? 22 : 24} />
      </div>
      <div className="body">
        <div className="name">{name}</div>
        {type ? <div className="type">{type}</div> : null}
      </div>
    </div>
  );
}

function DetailDrawer({ entity, kind, related, onClose }) {
  if (!entity) return null;
  const eyebrows = {
    machine:  "Thiết bị",
    chemical: "Hoá chất",
    tool:     "Dụng cụ"
  };
  return (
    <aside className={`detail-drawer${entity ? " is-open" : ""}`} onClick={(e) => e.stopPropagation()}>
      <button className="close" onClick={onClose} aria-label="Đóng">
        <Icon name="X" size={16} />
      </button>
      <div>
        <div className="eyebrow">{eyebrows[kind] || "Chi tiết"}</div>
        <h2>{entity.name}</h2>
        {entity.type ? <div className="type">{entity.type}</div> : null}
      </div>
      <div className="hero">[ Ảnh sản phẩm — drop ảnh thật vào ]</div>
      <p className="desc">{entity.desc}</p>
      {related && related.length > 0 ? (
        <div className="related">
          <h3>Đi cùng trong các quy trình</h3>
          <div className="chip-row">
            {related.map((r, i) => (
              <span key={i} className="chip">{r}</span>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

/**
 * Dashboard
 * props:
 *   state: {packages, areas, machines, chemicals, tools, mappings}
 *   tweaks: {tone, lineStyle, density, showImages}
 */
function Dashboard({ state, tweaks }) {
  const { packages, areas, machines, chemicals, tools, mappings } = state;

  const [activePackage, setActivePackage] = useState(packages[0]?.id || null);
  const [activeArea, setActiveArea] = useState(null);
  const [selected, setSelected] = useState(null); // { kind, id }
  const [query, setQuery] = useState("");
  const stageRef = useRef(null);
  const flowRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Active mappings — filtered by package and (optionally) area
  const activeMappings = useMemo(() => {
    if (!activePackage) return [];
    let list = mappings.filter((m) => m.packageId === activePackage);
    if (activeArea) list = list.filter((m) => m.areaId === activeArea);
    return list;
  }, [activePackage, activeArea, mappings]);

  // Which machines / chems / tools light up
  const activeIds = useMemo(() => {
    const m = new Set();
    const c = new Set();
    const t = new Set();
    activeMappings.forEach((mp) => {
      m.add(mp.machineId);
      (mp.chemicalIds || []).forEach((x) => c.add(x));
      (mp.toolIds || []).forEach((x) => t.add(x));
    });
    return { machines: m, chemicals: c, tools: t };
  }, [activeMappings]);

  // Areas that have any mapping in this package
  const areasInPackage = useMemo(() => {
    const set = new Set();
    if (activePackage) {
      mappings
        .filter((m) => m.packageId === activePackage)
        .forEach((m) => set.add(m.areaId));
    }
    return set;
  }, [activePackage, mappings]);

  // Filter for search
  const filterList = useCallback((items, fields = ["name", "type", "desc"]) => {
    if (!query) return items;
    const q = query.toLowerCase().trim();
    return items.filter((it) =>
      fields.some((f) => (it[f] || "").toLowerCase().includes(q))
    );
  }, [query]);

  // ===== Calculate connection lines =====
  const calcLines = useCallback(() => {
    if (!flowRef.current) return;
    const containerRect = flowRef.current.getBoundingClientRect();
    const stageScale = (() => {
      // Compensate for stage scale transform
      const s = stageRef.current;
      if (!s) return 1;
      const r = s.getBoundingClientRect();
      return r.width / 1920;
    })();
    const scale = stageScale || 1;
    const offset = (id, edge) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const left = (r.left - containerRect.left) / scale;
      const right = (r.right - containerRect.left) / scale;
      const top = (r.top - containerRect.top) / scale;
      const height = r.height / scale;
      return {
        x: edge === "left" ? left : right,
        y: top + height / 2
      };
    };

    // Quiet by default. Only draw lines when an area is selected — that's the spotlight.
    if (!activePackage || !activeArea) { setLines([]); return; }

    const out = [];
    activeMappings.forEach((mp) => {
      const opacity = 0.95;
      const width = 1.6;
      const animate = true;

      const aR = offset(`area-${mp.areaId}`, "right");
      const mL = offset(`machine-${mp.machineId}`, "left");
      const mR = offset(`machine-${mp.machineId}`, "right");
      if (aR && mL) {
        out.push({ id: `a-m-${mp.id}`, x1: aR.x, y1: aR.y, x2: mL.x, y2: mL.y, opacity, width, animate });
      }
      if (mR) {
        (mp.chemicalIds || []).forEach((cid) => {
          const cL = offset(`chemical-${cid}`, "left");
          const cR = offset(`chemical-${cid}`, "right");
          if (cL) out.push({ id: `m-c-${mp.id}-${cid}`, x1: mR.x, y1: mR.y, x2: cL.x, y2: cL.y, opacity, width, animate });
          if (cR) {
            (mp.toolIds || []).forEach((tid) => {
              const tL = offset(`tool-${tid}`, "left");
              if (tL) out.push({ id: `c-t-${mp.id}-${cid}-${tid}`, x1: cR.x, y1: cR.y, x2: tL.x, y2: tL.y, opacity, width, animate });
            });
          }
        });
        // Machine → tool direct (if no chems)
        if (!mp.chemicalIds || mp.chemicalIds.length === 0) {
          (mp.toolIds || []).forEach((tid) => {
            const tL = offset(`tool-${tid}`, "left");
            if (tL) out.push({ id: `m-t-${mp.id}-${tid}`, x1: mR.x, y1: mR.y, x2: tL.x, y2: tL.y, opacity, width, animate });
          });
        }
      }
    });
    setLines(out);
  }, [activeMappings, activePackage, activeArea]);

  useEffect(() => {
    const t = setTimeout(calcLines, 80);
    const handler = () => calcLines();
    window.addEventListener("resize", handler);
    return () => { clearTimeout(t); window.removeEventListener("resize", handler); };
  }, [calcLines]);

  // Also recalc when search changes (filter may hide elements)
  useEffect(() => {
    const t = setTimeout(calcLines, 100);
    return () => clearTimeout(t);
  }, [query, tweaks, calcLines]);

  // ===== Detail drawer content =====
  const drawerEntity = useMemo(() => {
    if (!selected) return null;
    if (selected.kind === "machine")  return machines.find((m) => m.id === selected.id);
    if (selected.kind === "chemical") return chemicals.find((c) => c.id === selected.id);
    if (selected.kind === "tool")     return tools.find((t) => t.id === selected.id);
    return null;
  }, [selected, machines, chemicals, tools]);

  const drawerRelated = useMemo(() => {
    if (!selected) return [];
    const out = new Set();
    mappings.forEach((mp) => {
      const hit =
        (selected.kind === "machine" && mp.machineId === selected.id) ||
        (selected.kind === "chemical" && (mp.chemicalIds || []).includes(selected.id)) ||
        (selected.kind === "tool" && (mp.toolIds || []).includes(selected.id));
      if (hit) {
        const pkg = packages.find((p) => p.id === mp.packageId);
        const area = areas.find((a) => a.id === mp.areaId);
        if (pkg && area) out.add(`${pkg.name} · ${area.name}`);
      }
    });
    return [...out];
  }, [selected, mappings, packages, areas]);

  const activePkgObj = packages.find((p) => p.id === activePackage);
  const stageClass = `stage${tweaks.tone === "ivory" ? " tone-ivory" : ""}${tweaks.speaker ? " speaker" : ""}`;

  // Click outside clears area / selection
  const handleStageClick = () => {
    setActiveArea(null);
    setSelected(null);
  };

  return (
    <div className={stageClass} ref={stageRef} onClick={handleStageClick}>
      {/* HEADER */}
      <header className="cockpit-header">
        <div className="brand-block">
          <img className="mark" src="assets/logo-mark-gold-on-navy.png" alt="HAUS" />
          <div className="divider"></div>
          <div className="lockup">
            <div className="name">HAUS</div>
            <div className="tag">Training Cockpit</div>
          </div>
        </div>
        <div className="search-row" onClick={(e) => e.stopPropagation()}>
          <Icon name="Search" size={16} color={tweaks.tone === "ivory" ? "var(--haus-navy-600)" : "var(--haus-gold)"} />
          <input
            type="text"
            placeholder="Tìm máy, hoá chất hoặc dụng cụ…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="mode-tabs" onClick={(e) => e.stopPropagation()}>
          <button className="is-active">Đào tạo</button>
          <button onClick={() => window.HAUS_GO_CONFIG && window.HAUS_GO_CONFIG()}>Cấu hình</button>
        </div>
      </header>

      {/* PACKAGE BAR */}
      <div className="pkg-bar" onClick={(e) => e.stopPropagation()}>
        {packages.map((pkg, idx) => {
          const active = pkg.id === activePackage;
          return (
            <button
              key={pkg.id}
              className={`pkg-tab${active ? " is-active" : ""}`}
              onClick={() => { setActivePackage(pkg.id); setActiveArea(null); setSelected(null); }}
            >
              <span className="eyebrow">Gói {String(idx + 1).padStart(2, "0")}</span>
              <span className="label">{pkg.name}</span>
            </button>
          );
        })}
      </div>
      <div className="pkg-desc">
        {activePkgObj ? <span><em>“</em>{activePkgObj.desc}<em>”</em></span> : null}
      </div>

      {/* FLOW GRID */}
      <div className="flow-grid" ref={flowRef}>
        {/* SVG connections */}
        <svg className="flow-svg" preserveAspectRatio="none">
          <defs>
            <marker id="dot-end" markerWidth="6" markerHeight="6" refX="3" refY="3">
              <circle cx="3" cy="3" r="2" fill="#E5C78F" />
            </marker>
          </defs>
          {lines.map((ln) => {
            const dx = Math.abs(ln.x2 - ln.x1);
            const cp1X = ln.x1 + dx * 0.45;
            const cp2X = ln.x2 - dx * 0.45;
            const d = `M ${ln.x1} ${ln.y1} C ${cp1X} ${ln.y1}, ${cp2X} ${ln.y2}, ${ln.x2} ${ln.y2}`;
            return (
              <g key={ln.id} className="flow-line">
                <path
                  d={d}
                  stroke="#E5C78F"
                  strokeWidth={ln.width}
                  strokeOpacity={ln.opacity}
                  fill="none"
                />
                {ln.animate && (
                  <g>
                    <polygon
                      points="0,-6 1,-1 6,0 1,1 0,6 -1,1 -6,0 -1,-1"
                      fill="#E5C78F"
                    >
                      <animateMotion dur="3.6s" repeatCount="indefinite" path={d} rotate="auto" />
                    </polygon>
                    <polygon
                      points="0,-4 0.7,-0.7 4,0 0.7,0.7 0,4 -0.7,0.7 -4,0 -0.7,-0.7"
                      fill="#E5C78F"
                      opacity="0.55"
                    >
                      <animateMotion dur="3.6s" begin="1.5s" repeatCount="indefinite" path={d} rotate="auto" />
                    </polygon>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* COL 1 — Areas */}
        <div className="flow-col" onClick={(e) => e.stopPropagation()}>
          <div className="col-head">
            <span className="h">Khu vực</span>
            <span className="count">{areas.length.toString().padStart(2, "0")} VỊ TRÍ</span>
          </div>
          <div className="col-body">
            {areas.map((a) => {
              const inPkg = areasInPackage.has(a.id);
              const isOn = activeArea === a.id;
              return (
                <FlowEntity
                  key={a.id}
                  id={`area-${a.id}`}
                  name={a.name}
                  icon={a.lucide || "Pin"}
                  isActive={isOn}
                  isDim={activePackage && !inPkg}
                  areaStyle
                  onClick={() => setActiveArea(isOn ? null : a.id)}
                />
              );
            })}
          </div>
        </div>

        {/* COL 2 — Machines */}
        <div className="flow-col" onClick={(e) => e.stopPropagation()}>
          <div className="col-head">
            <span className="h">Thiết bị Kärcher</span>
            <span className="count">{machines.length.toString().padStart(2, "0")} MÁY</span>
          </div>
          <div className="col-body">
            {filterList(machines).map((m) => {
              const on = activeIds.machines.has(m.id);
              const isSel = selected && selected.kind === "machine" && selected.id === m.id;
              const dim = activePackage && activeArea && !on && !isSel;
              return (
                <FlowEntity
                  key={m.id}
                  id={`machine-${m.id}`}
                  name={m.name}
                  type={m.type}
                  icon="Box"
                  isActive={isSel}
                  isOn={on && activeArea && !isSel}
                  isDim={dim}
                  onClick={() => setSelected({ kind: "machine", id: m.id })}
                />
              );
            })}
          </div>
        </div>

        {/* COL 3 — Chemicals */}
        <div className="flow-col" onClick={(e) => e.stopPropagation()}>
          <div className="col-head">
            <span className="h">Hoá chất</span>
            <span className="count">{chemicals.length.toString().padStart(2, "0")} LOẠI</span>
          </div>
          <div className="col-body">
            {filterList(chemicals).map((c) => {
              const on = activeIds.chemicals.has(c.id);
              const isSel = selected && selected.kind === "chemical" && selected.id === c.id;
              const dim = activePackage && activeArea && !on && !isSel;
              return (
                <FlowEntity
                  key={c.id}
                  id={`chemical-${c.id}`}
                  name={c.name}
                  type={c.type}
                  icon="Droplet"
                  isActive={isSel}
                  isOn={on && activeArea && !isSel}
                  isDim={dim}
                  onClick={() => setSelected({ kind: "chemical", id: c.id })}
                />
              );
            })}
          </div>
        </div>

        {/* COL 4 — Tools */}
        <div className="flow-col" onClick={(e) => e.stopPropagation()}>
          <div className="col-head">
            <span className="h">Dụng cụ</span>
            <span className="count">{tools.length.toString().padStart(2, "0")} MỤC</span>
          </div>
          <div className="col-body">
            {filterList(tools).map((t) => {
              const on = activeIds.tools.has(t.id);
              const isSel = selected && selected.kind === "tool" && selected.id === t.id;
              const dim = activePackage && activeArea && !on && !isSel;
              return (
                <FlowEntity
                  key={t.id}
                  id={`tool-${t.id}`}
                  name={t.name}
                  type={t.type}
                  icon="Wrench"
                  isActive={isSel}
                  isOn={on && activeArea && !isSel}
                  isDim={dim}
                  onClick={() => setSelected({ kind: "tool", id: t.id })}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* DETAIL DRAWER */}
      <DetailDrawer
        entity={drawerEntity}
        kind={selected && selected.kind}
        related={drawerRelated}
        onClose={() => setSelected(null)}
      />

      {/* FOOTER */}
      <footer className="cockpit-footer">
        <span>
          <span className="gold">✦</span>&nbsp;&nbsp;HAUS&nbsp;&nbsp;<span className="gold">·</span>&nbsp;&nbsp;Quy trình làm sạch
        </span>
        <span>
          {activePkgObj ? activePkgObj.name : "—"}
          &nbsp;&nbsp;<span className="gold">·</span>&nbsp;&nbsp;
          {activeArea ? (areas.find((a) => a.id === activeArea)?.name) : "Toàn khu vực"}
          &nbsp;&nbsp;<span className="gold">·</span>&nbsp;&nbsp;
          {activeMappings.length} quy trình
        </span>
        <span>Bấm khu vực để soi quy trình&nbsp;&nbsp;<span className="gold">→</span></span>
      </footer>
    </div>
  );
}

window.Dashboard = Dashboard;
