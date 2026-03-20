import { useState } from 'react';

function FilterPills() {
  const [active, setActive] = useState('All');
  const items = ['All', 'Music', 'Podcasts'];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((chip) => {
        const isOn = active === chip;
        return (
          <button
            key={chip}
            type="button"
            onClick={() => setActive(chip)}
            className={[
              'rounded-full px-4 py-1.5 text-xs font-bold transition',
              isOn
                ? 'bg-white text-black'
                : 'bg-[#3d2529] text-white ring-1 ring-white/10 hover:bg-[#4a2e34]',
            ].join(' ')}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}

/** Shortcut tile: thumb left, text right — fits 4×2 grid on md+ */
function ShortcutRowCard({ title, subtitle, coverUrl, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-h-[4.25rem] w-full items-center gap-2 rounded-md bg-[#3d2529]/95 p-2 text-left ring-1 ring-black/20 transition hover:bg-[#4a2e34]/95 md:min-h-[4.75rem] md:gap-2.5 md:rounded-lg md:p-2.5"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md shadow-md ring-1 ring-black/50 md:h-[52px] md:w-[52px]">
        {coverUrl ? (
          <img src={coverUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-600/40 to-violet-600/40" />
        )}
      </div>
      <div className="min-w-0 flex-1 pr-1">
        <div className="line-clamp-2 text-left text-xs font-bold leading-snug text-white md:text-[13px]">
          {title}
        </div>
        <div className="mt-0.5 line-clamp-1 text-left text-[11px] font-medium text-white/60 md:text-xs">
          {subtitle}
        </div>
      </div>
    </button>
  );
}

function PlayCircleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

/** Left column: “New release from …” + larger cover + metadata + play / add */
function NewReleaseHero({ song, onPlay }) {
  if (!song) return null;
  const secondary = 'Montell Fish'; // demo collaborator — static label reads well with any artist

  return (
    <section className="min-w-0 rounded-lg border border-white/10 bg-[#181818]/80 p-5 ring-1 ring-white/5 md:p-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
          <img src={song.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">New release from</p>
          <p className="truncate text-lg font-bold text-white">{song.artist}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end">
        {/* Album cover — slightly larger than before (was ~9rem; now ~11–12rem on md+) */}
        <div className="mx-auto shrink-0 sm:mx-0">
          <div className="h-36 w-36 overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/50 sm:h-44 sm:w-44 md:h-52 md:w-52">
            <img src={song.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>

        <div className="min-w-0 flex-1 pb-1">
          <p className="text-sm font-medium text-white/55">
            Single • {secondary}, {song.artist}
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            {song.title}
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onPlay}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-black shadow-lg transition hover:scale-105"
              aria-label="Play"
            >
              <PlayCircleIcon className="ml-0.5 h-6 w-6" />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-transparent text-white transition hover:border-white/50 hover:bg-white/5"
              aria-label="Add to library"
              title="Save"
            >
              <span className="text-xl font-light leading-none">+</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Right side of middle row */
function NewMusicFridayCard({ title, description, coverUrl, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full min-w-0 rounded-lg bg-[#181818]/80 p-2 text-left ring-1 ring-white/5 transition hover:bg-[#242424]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md">
        <img src={coverUrl} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" />
        <div
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-[10px] font-bold text-[#1DB954] ring-1 ring-white/10"
          aria-hidden
        >
          ♪
        </div>
      </div>
      <div className="mt-3 px-1 pb-1">
        <div className="line-clamp-2 text-sm font-bold text-white">{title}</div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">{description}</p>
      </div>
    </button>
  );
}

function NewMusicFridaySection({ songs, onSelectSong }) {
  const items = [
    {
      title: 'Release Radar',
      desc: 'A weekly mix based on what you love — new music picked for you.',
      idx: 1,
    },
    {
      title: 'New Music Friday',
      desc: "This week's hottest releases in one place.",
      idx: 2,
    },
    {
      title: 'Indie picks',
      desc: 'Fresh tracks from independent artists you might like.',
      idx: 3,
    },
  ];

  return (
    <section className="flex min-w-0 flex-col rounded-lg border border-white/10 bg-[#181818]/80 p-5 ring-1 ring-white/5 md:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-white md:text-xl">It&apos;s New Music Friday!</h2>
        <button
          type="button"
          className="shrink-0 text-xs font-bold text-white/55 transition hover:text-white"
        >
          Show all
        </button>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {items.map((item, i) => {
          const s = songs[item.idx % songs.length];
          if (!s) return null;
          return (
            <NewMusicFridayCard
              key={item.title}
              title={item.title}
              description={item.desc}
              coverUrl={s.cover}
              onClick={() => onSelectSong(item.idx % songs.length)}
            />
          );
        })}
      </div>
    </section>
  );
}

function ShelfCard({ song, isActive, isPlaying, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'group relative w-full min-w-[140px] max-w-[180px] shrink-0 rounded-lg border border-white/10 bg-white/5 p-3 text-left transition',
        'hover:bg-white/10',
        isActive ? 'ring-1 ring-emerald-400/60' : 'ring-0',
      ].join(' ')}
    >
      <div className="relative">
        <img
          src={song.cover}
          alt={`${song.title} cover`}
          className="aspect-square w-full rounded-lg object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-2 flex justify-end px-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-lg transition group-hover:opacity-100">
            {isActive && isPlaying ? 'II' : '▶'}
          </div>
        </div>
      </div>
      <div className="mt-3 min-w-0">
        <div className="truncate text-sm font-semibold text-white">{song.title}</div>
        <div className="truncate text-xs text-white/60">{song.artist}</div>
      </div>
    </button>
  );
}

export default function SongList({ songs, currentSongId, isPlaying, onSelectSong }) {
  const featured = songs[0];
  const shortcutData = [
    { title: 'ARIRANG', subtitle: 'Artist', cover: songs[0]?.cover, i: 0 },
    { title: 'How Dare You', subtitle: 'Single', cover: songs[1]?.cover, i: 1 },
    { title: 'Beast (feat. Waka Flocka) Radio', subtitle: 'Radio', cover: songs[2]?.cover, i: 2 },
    { title: 'Hot rotation', subtitle: 'Playlist', cover: songs[3]?.cover, i: 3 },
    { title: 'CAR PLAYLIST', subtitle: 'Playlist', cover: songs[4]?.cover, i: 4 },
    { title: songs[5]?.title ?? 'Soft Pixels', subtitle: 'Playlist', cover: songs[5]?.cover, i: 5 },
    { title: 'Night drive mix', subtitle: 'Made for you', cover: songs[0]?.cover, i: 0 },
    { title: 'Focus flow', subtitle: 'Playlist', cover: songs[2]?.cover, i: 2 },
  ].filter((x) => x.cover);

  return (
    <div className="bg-gradient-to-b from-[#1e1218]/90 via-[#121212] to-[#121212] px-4 pb-28 pt-4 md:px-6">
      <FilterPills />

      {/* 4×2 on md+; 2×4 on narrow screens */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {shortcutData.slice(0, 8).map((s, idx) => (
          <ShortcutRowCard
            key={`${s.title}-${idx}`}
            title={s.title}
            subtitle={s.subtitle}
            coverUrl={s.cover}
            onClick={() => onSelectSong(s.i)}
          />
        ))}
      </div>

      {/* Middle: new release (~58%) + New Music Friday (~42%) */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.88fr)] lg:items-start">
        <NewReleaseHero song={featured} onPlay={() => onSelectSong(0)} />
        <NewMusicFridaySection songs={songs} onSelectSong={onSelectSong} />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white md:text-xl">Recently played</h3>
          <button
            type="button"
            className="text-xs font-bold text-white/55 transition hover:text-white"
          >
            Show all
          </button>
        </div>
        <div className="sidebar-no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {songs.map((song, idx) => (
            <ShelfCard
              key={song.id}
              song={song}
              isActive={song.id === currentSongId}
              isPlaying={isPlaying}
              onSelect={() => onSelectSong(idx)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
