import { prisma } from '@/lib/prisma';

export const createVideoClip = async (data: any) => {
  try {
    // Check if a video clip with the given clip_id already exists
    const existingClip = await prisma.videoClips.findUnique({
      where: { clip_id: data.clip_id },
    });

    if (existingClip) {
      // If the clip exists, return it or handle it as needed
      console.log('Video clip already exists:', existingClip);
      return existingClip;
    }

    // Create a new video clip if it does not exist
    const newVideoClip = await prisma.videoClips.create({
      data: {
        conVideoId: data.conVideoId,
        clip_id: data.clip_id,
        exportId: data.exportId,
        videoId: +data.videoId,  // Ensure videoId is a number
      },
    });

    return newVideoClip;
  } catch (error) {
    console.error('Error creating video clip:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};


export const updateVideoClip = async (data: any) => {
  try {
    const { clip_id, title, src_url } = data;

    // Update the video clip with the given clip_id
    const updatedClip = await prisma.videoClips.updateMany({
      where: { exportId:  clip_id  },
      data: {
        title: title,
        clipSrc: src_url,
      },
    });

    return updatedClip;
  } catch (error) {
    console.error('Error updating video clip:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const getVideoClipsByVId = async (id: string) => {
  try {
    const video = await prisma.videoClips.findMany({
      where: {
        videoId: +id,
      },
    });
    return video;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
