import { useAuth } from '@/feature/auth/hooks/useAuth';
import LoginTemplate from '@/feature/auth/login/LoginTemplate';
import Layout from '@/layout/Layout';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { FormEvent, SetStateAction, useState } from 'react';

export interface LoginProps {
  psType: boolean;
  psTypeHandler: React.MouseEventHandler<HTMLDivElement>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setPassword: React.Dispatch<SetStateAction<string>>;
  setEmail: React.Dispatch<SetStateAction<string>>;
}

export default function Login() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [psType, setPsType] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { email, password };
    await auth.login(data);
  };
  const psTypeHandler = () => {
    setPsType(!psType);
  };

  return (
    <>
      <Layout>
        <LoginTemplate
          onSubmit={onSubmit}
          psType={psType}
          psTypeHandler={psTypeHandler}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'ko' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['header'])),
  },
});
