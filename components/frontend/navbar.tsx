import { useState } from 'react';
import { Dialog, DialogPanel, PopoverGroup } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Ed from '@/public/Ed.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const { status } = useSession();

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/10 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="font-display flex items-center p-1.5">
            <Image src={Ed} className="w-6" alt="" />
            <span className="ml-2 block font-semibold text-xl">
              {t('Editur')}
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a
            href="#"
            className="text-sm font-semibold leading-6 text-neutral-600 hover:text-neutral-900"
          >
            {t('features')}
          </a>
          <Link
            href="/pricing"
            className="text-sm font-semibold leading-6 text-neutral-600 hover:text-neutral-900"
          >
            {t('pricing')}
          </Link>

          <Link
            href="#contact_us"
            className="text-sm font-semibold leading-6 text-neutral-600 hover:text-neutral-900"
          >
            {t('contact-us')}
          </Link>
          
          {status === 'authenticated' && (
            <Link
              href="/dashboard"
              className="text-sm font-semibold leading-6 text-neutral-600 hover:text-neutral-900"
            >
              {t('Dashboard')}
            </Link>
          )}
        </PopoverGroup>

        <div className="hidden gap-x-7 lg:flex lg:flex-1 lg:items-center lg:justify-end">
          {status !== 'authenticated' && (
            <>
              <Link
                href="/auth/join"
                className="rounded-full bg-violet-600 px-8 py-0.5 text-xs font-semibold leading-6 text-white"
              >
                {t('get-started')}{' '}
                <span className="text-[11px] opacity-90">
                  {' '}
                  {t('videos-free')}
                </span>
              </Link>
              <Link
                href="/auth/login"
                className="text-sm font-semibold leading-6 text-neutral-700 hover:text-neutral-900"
              >
                {t('login')} <span aria-hidden="true">&rarr;</span>
              </Link>
            </>
          )}
        </div>
      </nav>
      <Dialog
        className="lg:hidden z-50"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="font-display flex items-center p-1.5">
              <Image src={Ed} className="w-6" alt="" />
              <span className="ml-2 block font-semibold text-xl">
                {t('Editur')}
              </span>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-neutral-600 hover:text-neutral-900"
                >
                  {t('features')}
                </a>
                <Link
                  href="/pricing"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {t('pricing')}
                </Link>
                <Link
                  href="#contact_us"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {t('contact-us')}
                </Link>
                {status === 'authenticated' && (
                  <Link
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t('Dashboard')}
                  </Link>
                )}
              </div>
              <div className="py-6">
                {status !== 'authenticated' && (
                  <Link
                    href="/auth/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t('login')} <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
