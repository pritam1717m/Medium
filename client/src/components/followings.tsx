import Avatar from "./avatar";

interface Following {
  follower: {
    id: string;
    name: string;
  };
}

type Followings = Array<Following>;

export default function Followings(followings: { followings: Followings }) {
  console.log(followings.followings);
  return (
    <div className="py-3 flex flex-col gap-2">
      <p className="dark:text-slate-300 font-semibold mb-3">Followings</p>
      <div className="flex flex-col gap-3">
        {followings.followings.map((item, index) => (
          <div className="flex flex-row gap-3" key={index}>
            <Avatar
              label={item.follower.name as string}
              className="w-6 h-6 text-sm"
            />
            <button className="">{item.follower.name as string}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
