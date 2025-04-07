import { useAtomValue } from "jotai";
import Avatar from "./avatar";
import { userAtom } from "@/store/atom/user";

interface Following {
  follower: {
    id: string;
    name: string;
  };
}

type Followings = Array<Following>;

export default function ProfileFollowings() {
  const user = useAtomValue(userAtom);
  const followings: Followings = user.following ? user.following : [];
  return (
    <div className="py-3 flex flex-col gap-2">
      {followings.length == 0 ? (
        <p className="text-gray-800 dark:text-slate-200">No followings</p>
      ) : (
        <>
          <p className="dark:text-slate-300 font-semibold mb-3">Followings</p>
          <div className="flex flex-col gap-3">
            {followings?.map((item, index) => (
              <div className="flex flex-row gap-3" key={index}>
                <Avatar
                  label={item.follower.name as string}
                  className="w-6 h-6 text-sm"
                />
                <button className="font-medium">
                  {item.follower.name as string}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
