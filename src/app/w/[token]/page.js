import prisma from "@/lib/prisma";

export default async function PublicWallpaperPage({ params }) {
 const { token } = await params;


  const user = await prisma.user.findUnique({
    where: { publicToken: token },
    include: { settings: true },
  });

  if (!user || !user.settings) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold">Wallpaper not ready</h1>
          <p className="mt-2 text-sm text-gray-300">
            Please open generator and save settings first.
          </p>
        </div>
      </main>
    );
  }

  const s = user.settings;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-[340px] rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
        <h1 className="text-lg font-bold text-orange-400">ConsistencyGrid</h1>

        <p className="mt-2 text-xs text-gray-300">
          Live Wallpaper Preview (Public Link)
        </p>

        {/* ✅ REAL PNG PREVIEW */}
        <img
          src={`/w/${token}/image.png`}
          alt="Wallpaper Preview"
          className="mt-5 w-full rounded-2xl border border-white/10"
        />

        <div className="mt-6 space-y-2 text-sm text-gray-200">
          <p>
            <span className="text-gray-400">DOB:</span>{" "}
            {new Date(s.dob).toDateString()}
          </p>
          <p>
            <span className="text-gray-400">Life Expectancy:</span>{" "}
            {s.lifeExpectancyYears} years
          </p>
          <p>
            <span className="text-gray-400">Show Life Grid:</span>{" "}
            {s.showLifeGrid ? "Yes" : "No"}
          </p>
          <p>
            <span className="text-gray-400">Show Year Grid:</span>{" "}
            {s.showYearGrid ? "Yes" : "No"}
          </p>
          <p>
            <span className="text-gray-400">Goal Enabled:</span>{" "}
            {s.goalEnabled ? "Yes" : "No"}
          </p>

          {s.goalEnabled && (
            <p>
              <span className="text-gray-400">Goal:</span>{" "}
              {s.goalTitle || "My Goal"}
            </p>
          )}
        </div>

        <div className="mt-6 rounded-xl bg-white/5 p-4">
          <p className="text-xs text-gray-300">
            ✅ This preview is coming from <b>/w/{token}/image.png</b>
          </p>
        </div>
      </div>
    </main>
  );
}
