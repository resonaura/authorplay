/* eslint-disable @typescript-eslint/no-explicit-any */
import './index.scss';

import React, { createElement, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // Import createPortal from react-dom
import { AnimationTools } from '../../tools/animation';

export interface ISmoothVisibility {
  visible: boolean;
  className?: string;
  duration?: number;
  children?: ReactNode | ReactNode[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  as?: keyof JSX.IntrinsicElements;
  onClick?: (e: any) => void;
  style?: React.CSSProperties | undefined;
  id?: string;
  containerRef?: React.Ref<any>;
  usePortal?: boolean; // Optional property, default is false
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onFocusCapture?: (e: React.FocusEvent) => void;
}

export function SmoothVisibility(props: ISmoothVisibility) {
  const [isHidden, setIsHidden] = useState<boolean>(!props.visible);
  const [isDetached, setIsDetached] = useState<boolean>(!props.visible);

  useEffect(() => {
    const timeout = AnimationTools.autoShowHideTransition(
      props.visible,
      setIsDetached,
      setIsHidden,
      props.duration
    );

    return () => clearTimeout(timeout);
  }, [props.visible, props.duration]);

  const containerElement: keyof JSX.IntrinsicElements = props.as ?? 'div';
  const element = createElement(
    containerElement,
    {
      id: props.id,
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
      className:
        'smooth-visibility' +
        (isHidden ? ' hidden' : '') +
        (props.className ? ' ' + props.className : ''),
      ref: props.containerRef,
      style: props.style,
      onClick: props.onClick,
      onScroll: props.onScroll,
      onMouseDown: props.onMouseDown,
      onFocusCapture: props.onFocusCapture
    },
    props.children
  );

  if (props.usePortal && !isDetached) {
    const portalNode =
      document.body.querySelector('.alchemy-root') ??
      document?.querySelector('#root') ??
      document.body;

    return createPortal(element, portalNode);
  } else {
    return <>{!isDetached && element}</>;
  }
}
