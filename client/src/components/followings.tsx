import { userAtom } from "@/store/atom/user";
import { useAtomValue } from "jotai";
import Avatar from "./avatar";

interface Following {
  follower: {
    id: string;
    name: string;
    about?: string;
  };
}
type Followings = Array<Following>;

export default function Followings() {
  const user = useAtomValue(userAtom);
  const followings: Followings = user.following ? user.following : [];
  return (
    <div className="py-3 flex flex-col gap-2">
      {followings.length == 0 ? (
        <p className="text-center font-[HostGrotesk] font-semibold text-xl text-gray-800 dark:text-slate-200">Explore stories and follow up to fullfill your interest 😊</p>
      ) : (
        <div>
          <p className="dark:text-slate-300 text-2xl font-semibold mb-3">
            {followings.length} Followings
          </p>
          <div className="flex flex-col gap-3">
            {followings?.map((item, index) => (
              <div className="flex flex-row justify-between" key={index}>
                <div
                  className="flex flex-row gap-3 cursor-pointer"
                  onClick={() => {}}
                >
                  <Avatar
                    label={item.follower.name as string}
                    className="w-14 h-14 text-xl"
                  />
                  <div className="flex flex-col justify-center dark:text-gray-200 text-gray-800">
                    <p className="text-lg font-semibold">
                      {item.follower.name as string}
                    </p>
                    {item.follower.about ? (
                      <p>{item.follower.about as string}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <button className="px-3 py-1 ring-1 ring-green-500 rounded-full font-medium text-green-500">
                    Following
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
