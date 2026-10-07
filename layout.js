import "./globals.css";
import { Noto_Naskh_Arabic } from "next/font/google";
const f = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "700"] });
export const metadata = { title: "ویڈیو اسٹوڈیو", description: "AI Video Generator" };
export default function RootLayout({ children }) {
  return (<html lang="ur" dir="rtl"><body className={`${f.className} min-h-screen`}>{children}</body></html>);
}
