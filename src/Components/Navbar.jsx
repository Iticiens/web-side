import { Button } from "antd"
import "./styles/Navbar.css"
export const Navbar = ()=>{
  return(
    <header>
      <h1>Dashboard</h1>
        <Button className="btn">Sign Up</Button>
    </header>
  )
}