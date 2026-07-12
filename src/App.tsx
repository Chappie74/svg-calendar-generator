import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import "./styles.css";
import * as dfn from "date-fns";
import SVGCalendar from "./SVGCalendar";
import { useTweaks } from "use-tweaks";

export default function App() {
  const props = useTweaks({
    shortDayNames: false,
    boxMargin: 5,
    boxWidth: 25,
    boxHeight: 25,
    boxStrokeWidth: 1,
    textXAdj: 0,
    textYAdj: 0,
    fontSize: 12,
  });

  const [date, setDate] = React.useState(() => new Date());

  const handleDateChange = (val: string) => {
    if (!val) return; // Keep the last valid date to prevent crash
    const parsed = dfn.parse(val, "yyyy-MM", new Date());
    if (!isNaN(parsed.getTime())) {
      setDate(parsed);
    }
  };

  const safeDate = React.useMemo(() => {
    return isNaN(date.getTime()) ? new Date() : date;
  }, [date]);

  const el = <SVGCalendar date={safeDate} {...props} />;

  const svgContent = React.useMemo(() => {
    try {
      return (
        `<?xml version="1.0" encoding="UTF-8" ?>\n` +
        ReactDOMServer.renderToStaticMarkup(el)
      );
    } catch (e) {
      return "";
    }
  }, [el]);

  const handleDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `calendar-${dfn.format(safeDate, "yyyy-MM")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formattedDate = React.useMemo(() => {
    return dfn.format(safeDate, "yyyy-MM");
  }, [safeDate]);

  return (
    <div className="App">
      <div className="header">
        <h1>SVG Calendar Generator</h1>
        <p>Customize and download high-quality SVG grids for any month.</p>
      </div>

      <div className="control-panel">
        <div className="input-group">
          <label htmlFor="month-picker">Select Month & Year</label>
          <input
            id="month-picker"
            className="month-picker"
            type="month"
            value={formattedDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>

        <button className="download-btn" onClick={handleDownload}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download SVG
        </button>
      </div>

      <div className="main-content">
        <div className="preview-card">
          <div style={{ width: "100%", maxWidth: "800px" }}>{el}</div>
        </div>

        <div className="code-card">
          <h3>SVG Source Code</h3>
          <textarea
            className="svg-textarea"
            value={svgContent}
            readOnly
            rows={18}
          />
        </div>
      </div>
    </div>
  );
}
