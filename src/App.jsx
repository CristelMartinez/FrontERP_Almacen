import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import { Toaster } from "react-hot-toast"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Productos from "./pages/Productos"
import Movimientos from "./pages/Movimientos"
import Inventario from "./pages/Inventario"
import Usuarios from "./pages/Usuarios"
import Reportes from "./pages/Reportes"
import ReporteMovimientos from "./pages/reportes/ReporteMovimientos"
import ReporteInventario from "./pages/reportes/ReporteInventario"
import ReporteStockBajo from "./pages/reportes/ReporteStockBajo"
import ReporteProductos from "./pages/reportes/ReporteProductos"
import KardexProducto from "./pages/reportes/KardexProducto"
import Configuracion from "./pages/Configuracion"
import Categorias from "./pages/configuracion/Categorias"
import Unidades from "./pages/configuracion/Unidades"
import Proveedores from "./pages/configuracion/Proveedores"
import Departamentos from "./pages/configuracion/Departamentos"
import TiposMovimiento from "./pages/configuracion/TiposMovimiento"
import Almacenes from "./pages/configuracion/Almacenes"
import Ubicaciones from "./pages/configuracion/Ubicaciones"
import Apartados from "./pages/Apartados"
import ReporteApartados from "./pages/reportes/ReporteApartados"
import Familias from "./pages/configuracion/Familias"
import Subfamilias from "./pages/configuracion/Subfamilias"

import MainLayout from "./layouts/MainLayout"

function App() {

  return (
    <>
    <Toaster position="top-right" />
    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* SISTEMA */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/reportes/movimientos" element={<ReporteMovimientos />} />
        <Route path="/reportes/inventario" element={<ReporteInventario />} />
        <Route path="/reportes/stock-bajo" element={<ReporteStockBajo />} />
        <Route path="/reportes/productos" element={<ReporteProductos />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/configuracion/categorias" element={<Categorias />} />
        <Route path="/configuracion/unidades" element={<Unidades />} />
        <Route path="/configuracion/proveedores" element={<Proveedores />} />
        <Route path="/configuracion/departamentos" element={<Departamentos />} />
        <Route path="/configuracion/tipos-movimiento" element={<TiposMovimiento />} />
        <Route path="/configuracion/almacenes" element={<Almacenes />} />
        <Route path="/apartados" element={<Apartados />} />
        <Route path="/reportes/kardex" element={<KardexProducto />} />
        <Route path="/reportes/apartados" element={<ReporteApartados />} />
        <Route path="/configuracion/ubicaciones" element={<Ubicaciones/>}/>
        <Route path="/configuracion/familias" element={<Familias/>}/>
        <Route path="/configuracion/subfamilias" element={<Subfamilias/>}/>


        

      </Route>

    </Routes>
    </>    
  )

}

export default App