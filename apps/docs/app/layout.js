import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
    title: "Create Turborepo",
    description: "Generated by create turbo",
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className={inter.className}>{children}</body>
    </html>);
}
