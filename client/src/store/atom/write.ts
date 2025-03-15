import { atom } from "jotai";

export const writeAtom = atom<{
  id: string;
}>({
  id: "",
});
