import { blogAtom } from "@/store/atom/blogs";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function ProfileLeft() {

  const [blogs, setBlogs] = useRecoilState(blogAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [author, setAuthor] = useState("");

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_domain_uri}/blog/all`,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (Array.isArray(res.data.post)) {
          const formattedBlogs = res.data.post.map((item: any) => ({
            id: item.id, 
            title: item.title, 
            content: item.content, 
            time: item.updatedAt, 
            author: item.author.name, 
          }));
          setBlogs(formattedBlogs)
          setAuthor(res.data.post[0]?.author.name || "Unknown Author");
          setIsLoading(false);
          setIsLoading(false)
        } else {
          console.error("Unexpected response format:");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col w-full p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{author}</h1>
        <button>
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="flex space-x-5 mt-3">
        <p className="font-medium">Home</p>
        <p className="text-gray-500">About</p>
      </div>

      <div className="mt-5 p-5 border rounded-lg bg-gray-900">
        <h2 className="text-xl font-semibold">Reading list</h2>
        {isLoading ? (
          <p className="text-gray-500 mt-2">Loading...</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
        <div key={blog.id} className="mt-2">
          <h3 className="text-lg font-medium">{blog.title}</h3>
          <p className="text-gray-400">{String(blog.content)}</p>
          <p className="text-gray-500 text-sm">{blog.time}</p>
        </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No stories</p>
        )}
      </div>
    </div>
  );
}
