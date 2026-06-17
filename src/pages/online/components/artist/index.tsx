import { IArtist } from '../../../../services/api/interfaces';

export interface ArtistProps {
  artist: IArtist;
  onClick?: () => void;
}
export function Artist(props: ArtistProps) {
  const handleClick = () => {
    props.onClick?.();
  };

  return (
    <article data-type='author' onClick={handleClick} className={'artist'}>
      <div
        className='background'
        style={{ backgroundImage: `url(${props.artist.Resources?.Poster})` }}
      ></div>
      <div className='descript'>
        <div className='title'>{props.artist.Title}</div>
      </div>
    </article>
  );
}
