import "./globals.css";
import { Header } from "~/src/components/Header/Header";
import Footer from "~/src/components/Footer/footer";
import BackToTopButton from '../src/components/Sections/components/BackToTopButton';

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
        <Footer />
      </body>
    </html>
  );
}
