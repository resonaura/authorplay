import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay } from '../../components/loading';
import { useEffect, useState } from 'react';
import { IArtist, ISong } from '../../services/api/interfaces';
import { useAPI } from '../../services/api/context';
import { Song } from '../online/components/song';
import { usePlayer } from '../../player/context';
import { Avatar } from '../../components/avatar';
import SmoothBackgroundImage from '../../components/smoothBackgroundImage';

function ArtistPage() {
  const { tag } = useParams();
  const navigate = useNavigate();

  const api = useAPI();
  const player = usePlayer();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [artist, setArtist] = useState<IArtist | null>(null);
  const [songs, setSongs] = useState<ISong[]>([]);

  const updateArtistInfo = async () => {
    if (!tag) {
      navigate('/online');
      return;
    }

    const response = await api.getArtistByShortTag(tag);

    if (response.ok && response.data) {
      setArtist(response.data);
      await updateSongs(response.data);
    }
  };

  const updateSongs = async (artist: IArtist) => {
    const response = await api.getSongsByArtist(artist.ID);

    if (response.ok && response.data) {
      setSongs(response.data);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    Promise.all([updateArtistInfo()])
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        navigate('/online');
      });
  }, []);

  return (
    <div className='main-content'>
      <SmoothBackgroundImage
        className='author-header-bg'
        src={artist?.Resources?.Poster ?? ''}
      >
        <div className='author-header'>
          <Avatar url={artist?.Resources?.Poster} />
          <p>{artist?.Title}</p>
        </div>
      </SmoothBackgroundImage>
      <section className='list'>
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

      <LoadingOverlay active={isLoading} />
    </div>
  );
}

export default ArtistPage;
