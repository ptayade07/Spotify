import { createPortal } from 'react-dom';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

/** Close / collapse panel — chevron → */
function ChevronRightIcon({ className = 'h-8 w-8' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
    >
      <path d="m10 8 4 4-4 4" />
    </svg>
  );
}

/** ⋯ menu — extra horizontal spacing, slightly larger canvas, small dots (thin / light) */
function MoreHorizontalIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="20" cy="12" r="1.3" />
    </svg>
  );
}

/**
 * Expand / fullscreen — four outward L-corners (empty center), hairline stroke.
 * Subtle RGB split is applied on the button wrapper for a chromatic-edge look.
 */
function ExpandArrowsIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      strokeLinejoin="miter"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
    >
      <path d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4" />
    </svg>
  );
}

/** Hollow square with arrow up (share / export) */
function ShareFromBoxIcon({ className = 'h-5 w-5', strokeWidth = 3 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
    >
      <path d="M12 4v9" />
      <path d="m8.5 7.5 3.5-3.5 3.5 3.5" />
      <rect x="5.25" y="13.25" width="13.5" height="7.5" rx="1.25" />
    </svg>
  );
}

/** Thin circle + plus (matches reference) */
function AddToLibraryIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.35" />
      <path d="M12 8.4v7.2" />
      <path d="M8.4 12h7.2" />
    </svg>
  );
}

/** Stable “monthly listeners” for demo data (no API) */
function pseudoMonthlyListeners(artist) {
  if (!artist) return '—';
  let h = 0;
  for (let i = 0; i < artist.length; i++) h = (h * 31 + artist.charCodeAt(i)) >>> 0;
  const n = 180_000 + (h % 820_000);
  return n.toLocaleString();
}

function artistBioParagraph(artist) {
  if (!artist) {
    return 'Add this artist to your library to read their full bio, see tour dates, and get updates on new music.';
  }
  return `${artist} is part of your demo library — a singer-songwriter and performer with a growing catalog. ${artist} connects with fans through live shows, studio releases, and collaborations across the scene. Follow to hear new singles, albums, and playlists curated along the way.`;
}

function hashId(id) {
  let h = 0;
  const s = id || '';
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Demo credits rows (no credits API) — varies slightly per track */
function buildDemoCredits(song) {
  if (!song?.artist) return [];

  const h = hashId(song.id);
  const second = [
    { name: 'RM', roles: 'Producer • Featured Artist' },
    { name: 'JYoy', roles: 'Producer • Mixer' },
  ][h % 2];
  const third = [
    { name: 'chiyoonhae', roles: 'Composer • Lyricist' },
    { name: 'Studio Han', roles: 'Composer • Arranger' },
    { name: 'Waveform Lab', roles: 'Strings • Arranger' },
  ][(h >> 3) % 3];

  /** trailing: main artist = Follow pill; producer = external link on hover; plain credit = text only */
  return [
    { key: 'main', name: song.artist, roles: 'Main Artist • Composer • Lyricist', trailing: 'follow' },
    { key: 'feat', ...second, trailing: 'link' },
    { key: 'arr', ...third, trailing: 'none' },
  ];
}

function ExternalLinkIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

/** Main artist → Follow; composer+lyricist-only style credits → no actions; else link if configured */
function getCreditTrailingAction(c) {
  if (c.key === 'main') return 'follow';
  const r = c.roles.toLowerCase();
  if (r.includes('composer') && r.includes('lyricist')) return 'none';
  if (c.trailing === 'link') return 'link';
  return 'none';
}

function CreditFollowButton({ following, onToggle }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onToggle();
  };
  if (following) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="shrink-0 cursor-pointer rounded-full border-2 border-white bg-transparent px-3.5 py-1 text-[13px] font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
      >
        Unfollow
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      className="shrink-0 cursor-pointer rounded-full border-2 border-white/95 bg-black px-3.5 py-1 text-[13px] font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
    >
      Follow
    </button>
  );
}

/** ─── Spotify-style “⋯” context menu (header) ─── */
function MoreMenuDivider() {
  return <div className="mx-1.5 my-[3px] h-px shrink-0 bg-white/15" role="separator" />;
}

function MoreMenuRow({ icon, label, hasSubmenu, onSelect }) {
  return (
    <button
      type="button"
      role="menuitem"
      className="flex w-full items-center gap-1.75 rounded py-[5px] pl-1.5 pr-2 text-left text-[14px] font-semibold leading-snug text-[#cfcfcf] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30"
      onClick={onSelect}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-white">{icon}</span>
      <span className="min-w-0 flex-1 text-[#cfcfcf]">{label}</span>
      {hasSubmenu ? (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0 text-white/85"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m10 8 4 4-4 4" />
        </svg>
      ) : null}
    </button>
  );
}

function MenuIconPlus() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MenuIconPlusInCircle() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  );
}

function MenuIconAddToQueue() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 7h9M5 11h12M5 15h9" />
      <path d="M17 5v6M14 8h6" />
    </svg>
  );
}

function MenuIconXInCircle() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="m9 9 6 6m0-6-6 6" />
    </svg>
  );
}

function MenuIconSongRadio() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" aria-hidden>
      <path d="M12 12h.01" />
      <path d="M16.24 7.76a8 8 0 0 1 0 8.48M14.12 9.88a4 4 0 0 1 0 4.24M9.88 9.88a4 4 0 0 0 0 4.24M7.76 7.76a8 8 0 0 0 0 8.48" />
    </svg>
  );
}

function MenuIconGoToArtist() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="3.25" />
      <path d="M6 19a6 6 0 0 1 12 0" />
      <path d="M17.5 14.5v3M17.5 15.75h3" />
    </svg>
  );
}

function MenuIconViewCredits() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 6h11M8 10h11M8 14h7" />
      <circle cx="5.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="14" r="1" fill="currentColor" stroke="none" />
      <path d="M17 18.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v.5h-5z" />
    </svg>
  );
}

function MenuIconSpotifyMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.586 14.422a.75.75 0 0 1-1.03.246c-2.829-1.736-6.39-2.127-10.583-1.166a.75.75 0 0 1-.336-1.462c4.564-1.044 8.448-.616 11.563 1.314a.75.75 0 0 1 .386.658zm1.223-2.77a.938.938 0 0 1-1.283.303c-3.222-1.982-8.13-2.557-11.931-1.407a.939.939 0 1 1-.548-1.8c4.196-1.274 9.513-.643 13.136 1.584.437.269.603.84.626 1.32zm.105-2.898a1.125 1.125 0 0 1-1.526.435c-3.567-2.12-9.467-2.452-12.863-1.36a1.125 1.125 0 1 1-.658-2.16c3.89-1.18 10.325-.795 14.276 1.59.532.316.771 1.001.77 1.495z" />
    </svg>
  );
}

export default function NowPlaying({ song, songs = [], currentIndex = 0, onSelectSong, onClosePanel }) {
  const scrollRef = useRef(null);
  const moreMenuBtnRef = useRef(null);
  const moreMenuPanelRef = useRef(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [moreMenuPos, setMoreMenuPos] = useState({ top: 0, left: 0, width: 260 });
  const [rightPanelScrolled, setRightPanelScrolled] = useState(false);

  const [creditFollowing, setCreditFollowing] = useState(() => ({
    main: false,
  }));
  /** Spotify-style: default “following” shows Unfollow outline pill */
  const [followingArtist, setFollowingArtist] = useState(true);

  useEffect(() => {
    setCreditFollowing({ main: false });
  }, [song?.id]);

  useEffect(() => {
    setFollowingArtist(true);
  }, [song?.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setRightPanelScrolled(el.scrollTop > 4);
  }, [song?.id]);

  useLayoutEffect(() => {
    if (!moreMenuOpen || !moreMenuBtnRef.current) return;
    const r = moreMenuBtnRef.current.getBoundingClientRect();
    const width = 260;
    let left = r.right - width;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    setMoreMenuPos({ top: r.bottom + 6, left, width });
  }, [moreMenuOpen]);

  useEffect(() => {
    if (!moreMenuOpen) return;
    const onDown = (e) => {
      if (moreMenuPanelRef.current?.contains(e.target)) return;
      if (moreMenuBtnRef.current?.contains(e.target)) return;
      setMoreMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMoreMenuOpen(false);
    };
    const onResize = () => setMoreMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [moreMenuOpen]);

  const headerLabel = useMemo(() => {
    if (!song?.artist) return 'ARTIST';
    return song.artist.toUpperCase();
  }, [song?.artist]);

  const cover = song?.cover ?? '';
  const title = song?.title ?? 'Nothing playing';
  const artist = song?.artist ?? '—';
  const listeners = useMemo(() => {
    if (!song?.artist) return '—';
    return pseudoMonthlyListeners(song.artist);
  }, [song?.artist]);
  const bio = useMemo(() => {
    if (!song) return 'Start playing a track to see artist details, monthly listeners, and more.';
    return artistBioParagraph(song.artist);
  }, [song]);

  const bannerAltCover = useMemo(() => {
    if (!songs?.length) return cover;
    const other = songs.find((s) => s.id !== song?.id && s.cover);
    return other?.cover || cover;
  }, [songs, song?.id, cover]);

  const demoCredits = useMemo(() => buildDemoCredits(song), [song]);

  const nextSong = useMemo(() => {
    if (!songs.length || !song) return null;
    const nextIdx = (currentIndex + 1) % songs.length;
    return songs[nextIdx];
  }, [songs, currentIndex, song]);

  function toggleCredit(key) {
    setCreditFollowing((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function closeMoreMenu() {
    setMoreMenuOpen(false);
  }

  const moreMenuPortal =
    moreMenuOpen &&
    createPortal(
      <div
        ref={moreMenuPanelRef}
        role="menu"
        aria-label="Track options"
        className="fixed z-[300] overflow-hidden rounded-md border border-white/10 bg-[#282828] py-0.5 shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
        style={{
          top: moreMenuPos.top,
          left: moreMenuPos.left,
          width: moreMenuPos.width,
        }}
      >
        <MoreMenuRow icon={<MenuIconPlus />} label="Add to playlist" hasSubmenu onSelect={closeMoreMenu} />
        <MoreMenuRow icon={<MenuIconPlusInCircle />} label="Save to your Liked Songs" onSelect={closeMoreMenu} />
        <MoreMenuRow icon={<MenuIconAddToQueue />} label="Add to queue" onSelect={closeMoreMenu} />
        <MoreMenuRow icon={<MenuIconXInCircle />} label="Exclude from your taste profile" onSelect={closeMoreMenu} />
        <MoreMenuDivider />
        <MoreMenuRow icon={<MenuIconSongRadio />} label="Go to song radio" onSelect={closeMoreMenu} />
        <MoreMenuRow icon={<MenuIconGoToArtist />} label="Go to artist" onSelect={closeMoreMenu} />
        <MoreMenuRow icon={<MenuIconViewCredits />} label="View credits" onSelect={closeMoreMenu} />
        <MoreMenuRow
          icon={<ShareFromBoxIcon className="h-5 w-5" strokeWidth={1.35} />}
          label="Share"
          hasSubmenu
          onSelect={closeMoreMenu}
        />
        <MoreMenuDivider />
        <MoreMenuRow icon={<MenuIconSpotifyMark />} label="Open in Desktop app" onSelect={closeMoreMenu} />
      </div>,
      document.body,
    );

  return (
    <aside className="group/right-panel flex h-full w-full flex-col overflow-hidden bg-[#121212] text-white">
      <header
        className={[
          'relative z-10 shrink-0 cursor-default bg-[#121212] px-3 pb-2.5 pt-3 transition-[box-shadow] duration-200 ease-out',
          rightPanelScrolled ? 'shadow-[0_8px_14px_-4px_rgba(0,0,0,0.55)]' : 'shadow-none',
        ].join(' ')}
      >
        <div className="flex items-center gap-0 transition-[gap] duration-200 ease-out group-hover/right-panel:gap-2">
          {/* Close panel — → arrow only when the right column is hovered or focused (like other header icons) */}
          {onClosePanel && (
            <div
              className={[
                'flex overflow-hidden opacity-0 pointer-events-none transition-[max-width,opacity,margin] duration-200 ease-out',
                'max-w-0 group-hover/right-panel:pointer-events-auto group-hover/right-panel:max-w-11 group-hover/right-panel:opacity-100',
                'group-focus-within/right-panel:pointer-events-auto group-focus-within/right-panel:max-w-11 group-focus-within/right-panel:opacity-100',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={onClosePanel}
                className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-md text-[#b3b3b3] transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35"
                aria-label="Close Now Playing panel"
                title="Close Now Playing"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            </div>
          )}
          <h2 className="min-w-0 flex-1 truncate pl-1 text-left text-[15px] font-bold tracking-[0.12em] text-white duration-200 ease-out group-hover/right-panel:underline group-hover/right-panel:decoration-white group-hover/right-panel:decoration-2 group-hover/right-panel:underline-offset-[5px]">
            {headerLabel}
          </h2>
          {/* More + expand — appear when the right column is hovered/focused, or while ⋯ menu is open */}
          <div
            className={[
              'flex shrink-0 items-center gap-0.5 overflow-hidden transition-[max-width,opacity] duration-200 ease-out',
              moreMenuOpen
                ? 'pointer-events-auto max-w-[5.75rem] opacity-100'
                : 'pointer-events-none max-w-0 opacity-0 group-hover/right-panel:pointer-events-auto group-hover/right-panel:max-w-[5.75rem] group-hover/right-panel:opacity-100 group-focus-within/right-panel:pointer-events-auto group-focus-within/right-panel:max-w-[5.75rem] group-focus-within/right-panel:opacity-100',
            ].join(' ')}
          >
            <button
              ref={moreMenuBtnRef}
              type="button"
              className={[
                'grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35',
                moreMenuOpen ? 'bg-black/55 ring-1 ring-white/15' : '',
              ].join(' ')}
              aria-label="More options"
              title="More options"
              aria-haspopup="menu"
              aria-expanded={moreMenuOpen}
              onClick={() => setMoreMenuOpen((o) => !o)}
            >
              <MoreHorizontalIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35"
              aria-label="Expand view"
              title="Expand"
            >
              <span
                className="inline-flex [filter:drop-shadow(0.4px_0_0_rgba(110,220,255,0.55))_drop-shadow(-0.45px_0_0_rgba(255,95,85,0.52))]"
                aria-hidden
              >
                <ExpandArrowsIcon className="h-[24px] w-[24px]" />
              </span>
            </button>
          </div>
        </div>
      </header>
      {moreMenuPortal}
      <div
        ref={scrollRef}
        onScroll={(e) => setRightPanelScrolled(e.currentTarget.scrollTop > 4)}
        className="sidebar-no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-0"
      >
        <div className="mt-1 w-full shrink-0 overflow-hidden rounded-lg bg-black/30">
          <div className="aspect-square w-full">
            {cover ? (
              <img src={cover} alt="" className="h-full w-full object-cover" draggable={false} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/40">
                No cover
              </div>
            )}
          </div>
        </div>

        {/* Row under hero cover: title + artist | share (slides in when right column hovered) | + always */}
        <div className="mt-5 flex w-full items-center gap-2">
          <div className="min-w-0 flex-1 pr-2">
            <div className="truncate text-[22px] font-bold leading-tight tracking-tight text-white md:text-[24px]">
              {title}
            </div>
            <div className="mt-0.5 truncate text-[14px] font-medium text-[#b3b3b3] md:text-[15px]">{artist}</div>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5 overflow-visible">
            <div className="flex min-h-[44px] min-w-0 flex-1 items-center justify-end overflow-visible pr-1">
              <button
                type="button"
                className={[
                  'grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-[#b3b3b3]',
                  'translate-x-[2.75rem] opacity-0 pointer-events-none transition-[transform,opacity] duration-300 ease-out',
                  'group-hover/right-panel:pointer-events-auto group-hover/right-panel:translate-x-0 group-hover/right-panel:opacity-100',
                  'group-focus-within/right-panel:pointer-events-auto group-focus-within/right-panel:translate-x-0 group-focus-within/right-panel:opacity-100',
                  'focus-visible:pointer-events-auto focus-visible:translate-x-0 focus-visible:opacity-100',
                  'hover:bg-white/10 hover:text-white',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40',
                ].join(' ')}
                aria-label="Share"
                title="Share"
              >
                <ShareFromBoxIcon className="h-[22px] w-[22px]" />
              </button>
            </div>
            <button
              type="button"
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border-[2.5px] border-[#b3b3b3]/85 bg-transparent text-[#b3b3b3] transition hover:border-white/60 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              aria-label="Add to Your Library"
              title="Add to Your Library"
            >
              <AddToLibraryIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* About the artist — image band on top, solid panel below (Spotify-style) */}
        <div className="mt-8 w-full shrink-0 overflow-hidden rounded-lg bg-[#181818]">
          <div className="relative aspect-[5/4] w-full max-h-[240px] min-h-[160px] overflow-hidden sm:aspect-[4/3]">
            {bannerAltCover ? (
              <img
                src={bannerAltCover}
                alt=""
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
            ) : (
              <div className="flex h-full min-h-[160px] w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-black" />
            )}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
            <p className="absolute left-4 top-4 text-[15px] font-bold tracking-tight text-white">
              About the artist
            </p>
          </div>

          <div className="bg-[#181818] px-4 pb-5 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[18px] font-bold leading-tight tracking-tight text-white">
                  {artist}
                </h3>
                <p className="mt-1 text-[15px] font-medium leading-snug text-[#b3b3b3] md:text-[16px]">
                  {listeners} monthly listeners
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFollowingArtist((v) => !v)}
                className={[
                  'shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-[12px] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40',
                  followingArtist
                    ? 'border-white bg-transparent text-white hover:bg-white/10'
                    : 'border-white bg-black text-white hover:bg-white/10',
                ].join(' ')}
              >
                {followingArtist ? 'Unfollow' : 'Follow'}
              </button>
            </div>
            <p className="mt-4 line-clamp-5 text-[13px] leading-relaxed text-white/90">{bio}</p>
          </div>
        </div>

        {/* Credits */}
        {demoCredits.length > 0 && (
          <div className="mt-5 w-full overflow-hidden rounded-lg bg-[#1f1f1f] p-3.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <h3 className="text-[17px] font-bold text-white">Credits</h3>
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-md px-2 py-0.5 text-[14px] font-semibold text-[#b3b3b3] transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
              >
                Show all
              </button>
            </div>
            <ul className="mt-2 space-y-0">
              {demoCredits.map((c) => {
                const following = creditFollowing[c.key] ?? false;
                const trailingAction = getCreditTrailingAction(c);
                return (
                  <li key={c.key} className="list-none">
                    <div className="group flex items-center gap-0.5 rounded-[10px] px-1.5 py-1.5 transition-colors hover:bg-[#3e3e3e]">
                      <button
                        type="button"
                        className="min-w-0 flex-1 cursor-pointer rounded-md py-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        aria-label={`View ${c.name}`}
                        onClick={() => {
                          /* Placeholder: open artist / credit detail */
                        }}
                      >
                        <div className="truncate text-[16px] font-bold text-white underline-offset-2 decoration-white group-hover:underline group-hover/right-panel:underline">
                          {c.name}
                        </div>
                        <div className="mt-px truncate text-[13px] font-medium text-[#b3b3b3]">{c.roles}</div>
                      </button>
                      {trailingAction === 'follow' && (
                        <div className="flex shrink-0 items-center pr-0.5">
                          <CreditFollowButton following={following} onToggle={() => toggleCredit(c.key)} />
                        </div>
                      )}
                      {trailingAction === 'link' && (
                        <button
                          type="button"
                          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-md text-white opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100 group-hover/right-panel:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                          aria-label={`Open ${c.name} profile`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <ExternalLinkIcon className="h-[18px] w-[18px]" />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Next in queue */}
        {nextSong && (
          <div className="mt-5 w-full overflow-hidden rounded-lg bg-[#1f1f1f] p-3.5">
            <div className="flex items-baseline justify-between gap-1.5">
              <h3 className="text-[17px] font-bold text-white">Next in queue</h3>
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-md px-2 py-0.5 text-[14px] font-semibold text-white transition hover:bg-white/5 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              >
                Open queue
              </button>
            </div>
            <div className="group mt-2 flex items-center gap-0.5 rounded-lg px-1 py-1 transition-colors hover:bg-[#333333]">
              <button
                type="button"
                onClick={() => {
                  const nextIdx = (currentIndex + 1) % songs.length;
                  onSelectSong?.(nextIdx);
                }}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-md py-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white/10">
                  {nextSong.cover ? (
                    <img
                      src={nextSong.cover}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-white/40">—</div>
                  )}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover/right-panel:opacity-100">
                    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-white" aria-hidden="true">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[16px] font-semibold text-white">{nextSong.title}</div>
                  <div className="mt-px truncate text-[14px] text-[#b3b3b3]">{nextSong.artist}</div>
                </div>
              </button>
              <button
                type="button"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-md text-lg font-bold leading-none text-white/90 opacity-0 transition-opacity hover:bg-white/10 hover:text-white group-hover:opacity-100 group-hover/right-panel:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                aria-label="More options for queued track"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                ⋯
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
