export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="w-full">
      <div className="overflow-auto rounded-lg border border-gray-100">
        <table className="min-w-full text-sm">

          {/* HEADER */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-50 bg-white">

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-16 text-center text-sm text-gray-400"
                >
                  Sin registros para mostrar
                </td>
              </tr>
            )}

            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick
                    ? "cursor-pointer hover:bg-blue-50/40"
                    : "hover:bg-gray-50/60"
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-gray-700 whitespace-nowrap"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  )
}