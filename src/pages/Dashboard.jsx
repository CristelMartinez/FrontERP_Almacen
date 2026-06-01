import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import {
  FiBox,
  FiRepeat,
  FiAlertTriangle,
  FiUsers,
  FiArrowRight,
  FiTrendingUp,
} from "react-icons/fi"

/* ─── STAT CARD ─────────────────────────────────────────────── */
function StatCard({ icon: Icon, iconColor, label, valor, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3 ${
        onClick ? "cursor-pointer hover:border-blue-200 hover:shadow-sm transition" : ""
      }`}
    >
      {/* ICONO + LABEL */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon size={15} />
        </div>
      </div>

      {/* VALOR */}
      <div className="text-3xl font-semibold text-gray-800">{valor}</div>

      {/* SUB */}
      {sub && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          {sub}
          {onClick && <FiArrowRight size={11} className="text-blue-400" />}
        </p>
      )}
    </div>
  )
}

/* ─── BADGE TIPO MOVIMIENTO ──────────────────────────────────── */
function TipoBadge({ tipo }) {
  const entrada = tipo?.toLowerCase().includes("entrada")
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        entrada
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-500"
      }`}
    >
      {tipo}
    </span>
  )
}

/* ─── STOCK NIVEL ────────────────────────────────────────────── */
function StockIndicator({ stock, minimo }) {
  const n = Number(stock)
  const m = Number(minimo)
  if (n === 0)
    return <span className="inline-flex items-center gap-1.5 text-red-600 font-medium">{n} <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /></span>
  if (n <= m)
    return <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium">{n} <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /></span>
  return <span className="text-gray-700">{n}</span>
}

/* ─── DASHBOARD ──────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [movimientos, setMovimientos] = useState([])
  const [stockBajo, setStockBajo] = useState([])
  const [totalStockBajo, setTotalStockBajo] = useState(0)
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargarDashboard() }, [])

  const cargarDashboard = async () => {
    try {
      const [dashRes, movRes, stockRes, stockCountRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/dashboard/movimientos"),
        api.get("/productos/stock-bajo?limit=5"),
        api.get("/productos/stock-bajo/count"),
      ])
      setStats(dashRes.data)
      setMovimientos(movRes.data)
      setStockBajo(stockRes.data)
      setTotalStockBajo(stockCountRes.data.total)
    } catch (error) {
      console.error("Error cargando dashboard", error)
    } finally {
      setCargando(false)
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ENCABEZADO */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Resumen general del almacén
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          icon={FiBox}
          iconColor="bg-blue-50 text-blue-500"
          label="Total productos"
          valor={stats.total_productos ?? 0}
          sub="Catálogo activo"
        />

        <StatCard
          icon={FiRepeat}
          iconColor="bg-violet-50 text-violet-500"
          label="Movimientos hoy"
          valor={stats.movimientos_hoy ?? 0}
          sub="Entradas y salidas"
        />

        <StatCard
          icon={FiAlertTriangle}
          iconColor="bg-red-50 text-red-500"
          label="Stock bajo"
          valor={totalStockBajo}
          sub="Ver productos afectados"
          onClick={() => navigate("/inventario?stock=bajo")}
        />

        <StatCard
          icon={FiUsers}
          iconColor="bg-emerald-50 text-emerald-500"
          label="Usuarios activos"
          valor={stats.usuarios_activos ?? 0}
          sub="Con acceso al sistema"
        />

      </div>

      {/* TABLAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ÚLTIMOS MOVIMIENTOS */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FiTrendingUp size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">
                Últimos movimientos
              </h2>
            </div>
            <button
              onClick={() => navigate("/movimientos")}
              className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 transition"
            >
              Ver todos <FiArrowRight size={11} />
            </button>
          </div>

          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["#", "Tipo", "Producto", "Cantidad", "Fecha"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-gray-400">
                    Sin movimientos registrados hoy
                  </td>
                </tr>
              ) : (
                movimientos.map((mov) => (
                  <tr key={mov.id_movimiento} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                      {mov.id_movimiento}
                    </td>
                    <td className="px-4 py-3">
                      <TipoBadge tipo={mov.tipo_movimiento} />
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">
                      {mov.producto}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{mov.cantidad}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(mov.fecha).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>

        {/* STOCK BAJO */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FiAlertTriangle size={15} className="text-red-400" />
              <h2 className="text-sm font-semibold text-gray-700">
                Productos con stock bajo
              </h2>
            </div>
            {totalStockBajo > 5 && (
              <button
                onClick={() => navigate("/inventario?stock=bajo")}
                className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 transition"
              >
                Ver todos ({totalStockBajo}) <FiArrowRight size={11} />
              </button>
            )}
          </div>

          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Producto", "Modelo", "Stock actual"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stockBajo.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-sm text-gray-400">
                    Todos los productos tienen stock suficiente
                  </td>
                </tr>
              ) : (
                stockBajo.map((item) => (
                  <tr key={item.id_producto} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 text-gray-700 max-w-[130px] truncate">
                      {item.producto}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[100px] truncate">
                      {item.modelo}
                    </td>
                    <td className="px-4 py-3">
                      <StockIndicator
                        stock={item.stock_actual}
                        minimo={item.stock_minimo}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>

      </div>

    </div>
  )
}