import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import '@/styles/globals.css';
import LayoutShell from '../../components/LayoutShell';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = await params;

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