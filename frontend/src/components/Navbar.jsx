import { Moon, Bell } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-18 px-8 flex items-center justify-between border-b bg-white/80 backdrop-blur-md">

      <div>
        <h1 className="text-xl font-semibold">
          TrackPort
        </h1>
      </div>

      <div className="flex items-center gap-4">

        <button
          className="
          p-2
          rounded-full
          hover:bg-gray-100
          transition
        "
        >
          <Moon size={20} />
        </button>

        <button
          className="
          p-2
          rounded-full
          hover:bg-gray-100
          transition
        "
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">

          <div
            className="
            w-10
            h-10
            rounded-full
            bg-violet-500
            text-white
            flex
            items-center
            justify-center
            font-semibold
          "
          >
            C
          </div>

          <div>
            <p className="font-medium">
              Chirag
            </p>

            <p className="text-sm text-gray-500">
              Developer
            </p>
          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;