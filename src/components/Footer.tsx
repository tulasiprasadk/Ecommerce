export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/20 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[#ffd000]">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-semibold">Contact Us</div>
            <div className="mt-2">Address: RRnagar, Bengaluru-560098</div>
            <div className="mt-1">Email: <a href="mailto:namaste@rrnagar.com" className="underline">namaste@rrnagar.com</a> • Phone: <a href="tel:+919844007900" className="underline">+91 98440 07900</a></div>
          </div>
          <div className="md:text-right">
            <div className="font-semibold">Explore</div>
            <div className="mt-2"><a href="/supplier" className="hover:opacity-80">Supplier</a> • <a href="#" className="hover:opacity-80">Partner Us</a></div>
            <div className="mt-1"><a href="/terms" className="hover:opacity-80">Terms</a> • <a href="/privacy" className="hover:opacity-80">Privacy</a></div>
            <div className="mt-3 flex items-center gap-3 md:justify-end">
              <a href="#" aria-label="Facebook" className="text-primary hover:opacity-80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.1V12h2.1V9.8c0-2.1 1.2-3.3 3-3.3.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 2.9h-1.9v7A10 10 0 0 0 22 12"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-primary hover:opacity-80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6-1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-primary hover:opacity-80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.8.4-1.6.6-2.5.8.9-.6 1.5-1.4 1.8-2.4-.8.5-1.8.9-2.8 1.1A4.3 4.3 0 0 0 12 9.5c0 .3 0 .6.1.9-3.6-.2-6.7-1.9-8.8-4.6-.4.6-.6 1.4-.6 2.1 0 1.5.8 2.9 2 3.7-.7 0-1.3-.2-1.9-.5v.1c0 2.1 1.5 3.8 3.5 4.2-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.1A8.6 8.6 0 0 1 2 19.5c1.9 1.2 4.2 1.9 6.6 1.9 7.9 0 12.3-6.6 12.3-12.3v-.6c.8-.5 1.5-1.2 2.1-2z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-primary hover:opacity-80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 8.98h4v12H3v-12zM9 8.98h3.8v1.6h.1c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.6v6.6h-4v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3v6.1H9v-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <div>© 2025 RRnagar.com</div>
          <div className="mt-1" lang="kn">ನಮ್ಮಿಂದ ನಿಮಗೆ — ನಿಮ್ಮಷ್ಟೇ ಹತ್ತಿರ.</div>
        </div>
      </div>
    </footer>
  );
}
