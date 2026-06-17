import './index.scss';

import classNames from 'classnames';
import { MouseEvent, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { LoadingOverlay } from '../loading';
import { SmoothVisibility } from '../smoothVisibility';
import { StringTools } from '../../tools/string';

export interface IAvatarBase {
  icon?: JSX.Element;
  url?: string | null;
  loader?: JSX.Element | string;
  percent?: number;
  isLoading?: boolean;
  overlayIcon?: JSX.Element;
  userName?: string;
}
export interface IAvatar extends IAvatarBase {
  size?:
    | 'nano'
    | 'micro'
    | 'micro-20'
    | 'tiny'
    | 'mini'
    | 'little'
    | 'small'
    | 'middle'
    | 'big'
    | 'large';

  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
  noFadeIn?: boolean;
}

export function Avatar({ size = 'middle', ...props }: IAvatar) {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [imageHasError, setImageHasError] = useState<boolean>(false);

  function handleOnClick(e: MouseEvent<HTMLDivElement>) {
    if (!props.disabled) {
      props.onClick?.(e);
    }
  }

  function handleOnImageLoaded() {
    setIsImageLoaded(true);
    setImageHasError(false);
  }

  function handleOnImageNotLoaded() {
    setIsImageLoaded(false);
    setImageHasError(true);
  }

  const className = classNames(
    'alchemy-avatar',
    props.className,
    `size-${typeof size === 'string' ? size : 'default'}`,
    {
      disabled: props.disabled,
      loading: props.isLoading,
      'no-image': !props.url
    }
  );

  return (
    <div className='alchemy-avatar-wrapper'>
      <div className={className} onClick={handleOnClick}>
        {props.url ? (
          <>
            <img
              src={props.url}
              className={classNames('avatar-image', {
                loaded: isImageLoaded,
                hidden: !isImageLoaded && !props.noFadeIn,
                error: imageHasError,
                'no-animation': props?.noFadeIn ? true : false
              })}
              onLoad={handleOnImageLoaded}
              onError={handleOnImageNotLoaded}
              alt='avatar'
            />
            <SmoothVisibility visible={imageHasError} className='avatar-icon'>
              <span>
                {props.userName
                  ? StringTools.capitalizeFirstTwoLetters(props.userName)
                  : 'N/A'}
              </span>
            </SmoothVisibility>
            <SmoothVisibility
              className='avatar-skeleton'
              visible={!isImageLoaded && !imageHasError}
            >
              <Skeleton />
            </SmoothVisibility>
          </>
        ) : (
          <SmoothVisibility visible={!props.isLoading} className='avatar-icon'>
            {props.icon ? (
              props.icon
            ) : props.userName ? (
              <span>
                {StringTools.capitalizeFirstTwoLetters(props.userName)}
              </span>
            ) : null}
          </SmoothVisibility>
        )}
        <LoadingOverlay active={props.isLoading ?? false} />
      </div>
    </div>
  );
}
