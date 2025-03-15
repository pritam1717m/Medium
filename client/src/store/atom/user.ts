import {atom} from 'jotai'

export const userAtom = atom<{
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
  }>({
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