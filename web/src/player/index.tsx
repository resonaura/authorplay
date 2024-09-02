/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import { usePlayer } from './context';

const Player: React.FC = () => {
  const {
    currentSong,
    progress,
    volume,
    isPlaying,
    togglePlayback,
    next,
    prev,
    setVolume,
    seek,
    playlist
  } = usePlayer();

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const bufferedBarRef = useRef<HTMLDivElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isChangingVolume, setIsChangingVolume] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio) {
        const updatedProgress = audio.currentTime / audio.duration;
        seek(updatedProgress);
      }
    };

    const updateBuffered = () => {
      if (audio && bufferedBarRef.current) {
        const buffered = audio.buffered;
        const duration = audio.duration;
        if (buffered.length) {
          const bufferedEnd = buffered.end(buffered.length - 1);
          bufferedBarRef.current.style.width = `${(bufferedEnd / duration) * 100}%`;
        }
      }
    };

    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('progress', updateBuffered);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('progress', updateBuffered);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isSeeking) handleSeek(e as any);
      if (isChangingVolume) handleVolumeChange(e as any);
    };

    const handleMouseUp = () => {
      setIsSeeking(false);
      setIsChangingVolume(false);
    };

    const handleMouseLeave = () => {
      setIsSeeking(false);
      setIsChangingVolume(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isSeeking, isChangingVolume]);

  const handleVolumeStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setIsChangingVolume(true);
    handleVolumeChange(e as any, true);
  };

  const handleVolumeChange = (e: any, force?: boolean) => {
    if (!isChangingVolume && !force) return;
    const volumeBar = volumeBarRef.current;
    if (volumeBar) {
      const clientX = e.type.startsWith('mouse')
        ? e.clientX
        : e.touches[0].clientX;
      const rect = volumeBar.getBoundingClientRect();
      const volume = (clientX - rect.left) / rect.width;
      setVolume(Math.max(0, Math.min(1, volume)));
    }
  };

  const handleSeek = (e: any, force?: boolean) => {
    if (!isSeeking && !force) return;
    const progressBar = progressBarRef.current;
    if (progressBar && audioRef.current) {
      const clientX = e.type.startsWith('mouse')
        ? e.clientX
        : e.touches[0].clientX;
      const rect = progressBar.getBoundingClientRect();
      const progress = (clientX - rect.left) / rect.width;
      audioRef.current.currentTime = audioRef.current.duration * progress;
      seek(progress);
    }
  };

  const handleSeekStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setIsSeeking(true);
    handleSeek(e, true);
  };

  return (
    <footer className={'player' + (playlist.length > 0 ? ' active' : '')}>
      <audio
        ref={audioRef}
        src={currentSong?.Resources?.Audio}
        onEnded={next}
      />
      <div className='data'>
        <div
          className='poster'
          style={{
            backgroundImage: `url(${currentSong?.Resources?.Poster || '/images/default.svg'})`
          }}
        ></div>
        <div className='info'>
          <div className='title'>{currentSong?.Title}</div>
          <div className='author'>{currentSong?.ArtistName}</div>
        </div>
      </div>
      <div className='wrapper'>
        <div className='controls'>
          <button className='prev' onClick={prev}></button>
          <button
            className={`play ${isPlaying ? 'played' : ''}`}
            onClick={togglePlayback}
          ></button>
          <button className='next' onClick={next}></button>
        </div>
      </div>
      <div
        id='volumeBar'
        onMouseDown={handleVolumeStart}
        onTouchStart={handleVolumeStart}
        ref={volumeBarRef}
        onClick={(e) => handleVolumeChange(e, true)}
      >
        <div id='volume' style={{ width: `${volume * 100}%` }}>
          <span></span>
        </div>
      </div>
      <div
        id='progressBar'
        onMouseDown={handleSeekStart}
        onTouchStart={handleSeekStart}
        ref={progressBarRef}
        onClick={(e) => handleSeek(e, true)}
      >
        <div
          id='buffered'
          ref={bufferedBarRef}
          style={{ width: '0%' }} // initially zero
        ></div>
        <div id='progress' style={{ width: `${progress * 100}%` }}>
          <span></span>
        </div>
      </div>
    </footer>
  );
};

export default Player;
