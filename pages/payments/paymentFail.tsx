import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import env from '@/lib/env';

const PaymentFailed = () => {
    const { t } = useTranslation('common');
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <FaTimesCircle className="text-red-500 text-6xl mx-auto" />
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">{t("pay-fail")}</h1>
        <p className="text-gray-600 mt-2">
          {t("pay-fail-message")}
        </p>
        <Link href="/">
          <button className="mt-6 px-6 py-2 bg-red-500 text-white rounded-md text-lg hover:bg-red-600 transition duration-300">
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

PaymentFailed.getLayout = function getLayout(page) {
    return <>{page}</>;
};

export default PaymentFailed;
