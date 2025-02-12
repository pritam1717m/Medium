import { useEffect, useRef, useState, useCallback } from "react";
import EditorJS from "@editorjs/editorjs";
import { toast } from "sonner";
import axios from "axios";
import Button from "./button";
import { Input } from "./ui/input";
import { useRecoilValue } from "recoil";
import { writeAtom } from "@/store/atom/write";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


function DraftEditor() {
  const [title, setTitle] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [savedContent, setSavedContent] = useState({
    time: 0,
    blocks: [],
    version: "",
  });
  const writeId = useRecoilValue(writeAtom);

  const ref = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const fetchBlogContent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_domain_uri}/blog/${writeId.id}`,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setSavedContent((prev) => ({
          ...prev,
          time: res.data.post.content.time,
          blocks: res.data.post.content.blocks,
          version: res.data.post.content.version
        }));
        setTitle(res.data.post.title)
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlogContent();
  }, [writeId.id]);

  useEffect(() => {
    if (!isMounted || !savedContent.blocks.length) return;  
  
    const initializeEditor = async () => {
      if (ref.current) return;
  
      const { default: EditorJS } : any = await import("@editorjs/editorjs");
      const { default: Header } : any = await import("@editorjs/header");
      const { default: Table } : any = await import("@editorjs/table");
      const { default: List } :any = await import("@editorjs/list");
      const { default: Code } : any = await import("@editorjs/code");
      const { default: Paragraph } : any = await import("@editorjs/paragraph");
      const { default: Quote } : any = await import("@editorjs/quote");
      const { default: Embed } : any = await import("@editorjs/embed");
  
      ref.current = new EditorJS({
        holder: "editorjs",
        data: savedContent,  
        autofocus: true,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+H",
          },
          table: { class: Table, inlineToolbar: true },
          list: {
            class: List,
            inlineToolbar: true,
            config: { defaultStyle: "unordered" },
            shortcut: "CMD+SHIFT+L",
          },
          code: Code,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+P",
          },
          quote: Quote,
          embed: {
            class: Embed,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                facebook: true,
                instagram: true,
                codepen: true,
                github: true,
                pinterest: true,
                twitter: true,
                "twitch-video": true,
              },
            },
          },
        },
      });
    };
  
    initializeEditor();
  
    return () => {
      ref.current?.destroy();
      ref.current = null;
    };
  }, [isMounted, savedContent, title]); 
  

  const save = useCallback(() => {
    if (!ref.current) return;

    ref.current.save().then((outputData) => {
      if (!title.trim()) {
        toast.error("Title cannot be empty!");
        return;
      }

      if (!writeId?.id) {
        toast.info("Please go thourgh Draft");
        return;
      }
      toast.promise(
        axios.put(
          `${import.meta.env.VITE_domain_uri}/blog`,
          { title, content: outputData, id: writeId.id },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Saved successfully!",
          error: "Failed to save!",
        }
      );
    });
  }, [title, writeId.id]);

  const publish = useCallback(() => {
    if (!ref.current) return;
    if (!writeId?.id) {
      toast.info("Please go thourgh Draft");
      return;
    }
    toast.promise(
      axios.put(
        `${import.meta.env.VITE_domain_uri}/blog/publish`,
        { id: writeId.id },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      ),
      {
        loading: "Publishing...",
        success: "Published successfully!",
        error: (message: any) => {
          if (message.status == 404) {
            return "Please write any content";
          }
        },
      }
    );
  }, [writeId.id]);

  return (
    <div className="flex flex-col px-5 md:flex-row  items-start justify-evenly dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full max-w-6xl transition-all duration-300">
        <div className="flex items-cente mb-1">
          <p className="text-2xl font-semibold text-gray-800 dark:text-white">
            ✏️
          </p>
          <div className="w-full flex flex-col">
            <Input
              type="text"
              defaultValue={title}
              className="text-lg font-semibold border-none ring-0 shadow-none focus-visible:ring-0 outline-none bg-transparent w-full px-2 transition-all duration-200"
              style={{ fontSize: "1.875rem", lineHeight: "2.25rem" }}
              onChange={(e) => {
                setTitle(() => e.target.value);
              }}
            />
            <hr className="w-full max-w-6xl mb-2" />
          </div>
        </div>
        <div
          id="editorjs"
          className="prose prose-lg dark:prose-invert px-10 max-w-full min-h-[550px] max-h-[500px] border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-amber-50 dark:bg-gray-950 transition-all duration-300 shadow-sm overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-amber-50
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-gray-950
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        ></div>
      </div>
      <div
        className="w-full md:w-32 md:ml-5 flex flex-row
      space-x-10 md:flex-col md:space-x-0 justify-center"
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Publish</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you save your content?</AlertDialogTitle>
              <AlertDialogDescription>
                This action can't hold your content if you not saved it. This
                will publish your post and you can change it later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={publish}>Publish</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={save} classname="w-full mt-5 dark:bg-green-700">
          Save
        </Button>
      </div>
    </div>
  );
}

export default DraftEditor;
