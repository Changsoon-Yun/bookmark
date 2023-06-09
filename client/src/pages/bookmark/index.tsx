import prefetchUserData from '@/feature/auth/hooks/prefetchUserData';
import Layout from '@/layout/components/templates/Layout';
import { GetServerSideProps } from 'next';
import React from 'react';

export default function Post() {
  return (
    <>
      <Layout>
        <div>bookmark index</div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return prefetchUserData(context);
};
