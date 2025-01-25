import { create } from "zustand";

interface Snippet {
  name: string;
  code: string | null;
}

interface SnippetState {
  snippetsNames: string[];
  selectedSnippet: Snippet | null;
  snippetFolder: string; // Nueva propiedad para la carpeta seleccionada
  addSnippetName: (name: string) => void;
  setSnippetsNames: (names: string[]) => void;
  setSelectedSnippet: (snippet: Snippet | null) => void;
  removeSnippetName: (name: string) => void;
  setSnippetFolder: (folder: string) => void; // Nuevo método
}

export const useSnippetStore = create<SnippetState>((set) => ({
  snippetsNames: [],
  selectedSnippet: null,
  snippetFolder: "", // Valor inicial vacío
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
  setSnippetFolder: (folder) => set({ snippetFolder: folder }), // Implementación del nuevo método
}));
