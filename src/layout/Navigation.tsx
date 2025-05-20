import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

async function getRandomFilmUUID() {
  const { data } = await supabase.from('films').select('id');
  const randomIndex = data && data.length > 0 ? Math.floor(Math.random() * data.length) : 0;
  return data && data.length > 0 ? data[randomIndex].id : null;
}

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 👈 використовуй useNavigate для внутрішньої навігації

  const isActive = (path: string) => location.pathname === path;

  const handleRandomLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // не дай <Link> перейти самостійно

    try {
      const randomUUID = await getRandomFilmUUID();
      if (randomUUID) {
        navigate(`/FilmDetail/${randomUUID}`); // 👈 без перезавантаження
      }
    } catch (error) {
      console.error('Error fetching random film UUID:', error);
    }
  };

  return (
    <div className="btn-all">
      <Link className={`btn ${isActive('/') ? 'active' : ''}`} to="/">Головна</Link>
      <Link className={`btn ${isActive('/release') ? 'active' : ''}`} to="/release">Анонси</Link>
      <Link className={`btn ${isActive('/schedule') ? 'active' : ''}`} to="/schedule">Розклад</Link>

      <Link
        className={`btn ${location.pathname.startsWith('/FilmDetail')}`}
        to="#"
        onClick={handleRandomLinkClick} // 👈 не використовуй to={`/FilmZone/...`}
      >
        Випадкове
      </Link>
    </div>
  );
};

export default Navigation;
