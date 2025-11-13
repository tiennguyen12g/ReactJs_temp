import React, { useEffect, useMemo, useRef, useState, useLayoutEffect, type CSSProperties, type JSX } from "react";
import clsx from "clsx";

export type CellValue = string | number | React.ReactNode | null | undefined;

export interface TableHeader {
  key: string;
  label: string;
  width?: number | string;
  sticky?: boolean;
  type?: "checkbox" | "text" | "number" | string;
  align?: "left" | "center" | "right";
}

export interface TableRow {
  id?: string | number;
  [key: string]: CellValue;
}

export interface TableData {
  headers: TableHeader[];
  rows: TableRow[];
}

interface TableV2Props {
  data: TableData;
  className?: string;
  cellPadding?: string;
  maxHeight?: string;
  onColumnReorder?: (order: number[]) => void;
  stickyColumns?: number[];
  isShowPagination?: boolean;
  pageSize?: number;
  initialColumnWidths?: Record<number, string | number>;
  onSelectionChange?: (selectedRowIds: any[]) => void;
}

const DEFAULT_PADDING = "px-4 py-2";

export default function TableWithDragColumn({
  data,
  className,
  cellPadding = DEFAULT_PADDING,
  maxHeight = "400px",
  onColumnReorder,
  stickyColumns,
  isShowPagination = true,
  pageSize = 10,
  initialColumnWidths,
  onSelectionChange,
}: TableV2Props) {
  const [columnOrder, setColumnOrder] = useState<number[]>(() => data.headers.map((_, idx) => idx));
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const headerRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const [stickyOffsets, setStickyOffsets] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const latestSelectionCallback = useRef<typeof onSelectionChange>(onSelectionChange);

  useEffect(() => {
    latestSelectionCallback.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    setColumnOrder(data.headers.map((_, idx) => idx));
    setPage(1);
    setSelectedMap({});
  }, [data.headers]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, data.rows.length]);

  const totalPages = Math.max(1, Math.ceil(data.rows.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const normalizedStickyCount = useMemo(() => {
    if (!stickyColumns?.length) return 0;
    const sorted = [...stickyColumns].sort((a, b) => a - b);
    const contiguous: number[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] !== i) {
        if (sorted[i] !== undefined) {
          console.warn("[Table_v2] stickyColumns must start from index 0 and be contiguous (e.g. [0,1,2]). Falling back to contiguous subset.");
        }
        break;
      }
      contiguous.push(sorted[i]);
    }
    return contiguous.length;
  }, [stickyColumns]);

  const orderedHeader = useMemo(
    () =>
      columnOrder.map((idx) => ({
        ...data.headers[idx],
        originalIndex: idx,
      })),
    [columnOrder, data.headers]
  );

  const rowIds = useMemo(() => data.rows.map((row, idx) => row.id ?? idx), [data.rows]);

  const rowIdLookup = useMemo(() => {
    const lookup = new Map<string, string | number>();
    rowIds.forEach((id) => {
      lookup.set(String(id), id);
    });
    return lookup;
  }, [rowIds]);

  const orderedRows = useMemo(
    () =>
      data.rows.map((row) =>
        columnOrder.map((headerIdx) => {
          const header = data.headers[headerIdx];
          if (!header) return null;
          return row[header.key];
        })
      ),
    [data.rows, columnOrder, data.headers]
  );

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return orderedRows.slice(start, start + pageSize);
  }, [orderedRows, page, pageSize]);

  const handleDragStart = (index: number) => (event: React.DragEvent<HTMLTableHeaderCellElement>) => {
    dragIndexRef.current = index;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (index: number) => (event: React.DragEvent<HTMLTableHeaderCellElement>) => {
    event.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (index: number) => () => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (index: number) => (event: React.DragEvent<HTMLTableHeaderCellElement>) => {
    event.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null) return;

    setColumnOrder((prev) => {
      if (fromIndex === index) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(index, 0, moved);
      onColumnReorder?.(next);
      return next;
    });

    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  useLayoutEffect(() => {
    if (!normalizedStickyCount) {
      setStickyOffsets([]);
      return;
    }
    const offsets: number[] = [];
    let cumulative = 0;
    for (let i = 0; i < normalizedStickyCount; i++) {
      const cell = headerRefs.current[i];
      if (!cell) break;
      offsets[i] = cumulative;
      cumulative += cell.getBoundingClientRect().width;
    }
    setStickyOffsets(offsets);
  }, [orderedHeader, normalizedStickyCount, columnOrder, pageSize, maxHeight]);

  const visibleRowIds = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rowIds.slice(start, start + paginatedRows.length).map((id) => String(id));
  }, [rowIds, paginatedRows.length, page, pageSize]);

  const allVisibleSelected = visibleRowIds.every((id) => selectedMap[id]);
  const someVisibleSelected = !allVisibleSelected && visibleRowIds.some((id) => selectedMap[id]);

  const toggleSelectAllVisible = () => {
    const shouldSelect = !allVisibleSelected;
    setSelectedMap((prev) => {
      const next = { ...prev };
      visibleRowIds.forEach((id) => {
        next[id] = shouldSelect;
      });
      return next;
    });
  };

  const toggleRowSelection = (rowId: string | number) => {
    const key = String(rowId);
    setSelectedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (!latestSelectionCallback.current) return;
    const selectedIds = Object.entries(selectedMap)
      .filter(([, value]) => value)
      .map(([key]) => rowIdLookup.get(key) ?? key);
    latestSelectionCallback.current(selectedIds);
  }, [selectedMap, rowIdLookup]);

  const widthForColumn = (header: (typeof orderedHeader)[number]) => {
    if (header.width != null) {
      return typeof header.width === "number" ? `${header.width}px` : header.width;
    }
    const fromInitial = initialColumnWidths?.[header.originalIndex];
    if (fromInitial != null) {
      return typeof fromInitial === "number" ? `${fromInitial}px` : String(fromInitial);
    }
    return undefined;
  };

  const renderPageButtons = () => {
    const buttons: JSX.Element[] = [];
    const pushButton = (p: number, content?: React.ReactNode) =>
      buttons.push(
        <button
          key={p}
          onClick={() => setPage(p)}
          className={clsx(
            "px-3 py-1 text-sm rounded border transition-colors",
            page === p ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
          )}
        >
          {content ?? p}
        </button>
      );

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pushButton(i);
    } else {
      pushButton(1);
      if (page > 4) {
        buttons.push(
          <span key="l-ellipsis" className="px-2 text-gray-500">
            …
          </span>
        );
      }
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pushButton(i);
      if (page < totalPages - 3) {
        buttons.push(
          <span key="r-ellipsis" className="px-2 text-gray-500">
            …
          </span>
        );
      }
      pushButton(totalPages);
    }

    return buttons;
  };

  return (
    <div
      className={clsx("relative w-full overflow-auto rounded-b-md bg-white shadow-sm table-scrollbar", className)}
      style={{ maxHeight }}
    >
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {orderedHeader.map(({ label, key }, headerIndex) => (
              <th
                key={headerIndex}
                ref={(el) => {
                  headerRefs.current[headerIndex] = el;
                }}
                draggable
                onDragStart={handleDragStart(headerIndex)}
                onDragOver={handleDragOver(headerIndex)}
                onDragLeave={handleDragLeave(headerIndex)}
                onDrop={handleDrop(headerIndex)}
                onDragEnd={handleDragEnd}
                className={clsx(
                  "border-r border-gray-200 text-sm font-semibold text-gray-700 uppercase tracking-wide select-none box-border",
                  cellPadding,
                  "bg-gray-50",
                  dragOverIndex === headerIndex && "bg-gray-200",
                  dragIndexRef.current === headerIndex && "opacity-60"
                )}
                style={
                  {
                    cursor: "grab",
                    position: normalizedStickyCount && headerIndex < normalizedStickyCount ? "sticky" : undefined,
                    left: normalizedStickyCount && headerIndex < normalizedStickyCount ? `${stickyOffsets[headerIndex] ?? 0}px` : undefined,
                    zIndex: normalizedStickyCount && headerIndex < normalizedStickyCount ? 12 : undefined,
                    // backgroundColor: "inherit",
                    textAlign: data.headers[headerIndex]?.align ?? "center",
                    width: widthForColumn(orderedHeader[headerIndex]),
                  } as CSSProperties
                }
              >
                {data.headers[headerIndex]?.type === "checkbox" ? (
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-orange-500"
                      checked={allVisibleSelected && visibleRowIds.length > 0}
                      ref={(el) => {
                        if (!el) return;
                        el.indeterminate = someVisibleSelected;
                      }}
                      onChange={toggleSelectAllVisible}
                    />
                  </div>
                ) : (
                  label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedRows.map((row, rowIdx) => {
            const rowKey = visibleRowIds[rowIdx] ?? String((page - 1) * pageSize + rowIdx);
            const resolvedRowId = rowIdLookup.get(rowKey) ?? rowKey;
            const isRowSelected = !!selectedMap[rowKey];
            const isEvenRow = rowIdx % 2 === 0;
            const stickyRowBg = isRowSelected ? "#fff7ed" : isEvenRow ? "#ffffff" : "#f9fafb";

            return (
              <tr
                key={rowKey}
                className={clsx(
                  "border-b border-gray-200 transition-colors duration-150",
                  isEvenRow ? "bg-white" : "bg-gray-50",
                  "hover:bg-gray-100",
                  isRowSelected && "!bg-[#fff7ed]"
                )}
              >
                {row.map((cell, colIdx) => {
                  const isSticky = normalizedStickyCount && colIdx < normalizedStickyCount;
                  const headerMetadata = orderedHeader[colIdx];
                  const columnWidth = widthForColumn(headerMetadata);
                  const isCheckboxColumn = headerMetadata.type === "checkbox";
                  const align = headerMetadata.align ?? "center";
                  const isSelected = isRowSelected;
                  let textAlign = "text-center";
                  switch (align) {
                    case "right":
                      textAlign = "text-right";
                      break;
                    case "left":
                      textAlign = "text-left";
                      break;
                    default:
                      break;
                  }

                  return (
                    <td
                      key={colIdx}
                      className={clsx(
                        "text-sm text-gray-700 align-middle box-border",
                        cellPadding,
                        textAlign
                      )}
                      style={
                        {
                          position: isSticky ? "sticky" : undefined,
                          left: isSticky ? `${stickyOffsets[colIdx] ?? 0}px` : undefined,
                          zIndex: isSticky ? 10 : undefined,
                          backgroundColor: isSticky ? stickyRowBg : undefined,
                          width: columnWidth,
                          minWidth: columnWidth,
                        } as CSSProperties
                      }
                    >
                      {isCheckboxColumn ? (
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer accent-orange-500"
                            checked={isSelected}
                            onChange={() => toggleRowSelection(resolvedRowId)}
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

      {isShowPagination && (
        <div className="sticky left-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <strong>
              {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, data.rows.length)}
            </strong>{" "}
            of {data.rows.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className={clsx(
                "px-3 py-1 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors",
                page === 1 && "opacity-40 cursor-not-allowed"
              )}
            >
              Prev
            </button>

            <div className="flex items-center gap-1">{renderPageButtons()}</div>

            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className={clsx(
                "px-3 py-1 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors",
                page === totalPages && "opacity-40 cursor-not-allowed"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
