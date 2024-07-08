import { useTranslation } from 'next-i18next';
import React, { useState, useEffect } from 'react';
import type { NextPageWithLayout } from 'types';
import toast from 'react-hot-toast';
import env from '@/lib/env';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


const ContactUsTable: NextPageWithLayout = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
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

  const deleteSubmission = async (id:any) => {
    
    try {
      const response = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.status === 'true') {
        toast.success('Contact Deleted successfully')
        setSubmissions(submissions.filter((submission) => submission.id !== id));
      } else {
        console.error(data.msg);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
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
                  onClick={() => deleteSubmission(submission.id)}
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
