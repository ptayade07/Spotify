function BigPlaylistHero({ onPlay }) {
  return (
    <section className="rounded-lg border border-white/10 bg-gradient-to-r from-[#0f0f10] via-[#1b1b1c] to-[#0f0f10] p-4 md:p-6">
      <div className="flex gap-5">
        <div className="h-28 w-28 shrink-0 rounded-xl bg-gradient-to-br from-blue-500/70 to-purple-600/70 ring-1 ring-white/10 md:h-36 md:w-36" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Playlist
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-4xl">
            HIT SONGS ENGLISH | Top Songs | Best of 2026
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            The biggest English hits right here.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onPlay}
              className="rounded-full bg-[#1DB954] px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#1ed760]"
            >
              Play
            </button>
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Follow
            </button>
            <button
              type="button"
              className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="More"
              title="More"
            >
              …
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <button
            type="button"
            className="rounded-full bg-black/40 px-4 py-2 text-xs text-white/70 ring-1 ring-white/10 transition hover:bg-black/60 hover:text-white"
          >
            Hide announcements
          </button>
        </div>
      </div>
    </section>
  );
}

function MiniRowCard({ title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 text-left transition hover:bg-white/10"
    >
      <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/10" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-white">{title}</div>
        <div className="truncate text-xs text-white/50">{subtitle}</div>
      </div>
      <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-black opacity-0 shadow-lg transition group-hover:opacity-100">
        ▶
      </div>
    </button>
  );
}

function ShelfCard({ song, isActive, isPlaying, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'group relative w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition',
        'hover:bg-white/10',
        isActive ? 'ring-1 ring-emerald-400/60' : 'ring-0',
      ].join(' ')}
    >
      <div className="relative">
        <img
          src={song.cover}
          alt={`${song.title} cover`}
          className="aspect-square w-full rounded-xl object-cover"
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

export default function SongList({
  songs,
  currentSongId,
  isPlaying,
  onSelectSong,
}) {
  return (
    <div className="px-4 pb-28 pt-4 md:px-6">
      <BigPlaylistHero onPlay={() => onSelectSong(0)} />

      <div className="mt-4 flex flex-wrap gap-2">
        {['All', 'Music', 'Podcasts'].map((chip) => (
          <button
            key={chip}
            type="button"
            className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <MiniRowCard
          title="Gehra Hua (From “Dhurandhar”)"
          subtitle="Few romantic hits • bollywood"
          onClick={() => onSelectSong(1)}
        />
        <MiniRowCard
          title="Beast (feat. Waka Flocka) Radio"
          subtitle="Radio"
          onClick={() => onSelectSong(2)}
        />
        <MiniRowCard
          title="Hot Hits Hindi"
          subtitle="Playlist"
          onClick={() => onSelectSong(3)}
        />
        <MiniRowCard
          title="Come My Way"
          subtitle="Single"
          onClick={() => onSelectSong(4)}
        />
        <MiniRowCard
          title="CAR PLAYLIST (HINDI SONGS)"
          subtitle="Playlist"
          onClick={() => onSelectSong(5)}
        />
        <MiniRowCard
          title="bollywood songs that feel like falling in love <3"
          subtitle="Playlist"
          onClick={() => onSelectSong(0)}
        />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Made For You</h3>
          <button
            type="button"
            className="text-xs font-semibold text-white/60 transition hover:text-white"
          >
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {songs.slice(0, 6).map((song, idx) => (
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

