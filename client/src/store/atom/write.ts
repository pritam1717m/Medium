import {atom} from 'recoil'

export const writeAtom = atom<{
    id: string;
  }>({
    key: "writeAtom",
    default: {
      id: "",
    },
  });