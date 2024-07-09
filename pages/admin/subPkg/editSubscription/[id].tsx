import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import env from '@/lib/env';
import ConfirmationModal from '@/components/confirmation'; // Adjust the import path as per your project structure
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';

const EditSubscription: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    price: '',
    uploadVideoLimit: '',
    generateClips: '',
    stripe_priceId: ''
  });

  const [loading, setLoading] = useState(false); // State to manage loading state
  const [showSuccess, setShowSuccess] = useState(false); // State to manage success popup
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage confirmation modal

  useEffect(() => {
    if (id) {
      axios.post(`/api/subscriptionPackages/subPkg`, {
        getSingleSubPkgId: id
      })
        .then(response => {
          setFormData({
            price: response.data.price,
            uploadVideoLimit: response.data.upload_video_limit,
            generateClips: response.data.generate_clips,
            stripe_priceId: response.data.stripe_priceId,
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation modal
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true); // Show loader

      // Perform form submission
      const response = await axios.post('/api/subscriptionPackages/subPkg', {
        ...formData,
        idToUpdateSubPkg: id
      });

      if (response.data.status === 'true') {
        setShowSuccess(true); // Show success popup
        setTimeout(() =>{
           setShowSuccess(false)
           router.push('/admin/subPkg/subscription'); // Redirect after successful submission
          }, 2000); // Hide success popup after 2 seconds
      } else {
        alert('Something went wrong while submitting.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
    } finally {
      setLoading(false); // Hide loader
      setShowConfirmation(false); // Close confirmation modal
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{t('edit-subscription')}</h1>
      <form onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-6 group">
        <input type="hidden" name="stripe_priceId" value={formData.stripe_priceId} />
          <input
            type="text"
            name="price"
            id="price"
            className="block py-3 px-4 w-full text-base text-gray-900 bg-transparent border-b-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.price}
            onChange={handleChange}
            required
          />
          <label
            htmlFor="price"
            className="absolute text-base text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-4 z-10 origin-[0] peer-focus:left-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {t('Price')}
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="uploadVideoLimit"
            id="uploadVideoLimit"
            className="block py-3 px-4 w-full text-base text-gray-900 bg-transparent border-b-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.uploadVideoLimit}
            onChange={handleChange}
            required
          />
          <label
            htmlFor="uploadVideoLimit"
            className="absolute text-base text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-4 z-10 origin-[0] peer-focus:left-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {t('upload-video-limit')}
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="generateClips"
            id="generateClips"
            className="block py-3 px-4 w-full text-base text-gray-900 bg-transparent border-b-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.generateClips}
            onChange={handleChange}
            required
          />
          <label
            htmlFor="generateClips"
            className="absolute text-base text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-4 z-10 origin-[0] peer-focus:left-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {t('generate-clips')}
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-base"
        >
          {t('Submit')}
        </button>
      </form>

          {/* Confirmation Modal for Submit */}
          <ConfirmationModal
        isOpen={showConfirmation}
        title="Confirmation"
        message="Are you sure you want to submit the form?"
        onConfirm={handleConfirmSubmit} // Use handleConfirmSubmit for confirmation
        onCancel={() => setShowConfirmation(false)} // Close modal on cancel
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
          <div className="bg-white text-green-800 text-lg font-semibold px-4 py-2 rounded-md shadow-lg">
            {t('updated-success-message')}
          </div>
        </div>
      )}


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

export default EditSubscription;
