import { atom } from "jotai";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const userAtom = atom<User | null>(null);
