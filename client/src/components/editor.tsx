import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { toast } from "sonner";
import axios from "axios";

function Editor() {
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<EditorJS>();

  const initializeEditor = async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header: any = (await import("@editorjs/header")).default;
    const Table: any = (await import("@editorjs/table")).default;
    const List: any = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const Paragraph: any = (await import("@editorjs/paragraph")).default;
    const Quote = (await import("@editorjs/quote")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+H",
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
            shortcut: "CMD+SHIFT+L",
          },
          code: Code,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+P",
          },
          quote: Quote,
        },
      });
      ref.current = editor;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);
  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };
    if (isMounted) {
      init();

      return () => {
        if (ref.current) {
          ref.current.destroy();
        }
      };
    }
  }, [isMounted]);

  const save = () => {
    if (ref.current) {
      ref.current.save().then((outputData) => {
        toast.promise(
          axios.post(
            `${import.meta.env.VITE_domain_uri}/blog`,
            {
              title: "My first blog",
              content: outputData,
            },
            {
              headers: {
                Authorization:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ZWYxNWNkLTJhZGUtNDdmNC1hNTQwLTkxNWRlOTVmYzU2OSJ9.ShaCl317l9Y8hYLdwg39VtpBGSmdKy507Ug3Np8-Qtc",
              },
            }
          ),
          {
            loading: "Signing in...",
            success: () => {
              return "Signed in successfully!";
            },
            error: (response) => {
              return response.data
                ? response.data.message
                : "Internal server error!";
            },
          }
        );
        console.log("Article data :", outputData);
      });
    }
  };
  return (
    <div className="content">
      <div
        id="editorjs"
        className="prose prose-lg max-w-full min-h-screen"
      ></div>
      <button onClick={save}>Save</button>
    </div>
  );
}

export default Editor;
