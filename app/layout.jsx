import './globals.css';

export const metadata = {
  title: 'Duro Pronostic',
  description: 'Assistant expert en pronostics sportifs',
  icons: { icon: '/duro.jpeg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
