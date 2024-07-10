  import app from '@/lib/app';
import Image from 'next/image';
import useTheme from 'hooks/useTheme';
import Link from 'next/link';


const Brand = () => {
  const { theme } = useTheme();
  return (
    <Link  href="/">
    <div className="flex pt-6 ml-4 shrink-0 items-center text-xl font-bold gap-2 dark:text-gray-100">
      
      <Image
        src={theme !== 'dark' ? '/Ed.png' : '/Ed.png'}
        alt={app.name}
        width={30}
        height={30}
      />
      {app.name}
    </div>
    </Link>
  );
};

export default Brand;
