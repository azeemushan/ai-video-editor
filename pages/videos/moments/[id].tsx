import Head from 'next/head';
import { NextPageWithLayout } from 'types';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Link from 'next/link';


const FetchingVideo: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [videoClips, setVidoClips] = useState<any[]>([]); 
  useEffect(()=>{
    axios
              .post('/api/videoClips/clips', {
                videoIdForClips: id,
                
              })
              .then((res) => {
                console.log(res.data.data)
                setVidoClips(res.data.data)
                
              });

  },[id])


  return (
    <>
      <Head>
        <title>{`${t('moments')}`}</title>
      </Head>
      <div>
        
      <Link href={`/dashboard`} passHref> 
      <button
              
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {t('home')}
            </button>
            </Link>

      {videoClips.map((clip, index) => (
  clip.clipSrc ? (
    <div key={index} style={{ marginBottom: '20px' }} >
        <div className='flex  justify-center  gap-5'>
            <div className='flex flex-col gap-3'>
      <h3 className='text-center  text-bold text-gray-500'> <div className='flex justify-center items-center gap-2'> <span className='text-2xl uppercase font-bold text-gray-600 '>{t('title')}</span>  <span>{clip.title}</span> </div></h3>
      <ReactPlayer url={clip.clipSrc}  controls={true} />
      </div>
      </div>
    </div>
  ) : null
))}
    </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context;
  const { id }: any = context.params;



  

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
  
    },
  };
};

export default FetchingVideo;
