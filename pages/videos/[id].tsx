import Head from 'next/head';
import { NextPageWithLayout } from 'types';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { getVideoById } from 'models/uploadedVideo';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import {  Loading } from '@/components/shared';


const FetchingVideo: NextPageWithLayout = ({
  originalLink,
  conVideoId,
}: any) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [videoData, setVideoData] = useState<any>(null);
  const [dbVideoObj, setDbVideoObj] = useState<any>(null);
  const [clips, setClips] = useState<any[]>([]);
  const [exportClips, setExportClips] = useState<any[]>([]);
  const [allProcessed, setAllProcessed] = useState(false);
  const [storedData, setStoredData] = useState<any[]>([]); 
  const [isAllDataStored, setIsAllDataStored] = useState(false);
  const [readyClips, setReadyClips] = useState<any[]>([]);
  const [readClipsRef,setReadyClipsRef] = useState(false);
  const [loading,setLoading] = useState(false);
  
  

  const apiKey = 'kak_784ec1c162bc-4366-b7d9-b37d266e6559';
  const baseURL = 'https://v1.api.klap.app/v1';
  

  const handleCreateClips = async () => {
    setLoading(true)

    

    try {
      const videoResponse = await axios.post(
        `${baseURL}/videos`,
        {
          source_video_url: originalLink,
          language: 'en',
          min_duration: 10,
          max_duration: 60,
          target_duration: 30,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const videoData = videoResponse.data;
      console.log('response from api after sending link>>>>>',videoData)

      // Update conVideoId field
      const conVideoUpatedResponse = await axios.put('/api/video/UploadVideo', {
        conVideoId: videoData.id,
        videoId: id,
      });
      const { message } = conVideoUpatedResponse.data;
      setDbVideoObj(conVideoUpatedResponse.data.data);
      axios
        .post('/api/video/UploadVideo', {
          fetchVideoById: id,
        })
        .then((res) => {
          setDbVideoObj(res.data.data);
        });
      
      

      setVideoData(videoData);
    } catch (error) {
      console.error('Error creating video or fetching clips:', error);
    }
  };

  

  useEffect(() => {
    if (!dbVideoObj) {

      axios
        .post('/api/video/UploadVideo', {
          fetchVideoById: id,
        })
        .then((res) => {
          setDbVideoObj(res.data.data);
        });
    }
  }, [dbVideoObj, id]);

  useEffect(() => {
    if (dbVideoObj && dbVideoObj.conVideoId) {
      const interval = setInterval(() => {
        axios
          .get(`${baseURL}/videos/${dbVideoObj.conVideoId}`, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.status === 'ready') {
              const { src_url, title } = res.data;
              if (!dbVideoObj.conVideoSrc) {
                axios
                  .post('/api/video/UploadVideo', {
                    updateConVidSrcById: id,
                    src_url,
                    title,
                  })
                  .then((res) => {
                    console.log(res.data);
                    if (res.data.status === 'true') {
                      
                      setDbVideoObj(res.data.data);
                    }
                  });
              }

              clearInterval(interval);
            }
          });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [conVideoId, dbVideoObj, id]);

  useEffect(() => {
    if (dbVideoObj && dbVideoObj.conVideoId && dbVideoObj.conVideoSrc) {
      axios
        .get(`${baseURL}/videos/${dbVideoObj.conVideoId}/clips`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
        .then((res) => {
          const clipsData = res.data;
          setClips(clipsData);

          clipsData.forEach((clip: any) => {
            axios
              .post(
                `${baseURL}/videos/${clip.video_id}/clips/${clip.id}/exports`,
                {
                  preset_id: clip.preset_id,
                  crop:false
                },
                {
                  headers: {
                    Authorization: `Bearer ${apiKey}`,
                  },
                }
              )
              .then((res) => {
                setExportClips((prevExportClips) => [
                  ...prevExportClips,
                  res.data,
                ]);
              });
          });
        });
    }
  }, [dbVideoObj]);
  useEffect(() => {
    if (exportClips.length === clips.length && clips.length > 0 && !allProcessed) {
      console.log(exportClips)
      


      const promises = exportClips.map((clip) => {
        return axios
          .get(
            `${baseURL}/videos/${clip.video_id}/clips/${clip.clip_id}/exports/${clip.id}`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            }
          )
          .then((res) => {
            return axios
              .post('/api/videoClips/clips', {
                conVideoId: clip.video_id,
                clip_id: clip.clip_id,
                exportId: clip.id,
                videoId: id,
              })
              .then((res) => {
                const newData = res.data.data;
                setStoredData((prevStoredData) => [...prevStoredData, newData]);
              });
          });
      });
        Promise.all(promises).then(() => {
          setIsAllDataStored(true); // Update state to indicate all data is stored
        });
  


      setAllProcessed(true);


    }
  }, [exportClips, clips, allProcessed, id]);

  useEffect(() => {
    if (isAllDataStored) {
      const interval = setInterval(() => {
        // Your code to execute every 10 seconds
        const readyPromises = storedData.map((clip) => {
          return axios
            .get(
              `${baseURL}/videos/${clip.conVideoId}/clips/${clip.clip_id}/exports/${clip.exportId}`,
              {
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                },
              }
            )
            .then((res) => {
              if (res.data.status === 'ready') {

                if (readyClips.length !== storedData.length) {
                  if (!readyClips.some((readyClip) => readyClip.id === res.data.id)) {
                    setReadyClips((prevReadyClips) => [...prevReadyClips, res.data]);
                  }
              }

              }
            });
        });

        Promise.all(readyPromises).then(() => {

          if (readyClips.length === storedData.length) {
            setReadyClipsRef(true)
            clearInterval(interval);
          }
          
        });
          

      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAllDataStored, storedData,readyClips]);

  useEffect(() => {
    if (readyClips.length > 0) {
      if(readClipsRef){
      console.log('Ready Clips:', readyClips);
      axios
        .put('/api/videoClips/clips', {
     
          exportArray: JSON.stringify(readyClips) 
     
     
        })
        .then((res) => {
          router.push(`/videos/moments/${id}`)
          
        });



      // const promises = readyClips.map((clip) => {
      //   return axios
      //   .put('/api/videoClips/clips', {
     
      //     clip_id: clip.id,
      //     title:clip.name,
      //     src_url:clip.src_url,
     
     
      //   })
      //   .then((res) => {
          
      //   });
      // });
      //   Promise.all(promises).then(() => {

          // router.push(`/videos/moments/${id}`)
          
      //   });
    }
    }
    
  }, [id, readClipsRef, readyClips, router]);
  


  if(loading){
    return <Loading />
  }
  

  return (
    <>
      <Head>
        <title>{`${t('create-clips')}`}</title>
      </Head>
      <div className="flex justify-center">
        <div className="create_clips_section flex gap-4 w-full md:w-3/4">
          <div className="flex-1">
            <ReactPlayer url={originalLink} width="100%" controls={true} />
          </div>
          <div className="flex-1 flex items-end">
            <button
              onClick={handleCreateClips}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {t('create-clips')}
            </button>




          </div>
        </div>
      </div>
      {clips.length > 0 && (
        <div className="mt-4">
          <h2>{t('clips')}</h2>
          <ul>
            {clips.map((clip) => (
              <li key={clip.id}>{clip.title}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { locale } = context;
  const { id }: any = context.params;

  const { originalLink, conVideoId }: any = await getVideoById(id);

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      originalLink,
      conVideoId,
    },
  };
};

export default FetchingVideo;
