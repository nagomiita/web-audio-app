import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchInputProps {
  onInputChange: (e: any) => void;
  onSubmit: () => Promise<void>;
}

export function SearchInput({ onInputChange, onSubmit }: SearchInputProps) {
  return (
    <section className="mb-10">
      <input
        onChange={onInputChange}
        className="bg-gray-700 w-1/3 p-2 rounded-l-lg focus:outline-none"
        placeholder="探したい曲を入力してください"
      />
      <button
        onClick={onSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </section>
  );
}
