export default function SplitLayout({ main, sidebar }) {
  return (
    <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0">{main}</div>
      <div className="flex min-w-0 flex-col gap-4">{sidebar}</div>
    </section>
  );
}
