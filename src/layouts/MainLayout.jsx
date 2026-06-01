import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Cerrar sidebar al navegar en móvil
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Bloquear scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* OVERLAY MÓVIL */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* NAVBAR */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* PÁGINA */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  )
}