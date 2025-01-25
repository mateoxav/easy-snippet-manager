import { useEffect } from "react";
import { readDir } from "@tauri-apps/plugin-fs";
import { useSnippetStore } from "../store/snippetsStore";
import SnippetItem from "./SnippetItem";
import { toast } from "react-hot-toast";

function SnippetList() {
  const setSnippetsNames = useSnippetStore((state) => state.setSnippetsNames);
  const snippetsNames = useSnippetStore((state) => state.snippetsNames);
  const snippetFolder = useSnippetStore((state) => state.snippetFolder); // Carpeta seleccionada

  useEffect(() => {
    async function loadFiles() {
      if (!snippetFolder) {
        toast.error("No se ha seleccionado una carpeta para los snippets.", {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "#202020",
            color: "#fff",
          },
        });
        return;
      }

      try {
        const result = await readDir(snippetFolder);
        const filenames = result
          .filter((file) => file.name?.endsWith(".md")) // Filtrar solo archivos .md
          .map((file) => file.name!.split(".")[0]);
        setSnippetsNames(filenames);
      } catch (error) {
        toast.error("Error al cargar los snippets. Verifica la carpeta seleccionada.", {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "#202020",
            color: "#fff",
          },
        });
      }
    }
    loadFiles();
  }, [snippetFolder]);

  return (
    <div>
      {snippetsNames.map((snippetName) => (
        <SnippetItem snippetName={snippetName} key={snippetName} />
      ))}
    </div>
  );
}

export default SnippetList;
