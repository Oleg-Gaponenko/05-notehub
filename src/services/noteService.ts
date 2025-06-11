import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from '../types/note';

interface NoteHubResponse {
    page: number;
    results: Note[];
    perPage: number;
    total: number;
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

interface DeleteNoteResponse {
    id: string;
}

const noteHubToken = import.meta.env.VITE_NOTEHUB_TOKEN;
const baseUrl = 'https://notehub-public.goit.study/api/notes';

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${noteHubToken}`,
    },
});

export async function fetchNotes ({search = '', page = 1, perPage = 12}: NoteHubParams): Promise<NoteHubResponse> {
    const response: AxiosResponse<NoteHubResponse> = await instance.get ('/notes', {
        params: {
            page,
            perPage,
            search,
        },
    });

    return response.data;
}

export async function createNote(newNote: CreateNoteParams): Promise<Note> {
    const response: AxiosResponse<Note> = await instance.post('/notes', newNote);
    return response.data;    
}

export async function deleteNote (noteId:string): Promise<DeleteNoteResponse> {
    const response: AxiosResponse<DeleteNoteResponse> = await instance.delete(`/notes/${noteId}`);
    return response.data;
}