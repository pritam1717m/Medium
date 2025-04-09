import { atomWithStorage } from 'jotai/utils';

export const blogAtom = atomWithStorage<{
    id: string;
    title: string;
    content: {};
    time: string;
    author?: string;
    upvote: number;
    downvote: number
  }[]>('blog',[]);