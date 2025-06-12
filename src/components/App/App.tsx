import { useState } from 'react';
import css from './App.module.css';
import { SearchBox } from '../SearchBox/SearchBox';
import { NoteForm } from '../NoteForm/NoteForm';
import { NoteList } from '../NoteList/NoteList';
import { Pagination } from '../Pagination/Pagination';

export default function App() {
  const [searchNote, setSearchNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
        <NoteForm />
        <SearchBox value={searchNote} onChange={handleSearchChange} />
        <NoteList
          search={searchNote}
          page={currentPage}
          perPage={notesPerPage}
          onTotalPagesChange={setTotalPages}
        />
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
        {/* Кнопка створення нотатки */}
      </header>
    </div>
  );
}
