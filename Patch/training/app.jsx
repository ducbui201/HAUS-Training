/* ============================================================
   HAUS Training Cockpit — App shell
   Owns global state, mode routing, scaling stage, tweaks.
   ============================================================ */

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tone": "navy",
  "lineStyle": "bezier-star",
  "density": "standard",
  "showImages": true,
  "speaker": false
}/*EDITMODE-END*/;

function ScalingStage({ children }) {
  // Wraps the 1920×1080 stage in a viewport-scaling container.
  const [scale, setScale] = useStateA(1);
  useEffectA(() => {
    function recompute() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScale(Math.min(w / 1920, h / 1080));
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);
  return (
    <div className="stage-wrap">
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [state, setState] = useStateA(() => window.HAUS_TRAINING.loadState());
  const [mode, setMode]   = useStateA("dashboard"); // "dashboard" | "config"
  const [t, setTweak]     = window.useTweaks(TWEAK_DEFAULTS);

  // Persist to localStorage whenever state changes
  useEffectA(() => {
    window.HAUS_TRAINING.saveState(state);
  }, [state]);

  // Wire mode-switch handles for child components (avoids prop-drilling through dashboard)
  useEffectA(() => {
    window.HAUS_GO_CONFIG = () => setMode("config");
    window.HAUS_GO_DASH   = () => setMode("dashboard");
    return () => { delete window.HAUS_GO_CONFIG; delete window.HAUS_GO_DASH; };
  }, []);

  // Body class for tone (so global bg under letterboxing reads right)
  useEffectA(() => {
    document.body.dataset.tone = (mode === "config") ? "ivory" : t.tone;
  }, [mode, t.tone]);

  const tweaksForDashboard = useMemoA(() => ({
    tone: t.tone,
    lineStyle: t.lineStyle,
    density: t.density,
    showImages: t.showImages,
    speaker: t.speaker
  }), [t]);

  return (
    <>
      <ScalingStage>
        {mode === "dashboard"
          ? <window.Dashboard state={state} tweaks={tweaksForDashboard} />
          : <window.Config    state={state} setState={setState} tweaks={tweaksForDashboard} />}
      </ScalingStage>

      <window.TweaksPanel>
        <window.TweakSection label="Bề mặt" />
        <window.TweakRadio
          label="Tông màu"
          value={t.tone}
          options={["navy", "ivory"]}
          onChange={(v) => setTweak("tone", v)}
        />
        <window.TweakRadio
          label="Mật độ"
          value={t.density}
          options={["compact", "standard", "spacious"]}
          onChange={(v) => setTweak("density", v)}
        />

        <window.TweakSection label="Đường nối" />
        <window.TweakRadio
          label="Phong cách"
          value={t.lineStyle}
          options={["bezier-star", "straight", "static"]}
          onChange={(v) => setTweak("lineStyle", v)}
        />

        <window.TweakSection label="Trình bày" />
        <window.TweakToggle
          label="Chế độ thuyết trình"
          value={t.speaker}
          onChange={(v) => setTweak("speaker", v)}
        />
        <window.TweakToggle
          label="Ảnh sản phẩm"
          value={t.showImages}
          onChange={(v) => setTweak("showImages", v)}
        />

        <window.TweakSection label="Dữ liệu" />
        <window.TweakButton
          label="Xuất JSON"
          onClick={() => window.HAUS_TRAINING.exportJSON(state)}
        />
        <window.TweakButton
          label="Khôi phục mặc định"
          onClick={() => {
            if (confirm("Khôi phục toàn bộ dữ liệu về mặc định ban đầu?")) {
              setState(window.HAUS_TRAINING.seedState());
            }
          }}
        />
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
