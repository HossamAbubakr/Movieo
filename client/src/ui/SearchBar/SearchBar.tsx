import { useRef, useState } from "react";
import "./SearchBar.css";

function SearchBar({ setQuery }: { setQuery: (query: string) => void }) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim() || "";
    if (searchValue.length < 3 && searchValue.length > 0) {
      setWarning(true);
    } else {
      setWarning(false);
      setQuery(searchValue);
    }
  };

  const handleReset = () => {
    setQuery("");
    setWarning(false);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search for movies..."
          className={`search-input ${warning ? "warning" : ""}`}
          onChange={(e) => handleSearch(e)}
        />
        <div className="search-actions">
          <button
            className="reset-button"
            onClick={handleReset}
            aria-label="Reset search"
          >
            ✕
          </button>
        </div>
      </div>
      {warning && (
        <div className="search-dropdown">
          <p>Enter at least 3 characters.</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
