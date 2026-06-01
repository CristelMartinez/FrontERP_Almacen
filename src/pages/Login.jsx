import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { FiMail, FiLock, FiEye, FiEyeOff, FiBox, FiUser } from "react-icons/fi"
import api from "../api/api"

export default function Login() {
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [verPassword, setVerPassword] = useState(false)
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!nombre || !password) {
      toast.error("Nombre de usuario y contraseña son obligatorios")
      return
    }

    setCargando(true)

    try {
      const res = await api.post("/auth/login", { nombre, password })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario))

      toast.success("Bienvenido al sistema")
      navigate("/dashboard")
    } catch (err) {
      const mensaje = err.response?.data?.message || "Error al iniciar sesión"
      toast.error(mensaje)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* PANEL IZQUIERDO — decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between p-12">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <FiBox size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg">ERP Almacén</span>
        </div>

        {/* MENSAJE CENTRAL */}
        <div>
          <h1 className="text-4xl font-semibold text-white leading-snug mb-4">
            Control total de tu inventario textil
          </h1>
          <p className="text-blue-200 text-base leading-relaxed">
            Gestiona entradas, salidas, ubicaciones y productos desde un solo lugar.
          </p>
        </div>

        {/* DATOS DECORATIVOS */}
        <div className="flex gap-8">
          {[
            { label: "Módulos", valor: "8+" },
            { label: "Importación masiva", valor: "Excel" },
            { label: "Control de roles", valor: "Sí" },
          ].map(({ label, valor }) => (
            <div key={label}>
              <p className="text-white font-semibold text-xl">{valor}</p>
              <p className="text-blue-300 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* PANEL DERECHO — formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* LOGO MÓVIL */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <FiBox size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800">ERP Almacén</span>
          </div>

          {/* ENCABEZADO */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Iniciar sesión
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* NOMBRE DE USUARIO */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Nombre de usuario
              </label>
              <div className="relative">
                <FiUser
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="nombre de usuario"
                  autoComplete="username"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Contraseña
              </label>
              <div className="relative">
                <FiLock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                />
                <input
                  type={verPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                  tabIndex={-1}
                >
                  {verPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>

          </form>

          {/* PIE */}
          <p className="text-center text-xs text-gray-300 mt-10">
            ERP Almacén Textil © {new Date().getFullYear()}
          </p>

        </div>
      </div>

    </div>
  )
}