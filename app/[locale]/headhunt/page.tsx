import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import RecruitmentPageContent from './recruitment-page-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'app.headhunt.page' });
  
  return {
    title: t('headhunt__simulator'),
    description: t('history__stats'),
  };
}

export default function RecruitmentPage() {
  return <RecruitmentPageContent />;
}
