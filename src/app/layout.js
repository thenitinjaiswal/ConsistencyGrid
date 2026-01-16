import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "ConsistencyGrid",
  description: "Your life in weeks as your wallpaper",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
