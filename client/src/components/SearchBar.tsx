


type SearchBarProps = {
  query: string
  onQueryChange: (value: string) => void
  onlyAvailable: boolean
  onOnlyAvailableChange: (value: boolean) => void
}

export default function SearchBar({
  query,
  onQueryChange,
  onlyAvailable,
  onOnlyAvailableChange,
}: SearchBarProps) {

  return (
    <div className="search-bar">
      <label htmlFor="book-search">Search</label>
      <input
        id="book-search"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <label htmlFor="only-available">Only available</label>
      <input
        id="only-available"
        type="checkbox"
        checked={onlyAvailable}
        onChange={(e) => {
          onOnlyAvailableChange(e.target.checked)
        }}


      />
    </div>
  )
}
