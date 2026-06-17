import { useEffect, useState } from 'react';
import { useAPI } from '../../services/api/context';
import { IArtist, ISong } from '../../services/api/interfaces';
import { Song } from './components/song';
import { usePlayer } from '../../player/context';
import SmoothBackgroundImage from '../../components/smoothBackgroundImage';
import { LoadingOverlay } from '../../components/loading';
import { Artist } from './components/artist';
import { useNavigate } from 'react-router-dom';

function OnlineMusic() {
  const apiService = useAPI();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [songs, setSongs] = useState<ISong[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);

  const updateSongs = async () => {
    const response = await apiService.getSongs();

    setSongs(response.data ?? []);
  };

  const updateArtists = async () => {
    const response = await apiService.getArtists();

    setArtists(response.data ?? []);
  };

  useEffect(() => {
    setIsLoading(true);

    Promise.all([updateSongs(), updateArtists()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const player = usePlayer();

  return (
    <div className='main-content'>
      <div className='header-place'></div>
      <div className='categories'>
        <div className='category'>
          <SmoothBackgroundImage
            className='category-heading'
            src={'/assets/images/bg-3.jpg'}
          >
            <span>Latest Songs</span>
          </SmoothBackgroundImage>
          <section>
            {songs.map((song) => {
              return (
                <Song
                  onPlay={() => player.playSong(song, songs)}
                  key={song.ID}
                  song={song}
                />
              );
            })}
          </section>
        </div>
        <div className='category'>
          <SmoothBackgroundImage
            className='category-heading'
            src={'/assets/images/bg-6.jpg'}
          >
            <span>Artists</span>
          </SmoothBackgroundImage>
          <section>
            {artists.map((artist) => {
              return (
                <Artist
                  key={artist.ID}
                  artist={artist}
                  onClick={() => navigate(`/artist/${artist.ShortTag}`)}
                />
              );
            })}
          </section>
        </div>
      </div>

      <LoadingOverlay active={isLoading} />
    </div>
  );
}

export default OnlineMusic;
