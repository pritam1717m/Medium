import {atom} from 'jotai'

export const blogAtom = atom<{
    id: string;
    title: string;
    content: {};
    time: string;
    author?: string;
  }[]>([]);