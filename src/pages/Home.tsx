import {Link } from 'react-router-dom';
import '../App.css';
import { useEffect, useState } from 'react';
import { supabase } from '../layout/supabaseClient';





type Film = {
  id: number;
  title: string;
  banner: string;
};

const Home = () => {

  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {

    const fetchRandomFilms = async () => {
      const { data, error } = await supabase.rpc('get_random_films');

      if (error) {
        console.error('Помилка при завантаженні фільмів:', error.message);
      } else {
        setFilms(data || []);
      }

      setLoading(false);
    };

    fetchRandomFilms();
  }, []);


  return (
<>
<div className="osnova">
  <div className="img-heart">
  <img className='hearts-in-eyes' src="heart.png" alt="" />
  </div>
              {loading ? <p>Завантаження...</p> : (
              <ul className='post-ul'>
                {films.map(film => (
                  <li key={film.id}>
                    <Link to={`/FilmDetail/${film.id}`}>
                      <div className="posters posters-ban">
                        <img className='posters-img' src={film.banner} alt={film.title} />
                        <p className='p-title' >{film.title}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          
        
</div>
          

    </>
  );
};
export default Home;
