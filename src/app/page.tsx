import SearchBar from "@/components/SearchBar";
import AdMarquee from "@/components/AdMarquee";
import SidebarAds from "@/components/SidebarAds";
import Discover from "@/components/Discover";

export default async function Home() {
  return (
    <div className="min-h-screen">
      {/* Top ads */}
      <AdMarquee position="TOP" />

      {/* Sidebar ads */}
      <SidebarAds />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-2xl bg-[#ffd000] px-8 py-12 text-[#c8102e] shadow-sm">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold">The Future of RR Nagar Starts Here</h1>
              <p className="mt-2 text-xl opacity-90" lang="kn">RR ನಗರದ ಹೊಸ ಡಿಜಿಟಲ್ ಅನುಭವ</p>
              <p className="mt-4 max-w-3xl opacity-90">
                RRnagar.com connects residents of Rajarajeshwari Nagar with trusted neighbourhood stores and service providers.
                Buy local — fast, reliable, and delivered.
              </p>
              <div className="mt-8">
                <SearchBar />
              </div>
              <div className="mt-6 flex gap-3">
                <a href="/catalog" className="rounded bg-black/10 px-4 py-2 font-medium text-[#c8102e] hover:bg-black/20">Browse Catalog</a>
                <a href="/supplier/onboard" className="rounded bg-black/10 px-4 py-2 font-medium text-[#c8102e] hover:bg-black/20">Become a Supplier</a>
              </div>
            </div>
            <div className="relative hidden h-full md:block">
              <img
                src="/globe.svg"
                alt="Local shopping and services"
                className="h-full w-full rounded-2xl object-cover shadow-md"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {[
              { name: "Groceries", emoji: "🛒" },
              { name: "Food", emoji: "🍲" },
              { name: "Pharmacy", emoji: "💊" },
              { name: "Home Services", emoji: "🧹" },
              { name: "Electronics", emoji: "🔌" },
              { name: "Fitness", emoji: "🏋️" },
            ].map((c) => (
              <a key={c.name} href="/catalog" className="group rounded-2xl border bg-muted p-4 text-center shadow-sm transition hover:shadow">
                <div className="text-3xl">{c.emoji}</div>
                <div className="mt-2 text-sm font-medium group-hover:text-primary">{c.name}</div>
              </a>
            ))}
          </div>
        </section>

        <Discover />
      </main>

      {/* Bottom ads */}
      <AdMarquee position="BOTTOM" />

    </div>
  );
}
