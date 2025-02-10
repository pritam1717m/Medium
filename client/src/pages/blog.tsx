import AppBar from "@/components/appbar";
import RenderContent from "@/components/render-content";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

type Block = {
  id: string;
  type: string;
  data: any;
};

type Content = {
  blocks: Block[];
};

function Blog() {
  const controller = new AbortController();
  const [blog, setBlog] = useState<Content>();
  const [title, setTitle] = useState("");
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_domain_uri}/blog/${id}`,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setTitle(res.data.post && res.data.post.title);
        setBlog(res.data.post && res.data.post.content);
      } catch (err) {
        toast.error("Falid to fetch blog, try again.");
      }
    })();
    return () => controller.abort();
  }, [id]);
  return (
    <div
      className="h-screen w-screen flex flex-col sm:overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <AppBar />
      <div className="mt-20 w-full flex justify-center">
        <RenderContent content={blog ?? { blocks: [] }} title={title} />
      </div>
    </div>
  );
}

export default Blog;
