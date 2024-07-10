import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfirmationModal from '@/components/confirmation'; // Adjust the import path as per your project structure
import env from '@/lib/env';
import { Loading } from '@/components/shared';
import toast from 'react-hot-toast';

function ManageSubscription() {
  const { t } = useTranslation('common');
  const { data } = useSession();
  const id = data?.user?.id;
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [subPkges, setSubPkges] = useState<any>([]);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false); // State to manage modal visibility
  const [selectedPriceId, setSelectedPriceId] = useState<string>('');
  const [loading, setLoading] = useState(false); // State to manage loading state
  
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.post('/api/subscriptionPackages/upSubPkg', {
        stripe_priceId: currentSubscription?.stripe_priceId,
      });
      const { data } = res.data;
      setSubPkges(data);
    } catch (error) {
      console.error('Error fetching subscription packages:', error);
    }
  }, [currentSubscription?.stripe_priceId, setSubPkges]);
  const fetchSubscription = useCallback(async () => {
    try {
      const res = await axios.post('/api/subscriptions/subscription', {
        userId: id,
        status: true,
      });
      const activeSubscription = res.data.data;
      setCurrentSubscription(activeSubscription);
    } catch (error) {
      console.error('Error fetching current subscription:', error);
    }
  }, [id, setCurrentSubscription]);

  useEffect(() => {
    if (id) {

      fetchSubscription();
    }
  }, [fetchSubscription, id]);

  useEffect(() => {
    
    if (currentSubscription?.stripe_priceId) {
      fetchData();
    }
  }, [currentSubscription, fetchData]);

  // Function to handle upgrade request
  const handleUpgrade = async (newPriceId: string) => {
    try {
      
      setSelectedPriceId(newPriceId);
      setShowUpgradeConfirm(true); // Show confirmation modal
    } catch (error) {
      console.error('Error initiating upgrade:', error);
      alert('Failed to initiate upgrade');
    } 
  };

  // Function to handle upgrade confirmation
  const handleUpgradeConfirm = async () => {
    try {
      setLoading(true); // Show loader

      // Perform upgrade request
      const upgradeRes = await axios.post('/api/subscriptions/upgrade', {
        subscriptionId: currentSubscription.stripe_subscriptionId,
        newPriceId: selectedPriceId,
      });

      if (upgradeRes.data.status === "true") {
        setCurrentSubscription(upgradeRes.data.data);
        fetchData()
        setLoading(false)

        toast.success('Subscription Upgraded successfully');
        
        
      } else {
        alert('Something went wrong while upgrading.');
      }

      // Fetch updated subscription details after upgrade
      const res = await axios.post('/api/subscriptions/subscription', {
        userId: id,
        status: true,
      });
      setCurrentSubscription(res.data.data);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription');
    } finally {
      setLoading(false); // Hide loader
      setShowUpgradeConfirm(false); // Close confirmation modal
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-5xl mx-auto px-3 text-center text-slate-950">
      <h1 className="text-4xl md:text-5xl font-semibold font-display my-8">{t('available-packages')}</h1>
      <div className="max-w-5xl mx-auto px-3 text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {subPkges.map((pkg: any) => (
            <section key={pkg.id} className="flex-1 p-12 bg-white shadow-xl rounded-2xl transition-transform hover:scale-105">
              <div className="flex-col flex justify-center items-center text-center">
                <h2 className="text-2xl font-semibold mb-4">{pkg.subscription_type} ({pkg.sub_dur_type})</h2>
                <h3 className="text-4xl md:text-5xl font-semibold mt-8 flex items-baseline">
                  <span>{t('dollar-colon')}{pkg.price}</span>
                  <p className="text-lg font-sans font-normal">{t('Monthly')}</p>
                </h3>
                <ul className="flex-1 self-start flex flex-col mt-8 gap-4 w-full">
                  <li className="flex gap-2 items-center text-left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 shrink-0 text-green-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="text-sm font-normal">{t('upload-limit')}: {pkg.upload_video_limit}</p>
                  </li>
                  <li className="flex gap-2 items-center text-left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 shrink-0 text-green-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="text-sm font-normal">{t('generate-clips')}: {pkg.generate_clips}</p>
                  </li>
                  <li className="flex gap-2 items-center text-left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 shrink-0 text-green-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="text-sm font-normal">{t('total-minutes')}: {pkg.total_min}</p>
                  </li>
                </ul>
                <button
                  className="mt-8 w-full px-6 py-3 h-12 bg-green-500 hover:bg-green-700 text-white font-bold rounded-xl relative flex items-center gap-2 justify-center border transition-all duration-300"
                  onClick={() => handleUpgrade(pkg.stripe_priceId)}
                >
                  <span className="text-sm font-semibold whitespace-nowrap">{t('upgrade-plan')}</span>
                </button>
              </div>
            </section>
          ))}
        </div>
        <p className="text-sm font-normal mt-8 text-slate-700">
          {t('need-more')}{' '}
          <a className="text-slate-500 hover:underline" href="https://discord.gg/KcAcHdrSQU">
            {t('lets-talk')}
          </a>
        </p>
      </div>

      {/* Confirmation Modal for Upgrade */}
      <ConfirmationModal
        isOpen={showUpgradeConfirm}
        title="Confirmation"
        message="Are you sure you want to upgrade?"
        onConfirm={handleUpgradeConfirm} // Use handleUpgradeConfirm for confirmation
        onCancel={() => setShowUpgradeConfirm(false)} // Close modal on cancel
      />

      {/* Loader */}
      {loading && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-50">
          <svg className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}

      
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
