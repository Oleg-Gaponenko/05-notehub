import css from './NoteList.module.css';
import {
  useQuery,
  keepPreviousData,
  QueryClient,
  useMutation,
} from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote, fetchNotes } from '../../services/noteService';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface NoteListProps {
  search: string;
  page: number;
  perPage: number;
  onTotalPagesChange: (totalPages: number) => void;
}

const queryClient = new QueryClient();

export function NoteList({
  search,
  page,
  perPage,
  onTotalPagesChange,
}: NoteListProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', search, page, perPage],
    queryFn: () => fetchNotes({ search, page, perPage }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Notes are loading, please wait...</p>;
  if (isError) return <p>An error has occured: {(error as Error).message} </p>;
  if (!data || data.results.length === 0) return <p>Notes are not found.</p>;

  useEffect(() => {
    if (data?.totalPages) {
      onTotalPagesChange(data.totalPages);
    }
  }, [data, onTotalPagesChange]);

  return (
    <ul className={css.list}>
      {data.results.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

const deleteMutation = useMutation({
  mutationFn: deleteNote,
  onSuccess: () => {
    toast.success('Note was deleted');
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  },
  onError: () => {
    toast.error('Failed to delete note');
  },
});
