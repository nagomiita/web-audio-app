import { useEffect, useRef, useState } from "react";
import { SongList } from "./components/SongList";
import spotify from "./lib/spotify";
import { Player } from "./components/Player";
import { SpotifyTrack } from "@/types/SpotifyTrack";
import { SearchInput } from "./components/SearchInput";
import { Pagination } from "./components/Pagination";

const limit = 20;

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState<SpotifyTrack[]>([]);
  const [isPlay, setIsPlay] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>();
  const [keyword, setKeyword] = useState("");
  const [searchedSongs, setSearchedSongs] = useState();
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const isSearchedResult = searchedSongs != null;
  const audioRef = useRef(null);
  useEffect(() => {
    fetchPopularSongs();
  }, []);
  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);
    setIsLoading(false);
  };
  const handleSongSelected = async (song: any) => {
    setSelectedSong(song);
    if (audioRef.current && song.preview_url) {
      audioRef.current.src = song.preview_url;
      try {
        playSong();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      console.warn("Preview URL is not available for this song.");
    }
  };

  const playSong = () => {
    audioRef.current.play();
    setIsPlay(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlay(false);
  };
  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const searchSongs = async () => {
    setIsLoading(true);
    const offset = (page - 1) * limit;
    console.log(page);
    try {
      const result = await spotify.searchSongs(keyword, limit, offset);
      setHasNext(result.next != null);
      setHasPrev(result.previous != null);
      setSearchedSongs(result.items);
    } catch (error) {
      console.error("Error search:", error);
    }
    setIsLoading(false);
  };

  const moveToNext = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };
  const moveToPrev = async () => {
    const prevPage = page - 1;
    setPage(prevPage);
  };
  useEffect(() => {
    if (keyword) {
      searchSongs();
    }
  }, [page]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput onInputChange={handleInputChange} onSubmit={searchSongs} />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSearchedResult ? "Searched Results" : "Popular Songs"}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={isSearchedResult ? searchedSongs : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {isSearchedResult && (
            <Pagination
              onPrev={hasPrev ? moveToPrev : null}
              onNext={hasNext ? moveToNext : null}
            />
          )}
        </section>
      </main>
      {selectedSong != null && (
        <Player
          song={selectedSong}
          isPlay={isPlay}
          onButtonClick={toggleSong}
        />
      )}

      <audio ref={audioRef}></audio>
    </div>
  );
}
