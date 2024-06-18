import React, { useEffect, useState } from 'react';
import { type ReactElement } from 'react';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import env from '@/lib/env';
import FrontLayout from '@/components/layouts/FrontLayout';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import { useRouter } from 'next/router';
import {  Loading } from '@/components/shared';

const pricingPlans = {
  monthly: [
    {
      id:'1',
      name: 'Basic',
      price: '$29',
      period: '/month',
      features: [
        'Upload 10 videos monthly',
        'Up to 45 minutes long videos',
        'Generate 100 clips monthly',
        'HD download',
      ],
      cardClass: 'bg-[rgb(248,236,236)] text-slate-950',
      buttonClass: 'border border-slate-200 text-slate-950 bg-white',
      buttonText: 'Get Started',
    },
    { id:2,
      name: 'Pro',
      price: '$79',
      period: '/month',
      features: [
        'Upload 30 videos monthly',
        'Up to 2 hours long videos',
        'Generate 300 clips monthly',
        '4K download',
        'Translate to 29 languages (AI Dubbing)',
      ],
      cardClass: 'bg-slate-950 text-white',
      buttonClass: 'bg-white text-slate-950 border-white',
      buttonText: 'Get Started',
    },
    {
      id:3,
      name: 'Pro+',
      price: '$189',
      period: '/month',
      features: [
        'Upload 100 videos monthly',
        'Up to 3 hours long videos',
        'Generate 1000 clips monthly',
        '4K download',
        'Translate to 29 languages (AI Dubbing)',
      ],
      cardClass: 'bg-slate-200 text-slate-950',
      buttonClass: 'border border-slate-200 text-white bg-slate-950',
      buttonText: 'Get Started',
    },
  ],
  yearly: [
    {
      name: 'Basic',
      price: '$23',
      period: '/month',
      features: [
        'Upload 10 videos monthly',
        'Up to 45 minutes long videos',
        'Generate 100 clips monthly',
        'HD download',
      ],
      cardClass: 'bg-[rgb(248,236,236)] text-slate-950',
      buttonClass: 'border border-slate-200 text-slate-950 bg-white',
      buttonText: 'Get Started',
    },
    {
      name: 'Pro',
      price: '$63',
      period: '/month',
      features: [
        'Upload 30 videos monthly',
        'Up to 2 hours long videos',
        'Generate 300 clips monthly',
        '4K download',
        'Translate to 29 languages (AI Dubbing)',
      ],
      cardClass: 'bg-slate-950 text-white',
      buttonClass: 'bg-white text-slate-950 border-white',
      buttonText: 'Get Started',
    },
    {
      name: 'Pro+',
      price: '$151',
      period: '/month',
      features: [
        'Upload 100 videos monthly',
        'Up to 3 hours long videos',
        'Generate 1000 clips monthly',
        '4K download',
        'Translate to 29 languages (AI Dubbing)',
      ],
      cardClass: 'bg-slate-200 text-slate-950',
      buttonClass: 'border border-slate-200 text-white bg-slate-950',
      buttonText: 'Get Started',
    },
  ],
};

const Pricing: NextPageWithLayout = () => {
  const router=  useRouter();
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
  const [subPkges, setSubPkges] = useState<any>([]);
  const { t } = useTranslation('common');
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/subscriptionPackages/subPkg');
        setSubPkges(res.data.data)
      } catch (error) {
        console.error('Error fetching subscription packages:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (subPkges.length) {
      const convertMaxLengthVideo = (maxLength) => {
        const [hours, minutes, seconds] = maxLength.split(':').map(Number);
        if (hours > 0) {
          return `Up to ${hours} hours long videos`;
        } else if (minutes > 0) {
          return `Up to ${minutes} minutes long videos`;
        } else {
          return `Up to ${seconds} seconds long videos`;
        }
      };

      const updatedMonthly = pricingPlans.monthly.map((plan, index) => {
        const newPlan = subPkges[index];
        return {
          ...plan,
          id:newPlan.id,
          name: newPlan.subscription_type,
          price: `$${newPlan.price}`,
          features: [
            `Upload ${newPlan.upload_video_limit} videos monthly`,
            convertMaxLengthVideo(newPlan.max_length_video),
            `Generate ${newPlan.generate_clips} clips monthly`,
            plan.features.includes('HD download') ? 'HD download' : '4K download',
            (plan.features.includes('Translate to 29 languages (AI Dubbing)') && newPlan.subscription_type !== 'BASIC') ? 'Translate to 29 languages (AI Dubbing)' : undefined,
          ].filter(Boolean),
        };
      });

      pricingPlans.monthly = updatedMonthly as any;
    }
  }, [subPkges]);

  const handleGetStarted = (id:any,price:any, subscriptionType:any) => {
    setLoading(true)
    
    const numericPrice = price.replace('$', '');
    axios.post('/api/payments/videoPayment',{
      id:id,
      price:numericPrice,
      Subscription_type:subscriptionType
    }).then((res)=>{
      router.push(res.data.data.url)
    })

    
  };
  if(loading){
    return <Loading />
  }

  return (
    <FrontLayout>
      <div className="max-w-5xl mx-auto px-3 text-center text-slate-950">
        <h1 className="text-4xl md:text-5xl font-semibold font-display my-8">
          {t('Plans')}
        </h1>
        <p className="text-xl font-sans font-normal text-slate-600 my-8">
          {t('no-hidden-fee')}
        </p>
        <div className="max-w-5xl mx-auto px-3 text-center">
          <div className="mx-auto mb-8 inline-flex gap-2 items-center justify-center bg-slate-200 p-1 rounded-2xl">
            <button
              onClick={() => setPlanType('monthly')}
              className={`px-6 py-3 h-12 rounded-xl ${planType === 'monthly' ? 'border  bg-white text-slate-950' : 'bg-transparent text-slate-950'}`}
            >
              <span className="text-sm font-semibold">{t('Monthly')}</span>
            </button>
            <button
              onClick={() => setPlanType('yearly')}
              className={`px-6 py-3 h-12 hidden rounded-xl ${planType === 'yearly' ? 'border  bg-white text-slate-950' : 'bg-transparent text-slate-950'}`}
            >
              <span className="text-sm font-semibold">{t('Yearly')}</span>
              <span className="text-xs font-normal rounded-full px-2 py-0.5 bg-green-300 text-green-950 ml-2">
                {t('save-190')}
              </span>
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {pricingPlans[planType].map((plan) => (
              <section key={plan.name} className={`flex-1 p-12 rounded-2xl ${plan.cardClass}`}>
                <div className="flex-col flex justify-center items-center text-center">
                  <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
                  <div className="flex-1 flex justify-center">
                    <div className="h-auto flex gap-2 items-center">
                      <div className="w-20 h-auto shrink-0"></div>
                    </div>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-semibold mt-8 flex items-baseline">
                    <span>{plan.price}</span>
                    <p className="text-lg font-sans font-normal">{plan.period}</p>
                  </h3>
                  <button
                    className={`mt-8 w-full px-6 py-3 h-12 rounded-xl ${plan.buttonClass} relative flex items-center gap-2 justify-center border transition-none`}
                    onClick={() => handleGetStarted(plan.id,plan.price, plan.name)}
                  >
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {plan.buttonText}
                    </span>
                  </button>
                  <p className="text-sm font-normal mt-4 text-slate-500">
                    {t('secured-stripe')}
                  </p>
                  <ul className="flex-1 self-start flex flex-col mt-8 gap-4 w-full">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 items-center text-left">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          className="w-5 h-5 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <p className="text-sm font-normal">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
          <p className="text-sm font-normal mt-8 text-slate-700">
            {t('need-more')} <a className="text-slate-500" href="https://discord.gg/KcAcHdrSQU">{t('lets-talk')}</a>
          </p>
        </div>
      </div>
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

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
};

Pricing.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Pricing;
