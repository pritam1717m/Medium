import { blogAtom } from "@/store/atom/blogs";
import { userAtom } from "@/store/atom/user";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useAtomValue, useAtom } from "jotai";
import ProfileBlog from "./profile-blog";

export default function ProfileLeft() {

  const [blogs, setBlogs] = useAtom(blogAtom);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_domain_uri}/blog`,
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
          }));
          setBlogs(formattedBlogs)
          setIsLoading(false);
        } else {
          console.error("Unexpected response format:");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col mt-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">{user.name}</h1>
        <button>
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="flex space-x-5 mt-3">
        <p className="font-medium">Home</p>
        <p className="text-gray-500">About</p>
      </div>

      <div className="mt-5 p-5">
        {isLoading ? (
          <p className="text-gray-500 mt-2">Loading...</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <ProfileBlog blog={blog} key={blog.id}/>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No stories yet</p>
        )}
      </div>
    </div>
  );
}
