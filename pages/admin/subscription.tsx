import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import { Table } from '@/components/shared/table/Table';
import { MdDelete } from "react-icons/md";
import { useTranslation } from 'next-i18next';
import Badge from '@/components/shared/Badge';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const Subscription: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/subscriptions/subscription');
        const data = res.data.data.map((item: any) => ({
          id: item.id.toString(),
          cells: [
            { text: item.user.name },
            { text: item.subscriptionPackage.subscription_type },
            { text: dayjs(item.start_date).format('M/D/YYYY') },
            { text: dayjs(item.end_date).format('M/D/YYYY') },
            { text: item.status ? <Badge color="info">{t('active')}</Badge> : <Badge color="error">{t('Finished')}</Badge> },
            { 
              actions: [
                {
                  text: 'Delete',
                  icon: <MdDelete />,
                  onClick: () => handleDelete(item.id),
                  destructive: true,
                },
              ],
            },
          ],
        }));
        setTableData(data);
      } catch (error) {
        console.error('Error fetching subscription :', error);
      }
    };
    fetchData();
  }, [t]);

  const handleDelete = (id: number) => {
    alert(`Delete clicked for subscription ID: ${id}`);
    // Add the axios delete request here if needed
    // axios.delete(`/api/subscriptions/${id}`)
    //   .then(response => {
    //     // Handle successful deletion
    //   })
    //   .catch(error => {
    //     console.error('Error deleting subscription:', error);
    //   });
  };

  const columns = ['User Name', 'Package', 'Start Date', 'End Date', 'Status', 'Actions'];

  return (
    <div>
      <h1 className='mb-3 font-bold'>{t('subscriptions')}</h1>
      <Table cols={columns} body={tableData as any} noMoreResults={false} />
    </div>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Subscription;
