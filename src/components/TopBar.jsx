export default function TopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-black bg-black">
      <div className="mx-auto w-full max-w-7xl px-3 py-2 md:px-5">
        <div className="grid w-full grid-cols-[1fr_minmax(0,620px)_1fr] items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-white/80 transition hover:text-white hover:[filter:drop-shadow(0_0_12px_rgba(255,255,255,0.25))]"
              aria-label="More"
              title="More"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="6" cy="12" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="18" cy="12" r="1.6" />
              </svg>
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-white/80 transition hover:text-white hover:[filter:drop-shadow(0_0_12px_rgba(255,255,255,0.25))]"
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
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-white/80 transition hover:text-white hover:[filter:drop-shadow(0_0_12px_rgba(255,255,255,0.25))]"
              aria-label="Forward"
              title="Forward"
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
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <div className="flex min-w-0 items-center justify-center">
            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white"
                aria-label="Home"
                title="Home"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5L12 3z" />
                </svg>
              </button>

              <div className="flex flex-1 items-center rounded-full bg-[#2a2a2a] px-4 py-1.5 ring-1 ring-white/10 focus-within:ring-white/20">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white/60"
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
                  className="min-w-0 flex-1 bg-transparent px-3 text-[17px] text-white placeholder:text-white/55 focus:outline-none"
                  placeholder="What do you want to play?"
                  aria-label="Search"
                />
                <div className="mx-2 h-5 w-px bg-white/20" />
                <button
                  type="button"
                  className="grid h-7 w-7 place-items-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Browse"
                  title="Browse"
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
                    <rect x="4" y="6" width="16" height="12" rx="2" />
                    <path d="M8 10h8" />
                    <path d="M8 14h6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div />
        </div>
      </div>
    </div>
  );
}

