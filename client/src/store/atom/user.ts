import {atomWithStorage} from 'jotai/utils'

export const userAtom = atomWithStorage<{
    id: string;
    name: string;
    email: string;
    about?: string;
    image?: string;
    links?: {};
    posts?: Array<object>;
    followers?: Array<object>;
    following?: Array<object>;
    createdAt: string;
  }>('user',{
    id: "",
    name: "",
    email: "",
    about: "",
    image: "",
    links: {},
    posts: [{}],
    followers: [{}],
    following: [{}],
    createdAt: "",
  });