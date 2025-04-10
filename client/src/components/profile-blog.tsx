import { useNavigate } from "react-router-dom";
import Avatar from "./avatar";
import { formatTime } from "@/lib/getTime";

type Blog = {
  id: string;
  title: string;
  content: any;
  time: string;
  author?: string;
  upvotes: number;
  downvotes: number;
};

function ProfileBlog({ blog }: { blog: Blog }) {
  const content = getContent(blog.content);
  const navigate = useNavigate();
  return (
    <div className="py-8 flex flex-col space-y-2 border-b border-slate-200 dark:border-slate-700 font-[HostGrotesk]">
      {blog.author && (
        <div className="flex flex-row items-center space-x-2 dark:text-slate-200">
          <Avatar label={blog.author} className="w-7 h-7"/>
          <p>by {blog.author}</p>
        </div>
      )}
      <div
        className="w-full flex flex-row space-x-5 cursor-pointer"
        onClick={() => {
          navigate(`/blogs/${blog.id}`);
        }}
      >
        <div className="mt-2 flex flex-col space-y-2">
          <p className="text-2xl font-extrabold text-wrap dark:text-slate-200/90">{blog.title}</p>
          <p className="text-slate-500 font-medium">
            {content.length >= 130 ? content.slice(0, 130) + "..." : content}
          </p>
        </div>
        <div className="w-0 md:min-w-36 max-w-26"></div>
      </div>
      <div className="mt-2 flex flex-row space-x-2 text-center text-slate-500 font-medium">
        <p className="text-center">✨ {formatTime(blog.time)}</p>
        <p className="text-center">👋🏼 {blog.downvotes + blog.upvotes}</p>
        <p className="text-center">👀 243</p>
      </div>
    </div>
  );
}

export function getContent(content: any): string {
  if (content && Array.isArray(content.blocks)) {
    const paragraphBlock = content.blocks.find(
      (block: any) => block.type === "paragraph"
    );
    return paragraphBlock ? paragraphBlock.data.text : "";
  }
  return "";
}
export default ProfileBlog;