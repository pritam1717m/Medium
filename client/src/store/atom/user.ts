import {atom} from 'recoil'

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
    key: "userAtom",
    default: {
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
    },
  });