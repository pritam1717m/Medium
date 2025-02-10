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
}: {
  content: Content;
  title: string;
}) => {
  if (!content || !content.blocks) return null;

  return (
    <div className="max-w-[350px] lg:max-w-[700px]">
      <p className="text-5xl font-[HostGrotesk] font-extrabold mb-5 dark:text-slate-200">
        {title}
      </p>
      <div className="flex flex-col space-y-5 text-justify">
        {content.blocks.map((block) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p
                  key={block.id}
                  className="font-[georgia] text-xl text-slate-800 dark:text-gray-400 leading-9 tracking-wide"
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;{block.data.text}
                </p>
              );

            case "header":
              const headingLevel = block.data.level;
              return (
                <div
                  key={block.id}
                  className="text-slate-700 dark:text-slate-200"
                >
                  {headingLevel === 1 && (
                    <h1 className="text-3xl font-bold leading-tight">
                      {block.data.text}
                    </h1>
                  )}
                  {headingLevel === 2 && (
                    <h2 className="text-2xl font-semibold leading-snug">
                      {block.data.text}
                    </h2>
                  )}
                  {headingLevel === 3 && (
                    <h3 className="text-xl font-medium leading-normal">
                      {block.data.text}
                    </h3>
                  )}
                  {headingLevel === 4 && (
                    <h4 className="text-lg font-medium leading-relaxed">
                      {block.data.text}
                    </h4>
                  )}
                  {headingLevel === 5 && (
                    <h5 className="text-base font-semibold leading-loose">
                      {block.data.text}
                    </h5>
                  )}
                  {headingLevel === 6 && (
                    <h6 className="text-sm font-semibold tracking-wide">
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
                          <li key={index} className="mb-1">
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
                                  ? "line-through text-gray-500"
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
                          <li key={index} className="mb-1">
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
                <blockquote key={block.id} className="text-slate-700 dark:text-gray-400 text-lg font-[georgia] tracking-wider py-5">
                  <p className="italic">&nbsp;&nbsp;&nbsp;&nbsp;"{block.data.text}"</p>
                  <p className="ml-20">{block.data.caption && <footer>{block.data.caption}</footer>}</p>
                </blockquote>
              );

            case "embed":
              return (
                <div key={block.id} className="w-full flex flex-col items-center">
                  <iframe
                    src={block.data.embed}
                    title="Embedded Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  {block.data.caption && <p className="text-lg py-5 dark:text-gray-300">{block.data.caption}</p>}
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
