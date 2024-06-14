
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import { Table } from '@/components/shared/table/Table';

import { MdDelete } from "react-icons/md";
import { useTranslation } from 'next-i18next';
import Badge from '@/components/shared/Badge';


const Subscription: NextPageWithLayout = () => {
    const { t } = useTranslation('common');

  const columns = ['User Name', 'Package', 'start Date', 'End Date','Status','Actions'];
  
  const tableData = [
    {
      id: '1',
      cells: [
        { text: 'Malik' },
        { text: 'Basic' },
        { text: '6/14/2024' },
        { text: '7/14/2024' },
        { text:   <Badge color="info">{t('active')}</Badge> }, //if true show active else finish
        { 
          actions: [
            
            {
              text: 'Delete',
              icon: <MdDelete />,
              onClick: () => alert('Delete clicked'),
              destructive: true,
            },
          ],
        },
      ],
    },
    {
      id: '2',
      cells: [
        { text: 'Uzair' },
        { text: 'Pro' },
        { text: '6/14/2024' },
        { text: '7/14/2024' },
        { text: <Badge color="error">{t('Finished')}</Badge> },  // if true show active else finish
        { 
          actions: [
            
            {
              text: 'Delete',
              icon: <MdDelete />,
              onClick: () => alert('Delete clicked'),
              destructive: true,
            },
          ],
        },
      ],
    },
  ];

  return <>
  
   <div>
      <h1 className='mb-3 font-bold'>{t('subscriptions')}</h1>
      <Table cols={columns} body={tableData as any} noMoreResults={false} />
    </div>

  </>
  

  


};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Subscription;
