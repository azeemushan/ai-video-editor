import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import axios from 'axios';
import env from '@/lib/env';
import Link from 'next/link';

function ManageSubscription() {
  const { t } = useTranslation('common');
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const { data } = useSession();
  const id = data?.user?.id;

  useEffect(() => {
    if (id) {
      const fetchSubscription = async () => {
        try {
          const res = await axios.post('/api/subscriptions/subscription', {
            userId: id,
            status: true,
          });
          const activeSubscription = res.data.data; // assuming the first one is the active subscription
          setCurrentSubscription(activeSubscription);
        } catch (error) {
          console.error('Error fetching current subscription:', error);
        }
      };
      fetchSubscription();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      
      const response = await axios.post('/api/subscriptions/cancel', {
        subscriptionId: currentSubscription.stripe_subscriptionId,
      });
      if (response.status === 200) {
      
        alert('Subscription cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  

  const upgradeButton = () => {
    return (
      <>
      <Link href="/dashboard/manageSubscription/upgradeSubscription">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {t('upgrade')}
        </button>
      </Link>
      <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
      {t('delete')}
    </button>
    </>
    );
  };

  const renderUsage = () => {
    if (!currentSubscription) return null;

    const { subscriptionPackage, subscriptionUsage } = currentSubscription;
    const usage = subscriptionUsage[0];

    return (
      <div className="mt-4 bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">
          {t('current-package')}: {subscriptionPackage.subscription_type}
        </h3>
        <p>{t('upload-limit')}: {usage.upload_count}/{subscriptionPackage.upload_video_limit}</p>
        <p>{t('generate-clips')}: {usage.clip_count}/{subscriptionPackage.generate_clips}</p>
        <p>{t('total-minutes')}: {usage.min}/{subscriptionPackage.total_min}</p>
      </div>
    );
  };

  useEffect(()=>{
    console.log(currentSubscription)

  },[currentSubscription])

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 shadow-md rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">{t('manage-subscription-card')}</h2>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">{currentSubscription?.subscriptionPackage?.subscription_type}</span>
          {upgradeButton()}
        </div>
      </div>
      {renderUsage()}
    </div>
  );
}

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

export default ManageSubscription;
