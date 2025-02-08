
const links = [
    { id: 1, name: "Help", url: "#" },
    { id: 2, name: "Status", url: "#" },
    { id: 3, name: "About", url: "#" },
    { id: 4, name: "Careers", url: "#" },
    { id: 5, name: "Press", url: "#" },
    { id: 6, name: "Blog", url: "#" },
    { id: 7, name: "Privacy", url: "#" },
    { id: 8, name: "Terms", url: "#" },
    { id: 9, name: "Text to Speech", url: "#" },
    { id: 10, name: "Teams", url: "#" }
  ];
  
function Footer() {
  return (
    <div className="w-full h-20 px-5 border-t list-none flex flex-row flex-wrap items-center justify-center space-x-3 font-[HostGrotesk] text-sm text-gray-600 bg-orange-50">
        {links.map(link => <li key={link.id}>
            {link.name}
        </li>) }
    </div>
  )
}

export default Footer