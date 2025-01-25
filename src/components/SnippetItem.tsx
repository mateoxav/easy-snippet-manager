import { useSnippetStore } from "../store/snippetsStore";
import { twMerge } from "tailwind-merge";
import { readTextFile, remove } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";

interface Props {
  snippetName: string;
}

function SnippetItem({ snippetName }: Props) {
  const setSelectedSnippet = useSnippetStore((state) => state.setSelectedSnippet);
  const selectedSnippet = useSnippetStore((state) => state.selectedSnippet);
  const removeSnippetName = useSnippetStore((state) => state.removeSnippetName);
  const snippetFolder = useSnippetStore((state) => state.snippetFolder); // Carpeta seleccionada

  const handleDelete = async (snippetName: string) => {
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

    const accept = await window.confirm("¿Estás seguro de que quieres borrar este snippet?");
    if (!accept) return;

    const filePath = await join(snippetFolder, `${snippetName}.md`);
    await remove(filePath);
    removeSnippetName(snippetName);

    toast.success("Snippet eliminado", {
      duration: 2000,
      position: "bottom-right",
      style: {
        background: "#202020",
        color: "#fff",
      },
    });
  };

  return (
    <div
      className={twMerge(
        "py-2 px-4 hover:bg-neutral-700 hover:cursor-pointer flex justify-between",
        selectedSnippet?.name === snippetName ? "bg-blue-800" : ""
      )}
      onClick={async () => {
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

        const filePath = await join(snippetFolder, `${snippetName}.md`);
        const snippet = await readTextFile(filePath);
        setSelectedSnippet({ name: snippetName, code: snippet });
      }}
    >
      <h1>{snippetName}</h1>

      {selectedSnippet?.name === snippetName && (
        <div className="flex gap-2 text-center justify-center">
          <MdDelete
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(snippetName);
            }}
            className="text-neutral-500"
          />

          <RiArrowGoBackLine
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSnippet(null);
            }}
            className="text-neutral-500"
          />
        </div>
      )}
    </div>
  );
}

export default SnippetItem;
