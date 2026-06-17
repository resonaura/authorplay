import axios from 'axios';
import { IArtist, IAlbum, ISong, IGenre, IApiResponse } from './interfaces';

const API_BASE = (import.meta.env.VITE_API_HOST as string) ?? 'https://api.rsnra.link/v1';
const ASSET_BASE = (import.meta.env.VITE_ASSET_HOST as string) ?? 'https://api.rsnra.link';

function assetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${ASSET_BASE}${path}`;
}

function mapArtist(a: any): IArtist {
  return {
    ID: a.id,
    Title: a.name,
    ShortTag: a.slug,
    YouTubeLink: a.youtubeUrl ?? '',
    Resources: { Poster: assetUrl(a.avatarUrl) },
  };
}

function mapTrack(t: any): ISong {
  return {
    ID: t.id,
    ArtistID: t.artistId ?? 0,
    ArtistName: t.artistName ?? '',
    ArtistShortTag: t.artistSlug ?? '',
    AlbumID: t.releaseId ?? 0,
    AlbumName: t.releaseTitle ?? '',
    Title: t.title,
    Resources: {
      Audio: assetUrl(t.audioUrl),
      Poster: assetUrl(t.coverUrl),
    },
  };
}

export class APIService {
  private slugCache = new Map<number, string>();

  public async getIndex(): Promise<IApiResponse<null>> {
    return { ok: true, code: 200, data: null };
  }

  public async getArtists(): Promise<IApiResponse<IArtist[]>> {
    const res = await axios.get(`${API_BASE}/artists`);
    const artists: IArtist[] = (res.data.data ?? []).map((a: any) => {
      const mapped = mapArtist(a);
      this.slugCache.set(mapped.ID, mapped.ShortTag);
      return mapped;
    });
    return { ok: true, code: 200, data: artists };
  }

  public async getArtist(id: number): Promise<IApiResponse<IArtist>> {
    const slug = this.slugCache.get(id);
    if (!slug) return { ok: false, code: 404, error: 'Artist not found' };
    return this.getArtistByShortTag(slug);
  }

  public async getArtistByShortTag(tag: string): Promise<IApiResponse<IArtist>> {
    const res = await axios.get(`${API_BASE}/artists/${encodeURIComponent(tag)}`);
    const artist = mapArtist(res.data.data);
    this.slugCache.set(artist.ID, artist.ShortTag);
    return { ok: true, code: 200, data: artist };
  }

  public async getSongs(limit: number = 500): Promise<IApiResponse<ISong[]>> {
    const res = await axios.get(`${API_BASE}/releases/tracks/latest`, { params: { limit } });
    const songs: ISong[] = (res.data.data ?? []).map(mapTrack);
    return { ok: true, code: 200, data: songs };
  }

  public async getSongsByArtist(artistId: number): Promise<IApiResponse<ISong[]>> {
    const slug = this.slugCache.get(artistId);
    if (!slug) return { ok: false, code: 404, error: 'Artist not found in cache' };
    const res = await axios.get(`${API_BASE}/artists/${encodeURIComponent(slug)}`);
    const artistData = res.data.data;
    const songs: ISong[] = [];
    for (const release of artistData.releases ?? []) {
      for (const track of release.tracks ?? []) {
        songs.push({
          ID: track.id,
          ArtistID: artistData.id,
          ArtistName: artistData.name,
          ArtistShortTag: artistData.slug,
          AlbumID: release.id,
          AlbumName: release.title,
          Title: track.title,
          Resources: {
            Audio: assetUrl(track.audioUrl ?? (release.type === 'single' ? release.audioUrl : null)),
            Poster: assetUrl(release.customCoverUrl ?? release.coverUrl),
          },
        });
      }
    }
    return { ok: true, code: 200, data: songs };
  }

  public async getSongByID(_id: number): Promise<IApiResponse<ISong>> {
    return { ok: false, code: 501, error: 'Not implemented' };
  }

  public async getAlbum(_id: number): Promise<IApiResponse<IAlbum>> {
    return { ok: false, code: 501, error: 'Not implemented' };
  }

  public async getArtistAlbums(_artistId: number): Promise<IApiResponse<IAlbum[]>> {
    return { ok: false, code: 501, error: 'Not implemented' };
  }

  public async getAlbumSongs(_id: number): Promise<IApiResponse<ISong[]>> {
    return { ok: false, code: 501, error: 'Not implemented' };
  }

  public async getGenres(): Promise<IApiResponse<IGenre[]>> {
    return { ok: true, code: 200, data: [] };
  }

  public async getGenre(_id: number): Promise<IApiResponse<IGenre>> {
    return { ok: false, code: 501, error: 'Not implemented' };
  }

  public async getAlbumGenres(_albumId: number): Promise<IApiResponse<IGenre[]>> {
    return { ok: true, code: 200, data: [] };
  }

  public getSongPosterURL(song: ISong): string {
    return song.Resources?.Poster ?? '';
  }

  public getSongAudioURL(song: ISong): string {
    return song.Resources?.Audio ?? '';
  }

  public getArtistImageURL(artist: IArtist): string {
    return artist.Resources?.Poster ?? '';
  }
}
