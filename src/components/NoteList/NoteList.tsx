import css from './NoteList.module.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote, fetchNotes } from '../../services/noteService';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import type { NoteHubResponse } from '../../services/noteService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import AbsentDataMessage from '../AbsentDataMessage/AbsentDataMessage';

interface NoteListProps {
  search: string;
  page: number;
  perPage: number;
  onTotalPagesChange: (totalPages: number) => void;
}

export default function NoteList({
  search,
  page,
  perPage,
  onTotalPagesChange,
}: NoteListProps) {
  const queryClient = useQueryClient();

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

  const { data, isLoading, isError, error } = useQuery<NoteHubResponse, Error>({
    queryKey: ['notes', search, page, perPage],
    queryFn: () => fetchNotes({ search, page, perPage }),
    placeholderData: previousData => previousData,
  });

  useEffect(() => {
    if (data?.totalPages) {
      onTotalPagesChange(data.totalPages);
    }
  }, [data, onTotalPagesChange]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={error!.message} />;
  if (!data?.notes?.length) return <AbsentDataMessage />;

  return (
    <ul className={css.list}>
      {data.notes.map((note: Note) => (
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
