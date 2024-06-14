import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Brand from './Brand';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import {  useSession } from 'next-auth/react';

import {
  FaTachometerAlt,
  FaInbox,
  
} from 'react-icons/fa';
import { MdOutlineSubscriptions } from "react-icons/md";

interface DrawerProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Drawer = ({ sidebarOpen, setSidebarOpen }: DrawerProps) => {
  const { t } = useTranslation('common');
  const {data} =  useSession();
    const {user_type}:any  = data?.user || {}
  

  return (
    <>
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600/80" />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">{t('close-sidebar')}</span>
                  <XMarkIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-black px-6 pb-4">
                <Brand />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 ps-6">
          <Brand />
          <div className="side_nav_links">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              {
                user_type ==="ADMIN" &&

              
              <ul className="space-y-2 font-medium">
                <li>
                  <Link href="/admin/dashboard">
                    <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer">
                      <FaTachometerAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                      <span className="ms-3">{t('Dashboard')}</span>
                    </div>
                  </Link>
                </li>
                
                <li>
                  <Link href="/admin/subPkg/subscription">
                    <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer">
                      <FaInbox className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        {t('sub-pkg')}
                      </span>
                      
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/subscription">
                    <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer">
                      <MdOutlineSubscriptions className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                      
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        {t('subscriptions')}
                      </span>
                    </div>
                  </Link>
                </li>
                
              </ul>
              }

 {
                user_type ==="USER" &&

              
              <ul className="space-y-2 font-medium">
                <li>
                  <Link href="/dashboard">
                    <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer">
                      <FaTachometerAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                      <span className="ms-3">{t('Dashboard')}</span>
                    </div>
                  </Link>
                </li>
                
                
               
                
               
              </ul>
              } 
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
