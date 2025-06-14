import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from '../types/note';

export interface NoteHubResponse {
    notes: Note[];
    totalPages: number;
}

interface NoteHubParams {
    search?: string;
    page?: number;
    perPage?: number;
}

interface CreateNoteParams {
    title: string;
    content: string;
    tag: NoteTag;
}

const noteHubToken = import.meta.env.VITE_NOTEHUB_TOKEN;
const baseUrl = 'https://notehub-public.goit.study/api';

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${noteHubToken}`,
    },
});

export async function fetchNotes ({search = '', page = 1, perPage = 12}: NoteHubParams): Promise<NoteHubResponse> {
    const params: Record<string, string | number> = {
        page,
        perPage,
    };

    if (search.trim()) {
        params.search = search.trim();
    }
    
    const response: AxiosResponse<NoteHubResponse> = await instance.get ('/notes', {
        params,
    });
    
    return response.data;
}

export async function createNote(newNote: CreateNoteParams): Promise<Note> {
    const response: AxiosResponse<Note> = await instance.post('/notes', newNote);
    return response.data;    
}

export async function deleteNote (noteId:number): Promise<Note> {
    const response: AxiosResponse<Note> = await instance.delete(`/notes/${noteId}`);
    return response.data;
}