import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import axios from 'axios';
import env from '@/lib/env';

function ManageSubscription() {
  const { t } = useTranslation('common');
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const { data } = useSession();
  const id = data?.user?.id;
  const [subPkges, setSubPkges] = useState<any>([]);

  useEffect(() => {
    if (id) {
      const fetchSubscription = async () => {
        try {
          const res = await axios.post('/api/subscriptions/subscription', {
            userId: id,
            status: true,
          });
          const activeSubscription = res.data.data;
          setCurrentSubscription(activeSubscription);
        } catch (error) {
          console.error('Error fetching current subscription:', error);
        }
      };
      fetchSubscription();
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post('/api/subscriptionPackages/upSubPkg', {
          stripe_priceId: currentSubscription?.stripe_priceId,
        });
        const { data } = res.data;
        setSubPkges(data);
      } catch (error) {
        console.error('Error fetching subscription packages:', error);
      }
    };
    if (currentSubscription?.stripe_priceId) {
      fetchData();
    }
  }, [currentSubscription]);

  const handleUpgrade = async (newPriceId: string) => {
    
    try {
    const upgradeRes =   await axios.post('/api/subscriptions/upgrade', {
        subscriptionId: currentSubscription.stripe_subscriptionId,
        newPriceId,
      });


      if(upgradeRes.data.status ==="true"){
        alert('subscription upgraded')

      }
      else{
        alert('some thing went wrong')


      }
      
      
      
      const res = await axios.post('/api/subscriptions/subscription', {
        userId: id,
        status: true,
      });
      setCurrentSubscription(res.data.data);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  useEffect(()=>{
    console.log(`===================================`)

    console.log(currentSubscription)
    console.log(subPkges)
    console.log(`===================================`)



  },[currentSubscription, subPkges])

  return (
    <div className="container mx-auto p-4">
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">{t('available-packages')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subPkges.map((pkg) => (
            <div key={pkg.id} className="bg-white shadow-md rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">
                {pkg.subscription_type} ({pkg.sub_dur_type})
              </h4>
              <p>
                {t('price')}
                {t('dollar-colon')}
                {pkg.price}
              </p>
              <p>{t('upload-limit')}: {pkg.upload_video_limit}</p>
              <p>{t('generate-clips')}: {pkg.generate_clips}</p>
              <p>{t('total-minutes')}: {pkg.total_min}</p>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => handleUpgrade(pkg.stripe_priceId)}
              >
                {t('select-plan')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
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

export default ManageSubscription;
