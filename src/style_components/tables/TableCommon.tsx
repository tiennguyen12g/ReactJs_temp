import React, { useMemo, useState, useEffect, type JSX } from "react";
import clsx from "clsx";
import type { CellValue, TableData } from "./TableWithDragColumn";

interface Props {
  data: TableData;
  className?: string;
  cellPadding?: string;
  maxHeight?: string;
  isShowPagination?: boolean;
  pageSize?: number;
  initialColumnWidths?: Record<number, string | number>; // {0: "150px", 1: "200px"}
}

const DEFAULT_PADDING = "px-3 py-2";

export default function TableCommon({
  data,
  className,
  cellPadding = DEFAULT_PADDING,
  maxHeight = "400px",
  isShowPagination = true,
  pageSize = 10,
  initialColumnWidths,
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.rows.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Calculate column widths: priority initialColumnWidths > header.width
  const columnWidths = useMemo(() => {
    const widths = data.headers.map((header, i) => {
      // First priority: initialColumnWidths prop
      if (initialColumnWidths && initialColumnWidths[i] !== undefined && initialColumnWidths[i] !== null) {
        const width = initialColumnWidths[i];
        return typeof width === "number" ? `${width}px` : String(width);
      }
      // Second priority: header.width
      if (header.width != null) {
        return typeof header.width === "number" ? `${header.width}px` : String(header.width);
      }
      // No width specified - use a default
      return "150px"; // Default width for columns without explicit width
    });
    return widths;
  }, [data.headers, initialColumnWidths]);

  // Transform rows to array format
  const rowDatas: CellValue[][] = useMemo(() => {
    const objKeys = data.headers.map((header) => header.key);
    return data.rows.map((row) => {
      return objKeys.map((keyField) => row[keyField]);
    });
  }, [data.rows, data.headers]);

  // Paginate rows
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rowDatas.slice(start, start + pageSize);
  }, [rowDatas, page, pageSize]);

  // Render pagination buttons
  const renderPageButtons = (): JSX.Element[] => {
    const buttons: JSX.Element[] = [];
    const pushButton = (p: number, content?: React.ReactNode) =>
      buttons.push(
        <button
          key={p}
          onClick={() => setPage(p)}
          className={clsx(
            "px-3 py-1 text-sm rounded border transition-colors",
            page === p
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
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
      className={clsx(
        "relative w-fit max-w-full overflow-auto rounded-md bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] table-scrollbar",
        className
      )}
      style={{ maxHeight }}
    >
      <table className="border-collapse" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {data.headers.map((header, idx) => {
            const width = columnWidths[idx];
            return (
              <col
                key={header.key}
                style={{
                  width,
                }}
              />
            );
          })}
        </colgroup>
        <thead>
          <tr>
            {data.headers.map((header, idx) => {
              const width = columnWidths[idx];
              const align = header.align ?? "center";
              return (
                <th
                  key={header.key}
                  className={clsx(
                    "border-b-2 border-gray-300 bg-gray-100 box-border",
                    cellPadding,
                    align === "left" && "text-left",
                    align === "center" && "text-center",
                    align === "right" && "text-right"
                  )}
                  style={{
                    width,
                    boxSizing: "border-box",
                  }}
                >
                  {header.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => {
                  const width = columnWidths[colIdx];
                  const align = data.headers[colIdx]?.align ?? "center";
                  return (
                    <td
                      key={colIdx}
                      className={clsx(
                        "box-border",
                        cellPadding,
                        align === "left" && "text-left",
                        align === "center" && "text-center",
                        align === "right" && "text-right"
                      )}
                      style={{
                        width: width && width !== "auto" ? width : undefined,
                        boxSizing: "border-box",
                      }}
                    >
                      {cell}
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
            Showing <strong>{(page - 1) * pageSize + 1}</strong> -{" "}
            <strong>{Math.min(page * pageSize, data.rows.length)}</strong> of {data.rows.length}
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
