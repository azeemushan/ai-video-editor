import { useTranslation } from 'next-i18next';
import React, { useState, useEffect } from 'react';
import type { NextPageWithLayout } from 'types';
import toast from 'react-hot-toast';
import env from '@/lib/env';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfirmationModal from '@/components/confirmation'; // Adjust the import path as per your project structure

const ContactUsTable: NextPageWithLayout = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to manage modal visibility
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const { t } = useTranslation('common');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/admin/contacts');
        const data = await response.json();

        if (data.status === 'true') {
          setSubmissions(data.data);
        } else {
          console.error(data.msg);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const deleteSubmission = async (id: any) => {
    try {
      setLoading(true); // Show loader
      const response = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.status === 'true') {
        toast.success(t('delete-success-message'));
        setSubmissions(submissions.filter((submission) => submission.id !== id));
      } else {
        console.error(data.msg);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setLoading(false); // Hide loader
      setShowDeleteConfirm(false); // Close confirmation modal
    }
  };

  // Function to handle delete button click
  const handleDeleteClick = (id: any) => {
    setSelectedSubmissionId(id);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <h2 className="mb-3 font-semibold text-2xl">{t('contacts')}</h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">{t('name')}</th>
            <th scope="col" className="py-3 px-6">{t('email')}</th>
            <th scope="col" className="py-3 px-6">{t('phone-number')}</th>
            <th scope="col" className="py-3 px-6">{t('message')}</th>
            <th scope="col" className="py-3 px-6">{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="py-4 px-6">{submission.name}</td>
              <td className="py-4 px-6">{submission.email}</td>
              <td className="py-4 px-6">{submission.phone}</td>
              <td className="py-4 px-6 w-[30rem]">{submission.message}</td>
              <td className="py-4 px-6">
                <button
                  onClick={() => handleDeleteClick(submission.id)}
                  className="relative py-2 text-red-500 hover:text-red-900 group"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="1.5em"
                    width="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                  </svg>
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('delete')}
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title={t('confirmation')}
        message={t('are-you-want-to-delete')}
        onConfirm={() => deleteSubmission(selectedSubmissionId)} // Use deleteSubmission for confirmation
        onCancel={() => setShowDeleteConfirm(false)} // Close modal on cancel
      />

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="absolute">
          <svg className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
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

export default ContactUsTable;
