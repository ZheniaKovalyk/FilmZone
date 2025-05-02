import '../App.css'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
      <div>
        <Link to="/">      <h4 className='footer-tt'>FilmZone</h4></Link>
        <h5 className='definition'>FilmZone — фільми та серіали українською, завжди поруч.</h5>
      </div>
      <div className='law'><h5>© 2025 FilmZone. Всі права захищені</h5></div>
      <div><a href="https://github.com/ZheniaKovalyk" target="_blank" rel="noopener noreferrer">
      <img className='github' src=".//github.svg" alt="" />
      </a></div>


    </footer>
  )
}

export default Footer
