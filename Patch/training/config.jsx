/* ============================================================
   HAUS Training — Config (admin mode)
   Sidebar: Packages / Areas / Machines / Chemicals / Tools / Mappings
   ============================================================ */

const { useState: useStateC, useMemo: useMemoC, useRef: useRefC } = React;

// ---------- shared form modal ----------
function ConfigModal({ title, eyebrow, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Đóng">
          <Icon name="X" size={14} />
        </button>
        {eyebrow ? <div className="modal-eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// ---------- Entity editor ----------
function EntityForm({ kind, value, allLucide, onSave, onCancel }) {
  const [draft, setDraft] = useStateC(value || { id: "", name: "", type: "", desc: "", lucide: "Box" });
  const update = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const isPackage = kind === "package";
  const isArea = kind === "area";

  return (
    <div className="form-grid">
      <div className="form-row">
        <label>Tên hiển thị</label>
        <input value={draft.name || ""} onChange={(e) => update("name", e.target.value)} />
      </div>
      {!isPackage && !isArea ? (
        <div className="form-row">
          <label>Phân loại</label>
          <input value={draft.type || ""} onChange={(e) => update("type", e.target.value)} />
        </div>
      ) : null}
      <div className="form-row">
        <label>Mô tả ngắn</label>
        <textarea value={draft.desc || ""} onChange={(e) => update("desc", e.target.value)} />
      </div>
      {(isPackage || isArea) ? (
        <div className="form-row">
          <label>Icon (Lucide)</label>
          <select value={draft.lucide || "Box"} onChange={(e) => update("lucide", e.target.value)}>
            {allLucide.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      ) : null}
      <div className="form-row">
        <label>Mã định danh (id)</label>
        <input
          value={draft.id || ""}
          onChange={(e) => update("id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          placeholder="vd: t11-1"
          readOnly={!!(value && value.id)}
          style={value && value.id ? { opacity: 0.55 } : {}}
        />
      </div>
      <div className="form-actions">
        <button className="haus-btn" onClick={onCancel}>Huỷ</button>
        <button className="haus-btn primary" onClick={() => onSave(draft)}>
          <Icon name="Sparkles" size={14} /> Lưu
        </button>
      </div>
    </div>
  );
}

// ---------- Mapping editor ----------
function MappingForm({ value, packages, areas, machines, chemicals, tools, onSave, onCancel }) {
  const [draft, setDraft] = useStateC(value || {
    id: "m" + Date.now(),
    packageId: packages[0]?.id || "",
    areaId: areas[0]?.id || "",
    machineId: machines[0]?.id || "",
    chemicalIds: [],
    toolIds: [],
    frequency: "",
    description: ""
  });
  const update = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const toggleId = (k, id) => setDraft((d) => {
    const cur = new Set(d[k] || []);
    if (cur.has(id)) cur.delete(id); else cur.add(id);
    return { ...d, [k]: [...cur] };
  });

  return (
    <div className="form-grid">
      <div className="form-row">
        <label>Gói dịch vụ</label>
        <select value={draft.packageId} onChange={(e) => update("packageId", e.target.value)}>
          {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Khu vực</label>
        <select value={draft.areaId} onChange={(e) => update("areaId", e.target.value)}>
          {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Máy chính</label>
        <select value={draft.machineId} onChange={(e) => update("machineId", e.target.value)}>
          {machines.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.type}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Hoá chất kết hợp</label>
        <div className="chip-pick">
          {chemicals.map((c) => (
            <button
              key={c.id}
              className={(draft.chemicalIds || []).includes(c.id) ? "is-on" : ""}
              onClick={() => toggleId("chemicalIds", c.id)}
              type="button"
            >{c.name}</button>
          ))}
        </div>
      </div>
      <div className="form-row">
        <label>Dụng cụ / phụ kiện</label>
        <div className="chip-pick">
          {tools.map((t) => (
            <button
              key={t.id}
              className={(draft.toolIds || []).includes(t.id) ? "is-on" : ""}
              onClick={() => toggleId("toolIds", t.id)}
              type="button"
            >{t.name}</button>
          ))}
        </div>
      </div>
      <div className="form-row">
        <label>Tần suất (nếu định kỳ)</label>
        <input
          value={draft.frequency || ""}
          onChange={(e) => update("frequency", e.target.value)}
          placeholder="vd: Hàng tuần, 2–3 tháng/lần…"
        />
      </div>
      <div className="form-row">
        <label>Mô tả thao tác</label>
        <textarea
          value={draft.description || ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Nhân viên đào tạo sẽ đọc dòng này khi diễn giải quy trình."
        />
      </div>
      <div className="form-actions">
        <button className="haus-btn" onClick={onCancel}>Huỷ</button>
        <button className="haus-btn primary" onClick={() => onSave(draft)}>
          <Icon name="Sparkles" size={14} /> Lưu quy trình
        </button>
      </div>
    </div>
  );
}

// ---------- Entity list page (Packages, Areas, Machines, Chemicals, Tools) ----------
function EntityPage({ kind, title, eyebrow, sub, items, allLucide, onAdd, onUpdate, onRemove }) {
  const [editing, setEditing] = useStateC(null); // null = closed, {} = new, {...} = edit existing
  const [confirmRemove, setConfirmRemove] = useStateC(null);

  return (
    <>
      <div className="cfg-head">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="title">{title}</h1>
          <div className="sub">{sub} <span style={{ color: "var(--haus-gold-700)" }}>· {items.length} mục</span></div>
        </div>
        <div className="actions">
          <button className="haus-btn primary" onClick={() => setEditing({})}>
            <Icon name="Plus" size={14} /> Thêm mới
          </button>
        </div>
      </div>

      <div className="cfg-list">
        {items.map((it) => {
          const iconName =
            (kind === "package" || kind === "area") ? (it.lucide || "Box") :
            kind === "machine" ? "Box" :
            kind === "chemical" ? "Droplet" :
            "Wrench";
          return (
            <div className="cfg-card" key={it.id} onClick={() => setEditing(it)}>
              <div className="thumb">
                <Icon name={iconName} size={26} color="var(--haus-navy)" />
              </div>
              <div className="body">
                <div className="name">{it.name}</div>
                {it.type ? <div className="type">{it.type}</div> : null}
                <div className="desc">{it.desc || it.description}</div>
              </div>
              <div className="quick">
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setEditing(it); }} title="Sửa">
                  <Icon name="Pencil" size={14} />
                </button>
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setConfirmRemove(it); }} title="Xoá">
                  <Icon name="Trash" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing ? (
        <ConfigModal
          eyebrow={editing.id ? "CHỈNH SỬA" : "THÊM MỚI"}
          title={editing.id ? editing.name : `Thêm ${title.toLowerCase()}`}
          onClose={() => setEditing(null)}
        >
          <EntityForm
            kind={kind}
            value={editing.id ? editing : null}
            allLucide={allLucide}
            onSave={(d) => {
              if (!d.name) return;
              if (!d.id) d.id = (d.name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
              if (editing.id) onUpdate(d); else onAdd(d);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </ConfigModal>
      ) : null}

      {confirmRemove ? (
        <ConfigModal
          eyebrow="XÁC NHẬN"
          title="Xoá mục này"
          onClose={() => setConfirmRemove(null)}
        >
          <p style={{ fontFamily: "var(--font-sans)", color: "var(--haus-navy-600)", lineHeight: 1.6 }}>
            Anh/Chị có chắc muốn xoá <strong>{confirmRemove.name}</strong>? Mọi quy trình đang dùng mục này
            cũng sẽ chịu ảnh hưởng.
          </p>
          <div className="form-actions">
            <button className="haus-btn" onClick={() => setConfirmRemove(null)}>Huỷ</button>
            <button className="haus-btn danger" onClick={() => { onRemove(confirmRemove.id); setConfirmRemove(null); }}>
              <Icon name="Trash" size={14} /> Xoá
            </button>
          </div>
        </ConfigModal>
      ) : null}
    </>
  );
}

// ---------- Mappings page (matrix view + edit) ----------
function MappingsPage({ state, onAdd, onUpdate, onRemove }) {
  const { packages, areas, machines, chemicals, tools, mappings } = state;
  const [editing, setEditing] = useStateC(null); // mapping object or {} for new
  const [filterPkg, setFilterPkg] = useStateC("all");

  const cellMappings = (pkgId, areaId) =>
    mappings.filter((m) => m.packageId === pkgId && m.areaId === areaId);

  const visiblePackages = filterPkg === "all" ? packages : packages.filter((p) => p.id === filterPkg);

  return (
    <>
      <div className="cfg-head">
        <div>
          <div className="eyebrow">QUY CHUẨN</div>
          <h1 className="title">Mối liên kết</h1>
          <div className="sub">
            Ma trận Gói × Khu vực. Bấm vào ô bất kỳ để thêm hoặc chỉnh quy trình.
            <span style={{ color: "var(--haus-gold-700)" }}> · {mappings.length} quy trình</span>
          </div>
        </div>
        <div className="actions">
          <select
            value={filterPkg}
            onChange={(e) => setFilterPkg(e.target.value)}
            style={{
              fontFamily: "var(--font-sans)", fontSize: 12, padding: "10px 14px",
              border: "1px solid var(--rule-strong-light)", background: "var(--haus-white)",
              color: "var(--haus-navy)", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase"
            }}
          >
            <option value="all">Tất cả gói</option>
            {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="haus-btn primary" onClick={() => setEditing({})}>
            <Icon name="Plus" size={14} /> Thêm quy trình
          </button>
        </div>
      </div>

      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th>Khu vực</th>
              {visiblePackages.map((p) => (
                <th key={p.id} className="pkg-col">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map((a) => (
              <tr key={a.id}>
                <td className="area-cell">{a.name}</td>
                {visiblePackages.map((p) => {
                  const cell = cellMappings(p.id, a.id);
                  const has = cell.length > 0;
                  return (
                    <td
                      key={p.id}
                      className={`cell${has ? " has-mapping" : ""}`}
                      onClick={() => {
                        if (cell.length === 1) setEditing(cell[0]);
                        else if (cell.length > 1) setEditing(cell[0]); // open first for now
                        else setEditing({ packageId: p.id, areaId: a.id });
                      }}
                    >
                      {has ? (
                        <div>
                          {cell.map((m) => {
                            const mach = machines.find((x) => x.id === m.machineId);
                            return (
                              <span key={m.id} className="cell-pill" title={m.description}>
                                {mach ? mach.name : m.machineId}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="cell-empty">+ thêm</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing ? (
        <ConfigModal
          eyebrow={editing.id ? "CHỈNH SỬA" : "THÊM MỚI"}
          title={editing.id ? "Chỉnh quy trình" : "Thêm quy trình"}
          onClose={() => setEditing(null)}
        >
          <MappingForm
            value={editing.id ? editing : { ...editing, id: "m" + Date.now() }}
            packages={packages}
            areas={areas}
            machines={machines}
            chemicals={chemicals}
            tools={tools}
            onSave={(d) => {
              if (editing.id) onUpdate(d); else onAdd(d);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
          {editing.id ? (
            <div style={{ borderTop: "1px solid var(--rule-hairline-light)", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "flex-end" }}>
              <button className="haus-btn danger" onClick={() => { onRemove(editing.id); setEditing(null); }}>
                <Icon name="Trash" size={14} /> Xoá quy trình này
              </button>
            </div>
          ) : null}
        </ConfigModal>
      ) : null}
    </>
  );
}

// ---------- Config shell ----------
function Config({ state, setState, tweaks }) {
  const [page, setPage] = useStateC("mappings");
  const fileRef = useRefC(null);
  const allLucide = useMemoC(() => Object.keys(window.HausIconPaths || {}), []);

  // Mutators
  const mutate = (key, updater) => setState((s) => ({ ...s, [key]: updater(s[key]) }));
  const addEntity = (key) => (d) => mutate(key, (arr) => [...arr, d]);
  const updateEntity = (key) => (d) => mutate(key, (arr) => arr.map((x) => x.id === d.id ? d : x));
  const removeEntity = (key) => (id) => mutate(key, (arr) => arr.filter((x) => x.id !== id));

  const items = [
    { id: "mappings",  label: "Mối liên kết",  icon: "Workflow",     count: state.mappings.length },
    { id: "packages",  label: "Gói dịch vụ",   icon: "Sparkles",     count: state.packages.length },
    { id: "areas",     label: "Khu vực",       icon: "Pin",          count: state.areas.length },
    { id: "machines",  label: "Thiết bị",      icon: "Box",          count: state.machines.length },
    { id: "chemicals", label: "Hoá chất",      icon: "Droplet",      count: state.chemicals.length },
    { id: "tools",     label: "Dụng cụ",       icon: "Wrench",       count: state.tools.length }
  ];

  const handleExport = () => window.HAUS_TRAINING.exportJSON(state);
  const handleImportClick = () => fileRef.current && fileRef.current.click();
  const handleImportFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const parsed = await window.HAUS_TRAINING.importJSON(f);
      setState((s) => ({ ...s, ...parsed }));
    } catch (err) {
      alert("Không đọc được tệp JSON: " + err.message);
    }
    e.target.value = "";
  };
  const handleReset = () => {
    if (confirm("Khôi phục toàn bộ dữ liệu về mặc định ban đầu?")) {
      setState(window.HAUS_TRAINING.seedState());
    }
  };

  return (
    <div className="stage tone-ivory">
      <header className="cockpit-header">
        <div className="brand-block">
          <img className="mark" src="assets/logo-mark-navy-on-white.png" alt="HAUS" />
          <div className="divider"></div>
          <div className="lockup">
            <div className="name">HAUS</div>
            <div className="tag">Cấu hình quy chuẩn</div>
          </div>
        </div>
        <div></div>
        <div className="mode-tabs">
          <button onClick={() => window.HAUS_GO_DASH && window.HAUS_GO_DASH()}>Đào tạo</button>
          <button className="is-active">Cấu hình</button>
        </div>
      </header>

      <div className="cfg-shell">
        <nav className="cfg-rail">
          <div className="rail-eyebrow">Quản lý</div>
          {items.map((it) => (
            <button
              key={it.id}
              className={`rail-item${page === it.id ? " is-active" : ""}`}
              onClick={() => setPage(it.id)}
            >
              <Icon name={it.icon} size={18} />
              <span>{it.label}</span>
              <span className="count">{it.count}</span>
            </button>
          ))}
          <div className="rail-spacer"></div>
          <div className="rail-foot">
            <button className="haus-btn ghost-dark" onClick={handleExport}>
              <Icon name="Download" size={14} /> Xuất JSON
            </button>
            <button className="haus-btn ghost-dark" onClick={handleImportClick}>
              <Icon name="Upload" size={14} /> Nhập JSON
            </button>
            <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={handleImportFile} />
            <button className="haus-btn ghost-dark" onClick={handleReset}>
              <Icon name="RotateCcw" size={14} /> Khôi phục
            </button>
          </div>
        </nav>

        <main className="cfg-canvas">
          {page === "mappings"  ? <MappingsPage state={state} onAdd={addEntity("mappings")} onUpdate={updateEntity("mappings")} onRemove={removeEntity("mappings")} /> : null}
          {page === "packages"  ? <EntityPage kind="package"  title="Gói dịch vụ" eyebrow="DỊCH VỤ"   sub="Khung gói chuẩn HAUS bán cho Quý khách."         items={state.packages}  allLucide={allLucide} onAdd={addEntity("packages")}  onUpdate={updateEntity("packages")}  onRemove={removeEntity("packages")} /> : null}
          {page === "areas"     ? <EntityPage kind="area"     title="Khu vực"     eyebrow="KHÔNG GIAN" sub="Phân chia không gian trong căn nhà."             items={state.areas}     allLucide={allLucide} onAdd={addEntity("areas")}     onUpdate={updateEntity("areas")}     onRemove={removeEntity("areas")} /> : null}
          {page === "machines"  ? <EntityPage kind="machine"  title="Thiết bị"    eyebrow="MÁY MÓC"    sub="Kärcher cùng các thiết bị chuyên dụng khác."     items={state.machines}  allLucide={allLucide} onAdd={addEntity("machines")}  onUpdate={updateEntity("machines")}  onRemove={removeEntity("machines")} /> : null}
          {page === "chemicals" ? <EntityPage kind="chemical" title="Hoá chất"    eyebrow="DUNG DỊCH"  sub="Thư viện hoá chất HAUS sử dụng và pha trộn."     items={state.chemicals} allLucide={allLucide} onAdd={addEntity("chemicals")} onUpdate={updateEntity("chemicals")} onRemove={removeEntity("chemicals")} /> : null}
          {page === "tools"     ? <EntityPage kind="tool"     title="Dụng cụ"     eyebrow="PHỤ KIỆN"   sub="Dụng cụ, phụ kiện và vật tư tiêu hao."            items={state.tools}     allLucide={allLucide} onAdd={addEntity("tools")}     onUpdate={updateEntity("tools")}     onRemove={removeEntity("tools")} /> : null}
        </main>
      </div>
    </div>
  );
}

window.Config = Config;
