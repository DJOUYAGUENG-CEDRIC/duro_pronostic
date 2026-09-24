import './globals.css';

export const metadata = {
  title: 'Duro Pronostic',
  description: 'Assistant expert en pronostics sportifs',
  icons: { icon: '/duro.jpeg' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
