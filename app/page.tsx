import SearchForm from "./components/SearchForm";

export default function Home() {
  return (
    <main className="search-shell">
      <section className="search-copy">
        <p className="eyebrow">Riftbound</p>
        <h1 className="hero-title">Card search</h1>
        <p className="hero-subtitle">
          Find any Riftbound card by name and track it across your favorite shops.
        </p>
      </section>

      <SearchForm placeholder="Search cards by name" />

      <p className="search-hint">Press Enter to search.</p>
    </main>
  );
}
