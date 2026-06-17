import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../../../player/context';
import { ISong } from '../../../../services/api/interfaces';
import { MouseEvent } from 'react';

export interface SongProps {
  song: ISong;
  onPlay?: () => void;
}
export function Song(props: SongProps) {
  const player = usePlayer();
  const navigate = useNavigate();

  const isCurrentSong = player.currentSong?.ID === props.song.ID;
  const isPlaying = isCurrentSong && player.isPlaying;

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    if (target.closest('.author')) return;

    if (isCurrentSong) {
      player.togglePlayback();
    } else {
      props.onPlay?.();
    }
  };

  return (
    <article
      onClick={handleClick}
      className={'song' + (isCurrentSong ? ' active' : '')}
    >
      <div
        className='background'
        style={{ backgroundImage: `url(${props.song.Resources?.Poster})` }}
      ></div>
      <div className='descript'>
        <div className='title'>{props.song.Title}</div>
        <div
          className='author'
          onClick={(e) => {
            e.preventDefault();
            navigate('/artist/' + props.song.ArtistShortTag);
          }}
        >
          {props.song.ArtistName}
        </div>
      </div>
      <button
        className={'track-button' + (isPlaying ? ' played' : '')}
      ></button>
    </article>
  );
}
