/**
 * DateFilter — par de inputs de fecha + botón "Generar"
 *
 * Props:
 *  - fechaInicio   {string}
 *  - fechaFin      {string}
 *  - onChangeInicio {fn}
 *  - onChangeFin   {fn}
 *  - onGenerar     {fn}
 *  - cargando      {bool}
 */
export default function DateFilter({
  fechaInicio,
  fechaFin,
  onChangeInicio,
  onChangeFin,
  onGenerar,
  cargando = false,
  label = "Generar reporte",
}) {
  return (
    <>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Fecha inicio
        </label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => onChangeInicio(e.target.value)}
          className="px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Fecha fin
        </label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => onChangeFin(e.target.value)}
          className="px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
        />
      </div>

      <div className="pb-0.5">
        <button
          onClick={onGenerar}
          disabled={cargando}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition shadow-sm"
        >
          {cargando ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Cargando…
            </>
          ) : (
            label
          )}
        </button>
      </div>
    </>
  )
}