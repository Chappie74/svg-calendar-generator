import * as React from "react";
import * as dfn from "date-fns";

function SVGCalendar({
  date,
  boxMargin = 5,
  boxWidth = 25,
  boxHeight = boxWidth,
  textXAdj = 0,
  textYAdj = 0,
  fontSize = 12,
  boxStrokeWidth = 1,
  shortDayNames = false,
  fontFamily = "Outfit",
}: {
  date: Date;
  boxMargin?: number;
  boxWidth?: number;
  boxHeight?: number;
  textXAdj?: number;
  textYAdj?: number;
  fontSize?: number;
  boxStrokeWidth?: number;
  shortDayNames?: boolean;
  fontFamily?: string;
}) {
  const textXOff = boxWidth / 2 + textXAdj;
  const textYOff = boxHeight / 2 + textYAdj;
  const boxes: React.ReactNode[] = [];
  const headings: React.ReactNode[] = [];
  const safeDate = !date || isNaN(date.getTime()) ? new Date() : date;
  const firstOfMonth = dfn.startOfMonth(safeDate);
  const fomWeekday = dfn.getDay(firstOfMonth);
  const monthLength = dfn.getDaysInMonth(firstOfMonth);
  for (let i = 0; i < 7 * 5; i++) {
    const y = Math.floor(i / 7);
    const x = i % 7;
    const tx = x * (boxWidth + boxMargin);
    const ty = y * (boxHeight + boxMargin);
    const dayOfMonth = i + 1 - fomWeekday;
    const date = dfn.setDate(firstOfMonth, dayOfMonth);
    if (y === 0) {
      const dayName = dfn.format(date, "cccccc");
      const formattedDayName = shortDayNames ? dayName.charAt(0) : dayName;
      headings.push(
        <g transform={`translate(${tx} ${-boxMargin * 2})`} key={i}>
          <text x={textXOff} textAnchor="middle" fontSize={fontSize}>
            {formattedDayName}
          </text>
        </g>
      );
    }
    if (dayOfMonth > 0 && dayOfMonth <= monthLength) {
      boxes.push(
        <g transform={`translate(${tx} ${ty})`} key={i}>
          <rect
            width={boxWidth}
            height={boxHeight}
            fill="none"
            stroke={boxStrokeWidth === 0 ? "none" : "black"}
            strokeWidth={boxStrokeWidth}
          />
          <text
            y={textYOff}
            x={textXOff}
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={fontSize}
          >
            {dayOfMonth}
          </text>
        </g>
      );
    }
  }

  const googleFontsMap: Record<string, string> = {
    "Outfit": "Outfit:wght@400;700",
    "Inter": "Inter:wght@400;700",
    "Playfair Display": "Playfair+Display:wght@400;700",
    "Roboto Mono": "Roboto+Mono:wght@400;700",
    "Montserrat": "Montserrat:wght@400;700",
    "Merriweather": "Merriweather:wght@400;700",
    "Pacifico": "Pacifico",
    "Lobster": "Lobster",
    "Cinzel": "Cinzel:wght@400;700",
    "Oswald": "Oswald:wght@400;700",
    "Great Vibes": "Great+Vibes",
    "Special Elite": "Special+Elite",
  };

  const googleFontName = googleFontsMap[fontFamily];
  const importStyle = googleFontName ? (
    <style>
      {`@import url('https://fonts.googleapis.com/css2?family=${googleFontName}&display=swap');`}
    </style>
  ) : null;

  const resolvedFontFamily = fontFamily.includes(",") ? fontFamily : `'${fontFamily}', sans-serif`;

  return (
    <svg viewBox="0 0 297 210" style={{ fontFamily: resolvedFontFamily }}>
      <defs>
        {importStyle}
      </defs>
      <g transform="translate(20 30)">
        {headings}
        {boxes}
      </g>
    </svg>
  );
}
export default SVGCalendar;
