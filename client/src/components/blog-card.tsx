import { useNavigate } from "react-router-dom";
import Avatar from "./avatar";

type Blog = {
  id: string;
  title: string;
  content: any;
  time: string;
  author: string;
};

function BlogCard({ blog }: { blog: Blog }) {
  const content = getContent(blog.content)
  const navigate = useNavigate()
  return (
    <div className="py-8 flex flex-col space-y-2 border-b border-slate-200 dark:border-slate-700 font-[HostGrotesk]">
      <div className="flex flex-row space-x-2">
        <Avatar label={blog.author} />
        <p>by {blog.author}</p>
      </div>
      <div className="w-full flex flex-row space-x-5 cursor-pointer" onClick={() => {
        navigate(`/blogs/${blog.id}`)
      }}>
        <div className="mt-2 flex flex-col space-y-2">
          <p className="text-2xl font-extrabold text-wrap">{blog.title}</p>
          <p className="text-slate-500 font-medium">
            {content.length >= 130 ? content.slice(0,130)+"...":content}
          </p>
        </div>
        <div className="w-0 md:min-w-36 max-w-26"></div>
      </div>
      <div className="mt-2 flex flex-row space-x-2 text-center text-slate-500 font-medium">
        <p className="text-center">✨ {formatTime(blog.time)}</p>
        <p className="text-center">👋🏼 5.4k</p>
        <p className="text-center">👀 243</p>
      </div>
    </div>
  );
}

const formatTime = (timestamp: string | number | Date): string => {
  const now = new Date();
  const givenTime = new Date(timestamp);
  const diffMs = now.getTime() - givenTime.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (days <= 3) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else {
    const date = givenTime.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[givenTime.getMonth()];
    const year = givenTime.getFullYear();

    const getOrdinal = (d: number) => {
      if (d > 3 && d < 21) return "th";
      const lastDigit = d % 10;
      return ["st", "nd", "rd"][lastDigit - 1] || "th";
    };

    return `${date}${getOrdinal(date)} ${month}, ${year}`;
  }
};

function getContent(content: any): string {
  if (content && Array.isArray(content.blocks)) {
    const paragraphBlock = content.blocks.find((block: any) => block.type === "paragraph");
    return paragraphBlock ? paragraphBlock.data.text : "";
  }
  return ""; 
}
export default BlogCard;
