import { useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import SongList from './components/SongList.jsx';
import TopBar from './components/TopBar.jsx';
import NowPlaying from './components/NowPlaying.jsx';
import { songs } from './data/songs.js';

export default function App() {
  const audioRef = useRef(null);

  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  /** Right “Now Playing” column — Spotify-style collapse to a slim strip */
  const [nowPlayingOpen, setNowPlayingOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const currentSong = useMemo(() => songs[currentIndex] ?? null, [currentIndex]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime || 0);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // Auto-advance for a Spotify-like feel
      setCurrentIndex((i) => (i + 1) % songs.length);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.src;
    audio.load();
    setProgress(0);

    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay may be blocked until user interacts
        setIsPlaying(false);
      });
    }
  }, [currentSong, isPlaying]);

  function selectSong(index) {
    setCurrentIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }

  function next() {
    setCurrentIndex((i) => (i + 1) % songs.length);
    setIsPlaying(true);
  }

  function prev() {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex((i) => (i - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  }

  function seek(nextTime) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextTime;
    setProgress(nextTime);
  }

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      {/* background kept solid black so panel gaps are black */}

      <TopBar />

      {/* Content area sits BELOW the fixed top bar */}
      <div className="relative mt-14 flex h-[calc(100vh-56px)] gap-[8px] overflow-hidden px-3 pb-3">
        <div className="h-full overflow-hidden rounded-lg bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
          <Sidebar
            expanded={isSidebarExpanded}
            onToggleExpanded={() =>
              setIsSidebarExpanded((v) => {
                const next = !v;
                if (next) setIsSidebarCollapsed(false);
                return next;
              })
            }
            libraryRailCollapsed={isSidebarCollapsed}
            onLibraryRailCollapse={() => setIsSidebarCollapsed(true)}
            onLibraryRailExpand={() => setIsSidebarCollapsed(false)}
          />
        </div>

        <div
          className={[
            'h-full min-w-0 flex-1 overflow-hidden rounded-lg bg-[#121212]',
            isSidebarExpanded ? 'pointer-events-none opacity-0' : 'opacity-100',
            'transition-opacity duration-150',
          ].join(' ')}
        >
          <main className="h-full min-w-0 flex-1 overflow-y-auto hover-scroll">
            <div className="mx-auto w-full max-w-7xl">
              <SongList
                songs={songs}
                currentSongId={currentSong?.id}
                isPlaying={isPlaying}
                onSelectSong={selectSong}
              />
            </div>
          </main>
        </div>

        {/* Now Playing column — full width or slim reopen handle when collapsed */}
        {!isSidebarExpanded && (
          <div
            className={[
              'h-full shrink-0 overflow-hidden rounded-lg bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.65)]',
              'transition-[width] duration-200 ease-out',
              nowPlayingOpen ? 'w-[405px]' : 'w-10',
            ].join(' ')}
          >
            {nowPlayingOpen ? (
              <NowPlaying
                song={currentSong}
                songs={songs}
                currentIndex={currentIndex}
                onSelectSong={selectSong}
                onClosePanel={() => setNowPlayingOpen(false)}
              />
            ) : (
              <button
                type="button"
                onClick={() => setNowPlayingOpen(true)}
                className="flex h-full w-full flex-col items-center justify-center border-0 bg-transparent px-0 text-[#b3b3b3] transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35"
                aria-label="Open Now Playing panel"
                title="Now Playing"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  aria-hidden="true"
                >
                  <path d="m14 8-4 4 4 4" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Expanded sidebar overlays only the CONTENT area (not the top bar) */}
        <div
          className={[
            'absolute inset-0 z-[65]',
            'transition-[opacity,transform] duration-200 ease-out',
            isSidebarExpanded
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 translate-x-2 pointer-events-none',
          ].join(' ')}
          aria-hidden={!isSidebarExpanded}
        >
          <div className="h-full overflow-hidden rounded-lg bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
            <Sidebar
              expanded={isSidebarExpanded}
              variant="expanded"
              onToggleExpanded={() => setIsSidebarExpanded(false)}
              libraryRailCollapsed={false}
              onLibraryRailCollapse={undefined}
              onLibraryRailExpand={undefined}
            />
          </div>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
}
