import { atom } from "jotai";

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

export const authTokenAtom = atom(savedToken || null);
export const authUserAtom = atom(savedUser ? JSON.parse(savedUser) : null);
export const authErrorAtom = atom('');