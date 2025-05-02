import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import React, { useEffect } from 'react';

type Film = {
  id: number;
  title: string;
  banner: string;
  category: string;
  year: number;
  entitle: string;
};

const Header = () => {
  const [films, setFilms] = React.useState<Film[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredFilms, setFilteredFilms] = React.useState<Film[]>([]);

  useEffect(() => {
    fetchFilms();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = films.filter(f =>
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.entitle.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8); // обмеження на кількість результатів

      setFilteredFilms(filtered);
    } else {
      setFilteredFilms([]);
    }
  }, [searchTerm, films]);

  const fetchFilms = async () => {
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching films:', error.message);
    } else if (data) {
      setFilms(data);
    }
  };

  return (
    <header>
      <Link to="/"><img src="FilmZone.png" alt="Logo" className="logo" /></Link>
      <Link to="/"><h1 className="logo-name">FilmZone</h1></Link>

      <div className="search search-header">
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
    </header>
  );
};

export default Header;
