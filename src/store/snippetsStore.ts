import { create } from "zustand";

interface Snippet {
  name: string;
  code: string | null;
}

interface SnippetState {
  snippetsNames: string[];
  selectedSnippet: Snippet | null;
  snippetFolder: string; // New property for selected folder
  addSnippetName: (name: string) => void;
  setSnippetsNames: (names: string[]) => void;
  setSelectedSnippet: (snippet: Snippet | null) => void;
  removeSnippetName: (name: string) => void;
  setSnippetFolder: (folder: string) => void; // New method
}

export const useSnippetStore = create<SnippetState>((set) => ({
  snippetsNames: [],
  selectedSnippet: null,
  snippetFolder: "", // Empty initial value
  addSnippetName: (name) =>
    set((state) => ({
      snippetsNames: [...state.snippetsNames, name],
    })),
  setSnippetsNames: (names) => set({ snippetsNames: names }),
  setSelectedSnippet: (snippet) => set({ selectedSnippet: snippet }),
  removeSnippetName: (name) =>
    set((state) => ({
      snippetsNames: state.snippetsNames.filter((n) => n !== name),
    })),
  setSnippetFolder: (folder) => set({ snippetFolder: folder }), // Implementation of the new method
}));
