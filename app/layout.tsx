import "./globals.css";
import { Header } from "~/src/components/Header/Header";
import Footer from "~/src/components/Footer/footer";
import BackToTopButton from '../src/components/Sections/components/BackToTopButton';
import BottomNavBar from "~/src/components/Sections/components/BottomNavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <BackToTopButton />
        <BottomNavBar />
        <Footer />
      </body>
    </html>
  );
}
