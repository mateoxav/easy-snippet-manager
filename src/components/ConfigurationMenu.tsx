import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useSnippetStore } from "../store/snippetsStore";
import { IoSettingsSharp } from "react-icons/io5";

function ConfigurationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const setSnippetFolder = useSnippetStore((state) => state.setSnippetFolder);

  const handleFolderSelect = async () => {
    const selectedFolder = await open({
      multiple: false,
      directory: true,
      title: "Seleccionar carpeta para guardar snippets",
    });

    if (selectedFolder && typeof selectedFolder === "string") {
      setSnippetFolder(selectedFolder);
      setIsOpen(false);
    }
  };

  return (
    <div className="absolute bottom-4 right-4">
      <IoSettingsSharp
        size={30}
        className="text-neutral-400 hover:text-neutral-200 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute bottom-10 right-0 bg-zinc-900 p-4 rounded shadow-lg">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleFolderSelect}
          >
            Select Folder
          </button>
        </div>
      )}
    </div>
  );
}

export default ConfigurationMenu;
