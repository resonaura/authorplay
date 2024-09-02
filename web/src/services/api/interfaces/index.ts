export interface IArtist {
  ID: number;
  Title: string;
  ShortTag: string;
  YouTubeLink: string;
  Resources?: {
    Poster: string;
  };
}

export interface IAlbum {
  ID: number;
  ArtistID: number;
  Title: string;
  Year: number;
}

export interface ISong {
  ID: number;
  ArtistID: number;
  ArtistName?: string;
  ArtistShortTag?: string;
  AlbumID: number;
  AlbumName?: string;
  Title: string;
  Feat?: string;
  Year?: number;
  Resources?: {
    Audio: string;
    Poster: string;
  };
}

export interface IGenre {
  ID: number;
  Name: string;
}

export interface IAlbumGenre {
  ID: number;
  AlbumID: number;
  GenreID: number;
}

export interface IApiResponse<T> {
  ok: boolean;
  code: number;
  data?: T;
  error?: string;
}
