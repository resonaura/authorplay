import { useState, CSSProperties, FC } from 'react';

interface SmoothImageProps {
  src: string;
  alt: string;
  placeholderImgUrl?: string;
  containerStyles?: CSSProperties;
  imageStyles?: CSSProperties;
  transitionTime?: number;
  transitionTimingFunction?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const SmoothImage: FC<SmoothImageProps> = ({
  src,
  alt,
  placeholderImgUrl = '',
  containerStyles = {},
  imageStyles = {},
  transitionTime = 0.3,
  transitionTimingFunction = 'ease-in',
  className,
  onLoad,
  onError
}) => {
  const [loaded, setLoaded] = useState<CSSProperties>({});

  const imageLoadHandler = () => {
    setLoaded({
      opacity: '1',
      transitionProperty: 'opacity',
      transitionDuration: `${transitionTime}s`,
      transitionTimingFunction
    });

    onLoad?.();
  };

  const bgImage = placeholderImgUrl ? `url(${placeholderImgUrl})` : undefined;

  return (
    <div
      className={'smooth-image' + (className ? ` ${className}` : '')}
      style={{
        position: 'relative',
        width: '100%',
        height: 0,
        opacity: 0,
        overflow: 'hidden',
        backgroundImage: bgImage,
        paddingBottom: '100%',
        backgroundSize: 'cover',
        ...containerStyles,
        ...loaded
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          ...imageStyles
        }}
        onLoad={imageLoadHandler}
        onError={onError}
      />
    </div>
  );
};

export default SmoothImage;
