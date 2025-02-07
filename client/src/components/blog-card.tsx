import Avatar from "./avatar";

type Blog = {
  author: string;
  title: string;
  description: string;
  date: string;
  views: number;
  comments: number;
  image: string;
};

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <div className="py-8 border-b border-slate-200 font-[HostGrotesk]">
      <div className="flex flex-row space-x-2">
        <Avatar />
        <p>by {blog.author}</p>
      </div>
      <div className="w-full flex flex-row space-x-5">
        <div className="mt-2 flex flex-col">
          <p className="text-2xl font-extrabold text-wrap">{blog.title}</p>
          <p className="text-slate-500 font-medium">{blog.description}</p>
        </div>
        <div className="md:min-w-36 max-w-36">
            image
        </div>
      </div>
      <div className="mt-2 flex flex-row space-x-2 text-center text-slate-500 font-medium">
        <p className="text-center">✨ {blog.date}</p>
        <p className="text-center">👋🏼 {blog.comments}</p>
        <p className="text-center">👀 {blog.views}</p>
      </div>
    </div>
  );
}

export default BlogCard;
