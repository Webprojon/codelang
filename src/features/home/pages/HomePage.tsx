import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PiCodeBold } from 'react-icons/pi';
import { SnippetCard } from '../';
import { useHomeSnippets, DEFAULT_PAGE } from '../';

export default function HomePage() {
  const { snippets, isLoading, error, currentPage, totalPages, setCurrentPage } =
    useHomeSnippets(DEFAULT_PAGE);

  return (
    <div>
      <div className="flex justify-center items-center flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome to Codelang!</h1>
        <PiCodeBold className="size-9" />
      </div>

      <div className="flex justify-center items-center gap-4 my-8">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className={`hover:bg-gray-200 px-3 py-3 rounded cursor-pointer ${currentPage === 1 || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaChevronLeft className="text-gray-400 size-3" />
        </button>
        <div className="px-4 py-2 text-sm bg-gray-100 rounded font-semibold text-gray-400">
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isLoading}
          className={`hover:bg-gray-100 px-3 py-3 rounded cursor-pointer ${currentPage === totalPages || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaChevronRight className="text-gray-300 size-3" />
        </button>
      </div>

      {/* Snippet Cards */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-500">Loading snippets...</p>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center py-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}
      {!isLoading && !error && (
        <div className="space-y-4">
          {snippets.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500">No snippets found</p>
            </div>
          ) : (
            snippets.map(snippet => <SnippetCard key={snippet.id} snippet={snippet} />)
          )}
        </div>
      )}
    </div>
  );
}
