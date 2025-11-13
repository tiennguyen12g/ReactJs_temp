import React, { useEffect, useMemo, useRef, useState, useLayoutEffect, type JSX, type CSSProperties } from "react";
import clsx from "clsx";
import { type TableData } from "./TableWithDragColumn";

interface TableProps {
  data: TableData;
  stickyColumns?: number[]; // which column indices are sticky (left)
  initialColumnWidths?: Record<number, string | number>; // e.g. {0: "150px", 1: "200px"}
  cellPadding?: string; // tailwind padding classes e.g. "px-4 py-2"
  className?: string;
  maxHeight?: string; // e.g. "400px" (use "none" for no max)
  pageSize?: number; // rows per page
  onSelectionChange?: (selectedRowIds: any[]) => void;
  isShowPagination?: boolean;
}

export default function TableWithResizeColumn({
  data,
  stickyColumns = [],
  initialColumnWidths = {},
  cellPadding = "px-3 py-2",
  className,
  maxHeight = "400px",
  pageSize = 10,
  onSelectionChange,
  isShowPagination = true,
}: TableProps) {
  // state: column widths in px (we store numbers for arithmetic)
  const parseWidth = (w?: string | number) => {
    if (!w) return undefined;
    if (typeof w === "number") return w;
    if (typeof w === "string" && w.endsWith("px")) {
      return parseInt(w.replace("px", ""), 10);
    }
    // try parse number
    const n = parseInt(w as string, 10);
    return isNaN(n) ? undefined : n;
  };

  // Use all headers - checkbox is part of the data
  const headerCount = data.headers.length;
  const headerRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const [stickyOffsets, setStickyOffsets] = useState<number[]>([]);

  // setup initial widths: either from initialColumnWidths or header width or auto fallback
  const [columnWidths, setColumnWidths] = useState<Record<number, number>>(() => {
    const out: Record<number, number> = {};
    for (let i = 0; i < headerCount; i++) {
      const header = data.headers[i];
      // Priority: initialColumnWidths > header.width > auto
      const w = parseWidth(initialColumnWidths[i]) ?? parseWidth(header.width);
      if (w) out[i] = w;
    }
    return out;
  });

  // selection state
  const [selected, setSelected] = useState<Record<string | number, boolean>>({});
  const rowIds = useMemo(() => data.rows.map((row, idx) => row.id ?? idx), [data.rows]);

  // pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.rows.length / pageSize));

  useEffect(() => {
    setPage(1);
    setSelected({});
  }, [data.headers, data.rows.length]);

  useEffect(() => {
    // clamp page
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Normalize sticky columns - they should be contiguous from the first sticky index
  const normalizedStickyColumns = useMemo(() => {
    if (!stickyColumns?.length) return [];
    const sorted = [...stickyColumns].sort((a, b) => a - b);
    const firstSticky = sorted[0];
    const contiguous: number[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] !== firstSticky + i) {
        if (sorted[i] !== undefined) {
          console.warn("[TableWithResizeColumn] stickyColumns must be contiguous. Falling back to contiguous subset.");
        }
        break;
      }
      contiguous.push(sorted[i]);
    }
    return contiguous;
  }, [stickyColumns]);

  // Calculate sticky offsets based on actual sticky column indices
  useLayoutEffect(() => {
    if (!normalizedStickyColumns.length) {
      setStickyOffsets([]);
      return;
    }
    const offsets: number[] = [];
    let cumulative = 0;
    for (const stickyIdx of normalizedStickyColumns) {
      const cell = headerRefs.current[stickyIdx];
      if (!cell) break;
      offsets[stickyIdx] = cumulative;
      cumulative += cell.getBoundingClientRect().width;
    }
    setStickyOffsets(offsets);
  }, [normalizedStickyColumns, columnWidths, data.headers]);

  // column resize logic
  const tableRef = useRef<HTMLDivElement | null>(null);
  const resizingRef = useRef<{ colIdx: number; startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!resizingRef.current) return;
      const { colIdx, startX, startWidth } = resizingRef.current;
      const dx = e.clientX - startX;
      const newW = Math.max(40, startWidth + dx); // minimum width 40px
      setColumnWidths((prev) => ({ ...prev, [colIdx]: Math.round(newW) }));
    }
    function onUp() {
      resizingRef.current = null;
      document.body.style.cursor = "";
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onResizeStart = (e: React.MouseEvent, colIdx: number) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[colIdx] ?? getAutoColumnWidth(colIdx);
    resizingRef.current = { colIdx, startX, startWidth };
    document.body.style.cursor = "col-resize";
  };

  // When widths not provided, estimate an "auto" width based on header text length (fallback)
  function getAutoColumnWidth(colIdx: number) {
    const header = data.headers[colIdx];
    if (!header) return 120;
    // For checkbox columns, use a fixed width
    if (header.type === "checkbox") return 48;
    // rough heuristic: 12 px per char + padding
    const headerText = String(header.label ?? "");
    const maxCellLen = data.rows.reduce((acc, row) => {
      const cell = row[header.key];
      const s = cell == null ? "" : String(cell);
      return Math.max(acc, s.length);
    }, headerText.length);
    const base = Math.min(400, Math.max(80, maxCellLen * 12)); // clamp
    return Math.round(base);
  }

  // Transform rows to array format for rendering
  const transformedRows = useMemo(() => {
    return data.rows.map((row) => data.headers.map((header) => row[header.key]));
  }, [data.rows, data.headers]);

  // compute visible rows for current page
  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return transformedRows.slice(start, start + pageSize);
  }, [transformedRows, page, pageSize]);

  // selection helpers
  const selectedChangeRef = useRef<typeof onSelectionChange>(onSelectionChange);

  useEffect(() => {
    selectedChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    if (!selectedChangeRef.current) return;
    const selectedIds = Object.entries(selected)
      .filter(([_, v]) => v)
      .map(([k]) => {
        const numId = Number(k);
        return isNaN(numId) ? k : numId;
      });
    selectedChangeRef.current(selectedIds);
  }, [selected]);

  const toggleRow = (rowId: string | number) => {
    const key = String(rowId);
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleRowIds = useMemo(
    () => rowIds.slice((page - 1) * pageSize, (page - 1) * pageSize + visibleRows.length),
    [rowIds, visibleRows.length, page, pageSize]
  );

  const allVisibleSelected = visibleRowIds.every((id) => !!selected[String(id)]);
  const someVisibleSelected = !allVisibleSelected && visibleRowIds.some((id) => !!selected[String(id)]);

  const toggleSelectAllVisible = () => {
    const shouldSelectAll = !allVisibleSelected;
    const updates: Record<string, boolean> = {};
    visibleRowIds.forEach((id) => {
      updates[String(id)] = shouldSelectAll;
    });
    setSelected((prev) => ({ ...prev, ...updates }));
  };

  // helpers to render width style string
  const widthStyleFor = (idx: number) => {
    const w = columnWidths[idx];
    if (w) return `${w}px`;
    const autoW = getAutoColumnWidth(idx);
    return `${autoW}px`;
  };

  const headerBgColor = "#fff3e5";
  const rowAltColor = "#fff6eb";
  const rowSelectedColor = "#dbeafe";

  return (
    <div className={clsx("w-full text-gray-900 z-10 overflow-auto"  , className)}>
      {/* outer wrapper for scroll x/y, keep header sticky */}
      <div ref={tableRef} className="w-full rounded-lg bg-white shadow-sm" style={{ maxHeight }}>
        <table className="border-collapse table-fixed w-max min-w-full" style={{ boxSizing: "border-box" }}>
          <colgroup>
            {data.headers.map((header, idx) => {
                const columnType = header.type ?? "";
                const columnWidth = header.width ?? 0;
                   const    width = columnType === "checkbox" ? columnWidth : widthStyleFor(idx);
              return (
              <col key={idx} style={{ width: width }} />
            )
            })}
          </colgroup>

          <thead className="bg-orange-50">
            <tr className="sticky top-0 z-40 shadow-sm">
              {data.headers.map((header, idx) => {
                const columnType = header.type ?? "";
                const columnWidth = header.width ?? 0;
                const isSticky = normalizedStickyColumns.includes(idx);
                const left = isSticky ? stickyOffsets[idx] : undefined;
                const align = header.align ?? "left";
                const isCheckbox = header.type === "checkbox";
                const stickyStyles: CSSProperties = {
                  width: columnType === "checkbox" ? columnWidth : widthStyleFor(idx),
                  boxSizing: "border-box",
                  position: isSticky ? "sticky" : undefined,
                  left: isSticky ? `${left}px` : undefined,
                  zIndex: isSticky ? 60 : undefined,
                  backgroundColor: headerBgColor,
                  textAlign: align,
                };
                return (
                  <th
                    key={idx}
                    ref={(el) => {
                      headerRefs.current[idx] = el;
                    }}
                    style={stickyStyles}
                    className={clsx(
                      "border-b border-orange-200 align-middle box-border",
                      "text-sm font-semibold text-gray-900 uppercase tracking-wide",
                      cellPadding,
                      align === "center" && "text-center",
                      align === "right" && "text-right",
                      align === "left" && "text-left",
                      isCheckbox && "flex items-center justify-center"
                    )}
                  >
                    {isCheckbox ? (
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          ref={(el) => {
                            if (!el) return;
                            el.indeterminate = someVisibleSelected;
                          }}
                          onChange={toggleSelectAllVisible}
                          className="cursor-pointer h-5 shrink-0 accent-orange-500"
                        />
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center gap-2">
                        <div className="truncate">{header.label}</div>

                        {/* resize handle */}
                        <div
                          onMouseDown={(e) => onResizeStart(e, idx)}
                          className="absolute top-0 right-[-19px] h-full w-3 cursor-col-resize flex items-center justify-center"
                          aria-hidden
                        >
                          <div className="h-5 border-r border-orange-200" />
                        </div>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row, rowIdx) => {
              const globalRowIdx = (page - 1) * pageSize + rowIdx;
              const rowId = visibleRowIds[rowIdx];
              const isSelected = !!selected[String(rowId)];
              const isEvenRow = rowIdx % 2 === 0;
              const rowBgColor = isSelected ? rowSelectedColor : isEvenRow ? "#ffffff" : rowAltColor;
              const hoverOverrideClass = isSelected ? "hover:!bg-[#bfdbfe]" : "hover:bg-[#ffe2cc]";
              const groupHoverOverride = isSelected ? "group-hover:!bg-[#bfdbfe]" : "group-hover:!bg-[#ffe2cc]";
              return (
                <tr
                  key={globalRowIdx}
                  className={clsx(
                    "align-middle group transition-colors duration-150 ease-out",
                    isSelected ? "!bg-[#dbeafe]" : isEvenRow ? "bg-white" : "bg-[#fff6eb]",
                    hoverOverrideClass
                  )}
                  style={{ "--sticky-row-bg": rowBgColor } as CSSProperties}
                >
                  {row.map((cell, colIdx) => {
                    const header = data.headers[colIdx];
                    const columnType = header.type ?? "";
                    const columnWidth = header.width ?? 0;
                    const isSticky = normalizedStickyColumns.includes(colIdx);
                    const left = isSticky ? stickyOffsets[colIdx] : undefined;
                    const align = header?.align ?? "left";
                    const isCheckbox = header?.type === "checkbox";
                    const stickyCellStyle: CSSProperties = {
                      width: columnType === "checkbox" ? columnWidth : widthStyleFor(colIdx),
                      boxSizing: "border-box",
                      position: isSticky ? "sticky" : undefined,
                      left: isSticky ? `${left}px` : undefined,
                      zIndex: isSticky ? 50 : undefined,
                      backgroundColor: isSticky ? rowBgColor : undefined,
                      textAlign: align,
                      verticalAlign: "middle",
                    };
                    return (
                      <td
                        key={colIdx}
                        style={stickyCellStyle}
                        className={clsx(
                          "border-b border-gray-200 whitespace-nowrap text-gray-900 box-border",
                          cellPadding,
                          groupHoverOverride,
                          align === "center" && "text-center",
                          align === "right" && "text-right",
                          align === "left" && "text-left",
                          isCheckbox && "align-middle"
                        )}
                      >
                        {isCheckbox ? (
                          <div className="flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => toggleRow(rowId)} 
                              className="cursor-pointer" 
                            />
                          </div>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* pagination controls */}
      {isShowPagination && (
        <div className="flex items-center justify-between mt-3 px-4 py-2 left-0 sticky">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <strong>
              {(page - 1) * pageSize + 1}
              {" - "}
              {Math.min(page * pageSize, data.rows.length)}
            </strong>{" "}
            of {data.rows.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 bg-white"
            >
              Prev
            </button>

            {/* simple page numbers window: show up to 7 pages with ellipsis */}
            <div className="flex items-center gap-1">{renderPageButtons(page, totalPages, setPage)}</div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** helper to render page number buttons with simple ellipsis */
function renderPageButtons(current: number, total: number, setPage: (p: number) => void) {
  const buttons: JSX.Element[] = [];
  const pushBtn = (p: number) =>
    buttons.push(
      <button
        key={p}
        onClick={() => setPage(p)}
        className={clsx(
          "px-3 py-1 border rounded bg-white",
          p === current ? "!bg-[#d2ffc8] text-[#008a12] border-[#008a12] font-[600]" : "border-gray-300 text-gray-700"
        )}
      >
        {p}
      </button>
    );

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pushBtn(i);
  } else {
    // window strategy: [1] ... [cur-1 cur cur+1] ... [total]
    pushBtn(1);
    if (current > 4)
      buttons.push(
        <span key="l-ell" className="px-2">
          …
        </span>
      );
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pushBtn(i);
    if (current < total - 3)
      buttons.push(
        <span key="r-ell" className="px-2">
          …
        </span>
      );
    pushBtn(total);
  }

  return <>{buttons}</>;
}
