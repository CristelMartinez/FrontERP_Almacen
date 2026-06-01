/**
 * EstadoBadge — pill reutilizable para mostrar estado activo/inactivo.
 * Uso: <EstadoBadge activo={row.activo} />
 */
export default function EstadoBadge({ activo }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        activo
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          activo ? "bg-green-500" : "bg-red-400"
        }`}
      />
      {activo ? "Activo" : "Inactivo"}
    </span>
  )
}