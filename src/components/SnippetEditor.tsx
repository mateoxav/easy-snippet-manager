import { Editor } from "@monaco-editor/react";
import { useSnippetStore } from "../store/snippetsStore";
import { useEffect, useState } from "react";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { HiPencilAlt } from "react-icons/hi";
import { toast } from "react-hot-toast";

function SnippetEditor() {
  const selectedSnippet = useSnippetStore((state) => state.selectedSnippet);
  const snippetFolder = useSnippetStore((state) => state.snippetFolder);
  const [text, setText] = useState<string>("");  // Changed to empty string as initial value

  // Update text when selected snippet changes
  useEffect(() => {
    if (selectedSnippet?.code) {
      // Make sure the code is string
      setText(typeof selectedSnippet.code === 'string' ? selectedSnippet.code : '');
    } else {
      setText('');
    }
  }, [selectedSnippet]);

  useEffect(() => {
    if (!selectedSnippet || !snippetFolder) return;

    const saveText = setTimeout(async () => {
      try {
        const filePath = await join(snippetFolder, `${selectedSnippet.name}.md`);
        // Make sure text is string before saving
        const contentToSave = typeof text === 'string' ? text : '';
        await writeTextFile(filePath, contentToSave);
        
        toast.success("Snippet saved", {
          duration: 2000,
          position: "bottom-right",
          style: {
            background: "#202020",
            color: "#fff",
          },
        });
      } catch (error) {
        console.error("Error saving snippet:", error);
        toast.error("Error saving snippet", {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "#202020",
            color: "#fff",
          },
        });
      }
    }, 1000);

    return () => {
      clearTimeout(saveText);
    };
  }, [text, selectedSnippet, snippetFolder]);

  return (
    <>
      {selectedSnippet ? (
        <Editor
          theme="vs-dark"
          defaultLanguage="markdown"
          options={{
            fontSize: 20,
            minimap: { enabled: false },
            wordWrap: "on",
          }}
          onChange={(value) => setText(value || "")}  // Ensure it is never undefined
          value={text}  // Use local status instead of selectedSnippet.code
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <HiPencilAlt className="text-9xl text-neutral-400" />
        </div>
      )}
    </>
  );
}

export default SnippetEditor;