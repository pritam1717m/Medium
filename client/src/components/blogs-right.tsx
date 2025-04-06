
const articles = [
  {
    title: "Why thousands of fake scientific papers are flooding academic journals",
    date: "1d ago",
    author: "The Medium Newsletter"
  },
  {
    title: "Palisades Fire: One Month Later",
    date: "4d ago",
    author: "Phil Schwarz"
  },
  {
    title: "I was working at the Capitol during the Jan. 6 riots. Here’s what I think.",
    date: "Nov 8, 2024",
    author: "Gladys of Monmouth"
  }
];

const topic = ["Data Science", "Writing", "Relationship", "Productivity", "Politics", "Cryptocurrency", "Money"]

function BlogsRight() {
  return (
    <div className="px-10 pt-10 flex flex-col border-l border-slate-200 dark:border-slate-500 font-[HostGrotesk]" >
        <p className="font-semibold dark:text-slate-200">Staff Picks</p>
        <div className="mt-5 flex flex-col gap-5">
          {articles.map(article => <div className="flex flex-col gap-3" key={article.date}>
            <div className="flex flex-row items-center gap-2">
              <p className="flex w-6 h-6 p-2 rounded-full font-bold bg-black text-slate-100 dark:bg-orange-50 dark:text-black items-center justify-center">{article.author.slice(0,1)}</p>
              <p className="text-sm dark:text-slate-300">{article.author}</p>
            </div>
            <div>
              <p className="font-extrabold dark:text-slate-300">{article.title}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{article.date}</p>
            </div>
          </div>)}
        </div>
        <a href="#" className="mt-5 text-slate-500 text-sm font-semibold">See the full list</a>
        <div className="mt-5">
            <p className="font-bold dark:text-slate-200">Recommended topics</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {topic.map(topic => <a href="#" className="px-5 py-2 rounded-full bg-gray-200/50 dark:bg-gray-600 dark:text-slate-300 border-none text-black" key={topic}>{topic}</a>)}
        </div>
    </div>
  );
}

export default BlogsRight;
