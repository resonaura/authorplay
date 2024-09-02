import './App.scss';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink
} from 'react-router-dom';
import Home from './pages/home';
import OnlineMusic from './pages/online';
import Player from './player';
import { APIServiceContext } from './services/api/context';
import { APIService } from './services/api';
import { PlayerProvider } from './player/context';
import ArtistPage from './pages/artist';

function App() {
  const apiService = new APIService();

  return (
    <APIServiceContext.Provider value={apiService}>
      <PlayerProvider>
        <Router>
          <main>
            <header>
              <div className='menu'>
                <NavLink to='/online'>
                  <span>Online</span>
                </NavLink>
                <NavLink to='/home'>
                  <span>Home</span>
                </NavLink>
              </div>
            </header>

            <Routes>
              <Route path='/home' element={<Home />} />
              <Route path='/online' element={<OnlineMusic />} />
              <Route path='/artist/:tag' element={<ArtistPage />} />
              <Route path='*' element={<Navigate to={'/home'} />} />
            </Routes>

            <Player />
          </main>
        </Router>
      </PlayerProvider>
    </APIServiceContext.Provider>
  );
}

export default App;
