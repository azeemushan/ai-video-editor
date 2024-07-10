import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { InputWithLabel } from '@/components/shared';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button } from 'react-daisyui';
import { FaPlus } from 'react-icons/fa';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import Link from 'next/link';
// import { Loading } from '@/components/shared';
import toast from 'react-hot-toast';


const VideoUpload: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [video, setVideo] = useState<any[]>([]);
  const [maxVideoLengthFromDB, setMaxVideoLengthFromDB] = useState<string | null>(null); // Add state to hold max video length

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

  const formatMaxVideoLength = (length: string) => {
    const [hours, minutes] = length.split(':').map(Number);
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  };

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
      setLoading(true);

      try {
        const response = await axios.post('/api/video/UploadVideo', {
          origionalVideoLink: link,
        });

        setLoading(false);

        if (response.data.data === 'payment') {
          toast.error('You need to buy a subscription to upload videos.')
          router.push(`/pricing`);
          return;
        }

        const { id, maxVideoLengthFromDB } = response.data.data;
        setMaxVideoLengthFromDB(maxVideoLengthFromDB); // Set the max video length from response
        router.push(`/videos/${id}`);
      } catch (error) {
        setLoading(false);
        console.error('Error uploading video:', error);
        setMaxVideoLengthFromDB(null); // Clear max video length on error
        formik.setFieldError('link', `You cannot upload video greater than ${formatMaxVideoLength(maxVideoLengthFromDB || '00:00:00')}`);
      }
    },
  });

  useEffect(() => {
    axios.get('/api/video/UploadVideo').then((res) => {
      setVideo(res.data.data);
      setMaxVideoLengthFromDB(res.data.maxVideoLengthFromDB); // Set the max video length from response
    }).catch(error => {
      console.error('Error fetching video data:', error);
    });
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={handleOpenModal}
          className="bg-purple-200 flex flex-col items-center py-20 justify-center rounded-lg cursor-pointer aspect-w-1 aspect-h-1"
        >
          <FaPlus className="text-purple-500 text-xl md:text-2xl lg:text-3xl" />
        </div>
        {video.map((clip, index) =>
          clip.conVideoSrc ? (
            <div
              key={index}
              className="video_par flex flex-col w-full rounded-lg overflow-hidden aspect-w-1 aspect-h-1"
            >
              <Link href={`/videos/moments/${clip.id}`} passHref>
                <ReactPlayer
                  url={clip.conVideoSrc}
                  width="100%"
                  height="100%"
                  className="flex-1"
                />
              </Link>
              <div className="mt-3 px-2 text-xs font-bold text-center sm:text-sm">
                <p className="whitespace-normal">{clip.conVideoTitle}</p>
              </div>
            </div>
          ) : null
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t('add-video')}
        onConfirm={handleConfirm}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="flex items-center gap-x-3 flex-wrap">
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
              {/* Display validation error message */}
              {/* {formik.touched.link && formik.errors.link && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.link}</div>
              )} */}
            </div>
            <div className="mt-9 space-y-3">
              <Button
                type="submit" 
                color="primary"
                loading={loading}
                active={!loading}
                fullWidth
                size="md"
                className="text-white"
              >
                {t('import-statement')}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VideoUpload;
