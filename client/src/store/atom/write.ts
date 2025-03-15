import { atomWithStorage } from "jotai/utils";

export const writeAtom = atomWithStorage<{
  id: string;
}>('write',{
  id: "",
});
