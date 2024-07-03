
import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import EdRm from '@/public/ed_rm_bg.png'

import Navbar from '../frontend/navbar';
// 
interface FrontLayoutProps {
  children: React.ReactNode;
}

const  FrontLayout =({ children }: FrontLayoutProps)  =>{
    const { t } = useTranslation('common');
   
  return (
    <>
       <Head>
        <title>{t('homepage-title-ai')}</title>
        
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="csrf-token" content="YsovHPNZ2tnAHTMiLX5SpDpdsdZOU7QYLpIKEN3r" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="sitemap" content="/sitemap.xml" />

        <link rel="canonical" href="https://www.editur.ai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Editur.ai" />
        <meta
          name="description"
          content={t('homepage-title-ai')}
        />
        <meta
          property="og:description"
          content={t('homepage-title-ai')}
        />
        <meta property="og:image" content="https://www.editur.ai/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FEd.0494cc35.png&w=640&q=75" />
        <meta property="og:url" content="" />
        <meta property="og:locale" content="en" />

      </Head>
      

      

      <Navbar />



        <div className='mt-28'>
      {children}
      </div>
      
      <footer className="bg-neutral-900 px-8 py-16">
        <div className="container mx-auto">
          <div className="mx-auto flex max-w-5xl flex-col justify-between gap-16 md:flex-row">
            <div className="flex flex-col gap-4">
              <Image src={EdRm} className="w-8" alt="" />
              <p className="text-sm text-neutral-400">{t('all-in-one-social-media-tool')}</p>
              <div className="flex items-center gap-4">
                <a target="_blank" rel="noreferrer" href="#">
                  <div>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      className="text-neutral-400 hover:text-neutral-500 text-xl cursor-pointer"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 0 0-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"
                      />
                    </svg>
                  </div>
                </a>
                <a target="_blank" rel="noreferrer" href="#">
                  <div>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      className="text-neutral-400 hover:text-neutral-500 text-xl cursor-pointer"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M960 509.2c0-2.2 0-4.7-.1-7.6-.1-8.1-.3-17.2-.5-26.9-.8-27.9-2.2-55.7-4.4-81.9-3-36.1-7.4-66.2-13.4-88.8a139.52 139.52 0 0 0-98.3-98.5c-28.3-7.6-83.7-12.3-161.7-15.2-37.1-1.4-76.8-2.3-116.5-2.8-13.9-.2-26.8-.3-38.4-.4h-29.4c-11.6.1-24.5.2-38.4.4-39.7.5-79.4 1.4-116.5 2.8-78 3-133.5 7.7-161.7 15.2A139.35 139.35 0 0 0 82.4 304C76.3 326.6 72 356.7 69 392.8c-2.2 26.2-3.6 54-4.4 81.9-.3 9.7-.4 18.8-.5 26.9 0 2.9-.1 5.4-.1 7.6v5.6c0 2.2 0 4.7.1 7.6.1 8.1.3 17.2.5 26.9.8 27.9 2.2 55.7 4.4 81.9 3 36.1 7.4 66.2 13.4 88.8 12.8 47.9 50.4 85.7 98.3 98.5 28.2 7.6 83.7 12.3 161.7 15.2 37.1 1.4 76.8 2.3 116.5 2.8 13.9.2 26.8.3 38.4.4h29.4c11.6-.1 24.5-.2 38.4-.4 39.7-.5 79.4-1.4 116.5-2.8 78-3 133.5-7.7 161.7-15.2 47.9-12.8 85.5-50.5 98.3-98.5 6.1-22.6 10.4-52.7 13.4-88.8 2.2-26.2 3.6-54 4.4-81.9.3-9.7.4-18.8.5-26.9 0-2.9.1-5.4.1-7.6v-5.6zm-72 5.2c0 2.1 0 4.4-.1 7.1-.1 7.8-.3 16.4-.5 25.7-.7 26.6-2.1 53.2-4.2 77.9-2.7 32.2-6.5 58.6-11.2 76.3-6.2 23.1-24.4 41.4-47.4 47.5-21 5.6-73.9 10.1-145.8 12.8-36.4 1.4-75.6 2.3-114.7 2.8-13.7.2-26.4.3-37.8.3h-28.6l-37.8-.3c-39.1-.5-78.2-1.4-114.7-2.8-71.9-2.8-124.9-7.2-145.8-12.8-23-6.2-41.2-24.4-47.4-47.5-4.7-17.7-8.5-44.1-11.2-76.3-2.1-24.7-3.4-51.3-4.2-77.9-.3-9.3-.4-18-.5-25.7 0-2.7-.1-5.1-.1-7.1v-4.8c0-2.1 0-4.4.1-7.1.1-7.8.3-16.4.5-25.7.7-26.6 2.1-53.2 4.2-77.9 2.7-32.2 6.5-58.6 11.2-76.3 6.2-23.1 24.4-41.4 47.4-47.5 21-5.6 73.9-10.1 145.8-12.8 36.4-1.4 75.6-2.3 114.7-2.8 13.7-.2 26.4-.3 37.8-.3h28.6l37.8.3c39.1.5 78.2 1.4 114.7 2.8 71.9 2.8 124.9 7.2 145.8 12.8 23 6.2 41.2 24.4 47.4 47.5 4.7 17.7 8.5 44.1 11.2 76.3 2.1 24.7 3.4 51.3 4.2 77.9.3 9.3.4 18 .5 25.7 0 2.7.1 5.1.1 7.1v4.8zM423 646l232-135-232-133z"
                      />
                    </svg>
                  </div>
                </a>
                <a target="_blank" rel="noreferrer" href="#">
                  <div>
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-400 hover:text-neutral-500 text-xl cursor-pointer"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"></path>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-16 md:flex-row">
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-100">{t('company')}</h3>
                <div className="flex flex-column flex-wrap gap-4 md:flex-col">
                  <Link href="#" className="text-sm text-neutral-400">{t('blog')}</Link>
                  <Link href="#" className="text-sm text-neutral-400">{t('pricing')}</Link>
                  <Link href="/terms-of-services" className="text-sm text-neutral-400">{t('terms-of-service')}</Link>
                  <Link href="/" className="text-sm text-neutral-400">{t('privacy-policy')}</Link>
                  <Link href="/" className="text-sm text-neutral-400">{t('contact-us')}</Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-100">{t('use-cases')}</h3>
                <div className="flex flex-column flex-wrap gap-4 md:flex-col">
                  <p className="text-sm text-neutral-400">{t('video-editors')}</p>
                  <p className="text-sm text-neutral-400">{t('agencies')}</p>
                  <p className="text-sm text-neutral-400">{t('youtubers')}</p>
                  <p className="text-sm text-neutral-400">{t('entrepreneurs')}</p>
                  <p className="text-sm text-neutral-400">{t('podcasters')}</p>
                  <p className="text-sm text-neutral-400">{t('churches')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </>

  );
}





  export default FrontLayout;