import { useState, FC, ReactNode } from 'react';

import './index.scss';
import { SmoothVisibility } from '../smoothVisibility';

interface SmoothBackgroundImageProps {
  src: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  children?: ReactNode;
}

const SmoothBackgroundImage: FC<SmoothBackgroundImageProps> = (props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const imageLoadHandler = () => {
    setIsLoaded(true);

    props.onLoad?.();
  };

  return (
    <div
      className={
        'smooth-background-image' +
        (isLoaded ? ' loaded' : '') +
        (props.className ? ` ${props.className}` : '')
      }
    >
      <div className='rendering-wrapper'>
        <SmoothVisibility
          visible={isLoaded}
          className='background-image'
          style={{
            backgroundImage: `url(${props.src})`
          }}
        ></SmoothVisibility>
        <img
          src={props.src}
          onLoad={imageLoadHandler}
          onError={props.onError}
          alt=''
          className='hidden-loading-image'
        />
      </div>
      {props.children}
    </div>
  );
};

export default SmoothBackgroundImage;
