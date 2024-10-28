interface PaginationProps {
  onPrev: () => Promise<void> | null;
  onNext: () => Promise<void> | null;
}
export function Pagination({ onPrev, onNext }: PaginationProps) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        disabled={onPrev == null}
        onClick={onPrev}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        disabled={onNext == null}
        onClick={onNext}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed ml-4"
      >
        Next
      </button>
    </div>
  );
}
