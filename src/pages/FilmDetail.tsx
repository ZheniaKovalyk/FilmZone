import { useEffect, useState} from 'react';
import {useParams } from 'react-router-dom';
import '../App.css';
import { supabase } from '../layout/supabaseClient';

type Film = {
  id: string;
  title: string;
  year: number;
  country: string;
  genre: string;
  director: string;
  banner: string;
  describe: string;
  time: string;
  entitle: string;
  age: string;
  actors: string;
};

type Episode = {
  id: string;
  film_id: string;
  season: number;
  series: number;
  src: string;
};

const FilmDetail = () => {
  const { id } = useParams();

  const [film, setFilm] = useState<Film | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');

  if (!id) {
    return <p>Фільм не знайдено</p>;
  }

  const handleSelectEpisode = (src: string) => {
    setSelectedEpisode(src);
    const savedKey = `${id}-season-${selectedSeason}`;
    localStorage.setItem(savedKey, src);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [filmRes, episodesRes] = await Promise.all([
        supabase.from('films').select('*').eq('id', id).single(),
        supabase.from('mainly').select('*').eq('film_id', id).order('series')
      ]);

      if (filmRes.data) setFilm(filmRes.data);
      if (episodesRes.data) setEpisodes(episodesRes.data);
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    if (episodes.length > 0) {
      const firstSeason = episodes[0].season;
      setSelectedSeason(firstSeason);
    }
  }, [episodes]);

  useEffect(() => {
    if (selectedSeason !== null) {
      const savedKey = `${id}-season-${selectedSeason}`;
      const savedEpisode = localStorage.getItem(savedKey);
      if (savedEpisode) {
        setSelectedEpisode(savedEpisode);
      } else {
        const firstEp = episodes.find(e => e.season === selectedSeason);
        setSelectedEpisode(firstEp?.src || '');
      }
    }
  }, [selectedSeason, episodes]);


  const seasons = [...new Set(episodes.map(ep => ep.season))];
  const visibleEpisodes = episodes.filter(ep => ep.season === selectedSeason);

  if (!film) return <p>Завантаження...</p>;



  return (
    <section>
      <div className="general">
        <div className="detail">
          <div className="table">
            <h2 className="title">{film.title}</h2>
            <h4 className='entitle'>{film.entitle}</h4>
            <table>
              <tbody>
                <tr><td className="label">Рік виходу:</td><td className='label-value'>{film.year}</td></tr>
                <tr><td className="label">Вік:</td><td className='label-value'>{film.age}</td></tr>
                <tr><td className="label">Час:</td><td className='label-value'>{film.time}</td></tr>
                <tr><td className="label">Країна:</td><td className='label-value'>{film.country}</td></tr>
                <tr><td className="label">Жанр:</td><td className='label-value'>{film.genre}</td></tr>
                <tr><td className="label">Актори:</td><td className='label-value'>{film.actors}</td></tr>
                <tr><td className="label">Режисер:</td><td className='label-value'>{film.director}</td></tr>

              </tbody>
            </table>
          </div>
          <img src={film.banner} alt={film.title} className="img" />
        </div>

        <p className="describe">{film.describe}</p>

        <div className="player">
          <iframe src={`https://1drv.ms/v/c/${selectedEpisode}`} width="100%" height="100%"  scrolling="no" allowFullScreen/>
        </div>

        <div className="sands">

            <div className="online"><h3>Дивитися онлайн "{film.title}"</h3></div> 
          <div className={seasons.length < 2 ? 'invisible-style' : 'season'} >
            {seasons.map(season => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={season === selectedSeason ? 'filter-btn-active' : 'filter-btn'}
              >
                Сезон {season}
              </button>
            ))}
          </div>

          <div className={episodes.length < 2 ? 'invisible-style' : ''}>
            {visibleEpisodes.map(ep => (
              <button
                key={ep.id}
                onClick={() => {
                  handleSelectEpisode(ep.src);


                }}
                className={ep.src === selectedEpisode ? 'filter-btn-active' : 'filter-btn'}
              >
                Серія {ep.series}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilmDetail;
