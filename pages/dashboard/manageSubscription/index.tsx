import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import axios from 'axios';

import Link from 'next/link';
import ConfirmationModal from '@/components/confirmation'; // Adjust the import path as per your project structure

function ManageSubscription() {
  const { t } = useTranslation('common');
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to manage modal visibility
  const { data } = useSession();
  const id = data?.user?.id;
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [showSuccess, setShowSuccess] = useState(false); // State to manage success popup

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
      setLoading(true); // Show loader
      const response = await axios.post('/api/subscriptions/cancel', {
        subscriptionId: currentSubscription.stripe_subscriptionId,
      });
      if (response.status === 200) {
        setShowSuccess(true); // Show success popup
        setTimeout(() => setShowSuccess(false), 4000); // Hide success popup after 4 seconds
        setCurrentSubscription(null); // Reset currentSubscription state after deletion
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    } finally {
      setLoading(false); // Hide loader
      setShowDeleteConfirm(false); // Close the confirmation modal after deletion
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
      </>
    );
  };

  const renderUsage = () => {
    if (!currentSubscription) return null;

    const { subscriptionPackage, subscriptionUsage } = currentSubscription;
    const usage = subscriptionUsage[0];

    return (
      <div className="flex justify-between mt-4 bg-white shadow-md rounded-lg p-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {t('current-package')}: {subscriptionPackage.subscription_type}
          </h3>
          <p>{t('upload-limit')}: {usage.upload_count}/{subscriptionPackage.upload_video_limit}</p>
          <p>{t('generate-clips')}: {usage.clip_count}/{subscriptionPackage.generate_clips}</p>
          <p>{t('total-minutes')}: {usage.min}/{subscriptionPackage.total_min}</p>
        </div>
        <div>
          <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            {t('delete')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 shadow-md rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl font-bold mb-4 md:mb-0"><span className="text-lg font-semibold">{currentSubscription?.subscriptionPackage?.subscription_type}</span></h2>
        <div className="flex items-center space-x-4">
          {upgradeButton()}
        </div>
      </div>
      {renderUsage()}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title={t('Confirmation')}
        message={t('Are you sure you want to Delete')}
        onConfirm={handleDelete} // Pass handleDelete function to handle confirmation
        onCancel={() => setShowDeleteConfirm(false)}
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

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white text-green-800 text-lg font-semibold px-4 py-2 rounded shadow-md">
            {t('delete-success-message')}
          </div>
        </div>
      )}
    </div>
  );
}



export default ManageSubscription;
