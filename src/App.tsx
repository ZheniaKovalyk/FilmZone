import { Routes, Route, } from 'react-router-dom';
import Home from './pages/Home';
import Release from './pages/Release';
import Schedule from './pages/Schedule';
import FilmDetail from './pages/FilmDetail';
import Layout from './layout';

const App = () => {
  return (
    <div>

      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/release" element={<Release />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/FilmDetail/:id" element={<FilmDetail />} /></Route>
      </Routes>


    </div>
  );
};

export default App;
