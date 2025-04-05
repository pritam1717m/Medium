interface Link {
  id: number;
  value: string;
}

type Links = Array<Link>;

export default function Link({ links }: { links: Links }) {
  function trimURL(url: string) {
    return url.replace(/^https?:\/\//, '').replace(/(\.[^./]*)\/.*/, '$1');
  }

  return links
    ? links.map((link) => {
        const url = trimURL(link.value)
        return (
          <div className="flex space-x-2 text-green-600 items-center" key={link.id}>
            <img
              src={`https://img.logo.dev/${url}?token=${import.meta.env.VITE_LOGO_SECRET}`}
              alt="logo"
              className="w-5 h-5 dark:bg-white rounded-full dark:ring-1 ring-green-700"
            />
            <a href={link.value}>{link.value}</a>
          </div>
        );
      })
    : " ";
}
