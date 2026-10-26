const SkeletonAsideBar = () => {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-dvh bg-white border-r border-gray-100 shadow-sm animate-pulse">
      {/* Logo skeleton */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100">
        {/* Icon "M" */}
        <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3 w-20 rounded bg-gray-200" />
          <div className="h-2 w-28 rounded bg-gray-200" />
        </div>
        {/* Badge */}
        <div className="h-4 w-16 rounded-md bg-gray-200 ml-auto" />
      </div>

      {/* Nav Items skeleton */}
      <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1">
        {/* Active item */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f0f4ff]">
          <div className="w-4 h-4 rounded bg-gray-200 shrink-0" />
          <div className="h-3 flex-1 rounded bg-gray-200" />
          <div className="w-1 h-5 rounded-r-full bg-blue-200" />
        </div>

        {/* Item with badge */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-4 h-4 rounded bg-gray-200 shrink-0" />
          <div className="h-3 flex-1 rounded bg-gray-200" />
          <div className="h-5 w-8 rounded-md bg-gray-200" />
        </div>

        {/* Regular items */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <div className="w-4 h-4 rounded bg-gray-200 shrink-0" />
            <div
              className="h-3 rounded bg-gray-200"
              style={{ width: `${55 + i * 10}%` }}
            />
          </div>
        ))}
      </nav>

      {/* Sign out skeleton */}
      <div className="px-2 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-4 h-4 rounded bg-gray-200 shrink-0" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </aside>
  );
};

export default SkeletonAsideBar;
