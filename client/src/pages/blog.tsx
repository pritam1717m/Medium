import AppBar from "@/components/appbar";
import RenderContent from "@/components/render-content";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [time, setTime] = useState("");
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
        setTime(res.data.post && res.data.post.updatedAt);
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
      <div className="my-20 w-full flex justify-center">
        {blog ? (
          <RenderContent
            content={blog ?? { blocks: [] }}
            title={title}
            time={time}
          />
        ) : (
          <div className="flex flex-col justify-center">
            <Skeleton className="h-[42px] w-[700px]"></Skeleton>
            <div className="my-10 flex items-center gap-3">
              <Skeleton className="p-7 rounded-full" />
              <div className="flex flex-col">
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton className="h-5 w-40"></Skeleton>
                  <Skeleton className="h-5 w-40"></Skeleton>
                </div>
              </div>
            </div>
            <div className="mb-5 flex flex-row justify-between border-t border-b py-4">
              <div className="flex flex-row justify-center items-center gap-10">
                {Array.from({ length: 3 }).map((_, index) => {
                  return <Skeleton className="h-7 w-7" key={index}></Skeleton>;
                })}
              </div>
              <div className="flex flex-row justify-center items-center gap-10">
                {Array.from({ length: 4 }).map((_, index) => {
                  return <Skeleton className="h-7 w-7" key={index}></Skeleton>;
                })}
              </div>
            </div>
            <div>
              {Array.from({ length: 4 }).map((_, index) => {
                return (
                  <Skeleton className="h-7 w-[700] my-2" key={index}></Skeleton>
                );
              })}
              <Skeleton className="h-80 w-[700px] my-2"></Skeleton>
              {Array.from({ length: 4 }).map((_, index) => {
                return (
                  <Skeleton className="h-7 w-[700] my-2" key={index}></Skeleton>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
