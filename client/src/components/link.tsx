interface Link {
  id: number;
  value: string;
}

type Links = Array<Link>;

export default function Link({ links }: { links: Links }) {
  function trimURL(url: string) {
    return url.replace(/(\.[^./]*)\/.*/, "$1");
  }

  console.log(links)
  return links
    ? links.map((link) => {
        const url = trimURL(link.value)
        return (
          <div className="flex space-x-2 text-green-600 items-center">
            <img
              src={`https://logo.clearbit.com/${url}`}
              alt="logo"
              className="w-5 h-5 dark:bg-white rounded-full dark:ring-1 ring-green-700"
            />
            <a href={link.value}>{link.value}</a>
          </div>
        );
      })
    : " ";
}
