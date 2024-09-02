/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimationTools } from '../../tools/animation';
import './index.scss';

import { useEffect, useState } from 'react';

export interface ILoadingSpinner {
  width?: number;
  height?: number;
  color?: string;
}
export function LoadingSpinner(props: ILoadingSpinner) {
  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox='0 0 50 50'
      className='loading-spinner'
      style={
        {
          enableBackground: 'new 0 0 50 50',
          minWidth: (props.width ?? 24) + 'px'
        } as any
      }
    >
      <path
        fill={props.color}
        d='M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z'
      >
        <animateTransform
          attributeType='xml'
          attributeName='transform'
          type='rotate'
          from='0 25 25'
          to='360 25 25'
          dur='0.6s'
          repeatCount='indefinite'
        />
      </path>
    </svg>
  );
}

export interface ILoadingOverlay {
  active: boolean;
  style?: React.CSSProperties;
  isGlobal?: boolean;
  loadingMessage?: string;
}

export function LoadingOverlay(props: ILoadingOverlay) {
  const [isDetached, setIsDetached] = useState<boolean>(!props.active);
  const [isHidden, setIsHidden] = useState<boolean>(!props.active);

  const [lastAnimationTimeout, setLastAnimationTimeout] = useState<any | null>(
    null
  );

  useEffect(() => {
    if (lastAnimationTimeout) {
      clearTimeout(lastAnimationTimeout);
    }

    const timeout = AnimationTools.autoShowHideTransition(
      props.active,
      setIsDetached,
      setIsHidden
    );

    setLastAnimationTimeout(timeout);
  }, [props.active]);

  return (
    (!isDetached && (
      <div
        className={
          'loading-wrapper' +
          (isHidden ? ' hidden' : '') +
          (props.isGlobal ? ' global' : '')
        }
        style={props.style}
      >
        <div className='loading'>
          <LoadingSpinner color='white' />
        </div>
      </div>
    )) ||
    null
  );
}
