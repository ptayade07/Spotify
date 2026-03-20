import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const CREATE_MENU_WIDTH = 400;

const FILTERS = ['Playlists', 'Artists', 'Albums'];

const ITEMS = [
  { id: 'liked', kind: 'playlist', title: 'Liked Songs', subtitle: 'Playlist • 147 songs', color: 'from-violet-500 to-indigo-500' },
  { id: 'taylor', kind: 'playlist', title: 'This is TaylorSwift', subtitle: 'Playlist • Spotify', color: 'from-amber-500 to-orange-500' },
  { id: 'wish', kind: 'playlist', title: 'Wish You Were Here', subtitle: 'Playlist • Aio Holmes', color: 'from-slate-500 to-zinc-500' },
  { id: 'tops23', kind: 'playlist', title: 'Your Top Songs 2023', subtitle: 'Playlist • Made for you', color: 'from-emerald-500 to-green-500' },
  { id: 'altz', kind: 'playlist', title: 'The Sound of Alt Z', subtitle: 'Playlist • thesoundsofspotify', color: 'from-fuchsia-500 to-purple-500' },
  { id: 'anime', kind: 'playlist', title: 'Anime', subtitle: 'Playlist • ptayade2603', color: 'from-cyan-500 to-sky-500' },
  // Artist profiles (circular avatars in the library)
  { id: 'art-ts', kind: 'artist', title: 'Taylor Swift', subtitle: 'Artist', color: 'from-pink-500 to-rose-600' },
  { id: 'art-weeknd', kind: 'artist', title: 'The Weeknd', subtitle: 'Artist', color: 'from-red-700 to-zinc-900' },
  { id: 'art-badbunny', kind: 'artist', title: 'Bad Bunny', subtitle: 'Artist', color: 'from-lime-400 to-emerald-700' },
  { id: 'art-ariana', kind: 'artist', title: 'Ariana Grande', subtitle: 'Artist', color: 'from-fuchsia-400 to-purple-700' },
  { id: 'art-drake', kind: 'artist', title: 'Drake', subtitle: 'Artist', color: 'from-amber-600 to-stone-800' },
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

function isArtistItem(item) {
  return item?.kind === 'artist';
}

function coverShapeClass(item) {
  return isArtistItem(item) ? 'rounded-full' : 'rounded-sm';
}

/** Centered plus / close for Create controls (avoids font baseline offset) */
function CreatePlusIcon({ className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CreateCloseIcon({ className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Spotify-style “collapse to narrow rail” control */
function CollapseToRailIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="2.25" />
      <path d="M10 4v16" />
      <path d="M15.25 9.25 12 12l3.25 2.75" />
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
  libraryRailCollapsed = false,
  onLibraryRailCollapse,
  onLibraryRailExpand,
}) {
  const [activeFilter, setActiveFilter] = useState('Playlists');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recents');
  const [viewAs, setViewAs] = useState('List');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createMenuPos, setCreateMenuPos] = useState(null);
  const recentsBtnRef = useRef(null);
  const recentsMenuRef = useRef(null);
  const createBtnRef = useRef(null);
  const createMenuRef = useRef(null);
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

  useEffect(() => {
    if (!isCreateOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsCreateOpen(false);
    };
    const onPointerDown = (e) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (createMenuRef.current?.contains(t)) return;
      if (createBtnRef.current?.contains(t)) return;
      setIsCreateOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isCreateOpen]);

  useLayoutEffect(() => {
    if (!isCreateOpen) {
      setCreateMenuPos(null);
      return;
    }

    const GAP_X = 12;
    const GAP_Y = 8;
    const MARGIN = 12;

    const place = () => {
      const btn = createBtnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const top = r.bottom + GAP_Y;
      // Open to the right of the button so it doesn’t cover “Your Library” / filters
      let left = r.right + GAP_X;
      if (left + CREATE_MENU_WIDTH > window.innerWidth - MARGIN) {
        left = Math.max(MARGIN, window.innerWidth - MARGIN - CREATE_MENU_WIDTH);
      }
      setCreateMenuPos({ top, left });
    };

    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [isCreateOpen]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = ITEMS;

    // "Creator" = artist profiles only (Spotify-style circular images), sorted A–Z
    if (sortBy === 'Creator') {
      items = items.filter((i) => isArtistItem(i));
      if (q) {
        items = items.filter(
          (i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q),
        );
      }
      return [...items].sort((a, b) => a.title.localeCompare(b.title));
    }

    // simple mapping: use subtitle keywords + kind to filter
    if (activeFilter === 'Playlists') {
      items = items.filter((i) => i.kind === 'playlist' || i.subtitle.toLowerCase().includes('playlist'));
    }
    if (activeFilter === 'Artists') {
      items = items.filter((i) => isArtistItem(i) || i.subtitle.toLowerCase().includes('artist'));
    }
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
    } // Recents = default order
    return items;
  }, [activeFilter, query, sortBy]);

  const isExpandedView = variant === 'expanded';
  const showLibraryRail = libraryRailCollapsed && !isExpandedView;

  const createMenuPortal =
    isCreateOpen &&
    createMenuPos &&
    createPortal(
      <div
        ref={createMenuRef}
        style={{
          position: 'fixed',
          top: createMenuPos.top,
          left: createMenuPos.left,
          width: CREATE_MENU_WIDTH,
          zIndex: 80,
        }}
        className="rounded-md border border-white/10 bg-[#282828] py-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
        role="menu"
        aria-label="Create menu"
      >
        <button
          type="button"
          className="group flex w-full items-start gap-3 px-4 py-2 text-left transition hover:bg-white/10"
          role="menuitem"
          onClick={() => setIsCreateOpen(false)}
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1a1a1a] ring-1 ring-white/10 transition-transform duration-200 ease-out group-hover:-rotate-6">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-white transition-colors duration-200 group-hover:text-[#1DB954]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18V6l8-2v9" />
              <ellipse cx="6.5" cy="18" rx="3" ry="2.5" fill="currentColor" stroke="none" />
              <path d="M17 11v7" />
              <path d="M14.25 14.5h5.5" />
            </svg>
          </div>
          <div className="min-w-0 pt-0.5">
            <div className="text-[16px] font-bold text-white">Playlist</div>
            <div className="mt-0.5 text-[14px] leading-snug text-white/55">
              Create a playlist with songs or episodes
            </div>
          </div>
        </button>

        <button
          type="button"
          className="group flex w-full items-start gap-3 px-4 py-2 text-left transition hover:bg-white/10"
          role="menuitem"
          onClick={() => setIsCreateOpen(false)}
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1a1a1a] ring-1 ring-white/10 transition-transform duration-200 ease-out group-hover:-rotate-6">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-white/40 transition-colors duration-200 group-hover:text-[#1DB954]"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="8.75" cy="12" r="5.35" />
              <circle cx="15.25" cy="12" r="5.35" />
            </svg>
          </div>
          <div className="min-w-0 pt-0.5">
            <div className="text-[16px] font-bold text-white">Blend</div>
            <div className="mt-0.5 text-[14px] leading-snug text-white/55">
              Combine your friends&apos; tastes into a playlist
            </div>
          </div>
        </button>

        <div className="my-0.5 h-px bg-white/10" />

        <button
          type="button"
          className="group flex w-full items-start gap-3 px-4 py-2 text-left transition hover:bg-white/10"
          role="menuitem"
          onClick={() => setIsCreateOpen(false)}
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1a1a1a] ring-1 ring-white/10 transition-transform duration-200 ease-out group-hover:-rotate-6">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-white transition-colors duration-200 group-hover:text-[#1DB954]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 8a2 2 0 012-2h4l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <div className="min-w-0 pt-0.5">
            <div className="text-[16px] font-bold text-white">Folder</div>
            <div className="mt-0.5 text-[14px] leading-snug text-white/55">Organize your playlists</div>
          </div>
        </button>
      </div>,
      document.body,
    );

  if (showLibraryRail) {
    return (
      <aside className="flex h-full w-[72px] min-w-[72px] flex-col overflow-hidden bg-[#121212]">
        <div className="flex flex-col items-center gap-3 px-1.5 pt-4">
          <button
            type="button"
            onClick={() => onLibraryRailExpand?.()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-white transition hover:bg-white/10"
            aria-label="Expand Your Library"
            title="Expand Your Library"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <div className="relative flex w-full justify-center">
            <button
              ref={createBtnRef}
              type="button"
              onClick={() => {
                setIsCreateOpen((v) => !v);
                setIsRecentsOpen(false);
              }}
              className={[
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 transition',
                isCreateOpen
                  ? 'bg-[#2a2a2a] text-white ring-white/25'
                  : 'bg-[#1f1f1f] text-white ring-white/15 hover:bg-[#2a2a2a]',
              ].join(' ')}
              title="Create"
              aria-expanded={isCreateOpen}
              aria-haspopup="menu"
            >
              {isCreateOpen ? (
                <CreateCloseIcon className="h-[1.4rem] w-[1.4rem]" />
              ) : (
                <CreatePlusIcon className="h-[1.45rem] w-[1.45rem]" />
              )}
            </button>
          </div>
        </div>

        <div className="sidebar-no-scrollbar min-h-0 flex-1 overflow-y-auto px-1.5 py-4">
          <div className="flex flex-col items-center gap-2.5">
            {ITEMS.slice(0, 12).map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.title}
                aria-label={item.title}
                className="h-11 w-11 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10 transition hover:ring-white/25"
              >
                <div className={['h-full w-full bg-gradient-to-br', item.color, coverShapeClass(item)].join(' ')} />
              </button>
            ))}
          </div>
        </div>

        {createMenuPortal}
      </aside>
    );
  }

  return (
    <aside
      className={[
        variant === 'expanded'
          ? 'flex h-full w-full flex-col'
          : 'flex h-full w-[420px] flex-col',
      ].join(' ')}
    >
      <div
        className={[
          'group',
          isExpandedView ? 'pl-6 pr-5 pt-4' : 'pl-3.5 pr-4 pt-5',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center overflow-hidden">
            {!isExpandedView && onLibraryRailCollapse ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLibraryRailCollapse();
                  }}
                  className="grid h-9 w-9 shrink-0 scale-95 place-items-center rounded-sm text-white/70 opacity-0 ring-1 ring-white/20 transition-[max-width,margin,opacity] duration-200 ease-out max-w-0 overflow-hidden pointer-events-none hover:bg-white/10 hover:text-white group-hover:pointer-events-auto group-hover:mr-2 group-hover:max-w-[2.25rem] group-hover:opacity-100"
                  aria-label="Collapse Your Library"
                  title="Collapse Your Library"
                >
                  <CollapseToRailIcon className="h-5 w-5" />
                </button>
                <div className="min-w-0 truncate text-[16px] font-bold tracking-tight text-white transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                  Your Library
                </div>
              </>
            ) : (
              <div
                className={[
                  'truncate font-bold tracking-tight text-white',
                  isExpandedView ? 'text-[17px]' : 'text-[16px]',
                ].join(' ')}
              >
                Your Library
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="relative">
              <button
                ref={createBtnRef}
                type="button"
                onClick={() => {
                  setIsCreateOpen((v) => !v);
                  setIsRecentsOpen(false);
                }}
                className={[
                  'flex items-center justify-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ring-1 transition',
                  isCreateOpen
                    ? 'bg-[#2a2a2a] text-white ring-white/20'
                    : 'bg-[#1f1f1f] text-white/90 ring-white/10 hover:bg-[#2a2a2a]',
                ].join(' ')}
                title="Create"
                aria-expanded={isCreateOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
                  {isCreateOpen ? (
                    <CreateCloseIcon className="h-4 w-4" />
                  ) : (
                    <CreatePlusIcon className="h-4 w-4" />
                  )}
                </span>
                <span className="leading-none">Create</span>
              </button>
            </div>
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
              onClick={() => {
                setIsRecentsOpen((v) => !v);
                setIsCreateOpen(false);
              }}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
              title={`Sort: ${sortBy}`}
              aria-label={`Library sort and view: ${sortBy}`}
            >
              <span className="truncate">{sortBy}</span>
              <span className="shrink-0 text-white/45">{viewAsIcon(viewAs)}</span>
            </button>

            {isRecentsOpen && (
              <div
                ref={recentsMenuRef}
                className="absolute right-0 top-10 z-50 w-[240px] rounded-sm border border-white/10 bg-[#2a2a2a] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
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
                    className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm text-white/90 hover:bg-white/10"
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
                <div className="rounded-md bg-black/35 px-1.5 py-1.5 ring-1 ring-white/10">
                  <div className="flex gap-1.5">
                    {[
                      { id: 'List', label: 'Compact list' },
                      { id: 'Squares', label: 'List with artwork' },
                      { id: 'Grid', label: 'Grid' },
                      { id: 'Large', label: 'Large grid' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setViewAs(opt.id)}
                        className={[
                          'grid h-10 w-10 place-items-center rounded-sm border text-sm transition',
                          viewAs === opt.id
                            ? 'border-[#1DB954] bg-black/40 text-[#1DB954]'
                            : 'border-transparent bg-transparent text-white/70 hover:bg-white/10 hover:text-white',
                        ].join(' ')}
                        title={opt.label}
                        aria-label={`View as ${opt.label}`}
                      >
                        {viewAsIcon(opt.id)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sidebar-no-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 pb-4">
        {isExpandedView ? (
          <>
            {/* Expanded layouts (without Title/Date/Played header) */}
            {viewAs === 'List' && (
              <div className="px-2">
                {/* Compact list: single line, text-only (Spotify-style) */}
                <div className="space-y-0">
                  {visible.map((item) => {
                    const { primary } = subtitleParts(item.subtitle);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition hover:bg-white/5"
                        title={item.title}
                      >
                        <div className="min-w-0 flex-1 truncate text-[15px]">
                          <span className="font-semibold text-white">{item.title}</span>
                          <span className="text-white/35"> • </span>
                          <span className="font-normal text-white/45">{primary}</span>
                        </div>
                        {primary.toLowerCase().includes('upcoming') && (
                          <div className="shrink-0 text-white/40">
                            <ClockIcon className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {viewAs === 'Squares' && (
              <div className="px-2">
                <div className="space-y-0">
                  {visible.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center justify-between gap-4 rounded-sm px-2 py-1.5 text-left transition hover:bg-white/5"
                      title={item.title}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className={[
                            'h-11 w-11 shrink-0 bg-gradient-to-br ring-1 ring-white/10',
                            coverShapeClass(item),
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
                      className="rounded-sm p-1 text-left transition hover:bg-white/5"
                      title={item.title}
                      aria-label={item.title}
                    >
                      <div
                        className={[
                          'aspect-square w-full bg-gradient-to-br ring-1 ring-white/10',
                          coverShapeClass(item),
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
                      className="rounded-sm p-1 text-left transition hover:bg-white/5"
                      title={item.title}
                    >
                      <div
                        className={[
                          'aspect-square w-full bg-gradient-to-br ring-1 ring-white/10',
                          coverShapeClass(item),
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
              <div className="space-y-0 px-1">
                {visible.map((item) => {
                  const { primary } = subtitleParts(item.subtitle);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition hover:bg-white/5"
                      title={item.title}
                    >
                      <div className="min-w-0 flex-1 truncate text-[15px]">
                        <span className="font-semibold text-white">{item.title}</span>
                        <span className="text-white/35"> • </span>
                        <span className="font-normal text-white/45">{primary}</span>
                      </div>
                      {primary.toLowerCase().includes('upcoming') && (
                        <div className="shrink-0 text-white/40">
                          <ClockIcon className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {viewAs === 'Squares' && (
              <div className="space-y-0">
                {visible.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left transition hover:bg-white/5"
                    title={item.title}
                  >
                    <div
                      className={[
                        'h-11 w-11 shrink-0 bg-gradient-to-br ring-1 ring-white/10',
                        coverShapeClass(item),
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
                    className="rounded-sm p-1 text-left transition hover:bg-white/5"
                    title={item.title}
                    aria-label={item.title}
                  >
                    <div
                      className={[
                        'aspect-square w-full bg-gradient-to-br ring-1 ring-white/10',
                        coverShapeClass(item),
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
                    className="rounded-sm p-1 text-left transition hover:bg-white/5"
                    title={item.title}
                  >
                    <div
                      className={[
                        'aspect-square w-full bg-gradient-to-br ring-1 ring-white/10',
                        coverShapeClass(item),
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

      {createMenuPortal}
    </aside>
  );
}

