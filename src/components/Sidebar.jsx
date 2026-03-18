import { useEffect, useMemo, useRef, useState } from 'react';

const FILTERS = ['Playlists', 'Artists', 'Albums'];

const ITEMS = [
  { id: 'liked', title: 'Liked Songs', subtitle: 'Playlist • 147 songs', color: 'from-violet-500 to-indigo-500' },
  { id: 'taylor', title: 'This is TaylorSwift', subtitle: 'Playlist • Spotify', color: 'from-amber-500 to-orange-500' },
  { id: 'wish', title: 'Wish You Were Here', subtitle: 'Playlist • Aio Holmes', color: 'from-slate-500 to-zinc-500' },
  { id: 'tops23', title: 'Your Top Songs 2023', subtitle: 'Playlist • Made for you', color: 'from-emerald-500 to-green-500' },
  { id: 'altz', title: 'The Sound of Alt Z', subtitle: 'Playlist • thesoundsofspotify', color: 'from-fuchsia-500 to-purple-500' },
  { id: 'anime', title: 'Anime', subtitle: 'Playlist • ptayade2603', color: 'from-cyan-500 to-sky-500' },
];

function subtitleParts(subtitle) {
  const parts = String(subtitle || '')
    .split('•')
    .map((s) => s.trim())
    .filter(Boolean);
  const primary = parts[0] ?? '';
  const secondary = parts.slice(1).join(' • ');
  return { primary, secondary };
}

function ClockIcon({ className = 'h-4.5 w-4.5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function pseudoDateAdded(id) {
  const seed = Array.from(String(id)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const daysAgo = (seed % 900) + 3; // 3..902
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const fmt = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  if (daysAgo < 25) return `${Math.max(2, Math.floor(daysAgo / 7))} weeks ago`;
  return fmt;
}

function viewAsIcon(id) {
  switch (id) {
    case 'List':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
    case 'Squares':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 7h11" />
          <path d="M9 12h11" />
          <path d="M9 17h11" />
          <path d="M4 7h1" />
          <path d="M4 12h1" />
          <path d="M4 17h1" />
        </svg>
      );
    case 'Grid':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="5" y="5" width="3" height="3" rx="0.6" />
          <rect x="10.5" y="5" width="3" height="3" rx="0.6" />
          <rect x="16" y="5" width="3" height="3" rx="0.6" />
          <rect x="5" y="10.5" width="3" height="3" rx="0.6" />
          <rect x="10.5" y="10.5" width="3" height="3" rx="0.6" />
          <rect x="16" y="10.5" width="3" height="3" rx="0.6" />
          <rect x="5" y="16" width="3" height="3" rx="0.6" />
          <rect x="10.5" y="16" width="3" height="3" rx="0.6" />
          <rect x="16" y="16" width="3" height="3" rx="0.6" />
        </svg>
      );
    case 'Large':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="5" width="7" height="6" rx="1" />
          <rect x="13" y="5" width="7" height="6" rx="1" />
          <rect x="4" y="13" width="7" height="6" rx="1" />
          <rect x="13" y="13" width="7" height="6" rx="1" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({
  expanded = false,
  onToggleExpanded,
  variant,
}) {
  const [activeFilter, setActiveFilter] = useState('Playlists');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recents');
  const [viewAs, setViewAs] = useState('List');
  const recentsBtnRef = useRef(null);
  const recentsMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!isRecentsOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsRecentsOpen(false);
    };
    const onPointerDown = (e) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (recentsMenuRef.current?.contains(t)) return;
      if (recentsBtnRef.current?.contains(t)) return;
      setIsRecentsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isRecentsOpen]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = ITEMS;
    // simple mapping: use subtitle keywords to filter
    if (activeFilter === 'Playlists') items = items.filter((i) => i.subtitle.toLowerCase().includes('playlist'));
    if (activeFilter === 'Artists') items = items.filter((i) => i.subtitle.toLowerCase().includes('artist'));
    if (activeFilter === 'Albums') items = items.filter((i) => i.subtitle.toLowerCase().includes('album'));
    if (q) {
      items = items.filter(
        (i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q),
      );
    }
    if (sortBy === 'Alphabetical') {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Recently Added') {
      items = [...items].reverse();
    } else if (sortBy === 'Creator') {
      items = [...items].sort((a, b) => {
        const aParts = subtitleParts(a.subtitle);
        const bParts = subtitleParts(b.subtitle);
        const aCreator = (aParts.secondary || aParts.primary).toLowerCase();
        const bCreator = (bParts.secondary || bParts.primary).toLowerCase();
        return aCreator.localeCompare(bCreator);
      });
    } // Recents = default order
    return items;
  }, [activeFilter, query, sortBy]);

  const isExpandedView = variant === 'expanded';

  return (
    <aside
      className={[
        variant === 'expanded'
          ? 'flex h-full w-full flex-col'
          : 'flex h-full w-[420px] flex-col',
      ].join(' ')}
    >
      <div className={isExpandedView ? 'px-6 pt-4' : 'px-4 pt-5'}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-white/80 transition hover:text-white"
              aria-label="Back"
              title="Back"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className={isExpandedView ? 'truncate text-[18px] font-bold tracking-tight text-white' : 'truncate text-[17px] font-bold tracking-tight text-white'}>
              Your Library
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/90 ring-1 ring-white/10 transition hover:bg-white/15"
              title="Create"
            >
              + Create
            </button>
            <button
              type="button"
              onClick={onToggleExpanded}
              className="grid h-9 w-9 place-items-center rounded-full text-white/75 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
              aria-label={expanded ? 'Collapse' : 'Expand'}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '↙' : '↗'}
            </button>
          </div>
        </div>

        <div className={isExpandedView ? 'mt-4 flex flex-wrap gap-2.5' : 'mt-4 flex flex-wrap gap-2'}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={[
                'rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/10 transition',
                activeFilter === f
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white',
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-white/60">
          {!isExpandedView && (
            <>
              {isSearchOpen ? (
                <div className="flex flex-1 items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10 focus-within:ring-white/20">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4.5 w-4.5 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.2-3.2" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search in Your Library"
                    className="min-w-0 flex-1 bg-transparent text-xs text-white placeholder:text-white/50 focus:outline-none"
                    aria-label="Search in your library"
                  />
                  {query.trim().length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="grid h-6 w-6 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                      aria-label="Clear search"
                      title="Clear"
                    >
                      ×
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="grid h-6 w-6 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                      aria-label="Close search"
                      title="Close"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 0);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 hover:text-white"
                  aria-label="Search"
                  title="Search"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.2-3.2" />
                  </svg>
                </button>
              )}
            </>
          )}

          {isExpandedView && <div className="flex-1" aria-hidden="true" />}

          <div className="relative shrink-0">
            <button
              type="button"
              ref={recentsBtnRef}
              onClick={() => setIsRecentsOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium hover:bg-white/10 hover:text-white"
              title="Recents"
              aria-label="Recents"
            >
              <span>Recents</span>
              <span className="text-white/45">{viewAsIcon(viewAs)}</span>
            </button>

            {isRecentsOpen && (
              <div
                ref={recentsMenuRef}
                className="absolute right-0 top-10 z-50 w-[240px] rounded-md border border-white/10 bg-[#2a2a2a] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
                role="menu"
                aria-label="Recents menu"
              >
                <div className="px-2 pb-1 pt-2 text-xs font-semibold text-white/60">
                  Sort by
                </div>
                {['Recents', 'Recently Added', 'Alphabetical', 'Creator'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setSortBy(label);
                      setIsRecentsOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-white/90 hover:bg-white/10"
                    role="menuitem"
                  >
                    <span className={sortBy === label ? 'text-[#1DB954]' : 'text-white/90'}>
                      {label}
                    </span>
                    {sortBy === label && <span className="text-[#1DB954]">✓</span>}
                  </button>
                ))}

                <div className="my-2 h-px bg-white/10" />

                <div className="px-2 pb-1 pt-1 text-xs font-semibold text-white/60">
                  View as
                </div>
                <div className="flex gap-2 px-1 pb-1 pt-1">
                  {[
                    { id: 'List' },
                    { id: 'Squares' },
                    { id: 'Grid' },
                    { id: 'Large' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setViewAs(opt.id)}
                      className={[
                        'grid h-11 w-11 place-items-center rounded-md border text-sm transition',
                        viewAs === opt.id
                          ? 'border-[#1DB954] bg-black/30 text-[#1DB954]'
                          : 'border-white/10 bg-black/20 text-white/80 hover:bg-black/30 hover:text-white',
                      ].join(' ')}
                      title={opt.id}
                      aria-label={`View as ${opt.id}`}
                    >
                      {viewAsIcon(opt.id)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-4 hover-scroll">
        {isExpandedView ? (
          <>
            {/* Expanded layouts (without Title/Date/Played header) */}
            {viewAs === 'List' && (
              <div className="px-2">
                <div className="space-y-0.5">
                  {visible.map((item) => {
                    const { primary } = subtitleParts(item.subtitle);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left transition hover:bg-white/5"
                        title={item.title}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white/90">
                            {item.title}
                            <span className="text-white/35"> • </span>
                            <span className="font-medium text-white/55">{primary}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 text-xs text-white/55">
                          <span>{pseudoDateAdded(item.id)}</span>
                          {primary.toLowerCase().includes('upcoming') && (
                            <span className="text-white/45">
                              <ClockIcon />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {viewAs === 'Squares' && (
              <div className="px-2">
                <div className="space-y-0.5">
                  {visible.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center justify-between gap-4 rounded-md px-2 py-2 text-left transition hover:bg-white/5"
                      title={item.title}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={[
                            'h-12 w-12 shrink-0 rounded-md bg-gradient-to-br ring-1 ring-white/10',
                            item.color,
                          ].join(' ')}
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white/90">
                            {item.title}
                          </div>
                          <div className="truncate text-xs text-white/55">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 text-xs text-white/55">
                        {pseudoDateAdded(item.id)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {viewAs === 'Grid' && (
              <div className="px-2">
                {/* Match Spotify expanded grid sizing */}
                <div className="grid grid-cols-6 gap-4 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10">
                  {visible.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="rounded-md p-1 text-left transition hover:bg-white/5"
                      title={item.title}
                      aria-label={item.title}
                    >
                      <div
                        className={[
                          'aspect-square w-full rounded-md bg-gradient-to-br ring-1 ring-white/10',
                          item.color,
                        ].join(' ')}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {viewAs === 'Large' && (
              <div className="px-2">
                {/* Match Spotify expanded grid sizing + labels */}
                <div className="grid grid-cols-6 gap-4 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10">
                  {visible.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="rounded-md p-1 text-left transition hover:bg-white/5"
                      title={item.title}
                    >
                      <div
                        className={[
                          'aspect-square w-full rounded-md bg-gradient-to-br ring-1 ring-white/10',
                          item.color,
                        ].join(' ')}
                      />
                      <div className="mt-2 truncate text-sm font-semibold text-white/90">
                        {item.title}
                      </div>
                      <div className="truncate text-xs text-white/55">{item.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-white/35">
              Library
            </div>

            {/* Normal layouts */}
            {viewAs === 'List' && (
              <div className="space-y-1 px-1">
                {visible.map((item) => {
                  const { primary } = subtitleParts(item.subtitle);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left transition hover:bg-white/5"
                      title={item.title}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white/90">
                          {item.title}
                          <span className="text-white/35"> • </span>
                          <span className="font-medium text-white/55">{primary}</span>
                        </div>
                      </div>
                      {primary.toLowerCase().includes('upcoming') && (
                        <div className="shrink-0 text-white/45">
                          <ClockIcon />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {viewAs === 'Squares' && (
              <div className="space-y-1">
                {visible.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition hover:bg-white/5"
                    title={item.title}
                  >
                    <div
                      className={[
                        'h-12 w-12 shrink-0 rounded-md bg-gradient-to-br ring-1 ring-white/10',
                        item.color,
                      ].join(' ')}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white/90">
                        {item.title}
                      </div>
                      <div className="truncate text-xs text-white/55">{item.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {viewAs === 'Grid' && (
              <div className="grid grid-cols-3 gap-3 px-1">
                {visible.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="rounded-md p-1 text-left transition hover:bg-white/5"
                    title={item.title}
                    aria-label={item.title}
                  >
                    <div
                      className={[
                        'aspect-square w-full rounded-md bg-gradient-to-br ring-1 ring-white/10',
                        item.color,
                      ].join(' ')}
                    />
                  </button>
                ))}
              </div>
            )}

            {viewAs === 'Large' && (
              <div className="grid grid-cols-3 gap-4 px-1">
                {visible.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="rounded-md p-1 text-left transition hover:bg-white/5"
                    title={item.title}
                  >
                    <div
                      className={[
                        'aspect-square w-full rounded-md bg-gradient-to-br ring-1 ring-white/10',
                        item.color,
                      ].join(' ')}
                    />
                    <div className="mt-2 truncate text-sm font-semibold text-white/90">
                      {item.title}
                    </div>
                    <div className="truncate text-xs text-white/55">{item.subtitle}</div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

