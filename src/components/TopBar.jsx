export default function TopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-black bg-black">
      <div className="flex w-full items-center gap-4 py-1.5 pl-2.5 pr-4 md:pl-3 md:pr-6">
        <a
          href="#"
          className="grid h-9 w-9 shrink-0 place-items-center text-white transition hover:opacity-90"
          aria-label="Spotify"
          title="Spotify"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.189-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          <div className="flex w-full max-w-[560px] items-center gap-2">
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/10 transition hover:bg-white/15"
              aria-label="Home"
              title="Home"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-white"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5L12 3z" />
              </svg>
            </button>

            <div className="flex min-w-0 flex-1 items-center rounded-full bg-[#1f1f1f] px-3 py-1 text-[#a3a3a3] ring-1 ring-white/5 focus-within:ring-white/15">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0"
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
                className="min-w-0 flex-1 bg-transparent px-2.5 text-[17px] font-semibold leading-tight text-[#a3a3a3] placeholder:font-semibold placeholder:text-[#a3a3a3] focus:outline-none"
                placeholder="What do you want to play?"
                aria-label="Search"
              />
              <div className="mx-1.5 h-6 w-px shrink-0 bg-[#a3a3a3]/35" />
              <button
                type="button"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-sm text-[#a3a3a3] transition hover:bg-white/5 hover:text-[#a3a3a3]"
                aria-label="Browse"
                title="Browse"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
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

        <div className="hidden w-9 shrink-0 sm:block" aria-hidden="true" />
      </div>
    </div>
  );
}
