import { useEffect, useRef, useState } from "react";
import { SongList } from "./components/SongList";
import spotify from "./lib/spotify";
import { Player } from "./components/Player";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const audioRef = useRef(null);
  useEffect(() => {
    fetchPopularSongs();
  }, []);
  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item: any) => {
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
        await audioRef.current.play();
        setIsPlay(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      console.warn("Preview URL is not available for this song.");
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-5">Popular Songs</h2>
          <SongList
            isLoading={isLoading}
            songs={popularSongs}
            onSongSelected={handleSongSelected}
          />
        </section>
      </main>
      <Player />
      <audio ref={audioRef}></audio>
    </div>
  );
}
