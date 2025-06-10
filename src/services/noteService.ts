import axios from "axios";
import type { Note } from '../types/note';

interface NoteHubResponse {
    page: number;
    results: Note[];
    total_pages: number;
}

const noteHubToken = import.meta.env.VITE_NOTEHUB_TOKEN;

export async function FetchNotes (searchQuery: string, page: number = 1): Promise<NoteHubResponse> {
    const response = await axios.get<NoteHubResponse>('https://notehub-public.goit.study/api/notes', {
        params: {
            searchQuery,
            page,
        },
        headers: {
            Authorization: `Bearer ${noteHubToken}`,
        },
    });

    return response.data;
}

