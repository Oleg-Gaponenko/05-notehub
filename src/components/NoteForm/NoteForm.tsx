import { Formik } from 'formik';
import type { NoteTag } from '../../types/note';
import css from './NoteForm.module.css';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import { toast } from 'react-hot-toast';

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Personal',
};

const validationSchema = Yup.object();

export function NoteForm() {
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note created successfully');
    },
    onError: () => {
      toast.error('Failed to create note');
    },
  });

  const handleSubmit = () => {
    //bla-bla
  };

  return(
    <form className={css.form}>
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <input id="title" type="text" name="title" className={css.input} />
    <span name="title" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <textarea
      id="content"
      name="content"
      rows="8"
      className={css.textarea}
    />
    <span name="content" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
    <select id="tag" name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </select>
    <span name="tag" className={css.error} />
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton}>
      Cancel
    </button>
    <button
      type="submit"
      className={css.submitButton}
      disabled=false
    >
      Create note
    </button>
  </div>
</form>
  )
}
