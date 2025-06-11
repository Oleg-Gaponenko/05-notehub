import css from './NoteList.module.css';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { fetchNotes } from '../../services/noteService';

interface NoteListProps {
  search: string;
  page: number;
  perPage: number;
}

export function NoteList({ search, page, perPage }: NoteListProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', { search, page, perPage }],
    queryFn: () => fetchNotes({ search, page, perPage }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Notes are loading, please wait...</p>;
  if (isError) return <p>An error has occured: {(error as Error).message} </p>;
  if (!data || data.results.length === 0) return <p>Notes are not found.</p>;

  return (
    <ul className={css.list}>
      {data.results.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
