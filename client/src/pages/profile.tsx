import AppBar from "@/components/appbar";
import ProfileLeft from "@/components/profile-left";
import ProfileRight from "@/components/profile-right";

const Profile = () => {
  return (
    <div
      className="h-screen w-screen flex flex-col sm:overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <AppBar />
      <div className="xl:px-20 w-full flex flex-row justify-evenly">
        <div className="min-w-full md:w-2/3 lg:min-w-[728px] lg:max-w-[728px]">  
            <ProfileLeft />
        </div>
        <div className=" max-w-0 md: w-1/3 lg:min-w-96 lg:max-w-52 hidden md:block">
          <ProfileRight />
        </div>
      </div>
    </div>
  );
};

export default Profile;