import Sidebar from "@/components/Sidebar.jsx";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="h-screen bg-slate-100 p-3">

      <div className="flex h-full gap-3">

        <Sidebar />

        <main
          className="
          flex-1
          overflow-y-auto
          rounded-[36px]
          bg-[url('/mountainLight.jpg')]
          bg-cover
          bg-center
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