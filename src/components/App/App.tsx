import { useEffect, useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import { useDebounce } from 'use-debounce';
import NoteModal from '../NoteModal/NoteModal';
import { fetchNotes, type NoteHubResponse } from '../../services/noteService';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import AbsentDataMessage from '../AbsentDataMessage/AbsentDataMessage';

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

  const { data, isLoading, isError, error } = useQuery<NoteHubResponse, Error>({
    queryKey: ['notes', debouncedSearch, currentPage, notesPerPage],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch,
        page: currentPage,
        perPage: notesPerPage,
      }),
    placeholderData: previousData => previousData,
  });

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchNote} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage message={error!.message} />}
      {data && data?.notes.length > 0 && <NoteList notes={data.notes} />}
      {!isLoading && !isError && data && data?.notes.length === 0 && (
        <AbsentDataMessage />
      )}

      {isModalOpen && (
        <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
