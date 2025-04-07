import { userAtom } from "@/store/atom/user";
import { useAtomValue } from "jotai";
import Avatar from "./avatar";

interface Follower {
  following: {
    id: string;
    name: string;
    about?: string;
  };
}
type Followers = Array<Follower>;

export default function Followers() {
  const user = useAtomValue(userAtom);
  const followers: Followers = user.followers ? user.followers : [];
  return (
    <div className="py-3 flex flex-col gap-2">
      {followers.length == 0 ? (
        <p className="text-center font-[HostGrotesk] font-semibold text-xl text-gray-800 dark:text-slate-200">Write More and Reach out to world ✍🏼</p>
      ) : (
        <div>
          <p className="dark:text-slate-300 text-2xl font-semibold mb-3">
            {followers.length} Followers
          </p>
          <div className="flex flex-col gap-3">
            {followers?.map((item, index) => (
              <div className="flex flex-row justify-between" key={index}>
                <div
                  className="flex flex-row gap-3 cursor-pointer"
                  onClick={() => {}}
                >
                  <Avatar
                    label={item.following.name as string}
                    className="w-14 h-14 text-xl"
                  />
                  <div className="flex flex-col justify-center dark:text-gray-200 text-gray-800">
                    <p className="text-lg font-semibold">
                      {item.following.name as string}
                    </p>
                    {item.following.about ? (
                      <p>{item.following.about as string}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <button className="px-3 py-1 ring-1 ring-green-500 rounded-full font-medium text-green-500">
                    Follow Back
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
