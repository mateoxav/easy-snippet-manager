import { writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { useSnippetStore } from "../store/snippetsStore";
import { toast } from "react-hot-toast";

function SnippetForm() {
  const [snippetName, setSnippetName] = useState("");
  const addSnippetName = useSnippetStore((state) => state.addSnippetName);
  const snippetFolder = useSnippetStore((state) => state.snippetFolder); // Carpeta seleccionada

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (!snippetFolder) {
          toast.error("No se ha seleccionado una carpeta para guardar snippets.", {
            duration: 3000,
            position: "bottom-right",
            style: {
              background: "#202020",
              color: "#fff",
            },
          });
          return;
        }

        await writeTextFile(`${snippetFolder}/${snippetName}.md`, "");
        setSnippetName("");
        addSnippetName(snippetName);

        toast.success("Snippet creado", {
          duration: 2000,
          position: "bottom-right",
          style: {
            background: "#202020",
            color: "#fff",
          },
        });
      }}
    >
      <input
        type="text"
        placeholder="Escribe un Snippet"
        className="bg-zinc-900 w-full border-none outline-none p-4"
        onChange={(e) => setSnippetName(e.target.value)}
        value={snippetName}
      />
      <button className="hidden">Save</button>
    </form>
  );
}

export default SnippetForm;
