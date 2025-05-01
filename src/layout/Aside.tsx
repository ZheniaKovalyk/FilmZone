import React, { useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

const asideBannerNumber = 3;
const searchBannerNumber = 8;

type Film = {
  id: number;
  title: string;
  banner: string;
  category: string;
  year: number;
};

function Aside() {
  const [films, setFilms] = React.useState<Film[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [filteredFilms, setFilteredFilms] = React.useState<Film[]>([]);

  useEffect(() => {
    fetchFilms();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      searchFilms();
    } else {
      fetchFilms();
    }
  }, [searchTerm]);

  const fetchFilms = async () => {
    const response = await supabase
      .from('films')
      .select('*')
      .order('year', { ascending: false })
      .limit(asideBannerNumber);

    if (response.error) {
      console.error('Error fetching films:', response.error.message);
    } else {
      setFilms(response.data as Film[]);
      setFilteredFilms([]);
    }
  }

  const searchFilms = async () => {
    const response = await supabase
      .from('films')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .limit(searchBannerNumber);

    if (response.error) {
      console.error('Error fetching films:', response.error.message);
    } else {
      setFilteredFilms(response.data as Film[]);
    }
  }

  return (
    <aside>
      <div className="search">
        <form className='search-form' onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Пошук"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
            <ul className="w-full">
            {filteredFilms.map((film) => (
              <li key={film.id} className='auto-complete'>
                <Link to={`/FilmDetail/${film.id}`}
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredFilms([]);
                  }}
                >
                  <div className="search-t">
                    <div className="s-title">
                      <p>{film.title}</p>
                      <p>{film.category}</p>
                    </div>
                    <img className="s-img" src={film.banner} alt={film.title} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </form>
      </div>
      <ul className='post-ul'>
        {films.map((film) => (
          <li key={film.id}>
            <Link to={`/FilmDetail/${film.id}`}>
              <div className="posters img-as">
                <img className="posters-img" src={film.banner} alt={film.title} />
                <p className="p-title">{film.title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Aside;
