import React, { useState } from 'react';
import type { NextPageWithLayout } from 'types';

const ContactUsTable: NextPageWithLayout = () => {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      username: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      message: 'Hello, I have a question. We pass in the formValues object as a argument to this function, then based on the email and password meeting the validation tests, the errors object is populated and returned.',
    },
    {
      id: 2,
      username: 'Jane Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '987-654-3210',
      message: 'Can you help me with my account?',
    },
    // Add more dummy data or fetch from a server
  ]);

  const deleteSubmission = (id) => {
    setSubmissions(submissions.filter((submission) => submission.id !== id));
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <h2 className='mb-3 font-semibold text-2xl'>Users Contacts</h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">Name</th>
            <th scope="col" className="py-3 px-6">Email</th>
            <th scope="col" className="py-3 px-6">Phone</th>
            <th scope="col" className="py-3 px-6">Message</th>
            <th scope="col" className="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="py-4 px-6">{submission.username}</td>
              <td className="py-4 px-6">{submission.email}</td>
              <td className="py-4 px-6">{submission.phoneNumber}</td>
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
    Delete
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

export default ContactUsTable;
