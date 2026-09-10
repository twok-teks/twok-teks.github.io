import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./secondary.css";
import "./portfolio-polish.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CloneChat } from "@/components/clone-chat";
import { site } from "@/content/site";

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});
const themeScript = `(function(){var p='system';try{var s=localStorage.getItem('portfolio-theme');if(['light','dark','system'].includes(s))p=s}catch(e){}var t=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;var d=document.documentElement;d.dataset.preference=p;d.dataset.theme=t;d.style.colorScheme=t;var m=document.createElement('meta');m.name='theme-color';m.id='portfolio-theme-color';m.content=t==='dark'?'#141517':'#fafaf9';document.head.appendChild(m)})()`;

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url || "http://localhost:3000"),
  robots: {
    index: site.configured && Boolean(site.url),
    follow: site.configured && Boolean(site.url),
  },
  openGraph: {
    type: "website",
    siteName: `${site.name} · Engineering portfolio`,
    title: "Practical software. Thoughtful engineering.",
    description: site.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
    images: ["/opengraph-image"],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CloneChat />
        {site.configured && site.url && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: site.name,
                alternateName: site.nickname,
                jobTitle: site.role,
                ...(site.url ? { url: site.url } : {}),
                sameAs: [site.github, site.linkedin].filter(Boolean),
              }).replace(/</g, "\\u003c"),
            }}
          />
        )}
      </body>
    </html>
  );
}
