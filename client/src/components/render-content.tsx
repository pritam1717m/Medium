import { userAtom } from "@/store/atom/user";
import { useAtomValue } from "jotai";
import Avatar from "./avatar";
import { formatTime } from "@/lib/getTime";
import { BookmarkPlus, CircleArrowDown, CircleArrowUp, Disc, Ellipsis, MessageCircleMore, Share, } from "lucide-react";

type Block = {
  id: string;
  type: string;
  data: any;
};

type Content = {
  blocks: Block[];
};

const RenderContent = ({
  content,
  title,
  time,
}: {
  content: Content;
  title: string;
  time: string;
}) => {
  if (!content || !content.blocks) return null;
  const user = useAtomValue(userAtom);
  return (
    <div className="max-w-[350px] lg:max-w-[700px]">
      <div className="flex flex-col justify-center">
        <p className="text-[42px] font-[HostGrotesk] font-extrabold dark:text-slate-200 leading-snug text-justify">
          {title}
        </p>
        <div className="my-10 flex items-center gap-3">
          <Avatar label={user.name} className="p-7 text-4xl" />
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <p className="text-lg">{user.name}</p>
              <span>.</span>
              <p>Follow</p>
            </div>
            <div>{formatTime(time)}</div>
          </div>
        </div>
        <div className="mb-5 flex flex-row justify-between border-t border-b py-4">
          <div className="flex flex-row justify-center items-center gap-10">
            <button><CircleArrowUp /></button>
            <button><CircleArrowDown /></button>
            <button><MessageCircleMore /></button>
          </div>
          <div className="flex flex-row justify-center items-center gap-10">
            <BookmarkPlus />
            <Disc />
            <Share />
            <Ellipsis />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-5 text-justify">
        {content.blocks.map((block) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p
                  key={block.id}
                  className="font-[Helvetica] font-medium text-lg text-slate-800 dark:text-gray-200 leading-7"
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;{block.data.text}
                </p>
              );

            case "header":
              const headingLevel = block.data.level;
              return (
                <div
                  key={block.id}
                  className="text-slate-800 dark:text-slate-200"
                >
                  {headingLevel === 1 && (
                    <h1 className="text-2xl font-bold leading-tight">
                      {block.data.text}
                    </h1>
                  )}
                  {headingLevel === 2 && (
                    <h2 className="text-xl font-semibold leading-snug">
                      {block.data.text}
                    </h2>
                  )}
                  {headingLevel === 3 && (
                    <h3 className="text-lg font-medium leading-normal">
                      {block.data.text}
                    </h3>
                  )}
                  {headingLevel === 4 && (
                    <h4 className="text-md font-medium leading-relaxed">
                      {block.data.text}
                    </h4>
                  )}
                  {headingLevel === 5 && (
                    <h5 className="text-sm font-semibold leading-loose">
                      {block.data.text}
                    </h5>
                  )}
                  {headingLevel === 6 && (
                    <h6 className="text-xs font-semibold tracking-wide">
                      {block.data.text}
                    </h6>
                  )}
                </div>
              );

            case "table":
              return (
                <div key={block.id} className="overflow-x-auto">
                  <table className="table-auto border-collapse border border-gray-300 w-full">
                    <tbody>
                      {block.data.content.map(
                        (row: string[], rowIndex: number) => (
                          <tr
                            key={rowIndex}
                            className={
                              block.data.withHeadings && rowIndex === 0
                                ? "bg-gray-200 dark:bg-gray-800 dark:text-slate-300 font-bold"
                                : ""
                            }
                          >
                            {row.map((cell: string, cellIndex: number) => (
                              <td
                                key={cellIndex}
                                className="border border-gray-300 dark:border-gray-400 px-4 py-2"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              );

            case "list":
              return (
                <div key={block.id} className="mb-4">
                  {block.data.style === "ordered" ? (
                    <ol className="list-decimal pl-10">
                      {block.data.items.map(
                        (item: { content: string }, index: number) => (
                          <li
                            key={index}
                            className="mb-1 text-lg font-[Helvetica] text-slate-800 dark:text-gray-200"
                          >
                            {item.content}
                          </li>
                        )
                      )}
                    </ol>
                  ) : block.data.style === "checklist" ? (
                    <ul className="pl-6">
                      {block.data.items.map(
                        (
                          item: {
                            content: string;
                            meta: { checked?: boolean };
                          },
                          index: number
                        ) => (
                          <li key={index} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.meta?.checked || false}
                              readOnly
                              className="w-4 h-4"
                            />
                            <span
                              className={
                                item.meta?.checked
                                  ? "line-through dark:text-gray-200"
                                  : ""
                              }
                            >
                              {item.content}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <ul className="list-disc pl-10">
                      {block.data.items.map(
                        (item: { content: string }, index: number) => (
                          <li
                            key={index}
                            className="mb-1 text-lg font-[Helvetica] text-slate-800 dark:text-gray-200"
                          >
                            {item.content}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              );

            case "code":
              return (
                <pre
                  key={block.id}
                  className="bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-white p-4 rounded-md overflow-x-auto"
                >
                  <code className="whitespace-pre-wrap">{block.data.code}</code>
                </pre>
              );

            case "quote":
              return (
                <blockquote
                  key={block.id}
                  className="text-slate-700 dark:text-gray-400 text-lg font-[Helvetica] tracking-wider py-5"
                >
                  <p className="italic">
                    &nbsp;&nbsp;&nbsp;&nbsp;"{block.data.text}"
                  </p>
                  <p className="ml-20">
                    {block.data.caption && (
                      <footer>{block.data.caption}</footer>
                    )}
                  </p>
                </blockquote>
              );

            case "embed":
              return (
                <div
                  key={block.id}
                  className="w-full flex flex-col items-center"
                >
                  <iframe
                    src={block.data.embed}
                    title="Embedded Video"
                    width={700}
                    height={400}
                    allowFullScreen
                  ></iframe>
                  {block.data.caption && (
                    <p className="text-lg py-5 dark:text-gray-300">
                      {block.data.caption}
                    </p>
                  )}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default RenderContent;
