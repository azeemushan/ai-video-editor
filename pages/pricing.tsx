import React, { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import env from '@/lib/env';
import FrontLayout from '@/components/layouts/FrontLayout';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Loading } from '@/components/shared';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Pricing: NextPageWithLayout = () => {
  const router = useRouter();
  const { data } = useSession();
  const id = data?.user?.id;
  const { t } = useTranslation('common');
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
  const [subPkges, setSubPkges] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<any>({
    monthly: [],
    yearly: [],
  });
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/subscriptionPackages/subPkg');
        const { data } = res.data;

        data.sort((a: any, b: any) => {
          if (a.subscription_type === 'BASIC') return -1;
          if (a.subscription_type === 'PRO' && b.subscription_type !== 'BASIC')
            return -1;
          return 1;
        });

        setSubPkges(data);
      } catch (error) {
        console.error('Error fetching subscription packages:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (subPkges.length) {
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

      const updatedMonthly = subPkges
        .filter((plan: any) => plan.sub_dur_type === 'MONTHLY')
        .map((newPlan: any) => ({
          id: newPlan.id,
          stripe_priceId: newPlan.stripe_priceId,
          name: newPlan.subscription_type,
          price: `$${newPlan.price}`,
          features: [
            `Upload ${newPlan.upload_video_limit} videos monthly`,
            convertMaxLengthVideo(newPlan.max_length_video),
            `Generate ${newPlan.generate_clips} clips monthly`,
            'HD download',
            newPlan.subscription_type !== 'BASIC'
              ? 'Translate to 29 languages (AI Dubbing)'
              : undefined,
          ].filter(Boolean),
          cardClass: getCardClass(newPlan.subscription_type),
          buttonClass: getButtonClass(newPlan.subscription_type),
          buttonText: 'Get Started',
        }));

      const updatedYearly = subPkges
        .filter((plan: any) => plan.sub_dur_type === 'YEARLY')
        .map((newPlan: any) => ({
          id: newPlan.id,
          stripe_priceId: newPlan.stripe_priceId,
          name: newPlan.subscription_type,
          price: `$${newPlan.price}`,
          features: [
            `Upload ${newPlan.upload_video_limit} videos monthly`,
            convertMaxLengthVideo(newPlan.max_length_video),
            `Generate ${newPlan.generate_clips} clips monthly`,
            'HD download',
            newPlan.subscription_type !== 'BASIC'
              ? 'Translate to 29 languages (AI Dubbing)'
              : undefined,
          ].filter(Boolean),
          cardClass: getCardClass(newPlan.subscription_type),
          buttonClass: getButtonClass(newPlan.subscription_type),
          buttonText: 'Get Started',
        }));

      setPricingPlans({ monthly: updatedMonthly, yearly: updatedYearly });
    }
  }, [subPkges]);

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

  const handleGetStarted = (id: any, price: any, subscriptionType: any) => {
    setLoading(true);
    const numericPrice = price.replace('$', '');
    axios
      .post('/api/payments/videoPayment', {
        id: id,
        price: numericPrice,
        Subscription_type: subscriptionType,
      })
      .then((res) => {
        if (res.data.status === 'true') {
          const url = new URL(res.data.data.url);
          const params = new URLSearchParams(url.search);
          if (url.pathname === '/auth/login') {
            params.append('fromPricing', 'true');
            url.search = params.toString();
          }
          router.push(url.toString());
        } else if (res.data.status === 'subscription exist') {
          toast.error(res.data.message);
          router.push('/dashboard/manageSubscription');
        } else if (res.data.status === 'not_authenticated') {
          // Redirect to login page with fromPricing query parameter
          const callbackUrl = encodeURIComponent('/pricing');
          router.push(`/auth/login?callbackUrl=${callbackUrl}&fromPricing=true`);
        }
      });
  };
  

  useEffect(() => {
    if (id) {
      const fetchSubscription = async () => {
        try {
          const res = await axios.post('/api/subscriptions/subscription', {
            userId: id,
            status: true,
          });
          const activeSubscription = res.data.data; // assuming the first one is the active subscription
          console.log('Active subscription:', activeSubscription); // Debugging log
          setCurrentSubscription(activeSubscription);
          // Set planType based on current subscription duration type
          if (activeSubscription.subscriptionPackage.sub_dur_type === 'YEARLY') {
            setPlanType('yearly');
          } else {
            setPlanType('monthly');
          }
        } catch (error) {
          console.error('Error fetching current subscription:', error);
        }
      };
      fetchSubscription();
    }
  }, [id]);



  if (loading) {
    return <Loading />;
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
              className={`px-6 py-3 h-12 rounded-xl ${
                planType === 'monthly' ? 'border bg-white text-slate-950' : 'bg-transparent text-slate-950'
              }`}
            >
              <span className="text-sm font-semibold">{t('Monthly')}</span>
            </button>
            <button
              onClick={() => setPlanType('yearly')}
              className={`px-6 py-3 h-12  rounded-xl ${
                planType === 'yearly' ? 'border bg-white text-slate-950' : 'bg-transparent text-slate-950'
              }`}
            >
              <span className="text-sm font-semibold">{t('Yearly')}</span>
              <span className="text-xs font-normal rounded-full px-2 py-0.5 bg-green-300 text-green-950 ml-2">
                {t('save-190')}
              </span>
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {pricingPlans[planType]?.map((plan: any) => (
              <section
                key={plan.id}
                className={`flex-1 p-12 rounded-2xl relative ${plan.cardClass}`}
              >
                {currentSubscription &&
                  currentSubscription.stripe_priceId === plan.stripe_priceId && (
                    <span className="bg-[#333030] text-white text-base font-medium absolute -top-[17px] left-[86px] px-5 py-1 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                      {t('current-plan')}
                    </span>
                  )}
                <div className="flex-col flex justify-center items-center text-center">
                  <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
                  <div className="flex-1 flex justify-center">
                    <div className="h-auto flex gap-2 items-center"></div>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-semibold mt-8 flex items-baseline">
                    <span>{plan.price}</span>
                    <p className="text-lg font-sans font-normal">{plan.period}</p>
                  </h3>
                  {currentSubscription &&
                  currentSubscription.stripe_priceId === plan.stripe_priceId ? (
                    <Link href="/dashboard/manageSubscription">
                      <button
                        className={`mt-8 w-full px-6 py-3 h-12 rounded-xl ${plan.buttonClass} relative flex items-center gap-2 justify-center border transition-none`}
                      >
                        <span className="text-sm font-semibold whitespace-nowrap">
                          {t('manage-subscription-card')}
                        </span>
                      </button>
                    </Link>
                  ) : (
                    <button
                      className={`mt-8 w-full px-6 py-3 h-12 rounded-xl ${plan.buttonClass} relative flex items-center gap-2 justify-center border transition-none`}
                      onClick={() =>
                        handleGetStarted(plan.id, plan.price, plan.name)
                      }
                    >
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {plan.buttonText}
                      </span>
                    </button>
                  )}
                  <p className="text-sm font-normal mt-4 text-slate-500">
                    {t('secured-stripe')}
                  </p>
                  <ul className="flex-1 self-start flex flex-col mt-8 gap-4 w-full">
                    {plan.features.map((feature: string) => (
                      <li
                        key={feature}
                        className="flex gap-2 items-center text-left"
                      >
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
            {t('need-more')}{' '}
            <a className="text-slate-500" href="https://discord.gg/KcAcHdrSQU">
              {t('lets-talk')}
            </a>
          </p>
        </div>
      </div>
    </FrontLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
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
