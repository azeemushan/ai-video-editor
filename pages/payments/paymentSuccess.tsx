import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { type ReactElement } from 'react';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import env from '@/lib/env';
import type { NextPageWithLayout } from 'types';

const PaymentSuccess: NextPageWithLayout = () => {
    const { t } = useTranslation('common');
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">{t('pay-success')}</h1>
        <p className="text-gray-600 mt-2">
          {t("pay-complete")}
        </p>
        <Link href="/">
          <button className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md text-lg hover:bg-green-600 transition duration-300">
            {t('go-home')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // Redirect to login page if landing page is disabled
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



PaymentSuccess.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
  };


export default PaymentSuccess;
