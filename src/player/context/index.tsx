import { createContext, ReactNode, useContext, useState } from 'react';
import { ISong } from '../../services/api/interfaces';

enum LoopMode {
  NoLoop = 'NO_LOOP',
  LoopAll = 'LOOP_ALL',
  LoopOne = 'LOOP_ONE'
}

interface PlayerContextProps {
  currentSong: ISong | null;
  playlist: ISong[];
  isPlaying: boolean;
  loopMode: LoopMode;
  playSong: (song: ISong, otherSongs: ISong[]) => void;
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  next: () => void;
  prev: () => void;
  toggleLoop: () => void;
  setVolume: (volume: number) => void;
  seek: (progress: number) => void;
  volume: number;
  progress: number;
}

export const PlayerContext = createContext<PlayerContextProps>({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  loopMode: LoopMode.LoopAll, // По умолчанию включено цикличное воспроизведение всего плейлиста
  playSong: () => {},
  play: () => {},
  pause: () => {},
  togglePlayback: () => {},
  next: () => {},
  prev: () => {},
  toggleLoop: () => {},
  setVolume: () => {},
  seek: () => {},
  volume: 1,
  progress: 0
});

export interface IPlayerProvider {
  children?: ReactNode;
}

export const PlayerProvider = ({ children }: IPlayerProvider) => {
  const [currentSong, setCurrentSong] = useState<ISong | null>(null);
  const [playlist, setPlaylist] = useState<ISong[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState(LoopMode.LoopAll);
  const [volume, setVolumeState] = useState(1); // default volume
  const [progress, setProgress] = useState(0); // default progress

  const toggleLoop = () => {
    setLoopMode((prevMode) => {
      switch (prevMode) {
        case LoopMode.NoLoop:
          return LoopMode.LoopAll;
        case LoopMode.LoopAll:
          return LoopMode.LoopOne;
        case LoopMode.LoopOne:
          return LoopMode.NoLoop;
        default:
          return LoopMode.LoopAll;
      }
    });
  };

  const playSong = (song: ISong, otherSongs: ISong[]) => {
    setCurrentSong(song);

    const songIndex = otherSongs.findIndex((s) => s.ID === song.ID);

    let newPlaylist: ISong[] = [];
    if (loopMode === LoopMode.NoLoop) {
      newPlaylist = otherSongs.slice(songIndex + 1);
    } else if (loopMode === LoopMode.LoopAll) {
      // Разбиваем otherSongs на две части и ротируем так, чтобы текущая песня была в конце цикла
      newPlaylist = [
        ...otherSongs.slice(songIndex + 1), // Песни после текущей
        song, // Добавляем текущую песню в конец
        ...otherSongs.slice(0, songIndex) // Песни до текущей, включая текущую в цикл
      ];
    } else if (loopMode === LoopMode.LoopOne) {
      newPlaylist = [song];
    }

    console.log('Current playlist:', newPlaylist);

    setPlaylist(newPlaylist);
    setIsPlaying(true);
  };

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  const next = () => {
    if (!playlist.length) return;

    const currentIndex = playlist.findIndex(
      (song) => song.ID === currentSong?.ID
    );
    let nextIndex;

    switch (loopMode) {
      case LoopMode.NoLoop:
        nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
          setCurrentSong(playlist[nextIndex]);
          seek(0);
        } else {
          pause(); // Пауза, если достигнут конец плейлиста без цикла
        }
        break;
      case LoopMode.LoopAll:
        nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentSong(playlist[nextIndex]);
        seek(0);
        break;
      case LoopMode.LoopOne:
        // В режиме повтора одной песни просто перезапускаем её
        play();
        break;
    }
  };

  const prev = () => {
    if (!playlist.length) return;

    const currentIndex = playlist.findIndex(
      (song) => song.ID === currentSong?.ID
    );
    let prevIndex;

    switch (loopMode) {
      case LoopMode.NoLoop:
        prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          setCurrentSong(playlist[prevIndex]);
          seek(0);
        }
        break;
      case LoopMode.LoopAll:
        prevIndex = (currentIndex - 1 + playlist.length) % playlist.length; // Используем модуль для цикличного переключения
        setCurrentSong(playlist[prevIndex]);
        seek(0);
        break;
      case LoopMode.LoopOne:
        // В режиме повтора одной песни просто перезапускаем её
        play();
        break;
    }
  };

  const setVolume = (volume: number) => {
    setVolumeState(volume);
  };

  const seek = (progress: number) => {
    setProgress(progress);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        playlist,
        isPlaying,
        loopMode,
        playSong,
        play,
        pause,
        togglePlayback,
        next,
        prev,
        toggleLoop,
        setVolume,
        seek,
        volume,
        progress
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
