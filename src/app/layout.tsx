import { Unbounded } from 'next/font/google';
import './globals.css';

export const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-unbounded',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={unbounded.className}>
        {children}
      </body>
    </html>
  );
}