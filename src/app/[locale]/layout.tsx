import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import LayoutShell from '@/components/LayoutShell';
import '@/styles/globals.css';
import { getMessages } from 'next-intl/server';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>; 
}) {
  const resolvedParams = await params; 
  const { locale } = resolvedParams;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen bg-[#FFF5E1]">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LayoutShell>{children}</LayoutShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
