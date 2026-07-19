export const metadata = {
  title: 'AI Multiverse Photo Styler',
  description: 'Transform photos into unique fictional styles with backstories',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f9fafb' }}>
        {children}
      </body>
    </html>
  );
}