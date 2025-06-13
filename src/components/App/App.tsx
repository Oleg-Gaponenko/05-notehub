import { useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import { useDebounce } from 'use-debounce';
import NoteModal from '../NoteModal/NoteModal';

export default function App() {
  const [searchNote, setSearchNote] = useState('');
  const [debouncedSearch] = useDebounce(searchNote, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notesPerPage = 12;

  const handleSearchChange = (value: string) => {
    setSearchNote(value);
    setCurrentPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchNote} onChange={handleSearchChange} />
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      <NoteList
        search={debouncedSearch}
        page={currentPage}
        perPage={notesPerPage}
        onTotalPagesChange={setTotalPages}
      />
      <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
