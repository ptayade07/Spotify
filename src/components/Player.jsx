import { useEffect, useMemo } from 'react';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Player({
  audioRef,
  song,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  progress,
  duration,
  onSeek,
  volume,
  onChangeVolume,
}) {
  const timeLabel = useMemo(
    () => `${formatTime(progress)} / ${formatTime(duration)}`,
    [progress, duration],
  );
  const pct = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    const v = Math.max(0, Math.min(1, progress / duration));
    return Math.round(v * 1000) / 10; // 0.0 .. 100.0
  }, [progress, duration]);
  const volPct = useMemo(() => {
    const v = Math.max(0, Math.min(1, volume));
    return Math.round(v * 1000) / 10;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [audioRef, volume]);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-black/70 backdrop-blur">
      {/* Top: thin full-width progress bar */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-2 md:px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 text-right text-[11px] tabular-nums text-white/60">
            {formatTime(progress)}
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(0, duration || 0)}
            step={0.25}
            value={Math.min(progress, duration || 0)}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="player-range w-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ffffff 0%, #ffffff ${pct}%, rgba(255,255,255,0.25) ${pct}%, rgba(255,255,255,0.25) 100%)`,
            }}
            aria-label="Seek"
            title={timeLabel}
            disabled={!song || !duration}
          />
          <div className="w-12 text-[11px] tabular-nums text-white/60">
            {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Bottom: controls row */}
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 pb-3 pt-2 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <img
            src={song?.cover}
            alt={song ? `${song.title} cover` : ''}
            className="h-12 w-12 rounded-sm object-cover"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">
              {song?.title ?? 'Select a song'}
            </div>
            <div className="truncate text-xs text-white/60">
              {song?.artist ?? '—'}
            </div>
          </div>
        </div>

        <div className="flex flex-[1.2] items-center justify-center gap-4">
          <button
            type="button"
            onClick={onPrev}
            className="px-2 py-1 text-white/75 transition hover:text-white"
            aria-label="Previous"
            title="Previous"
          >
            ‹‹
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            className={[
              'grid h-9 w-9 place-items-center rounded-full font-semibold transition',
              'bg-white text-black hover:bg-white/90',
            ].join(' ')}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
            disabled={!song}
          >
            {isPlaying ? 'II' : '▶'}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-2 py-1 text-white/75 transition hover:text-white"
            aria-label="Next"
            title="Next"
          >
            ››
          </button>
        </div>

        <div className="hidden md:flex min-w-[180px] flex-1 items-center justify-end gap-3">
          <div className="text-xs text-white/60">Vol</div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            className="player-range w-32 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volPct}%, rgba(255,255,255,0.25) ${volPct}%, rgba(255,255,255,0.25) 100%)`,
            }}
            aria-label="Volume"
          />
        </div>

        <audio ref={audioRef} />
      </div>
    </footer>
  );
}

