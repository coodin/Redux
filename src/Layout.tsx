import { Outlet } from "react-router-dom"
import { Navbar } from "./app/Navbar"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Layout
