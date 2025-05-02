import '../App.css';
import { Link } from 'react-router-dom';
import { supabase } from '../layout/supabaseClient';
import { useEffect, useState } from 'react';

const FILMS_PER_PAGE = 12;

type Film = {
  id: number;
  title: string;
  banner: string;
  category: string;
  year: number;
};

const Release = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFilms, setTotalFilms] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [sortType, setSortType] = useState<'newest' | 'oldest' | 'az' | 'za' | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [originalFilms, setOriginalFilms] = useState<Film[]>([]);

  useEffect(() => {
    fetchTotalFilms();
    fetchAllCategories();
    fetchFilms();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchFilmsByCategories(selectedCategories);
    } else {
      fetchFilms();
    }
  }, [currentPage, selectedCategories, sortType]);

  useEffect(() => {
    if (!loading) {
      applySorting(films, sortType);
    }
  }, [films]);

  const fetchTotalFilms = async () => {
    const { count } = await supabase
      .from('films')
      .select('*', { count: 'exact', head: true });

    if (count !== null) {
      setTotalFilms(count);
    }
  };

  const fetchAllCategories = async () => {
    const { data, error } = await supabase
      .from('films')
      .select('category');

    if (error) {
      console.error('Помилка при завантаженні категорій:', error.message);
    } else {
      const uniqueCategories = Array.from(new Set((data || []).map(film => film.category)));
      setAllCategories(uniqueCategories);
    }
  };

  const fetchFilms = async () => {
    const { data, error } = await supabase
      .from('films')
      .select('*');

    if (error) {
      console.error('Помилка при завантаженні фільмів:', error.message);
    } else {
      setFilms(data || []);
      setOriginalFilms(data || []);
      setTotalFilms(data?.length || 0);
    }

    setLoading(false);
  };

  const fetchFilmsByCategories = async (categories: string[]) => {
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .in('category', categories);

    if (error) {
      console.error('Помилка при завантаженні фільмів по категоріях:', error.message);
    } else {
      setFilms(data || []);
      setOriginalFilms(data || []);
      setTotalFilms(data?.length || 0);
    }

    setLoading(false);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleSort = (type: 'newest' | 'oldest' | 'az' | 'za') => {
    if (sortType === type) {
      setFilms([...originalFilms]);
      setSortType(null);
    } else {
      const sortedFilms = sortFilms([...films], type);
      setFilms(sortedFilms);
      setSortType(type);
    }
  };

  const applySorting = (films: Film[], sortType: 'newest' | 'oldest' | 'az' | 'za' | null) => {
    if (sortType !== null) {
      const sortedFilms = sortFilms(films, sortType);
      setFilms(sortedFilms);
    }
  };

  const sortFilms = (films: Film[], sortType: 'newest' | 'oldest' | 'az' | 'za'): Film[] => {
    switch (sortType) {
      case 'newest':
        return [...films].sort((a, b) => b.year - a.year);
      case 'oldest':
        return [...films].sort((a, b) => a.year - b.year);
      case 'az':
        return [...films].sort((a, b) => a.title.localeCompare(b.title));
      case 'za':
        return [...films].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return films;
    }
  };

  const totalPages = Math.ceil(totalFilms / FILMS_PER_PAGE);

  return (
    <>
      <div className="detail-posters">


        <div className="category-buttons">
          <h1 className='sort-title'>Вибрати категорію</h1>
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={ selectedCategories.includes(category) ? 'filter-btn-active' : 'filter-btn'}
            >
              {category}
            </button>
          ))}
        </div>
        <div className='sort-btn'>
          <h1  className='sort-title'>Сортувати </h1>
          <div>
            <button
              onClick={() => handleSort('newest')}
              className={sortType === 'newest' ? 'filter-btn-active' : 'filter-btn'}
            >
              Від новішого до старішого
            </button>
            <button
              onClick={() => handleSort('oldest')}
              className={sortType === 'oldest' ? 'filter-btn-active' : 'filter-btn'}
            >
              Від старішого до новішого
            </button>
            <button
              onClick={() => handleSort('az')}
              className={sortType === 'az' ? 'filter-btn-active' : 'filter-btn'}
            >
              Від А до Я
            </button>
            <button
              onClick={() => handleSort('za')}
              className={sortType === 'za' ? 'filter-btn-active' : 'filter-btn'}
            >
              Від Я до А
            </button>
          </div>
        </div>
        {loading ? (
          <p>Завантаження...</p>
        ) : (
          <ul className="post-ul">
            {films
              .slice((currentPage - 1) * FILMS_PER_PAGE, currentPage * FILMS_PER_PAGE)
              .map((film) => (
                <li key={film.id}>
                  <Link to={`/FilmDetail/${film.id}`}>
                    <div className="posters">
                      <img className="posters-img" src={film.banner} alt={film.title} />
                      <p className="p-title">{film.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        )}

        <div className="pagination">
          <button className='btn-marg' onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            <img className='btn-pag btn-pag-left' src="chevron-right-solid.svg" alt="" />
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                className={`btn-marg ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button className='btn-marg' onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            <img className='btn-pag' src="chevron-right-solid.svg" alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Release;
