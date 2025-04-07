import { atomWithStorage } from "jotai/utils";

interface Following {
  follower: {
    id: string;
    name: string;
    about?: string
  };
}

interface Follower {
  following: {
    id: string;
    name: string;
    about?: string
  };
}

export const userAtom = atomWithStorage<{
  id: string;
  name: string;
  email: string;
  about?: string;
  image?: string;
  links?: Array<object>;
  posts?: Array<object>;
  followers?: Array<Follower>;
  following?: Array<Following>;
  createdAt: string;
}>("user", {
  id: "",
  name: "",
  email: "",
  about: "",
  image: "",
  links: [],
  posts: [{}],
  followers: [
    {
      following: {
        id: "",
        name: "",
        about : ""
      },
    },
  ],
  following: [
    {
      follower: {
        id: "",
        name: "",
        about: ""
      },
    },
  ],
  createdAt: "",
});
