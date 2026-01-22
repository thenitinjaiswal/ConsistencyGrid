import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: {
    default: "ConsistencyGrid - Your Life in Weeks as Your Wallpaper",
    template: "%s | ConsistencyGrid",
  },
  description: "Generate a personalized calendar wallpaper showing your life progress. Auto-updates daily so every morning reminds you to make today count.",
  keywords: ["life calendar", "wallpaper generator", "habit tracker", "productivity", "life visualization", "weekly calendar", "motivation"],
  authors: [{ name: "ConsistencyGrid" }],
  creator: "ConsistencyGrid",
  publisher: "ConsistencyGrid",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://consistencygrid.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ConsistencyGrid",
    title: "ConsistencyGrid - Your Life in Weeks as Your Wallpaper",
    description: "Generate a personalized calendar wallpaper showing your life progress. Auto-updates daily so every morning reminds you to make today count.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ConsistencyGrid - Life Calendar Wallpaper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ConsistencyGrid - Your Life in Weeks as Your Wallpaper",
    description: "Generate a personalized calendar wallpaper showing your life progress. Auto-updates daily.",
    images: ["/og-image.png"],
    creator: "@consistencygrid",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Google Analytics */}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
