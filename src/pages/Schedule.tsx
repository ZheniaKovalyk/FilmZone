import '../App.css';
import { supabase } from '../layout/supabaseClient';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Film = {
  id: number;
  title: string;
  banner: string;
  category: string;
  year: number;
};

const dayNames = [
  'Понеділок',
  'Вівторок',
  'Середа',
  'Четвер',
  'П\'ятниця',
  'Субота',
  'Неділя',
];

const filmCounts = [5, 2, 4, 1, 3, 4, 2]; // кількість фільмів на кожен день

const Schedule = () => {
  const [weeklyFilms, setWeeklyFilms] = useState<Film[][]>([]);
  const [loading, setLoading] = useState(true);

  const getRandomSubset = (arr: Film[], count: number): Film[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchAllFilms = async () => {
      const { data, error } = await supabase.from('films').select('*');

      if (error) {
        console.error('Помилка при завантаженні фільмів:', error.message);
        setLoading(false);
        return;
      }

      const allFilms = data || [];

      const schedule = filmCounts.map((count) => getRandomSubset(allFilms, count));
      setWeeklyFilms(schedule);
      setLoading(false);
    };

    fetchAllFilms();
  }, []);

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="day-films">
      {dayNames.map((dayName, index) => (
        <div key={index}>
          <h1 className="day">{dayName}</h1>
          <ul className="post-ul">
            {weeklyFilms[index]?.map((film) => (
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
        </div>
      ))}
    </div>
  );
};

export default Schedule;
