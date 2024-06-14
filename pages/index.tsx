import Link from 'next/link';
import { type ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


import env from '@/lib/env';
import azeeem from '../public/azeeem.jpg'
import hasnain from '../public/hasnain.jpg'
import hassan from '../public/hassan.jpg'
import jenny from '../public/jenny.jpg'
import Image from 'next/image';
import FrontLayout from '@/components/layouts/FrontLayout';
import { getSession } from "next-auth/react";

const Home: NextPageWithLayout = ({session}) => {
  const { t } = useTranslation('common');
  console.log(session)
  
  

  return (
    
      
<FrontLayout>
      <main>
        <div className="relative">
          <div className="mt-20 md:mt-0">
            <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className=" lg:px-8  sm-padding-top">
                <div className="flex gap-2 justify-around small-display">
                  <div className="small-center">
                    <h1 className="font-fancy text-4xl font-bold leading-snug tracking-tight text-neutral-800 md:text-7xl lg:leading-none sm-font-size">
                      {t('convert-your')} <br /> <span className="ml-2 text-violet-600 lg:ml-0">{t('long-videos')}</span> {t('into')} <br />
                      <span className="ml-2 text-violet-600 lg:ml-0">{t('engaging-shorts')}</span>
                    </h1>
                    <h2 className="mx-auto mt-4 font-sans text-lg font-semibold text-neutral-500 sm:text-2xl sm:leading-normal lg:mt-6">
                      {t('create-pro-edited')} <span className="block">{t('everything-you-need')}</span>
                    </h2>
                  </div>
                  <div className="sm-video-width flex">
                    <div className="aspect-video video-sm-width overflow-hidden mt-1 rounded bg-neutral-100" style={{ width: '100%' }}>
                      <video
                        src="https://s3.us-east-1.amazonaws.com/remotionlambda-useast1-se782d1snq/renders/6jf0w4247b/out.mp4"
                        autoPlay
                        muted
                        loop
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-2">
                  <a href="/register" className="group flex relative rounded-full bg-violet-600 py-3.5 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
                    <span className="ml-4">{t('get-started')}</span>
                    <span className="ml-2 mr-4 inline-block -translate-y-px rounded-full bg-violet-800 px-3 py-1 text-xs font-medium leading-tight text-white transition-transform group-hover:scale-105">
                      {t('2-videos-free')}
                    </span>
                  </a>
                  <p className="text-xs text-neutral-400">{t('no-credit-card-required')}</p>
                </div>
                <div className="mb-14 mt-20 flex items-center justify-center">
                  <div className="isolate mt-14 items-center space-y-2 md:flex md:-space-x-2 md:space-y-0">
                    <Image className="relative z-30 inline-block h-10 w-10 rounded-full ring-2 ring-white delay-1000 hover:scale-[1200%]" src={azeeem} alt="" />
                    <Image className="relative z-20 inline-block h-10 w-10 rounded-full ring-2 ring-white" src={hasnain} alt="" />
                    <Image className="relative z-10 inline-block h-10 w-10 rounded-full ring-2 ring-white" src={hassan} alt="" />
                    <Image className="relative z-0 inline-block h-10 w-10 rounded-full ring-2 ring-white" src={jenny} alt="" />
                    <div className="text-sm text-neutral-500 md:pl-6">{t('creators-have-repurposed')}</div>
                  </div>
                </div>
                <div className="relative w-11/12 m-auto">
                  <div className="relative z-10 mx-auto">
                    <div className="col-span-2 rounded-md border-2 border-emerald-500 bg-gradient-to-tr from-emerald-500 via-emerald-600 to-green-600 pl-1 pt-1">
                      <div className="relative h-full text-center overflow-hidden rounded-br rounded-tl-lg bg-white px-5 py-5">
                        <h3 className="bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-600 bg-clip-text text-xl font-semibold text-transparent">
                          {t('viral-clips')}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                          {t('perfect-to-share')}
                        </p>
                        <div className="relative inset-y-0 mt-4 h-64">
                          <div className="absolute flex w-[200%] gap-x-4">
                            <div className="aspect-video rounded">
                              <video
                                className="h-64"
                                src="https://s3.us-east-1.amazonaws.com/remotionlambda-useast1-se782d1snq/renders/yrweub509u/out.mp4"
                                autoPlay
                                muted
                                loop
                              />
                            </div>
                            <div className="aspect-[9/16] rounded">
                              <video
                                className="h-64"
                                src="https://s3.us-east-1.amazonaws.com/remotionlambda-useast1-se782d1snq/renders/oiix1l1v2z/out.mp4"
                                autoPlay
                                muted
                                loop
                              />
                            </div>
                            <div className="aspect-video rounded">
                              <video
                                className="h-64"
                                src="https://s3.us-east-1.amazonaws.com/remotionlambda-useast1-se782d1snq/renders/6jf0w4247b/out.mp4"
                                autoPlay
                                muted
                                loop
                              />
                            </div>
                            <div className="aspect-[9/16] rounded">
                              <video
                                className="h-64"
                                src="https://s3.us-east-1.amazonaws.com/remotionlambda-useast1-se782d1snq/renders/2xmr6mc8vq/out.mp4"
                                autoPlay
                                muted
                                loop
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-0">
              <div className="bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <h2 className="mb-10 text-center text-lg font-semibold leading-8 text-neutral-900">
                    {t('some-awesome-marketing-teams')}
                  </h2>
                  <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Image
                      className="col-span-2 max-h-12 object-contain lg:col-span-1"
                      src="https://zetasoft.org/wp-content/uploads/2022/12/cropped-cropped-zetasoftLogo-removebg-preview.png"
                      alt="Zetasoft"
                      width="258"
                      height="88"
                    />
                    <Image
                      className="col-span-2 max-h-9 object-contain lg:col-span-1"
                      src="https://s2smark.com/assets/img/logo/s2s-logo-1.png"
                      alt="GitHub"
                      width="158"
                      height="48"
                    />
                    <Image
                      className="col-span-2 max-h-12 object-contain lg:col-span-1"
                      src="https://codvets.com/wp-content/uploads/2021/04/Asset-1-1.png"
                      alt="Google"
                      width="158"
                      height="48"
                    />
                    <Image
                      className="col-span-2 col-start-2 max-h-12object-contain sm:col-start-auto lg:col-span-1"
                      src="https://assets-global.website-files.com/6626a8927cbc7682875d608c/662d4619c16c8483da10ab94_Group%2054.png"
                      alt="Statamic"
                      width="158"
                      height="48"
                    />
                    <Image
                      className="col-span-2 max-h-16 object-contain sm:col-start-2 lg:col-span-1"
                      src="https://oraseya.com/wp-content/uploads/2023/11/OraseyaLogo75pxForIcon.png"
                      alt="ORSEYA"
                      width="158"
                      height="48"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-10">
              <div className="overflow-hidden bg-white py-24 sm:py-16">
                <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
                    <div className="px-6 md:px-0 lg:pr-4 lg:pt-4">
                      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
                        <p className="mt-8 text-3xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
                          {t('how-it-works')}
                        </p>
                        <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-neutral-600 lg:max-w-none">
                          <div className="relative pl-9">
                            <dt className="inline text-3xl font-semibold text-neutral-900">
                              <div className="absolute left-1 top-0 h-10 w-10 text-3xl text-violet-600">1</div>
                              {t('add-your-videos')}
                            </dt>
                            <dd className="inline">{t('from-youtube-or-upload')}</dd>
                          </div>
                          <div className="relative pl-9">
                            <dt className="inline text-3xl font-semibold text-neutral-900">
                              <div className="absolute left-1 top-0 h-10 w-10 text-3xl text-violet-600">2</div>
                              {t('ai-generates-content')}
                            </dt>
                            <dd className="inline"></dd>
                          </div>
                          <div className="relative pl-9">
                            <dt className="inline text-3xl font-semibold text-neutral-900">
                              <div className="absolute left-1 top-0 h-10 w-10 text-3xl text-violet-600">3</div>
                              {t('publish')}
                            </dt>
                            <dd className="inline">{t('to-your-site-social-media')}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div className="mx-auto px-6 lg:px-0">
                      <h2 className="bg-gradient-to-br ml-4 mt-10 from-neutral-900 to-violet-700 bg-clip-text text-4xl font-bold leading-loose tracking-tight text-transparent">
                        <span className="text-violet-600">{t('save-hours')}</span> {t('using-ai')}<br />
                        {t('take-long-form-videos')}<br />{t('create-short-form-marketing')}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-20">
              <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="flex flex-col justify-center">
                  <h2 className="bg-gradient-to-br from-neutral-900 to-violet-700 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent sm:leading-none lg:text-5xl">
                    {t('make-entire-team-happy')}
                  </h2>
                  <p className="mt-5 text-center text-lg text-neutral-700">
                    <strong className="font-bold">{t('making-video-first-step')}</strong> {t('let-video-tap')}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-56 bg-white">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                  <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                    <dt className="text-base leading-7 text-neutral-600">{t('just-like-you')}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      {t('10460-creators')}
                    </dd>
                  </div>
                  <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                    <dt className="text-base leading-7 text-neutral-600">{t('processed-and-analyzed')}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      {t('15875-videos')}
                    </dd>
                  </div>
                  <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                    <dt className="text-base leading-7 text-neutral-600">{t('short-videos')}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      {t('238125-generated')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <section className="w-full max-w-10xl px-8 py-16">
              <div id="features" className="flex flex-col items-center gap-16 ">
                <h2 className="text-center text-4xl font-bold text-violet-600">{t('everything-you-need-to-create')}</h2>
                <div className="flex justify-center w-full flex-wrap" style={{ width: '90%' }}>
                  <div className="p-2 sm:w-1/2 lg:w-1/6" style={{ width: '23rem' }}>
                    <div className="flex flex-col justify-center items-center gap-4 rounded-lg border-4 p-4 sm:h-[250px] border-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-10 lg:w-14 text-purple-400/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-neutral-900">{t('accurate-subtitles')}</p>
                        <p className="text-md text-neutral-400">{t('ai-generated-editable-transcription')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 sm:w-1/2 lg:w-1/6" style={{ width: '23rem' }}>
                    <div className="flex flex-col justify-center items-center gap-4 rounded-lg border-4 p-4 sm:h-[250px] border-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-10 lg:w-14 text-green-400/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-neutral-900">{t('auto-framing')}</p>
                        <p className="text-md text-neutral-400">{t('editor-ai-automatically-frame-faces')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 sm:w-1/2 lg:w-1/6" style={{ width: '23rem' }}>
                    <div className="flex flex-col justify-center items-center gap-4 rounded-lg border-4 p-4 sm:h-[250px] border-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-10 lg:w-14 text-yellow-400/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                      </svg>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-neutral-900">{t('auto-emojis')}</p>
                        <p className="text-md text-neutral-400">{t('ai-suggested-emojis')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 sm:w-1/2 lg:w-1/6" style={{ width: '23rem' }}>
                    <div className="flex flex-col justify-center items-center gap-4 rounded-lg border-4 p-4 sm:h-[250px] border-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-10 lg:w-14 text-blue-400/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                      </svg>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-neutral-900">{t('magic-b-roll')}</p>
                        <p className="text-md text-neutral-400">{t('automatically-add-relevant-b-roll')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 sm:w-1/2 lg:w-1/6" style={{ width: '23rem' }}>
                    <div className="flex flex-col justify-center items-center gap-4 rounded-lg border-4 p-4 sm:h-[250px] border-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-10 lg:w-14 text-red-400/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                      </svg>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-neutral-900">{t('background-music')}</p>
                        <p className="text-md text-neutral-400">{t('add-engaging-background-music')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 sm:w-1/2 lg:w-1/6" style={{ width: '23rem' }}>
                    <div className="flex flex-col justify-center items-center gap-4 rounded-lg border-4 p-4 sm:h-[250px] border-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-10 lg:w-14 text-pink-400/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-neutral-900">{t('social-media')}</p>
                        <p className="text-md text-neutral-400">{t('post-schedule-to-social-media')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
</FrontLayout>
      
    
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
  const session = await getSession(context);

  return {
    props: {
      session,
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Home;
