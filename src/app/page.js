"use client";
import Navbar from "@/components/layout/Navbar";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf1]">
      {/* Temporary Test Button
      <div className="bg-red-100 p-4 text-center">
        <button
          onClick={() => {
            if (window.Android) {
              window.Android.saveWallpaperUrl(
                "https://picsum.photos/1080/1920"
              );
            } else {
              alert("Android app me open karo");
            }
          }}
        >
          Send URL to Android
        </button>

      </div> */}

      {/* Top Navbar */}
      <Navbar rightLinkText="Log in" rightLinkHref="/login" />


      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Your life in <span className="text-orange-500">weeks</span>
          <br />
          as your wallpaper
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm text-gray-600 sm:text-base">
          Generate a personalized calendar wallpaper showing your life progress.
          Auto-updates daily so every morning reminds you to make today count.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50">
            <span className="text-lg">G</span>
            Continue with Google
          </button>

          <button className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
            Sign up free →
          </button>
        </div>

        {/* Phone Preview Placeholder */}
        <div className="mt-12 flex justify-center">
          <div className="h-[360px] w-[200px] rounded-[32px] border border-gray-200 bg-white shadow-xl" />
        </div>
      </section>

      {/* Auto Update Card */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Auto-Update Wallpaper
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
            Get a unique URL that always shows today’s progress. Use MacroDroid
            on Android to automatically update your wallpaper every morning.
          </p>

          <button className="mt-6 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
            Create Your Calendar →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-10 text-center text-xs text-gray-500">
        ConsistencyGrid • Make every week count
      </footer>
    </main>
  );
}
