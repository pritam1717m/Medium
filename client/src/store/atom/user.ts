import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage<{
  id: string;
  name: string;
  email: string;
  about?: string;
  image?: string;
  links?: Array<object>;
  posts?: Array<object>;
  followers?: Array<object>;
  following?: Array<object>;
  createdAt: string;
}>("user", {
  id: "",
  name: "",
  email: "",
  about: "",
  image: "",
  links: [
    { id: 0, value: "ghjgadhgs" },
    { id: 1, value: "Ddassddddwed" },
  ],
  posts: [{}],
  followers: [{}],
  following: [{}],
  createdAt: "",
});
