import { useSnippetStore } from "../store/snippetsStore";
import { twMerge } from "tailwind-merge";
import { readTextFile, remove } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FaCopy } from "react-icons/fa";

interface Props {
  snippetName: string;
}

function SnippetItem({ snippetName }: Props) {
  const setSelectedSnippet = useSnippetStore((state) => state.setSelectedSnippet);
  const selectedSnippet = useSnippetStore((state) => state.selectedSnippet);
  const removeSnippetName = useSnippetStore((state) => state.removeSnippetName);
  const snippetFolder = useSnippetStore((state) => state.snippetFolder);

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

  const handleCopyToClipboard = async () => {
    if (!selectedSnippet?.code) {
      toast.error("No hay código para copiar.", {
        duration: 2000,
        position: "bottom-right",
        style: {
          background: "#202020",
          color: "#fff",
        },
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(selectedSnippet.code);
      toast.success("Código copiado al portapapeles", {
        duration: 2000,
        position: "bottom-right",
        style: {
          background: "#202020",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      toast.error("Error al copiar el código", {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "#202020",
          color: "#fff",
        },
      });
    }
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
          <FaCopy
            onClick={(e) => {
              e.stopPropagation();
              handleCopyToClipboard();
            }}
            className="text-neutral-500 hover:text-neutral-200 cursor-pointer"
          />
          <MdDelete
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(snippetName);
            }}
            className="text-neutral-500 hover:text-neutral-200 cursor-pointer"
          />
          <RiArrowGoBackLine
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSnippet(null);
            }}
            className="text-neutral-500 hover:text-neutral-200 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}

export default SnippetItem;