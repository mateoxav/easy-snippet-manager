import { useEffect } from "react";
import { readDir } from "@tauri-apps/plugin-fs";
import { useSnippetStore } from "../store/snippetsStore";
import SnippetItem from "./SnippetItem";
import { toast } from "react-hot-toast";

function SnippetList() {
  const setSnippetsNames = useSnippetStore((state) => state.setSnippetsNames);
  const snippetsNames = useSnippetStore((state) => state.snippetsNames);
  const snippetFolder = useSnippetStore((state) => state.snippetFolder); // Selected folder

  useEffect(() => {
    async function loadFiles() {
      if (!snippetFolder) {
        toast.error("No folder has been selected for the snippets.", {
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
          .filter((file) => file.name?.endsWith(".md")) // Filter .md files only
          .map((file) => file.name!.split(".")[0]);
        setSnippetsNames(filenames);
      } catch (error) {
        toast.error("Error loading snippets. Check the selected folder.", {
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
