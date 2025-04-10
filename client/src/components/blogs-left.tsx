import { useAtom} from "jotai";
import BlogCard from "./blog-card";
import { blogAtom } from "@/store/atom/blogs";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";

function BlogsLeft() {
  const [blogs, setBlogs] = useAtom(blogAtom);
  const [isLoading, setIsLoading] = useState(false);

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
        console.log(res.data.posts)
        if (Array.isArray(res.data.posts)) {
          const formattedBlogs = res.data.posts.map((item: any) => ({
            id: item.id, 
            title: item.title, 
            content: item.content, 
            time: item.updatedAt, 
            author: item.author.name,
            upvotes: item.upvotes, 
            downvotes: item.downvotes, 
          }));
          
          setBlogs(formattedBlogs); 
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
    <div className="px-5 sm:px-10 pt-10 flex flex-col">
      <p>Navigation</p>
      <div className="mt-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_,index) => {
              return (
                <div className="py-8" key={index}>
                  <div className="flex flex-row space-x-2 items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="w-full flex flex-row space-x-0 md:space-x-5 mt-4">
                    <div className="flex flex-col space-y-2 w-full">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-6 w-2/3 md:w-5/6" />
                      <Skeleton className="h-6 w-2/3" />
                    </div>
                    <Skeleton className="h-24 w-36 md:min-w-36 max-w-36" />
                  </div>
                  <div className="mt-4 flex flex-row space-x-4 text-center">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <hr className="mt-5" />
                </div>
              );
            })
          : blogs.map((blog) => {
              return <BlogCard key={blog.id} blog={blog} />;
            })}
      </div>
    </div>
  );
}

export default BlogsLeft;
