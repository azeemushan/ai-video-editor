import { prisma } from '@/lib/prisma';

export const createVideo = async (data: any) => {
  try {
    console.log(data.userId);
    const existingVideo = await prisma.uploadedVideo.findFirst({
      where: {
        originalLink: data.link,
        userId: data.userId,
      },
    });
  
    // If the video exists, return it
    if (existingVideo) {
      return existingVideo;
    }
  
    // If the video doesn't exist, create a new one
    const newVideo = await prisma.uploadedVideo.create({
      data: {
        originalLink: data.link,
        userId: data.userId,
      },
    });
  
    return newVideo;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const getVideoById = async (id: string) => {
  try {
    const video = await prisma.uploadedVideo.findUnique({
      where: {
        id: +id,
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

export const updateConVideoIdField = async (data: any) => {
  

  try {
    const updatedVideo = await prisma.uploadedVideo.update({
      where: {
        id: +data.id, // Assuming data.id contains the video ID
        userId:data.userId
      },
      data: {
        // Specify fields to update here (e.g., videoId)
        conVideoId: data.conVideoId,
      },
    });
    return updatedVideo;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const updateConVideoSrcField = async (data: any) => {
  

  try {
    const updatedVideo = await prisma.uploadedVideo.update({
      where: {
        id: +data.id, // Assuming data.id contains the video ID
        userId:data.userId
      },
      data: {
        // Specify fields to update here (e.g., videoId)
        conVideoSrc: data.conVideoSrc,
        conVideoTitle: data.conVideoTitle,
      },
    });
    return updatedVideo;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};


export const getAllVideos = async (data: any) => {
  try {
    const videos = await prisma.uploadedVideo.findMany({
      where: {
        userId: data.userId,
      },
    });
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
