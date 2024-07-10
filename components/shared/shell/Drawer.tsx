import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Brand from './Brand';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { FaTachometerAlt, FaInbox } from 'react-icons/fa';
import { MdOutlineSubscriptions } from 'react-icons/md';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { MdManageHistory } from "react-icons/md";
import env from '@/lib/env';
import useTheme from 'hooks/useTheme';
import {
  ArrowRightOnRectangleIcon,
  SunIcon,

} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

interface DrawerProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Drawer = ({ sidebarOpen, setSidebarOpen }: DrawerProps) => {
  const { t } = useTranslation('common');
  const { data } = useSession();
  const { toggleTheme } = useTheme();

  const { user_type, name }: any = data?.user || {};

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
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 dark:bg-black px-6 pb-4">
                <Brand />
                {/* mobile */}
                <div className="side_nav_links">
                  <div className="h-full px-3 py-4 overflow-y-auto  dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                      {user_type === 'ADMIN' && (
                        <>
                          <li>
                            <Link href="/admin/dashboard">
                              <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                                <FaTachometerAlt className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />
                                <span className="ms-3">{t('Dashboard')}</span>
                              </div>
                            </Link>
                          </li>

                          <li>
                            <Link href="/admin/subPkg/subscription">
                              <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                                <FaInbox className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                  {t('sub-pkg')}
                                </span>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link href="/admin/subscription">
                              <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                                <MdOutlineSubscriptions className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />

                                <span className="flex-1 ms-3 whitespace-nowrap">
                                  {t('subscriptions')}
                                </span>
                              </div>
                            </Link>
                          </li>

                          <li>
                            <Link href="/admin/contacts">
                              <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                                <MdOutlineSubscriptions className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />

                                <span className="flex-1 ms-3 whitespace-nowrap">
                                  {t('contacts')}
                                </span>
                              </div>
                            </Link>
                          </li>
                        </>
                      )}

                      {user_type === 'USER' && (
                        <>
                          <li>
                            <Link href="/dashboard">
                              <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                                <FaTachometerAlt className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />
                                <span className="ms-3">{t('Dashboard')}</span>
                              </div>
                            </Link>
                          </li>

                          <li>
                            <Link href="/dashboard/manageSubscription">
                              <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                                <MdManageHistory className="w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="ms-3">{t('manage-subscription-card')}</span>
                              </div>
                            </Link>
                          </li>
                        </>
                      )}

                      
                    </ul>
                    
                  </div>
                </div>
                <div className='border border-gray-300'></div>
                {/* profile */}
                
                
                        <div className="flex items-center gap-x-4 lg:gap-x-6 justify-end">
                          <div className="dropdown dropdown-end">
                            <div
                              className="flex items-center cursor-pointer"
                              tabIndex={0}
                            >
                              <span className=" lg:flex lg:items-center">
                                <button
                                  className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50"
                                  aria-hidden="true"
                                >
                                  {name}
                                </button>
                                <ChevronDownIcon
                                  className="ml-2 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 border rounded w-40 space-y-1"
                            >
                          

                              {env.darkModeEnabled && (
                                <li>
                                  <button
                                    className="block px-2 py-1 text-sm leading-6 text-gray-900 dark:text-gray-50 cursor-pointer"
                                    type="button"
                                    onClick={toggleTheme}
                                  >
                                    <div className="flex items-center">
                                      <SunIcon className="w-5 h-5 mr-1" />{' '}
                                      {t('switch-theme')}
                                    </div>
                                  </button>
                                </li>
                              )}

                              <li>
                                <button
                                  className="block px-2 py-1 text-sm leading-6 text-gray-900 dark:text-gray-50 cursor-pointer"
                                  type="button"
                                  onClick={() => signOut()}
                                >
                                  <div className="flex items-center">
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />{' '}
                                    {t('logout')}
                                  </div>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                
                      {/* profile */}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col bg-gray-100 gap-y-5 overflow-y-auto border-r border-gray-200">
          <Brand />
          {/* desktop */}
          <div className="side_nav_links">
            <div className="h-full px-3 py-4 overflow-y-auto  dark:bg-gray-800">
              <ul className="space-y-2 font-medium">
                {user_type === 'ADMIN' && (
                  <>
                    <li>
                      <Link href="/admin/dashboard">
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                          <FaTachometerAlt className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />
                          <span className="ms-3">{t('Dashboard')}</span>
                        </div>
                      </Link>
                    </li>

                    <li>
                      <Link href="/admin/subPkg/subscription">
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                          <FaInbox className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />
                          <span className="flex-1 ms-3 whitespace-nowrap">
                            {t('sub-pkg')}
                          </span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/subscription">
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                          <MdOutlineSubscriptions className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />

                          <span className="flex-1 ms-3 whitespace-nowrap">
                            {t('subscriptions')}
                          </span>
                        </div>
                      </Link>
                    </li>

                    <li>
                      <Link href="/admin/contacts">
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                          <MdOutlineSubscriptions className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />

                          <span className="flex-1 ms-3 whitespace-nowrap">
                            {t('contacts')}
                          </span>
                        </div>
                      </Link>
                    </li>
                  </>
                )}

                {user_type === 'USER' && (
                  <>
                    <li>
                      <Link href="/dashboard">
                        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                          <FaTachometerAlt className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />
                          <span className="ms-3">{t('Dashboard')}</span>
                        </div>
                      </Link>
                    </li>

                    
                    <li>
                            <Link href="/dashboard/manageSubscription">
                              <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transform transition-transform hover:scale-105 shadow-md">
                                <MdManageHistory className="bg-[#976FE0] text-white p-1 w-6 h-6 rounded shadow-lg  " />
                                <span className="ms-3">{t('manage-subscription-card')}</span>
                              </div>
                            </Link>
                          </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
