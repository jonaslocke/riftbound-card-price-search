type SearchFormProps = {
  placeholder?: string;
  name?: string;
};

export default function SearchForm({
  placeholder = "Search...",
  name = "query",
}: SearchFormProps) {
  return (
    <form className="search-form" role="search" action="#" method="get">
      <label className="visually-hidden" htmlFor="search-input">
        Search
      </label>
      <input
        id="search-input"
        name={name}
        type="search"
        placeholder={placeholder}
        autoComplete="off"
        className="search-input"
      />
    </form>
  );
}
