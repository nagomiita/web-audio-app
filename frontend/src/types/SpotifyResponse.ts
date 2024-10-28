import { SpotifyTrack } from "./SpotifyTrack";

export interface SpotifyResponse {
  items: {
    track: SpotifyTrack;
  }[];
}
