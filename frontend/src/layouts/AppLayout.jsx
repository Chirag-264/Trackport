import Sidebar from "@/components/Sidebar.jsx";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div
      className="
        h-screen
        overflow-hidden

        bg-[url('/mountainLight.jpg')]
        dark:bg-[url('/starsDark.jpg')]

        bg-cover
        bg-center
        bg-no-repeat

        p-3
      "
    >
      <div
        className="
          flex
          h-full

          rounded-[36px]

          bg-white/10
          dark:bg-black/15

          backdrop-blur-md
          dark:backdrop-blur-sm
          border
          border-white/20

          overflow-hidden
        "
      >
        <Sidebar
          className="
            w-64

            bg-white/35
            dark:bg-black/20
            backdrop-blur-md

            border-r
            border-white/15
          "
        />

        <main
          className="
            flex-1
            overflow-y-auto
            min-h-0
            p-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;