import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { FaFileExcel, FaFilePdf } from "react-icons/fa"

/**
 * Layout reutilizable para páginas de reporte.
 *
 * Props:
 *  - titulo        {string}    Título del reporte
 *  - subtitulo     {string}    Descripción breve
 *  - onExcelClick  {fn}        Handler descarga Excel
 *  - onPDFClick    {fn}        Handler descarga PDF
 *  - filtros       {ReactNode} Área de filtros (fechas, búsquedas, botón generar)
 *  - children      {ReactNode} Tabla u otro contenido
 */
export default function ReporteLayout({
  titulo,
  subtitulo,
  onExcelClick,
  onPDFClick,
  filtros,
  children,
}) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">

      {/* ENCABEZADO */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/reportes")}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            title="Volver a reportes"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{titulo}</h1>
            {subtitulo && (
              <p className="text-sm text-gray-400 mt-0.5">{subtitulo}</p>
            )}
          </div>
        </div>

        {/* BOTONES EXPORTAR */}
        <div className="flex items-center gap-2">
          {onExcelClick && (
            <button
              onClick={onExcelClick}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <FaFileExcel size={13} className="text-green-600" />
              Excel
            </button>
          )}
          {onPDFClick && (
            <button
              onClick={onPDFClick}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <FaFilePdf size={13} className="text-red-500" />
              PDF
            </button>
          )}
        </div>
      </div>

      {/* FILTROS */}
      {filtros && (
        <div className="bg-white border border-gray-100 rounded-xl px-5 py-4">
          <div className="flex flex-wrap items-end gap-3">
            {filtros}
          </div>
        </div>
      )}

      {/* CONTENIDO / TABLA */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {children}
      </div>

    </div>
  )
}