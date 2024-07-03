import { type ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import env from '@/lib/env';
import FrontLayout from '@/components/layouts/FrontLayout';

const TermsOfServices: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  return (
    <FrontLayout>
      <div className="terms_of_services mx-auto p-6 max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-4">{t('terms_of_service.title')}</h1>
        <p className="text-center mb-6">{t('terms_of_service.last_updated')}</p>
        <p className="mb-4">{t('terms_of_service.welcome')}</p>
        <p className="mb-6">{t('terms_of_service.introduction')}</p>

        {Object.entries(t('terms_of_service', { returnObjects: true }))
          .filter(([key]) => key !== 'title' && key !== 'last_updated' && key !== 'welcome' && key !== 'introduction')
          .map(([key, value]:any) => (
            <div key={key} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{value.heading}</h2>
              <p>{value.content}</p>
            </div>
          ))}
      </div>
    </FrontLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  if (env.hideLandingPage) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: true,
      },
    };
  }

  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
};

TermsOfServices.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default TermsOfServices;
