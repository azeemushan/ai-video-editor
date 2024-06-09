import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { InputWithLabel } from '@/components/shared';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button } from 'react-daisyui';
import { FaPlus } from "react-icons/fa";
import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player';
import Link from 'next/link';


const VideoUpload: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [video, setVideo] = useState<any[]>([]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    // Perform your confirm action here
    setIsModalOpen(false);
  };

  const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

  const formik = useFormik({
    initialValues: {
      link: '',
    },
    validationSchema: Yup.object().shape({
      link: Yup.string()
        .matches(youtubeRegex, 'Invalid YouTube link')
        .required('YouTube link is required'),
    }),
    onSubmit: async (values) => {
      const { link } = values;
      axios.post('/api/video/UploadVideo', {
        origionalVideoLink: link
      })
      .then(function (response:any) {
        const {id}= response.data.data
        router.push(`/videos/${id}`)
        
        console.log(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      
      formik.resetForm();
    },
  });
  useEffect(()=>{
    axios
              .get('/api/video/UploadVideo')
              .then((res) => {
                console.log(res.data.data)
                setVideo(res.data.data)
                
              });

  },[])

  return (
    <div>
      <span onClick={handleOpenModal} className='px-32 py-20 bg-purple-200 inline-flex items-center rounded-lg cursor-pointer'>

      
      <FaPlus  className='text-purple-500 text-3xl' />
      </span>
      {video.map((clip, index) => (
        clip.conVideoSrc ? (
          <div key={index} style={{ marginBottom: '20px' }} className='video_par mt-4 flex gap-4'>
            <div className='flex flex-col '>
            <Link href={`/videos/moments/${clip.id}`} passHref>
              
                <ReactPlayer url={clip.conVideoSrc}  width="300px" height="auto"  />
              
            </Link>
            <h3 className='mt-3 text-[10px] font-bold '>{clip.conVideoTitle}</h3>
            </div>
          </div>
        ) : null
      ))}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t('add-video')}
        
        onConfirm={handleConfirm}
      >
        {/* children content will be goes here */}
        <form onSubmit={formik.handleSubmit}>
          <div className='flex items-center gap-x-3 flex-wrap'>
          <div className="space-y-3 flex-1">
            <InputWithLabel
              type="text"
              label="Youtube Link"
              name="link"
              placeholder="Enter Youtube link"
              value={formik.values.link}
              error={formik.touched.link ? formik.errors.link : undefined}
              onChange={formik.handleChange}
            />
          </div>
          <div className="mt-9 space-y-3">
            
          
          
            <Button
              type="submit"
              color="primary"
              loading={formik.isSubmitting}
              active={formik.dirty}
              fullWidth
              size="md"
              className='text-white'
            >
              {t("import-statement")}
            </Button>
          </div>
          </div>
        </form>
      </Modal>

      


    </div>
  );
};

export default VideoUpload;
