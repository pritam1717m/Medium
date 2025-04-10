import AppBar from "@/components/appbar";
import RenderContent from "@/components/render-content";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface Block {
  id: string;
  type: string;
  data: any;
}

type Content = {
  blocks: Block[];
};

interface Details {
  postId: string;
  title: string;
  time: string;
  authorId: string;
  author: string;
  upvotes: number;
  downvotes: number;
}

function Blog() {
  const controller = new AbortController();
  const [blog, setBlog] = useState<Content>();
  const [details, setDetails] = useState<Details>({
    postId: "",
    title: "",
    time: "",
    authorId: "",
    author: "",
    upvotes: 0,
    downvotes: 0,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if(!localStorage.getItem("token")){
      navigate("/")
    }
    (async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_domain_uri}/user/me`,
          {},
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (res.data.status === 401) {
          toast.error("Session expired, Login again...");
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error: any) {
        toast.error("Something went wrong!");
        if (error.response?.status === 401) {
          toast.error("Session expired, Login again...");
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    })();
  }, []);
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

        setBlog(res.data.post && res.data.post.content);
        setDetails({
          postId: id as string,
          title: res.data.post && res.data.post.title,
          time: res.data.post && res.data.post.updatedAt,
          authorId: res.data.post && res.data.post.authorId,
          author: res.data.post && res.data.post.author.name,
          upvotes: res.data.post && res.data.post.upvotes,
          downvotes: res.data.post && res.data.post.downvotes,
        });
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
            postId={id as string}
            content={blog ?? { blocks: [] }}
            title={details.title}
            time={details.time}
            authorId={details.authorId}
            author={details.author}
            upvotes={details.upvotes}
            downvotes={details.downvotes}
          />
        ) : (
          <div className="max-w-[350px] lg:max-w-[700px] flex flex-col justify-center">
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
