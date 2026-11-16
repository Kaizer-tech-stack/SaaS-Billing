import { Search } from "lucide-react";
function SearchBox({ value, onChange }) {
  return (
    <label className="search">
      <Search size={15} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
      />
    </label>
  );
}
export default SearchBox;
