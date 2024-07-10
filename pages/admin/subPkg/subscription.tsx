import React, { useCallback, useEffect, useState } from 'react';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import env from '@/lib/env';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import Link from 'next/link';


const Pricing: NextPageWithLayout = () => {
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
  const [pricingPlans, setPricingPlans] = useState<any>({ monthly: [], yearly: [] }); // Initialize as empty object
  const { t } = useTranslation('common');
  const updatePricingPlans = useCallback((data: any[], period: 'monthly' | 'yearly') => {
    return data
      .filter((plan: any) => plan.sub_dur_type.toLowerCase() === period)
      .map((newPlan) => ({
        id: newPlan.id,
        name: newPlan.subscription_type,
        price: `$${newPlan.price}`,
        period,
        features: [
          `Upload ${newPlan.upload_video_limit} videos ${t("Monthly")}`,
          convertMaxLengthVideo(newPlan.max_length_video),
          `Generate ${newPlan.generate_clips} clips ${t("Monthly")}`,
          period === 'monthly' ? 'HD download' : '4K download',
          period === 'yearly' && newPlan.subscription_type !== 'BASIC' ? 'Translate to 29 languages (AI Dubbing)' : undefined,
        ].filter(Boolean),
        cardClass: getCardClass(newPlan.subscription_type),
        buttonClass: getButtonClass(newPlan.subscription_type),
        buttonText: 'Get Started',
        editButton: 'Edit',
      }));
  }, [t]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/subscriptionPackages/subPkg');
        const { data } = res.data;

        // Sort plans by subscription_type: basic, pro, premium
        data.sort((a: any, b: any) => {
          if (a.subscription_type === 'BASIC') return -1;
          if (a.subscription_type === 'PRO' && b.subscription_type !== 'BASIC') return -1;
          return 1;
        });

        const updatedPlans = {
          monthly: updatePricingPlans(data, 'monthly'),
          yearly: updatePricingPlans(data, 'yearly'),
        };

        setPricingPlans(updatedPlans);
      } catch (error) {
        console.error('Error fetching subscription packages:', error);
      }
    };

    fetchData();
  }, [updatePricingPlans]);


  const getCardClass = (subscriptionType: string) => {
    if (subscriptionType === 'PRO') {
      return 'bg-slate-200 text-slate-950';
    } else {
      return 'bg-slate-200 text-slate-950';
    }
  };

  const getButtonClass = (subscriptionType: string) => {
    if (subscriptionType === 'PRO') {
      return 'bg-black text-white border-white';
    } else {
      return 'border border-slate-200 text-slate-950 bg-white';
    }
  };

  const convertMaxLengthVideo = (maxLength: string) => {
    const [hours, minutes, seconds] = maxLength.split(':').map(Number);

    if (hours > 0) {
      return `Up to ${hours} hours long videos`;
    } else if (minutes > 0) {
      return `Up to ${minutes} minutes long videos`;
    } else {
      return `Up to ${seconds} seconds long videos`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 text-center text-slate-950">
      <h1 className="text-4xl md:text-5xl font-semibold font-display my-8">{t('Plans')}</h1>
      <p className="text-xl font-sans font-normal text-slate-600 my-8">{t('no-hidden-fee')}</p>
      <div className="max-w-5xl mx-auto px-3 text-center">
      <div className="mx-auto mb-8 inline-flex flex-col sm:flex-row gap-2 items-center justify-center bg-slate-200 p-1 rounded-2xl">
  <button
    onClick={() => setPlanType('monthly')}
    className={`px-4 py-2 h-12 rounded-xl ${planType === 'monthly' ? 'border bg-white text-slate-950' : 'bg-transparent text-slate-950'}`}
  >
    <span className="text-sm font-semibold">{t('Monthly')}</span>
  </button>
  <button
    onClick={() => setPlanType('yearly')}
    className={`px-4 py-2 h-12 rounded-xl ${planType === 'yearly' ? 'border bg-white text-slate-950' : 'bg-transparent text-slate-950'}`}
  >
    <span className="text-sm font-semibold">{t('Yearly')}</span>
    <span className="text-xs font-normal rounded-full px-2 py-0.5 bg-green-300 text-green-950 ml-2">
      {t('save-190')}
    </span>
  </button>
</div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {pricingPlans[planType]?.map((plan: any) => (
            <section key={plan.id} className={`flex-1 p-12 rounded-2xl ${plan.cardClass}`}>
              <div className="flex-col flex justify-center items-center text-center">
                <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
                <div className="flex-1 flex justify-center">
                  <div className="h-auto flex gap-2 items-center">
                    <div className="w-20 h-auto shrink-0"></div>
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-semibold mt-8 flex items-baseline">
                  <span>{plan.price}</span>
                  <p className="text-lg font-sans font-normal">{t('Monthly')}</p>
                </h3>
                <ul className="flex-1 self-start flex flex-col mt-8 gap-4 w-full">
                  {plan.features.map((feature: string) => (
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
                <Link
                  href={`/admin/subPkg/editSubscription/${plan.id}`}
                  className={`mt-8 w-full px-6 py-3 h-12 rounded-xl ${plan.buttonClass} relative flex items-center gap-2 justify-center border transition-none`}
                >
                  <span className="text-sm font-semibold whitespace-nowrap">{plan.editButton}</span>
                </Link>
              </div>
            </section>
          ))}
        </div>
        <p className="text-sm font-normal mt-8 text-slate-700">
          {t('need-more')}{' '}
          <a className="text-slate-500" href="https://discord.gg/KcAcHdrSQU">
            {t('lets-talk')}
          </a>
        </p>
      </div>
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

export default Pricing;
