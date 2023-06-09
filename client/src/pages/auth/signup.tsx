import SignupTemplate from '@/feature/auth/components/templates/SignupTemplate';
import prefetchUserData from '@/feature/auth/hooks/prefetchUserData';
import { useAuth } from '@/feature/auth/hooks/useAuth';
import { AuthProps, ConfirmPassword } from '@/types/props/AuthProps';
import Layout from '@/layout/components/templates/Layout';
import { User } from '@/types/api/User';
import { useBoolean } from '@chakra-ui/hooks';
import { useToast } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import React, { FormEvent, useRef } from 'react';

export interface signupProps extends ConfirmPassword, AuthProps {}

export default function Signup() {
  const auth = useAuth();
  const { t } = useTranslation('common');
  const toast = useToast();

  const [pwWatch, setPwWatch] = useBoolean(false);
  const [pwConfirmWatch, setPwConfirmWatch] = useBoolean(false);

  const userNameRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pwConfirmRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = userNameRef.current?.value;
    const password = pwRef.current?.value;
    const confirmPassword = pwConfirmRef.current?.value;
    if (password !== confirmPassword) {
      toast({ title: t('password-not-matched'), status: 'warning', isClosable: true });
      return;
    }

    if (userName && password) {
      const data: User = { userName, password };
      auth.signup(data);
    }
  };
  return (
    <>
      <Layout>
        <SignupTemplate
          onSubmit={onSubmit}
          userNameRef={userNameRef}
          pwRef={pwRef}
          pwWatch={pwWatch}
          pwConfirmRef={pwConfirmRef}
          setPwWatch={setPwWatch}
          pwConfirmWatch={pwConfirmWatch}
          setPwConfirmWatch={setPwConfirmWatch}
        />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return prefetchUserData(context);
};
