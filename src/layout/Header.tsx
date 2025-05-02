import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header>
      <Link to="/"><img src="FilmZone.png" alt="Logo" className="logo" /></Link>
      <Link to="/"><h1 className="logo-name">FilmZone</h1></Link>

    </header>
  )
}

export default Header
