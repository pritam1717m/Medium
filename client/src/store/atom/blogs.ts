import {atom} from 'recoil'

export const blogAtom = atom<{
    id: string;
    title: string;
    content: {};
    time: string;
    author?: string;
  }[]>({
    key: "blogAtom",
    default: [],
  });