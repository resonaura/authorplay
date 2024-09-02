import axios from 'axios';
import { IArtist, IAlbum, ISong, IGenre, IApiResponse } from './interfaces';

export class APIService {
  public baseURL: string = import.meta.env.VITE_API_HOST;

  public async getIndex(): Promise<IApiResponse<null>> {
    const response = await axios.get<IApiResponse<null>>(
      `${this.baseURL}/content/index`
    );
    return response.data;
  }

  public async getArtist(id: number): Promise<IApiResponse<IArtist>> {
    const response = await axios.get<IApiResponse<IArtist>>(
      `${this.baseURL}/content/getArtist/`,
      { params: { id } }
    );
    return response.data;
  }

  public async getArtistByShortTag(
    tag: string
  ): Promise<IApiResponse<IArtist>> {
    const response = await axios.get<IApiResponse<IArtist>>(
      `${this.baseURL}/content/getArtistByShortTag/`,
      { params: { tag } }
    );
    return response.data;
  }

  public async getAlbum(id: number): Promise<IApiResponse<IAlbum>> {
    const response = await axios.get<IApiResponse<IAlbum>>(
      `${this.baseURL}/content/getAlbum/`,
      { params: { id } }
    );
    return response.data;
  }

  public async getArtistAlbums(
    artistId: number
  ): Promise<IApiResponse<IAlbum[]>> {
    const response = await axios.get<IApiResponse<IAlbum[]>>(
      `${this.baseURL}/content/getArtistAlbums/`,
      { params: { artist_id: artistId } }
    );
    return response.data;
  }

  public async getArtists(
    limit: number = 500
  ): Promise<IApiResponse<IArtist[]>> {
    const response = await axios.get<IApiResponse<IArtist[]>>(
      `${this.baseURL}/content/getArtists/`,
      { params: { limit } }
    );
    return response.data;
  }

  public async getAlbumSongs(id: number): Promise<IApiResponse<ISong[]>> {
    const response = await axios.get<IApiResponse<ISong[]>>(
      `${this.baseURL}/content/getAlbumSongs/`,
      { params: { id } }
    );
    return response.data;
  }

  public async getSongs(limit: number = 500): Promise<IApiResponse<ISong[]>> {
    const response = await axios.get<IApiResponse<ISong[]>>(
      `${this.baseURL}/content/getSongs/`,
      { params: { limit } }
    );
    return response.data;
  }

  public async getSongsByArtist(
    artistId: number,
    limit: number = 500
  ): Promise<IApiResponse<ISong[]>> {
    const response = await axios.get<IApiResponse<ISong[]>>(
      `${this.baseURL}/content/getSongsByArtist/`,
      { params: { artist_id: artistId, limit } }
    );
    return response.data;
  }

  public async getSongByID(id: number): Promise<IApiResponse<ISong>> {
    const response = await axios.get<IApiResponse<ISong>>(
      `${this.baseURL}/content/getSongByID/`,
      { params: { id } }
    );
    return response.data;
  }

  public async getGenres(limit: number = 500): Promise<IApiResponse<IGenre[]>> {
    const response = await axios.get<IApiResponse<IGenre[]>>(
      `${this.baseURL}/content/getGenres/`,
      { params: { limit } }
    );
    return response.data;
  }

  public async getGenre(id: number): Promise<IApiResponse<IGenre>> {
    const response = await axios.get<IApiResponse<IGenre>>(
      `${this.baseURL}/content/getGenre/`,
      { params: { id } }
    );
    return response.data;
  }

  public async getAlbumGenres(
    albumId: number
  ): Promise<IApiResponse<IGenre[]>> {
    const response = await axios.get<IApiResponse<IGenre[]>>(
      `${this.baseURL}/content/getAlbumGenres/`,
      { params: { album_id: albumId } }
    );
    return response.data;
  }

  public getSongPosterURL(song: ISong): string {
    return `${this.baseURL}/storage/images/albums/${song.AlbumID}.webp`;
  }

  public getSongAudioURL(id: number): string {
    return `${this.baseURL}/storage/audio/${id}.flac`;
  }

  public getArtistImageURL(id: number): string {
    return `${this.baseURL}/storage/images/artists/${id}.webp`;
  }
}
