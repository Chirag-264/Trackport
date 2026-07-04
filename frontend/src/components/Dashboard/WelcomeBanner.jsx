export default function WelcomeBanner({ user }) {
  return (
    <div className="flex items-start justify-between">

      <div>

        <h1 className="text-5xl font-bold tracking-tight">
          Welcome back, {user.name}! 👋
        </h1>

        <p className="text-muted-foreground text-lg mt-3">
          Let's build, learn and ship. You've got this! 🚀
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div
          className="
          h-12
          w-80
          rounded-2xl
          bg-white/70
          border
          flex
          items-center
          px-4
          text-muted-foreground
          "
        >
          Search projects, tasks...
        </div>

        <div
          className="
          h-12
          w-12
          rounded-2xl
          bg-white/70
          border
          "
        />

        <div
          className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-white/70
          border
          px-4
          h-12
          "
        >
          <div
            className="
            h-8
            w-8
            rounded-full
            bg-violet-500
            text-white
            flex
            items-center
            justify-center
            text-sm
            font-bold
            "
          >
            C
          </div>

          <span className="font-medium">
            Chirag
          </span>

        </div>

      </div>

    </div>
  );
}