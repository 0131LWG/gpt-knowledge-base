import React, { useState, Dispatch, useCallback } from 'react';
import { FormControl, Flex, Input, Button, FormErrorMessage, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { PageTypeEnum } from '@/constants/user';
import { postLogin } from '@/api/user';
import type { ResLogin } from '@/api/response/user';
import { useToast } from '@/hooks/useToast';

interface Props {
  setPageType: Dispatch<`${PageTypeEnum}`>;
  loginSuccess: (e: ResLogin) => void;
}

interface LoginFormType {
  username: string;
  password: string;
}

const LoginForm = ({ setPageType, loginSuccess }: Props) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormType>();

  const [requesting, setRequesting] = useState(false);

  const onclickLogin = useCallback(
    async ({ username, password }: LoginFormType) => {
      setRequesting(true);
      try {
        loginSuccess(
          await postLogin({
            username,
            password
          })
        );
        toast({
          title: '登录成功',
          status: 'success'
        });
      } catch (error: any) {
        toast({
          title: error.message || '登录异常',
          status: 'error'
        });
      }
      setRequesting(false);
    },
    [loginSuccess, toast]
  );

  return (
    <>
      <Box fontWeight={'bold'} fontSize={'2xl'} textAlign={'left'}>
        登录 FastGPT
      </Box>
      <Flex align={'center'} justifyContent={'flex-start'} mt={4} mb={4}>
        <Box fontSize="sm">新用户？</Box>
        <Box
          cursor={'pointer'}
          _hover={{ textDecoration: 'underline' }}
          onClick={() => setPageType('register')}
          fontSize="sm"
          color={'myBlue.600'}
        >
          注册账号
        </Box>
      </Flex>
      <form onSubmit={handleSubmit(onclickLogin)}>
        <FormControl isInvalid={!!errors.username}>
          <Input
            placeholder="邮箱/手机号"
            size={['md', 'lg']}
            {...register('username', {
              required: '邮箱/手机号不能为空',
              pattern: {
                value:
                  /(^1[3456789]\d{9}$)|(^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$)/,
                message: '邮箱/手机号格式错误'
              }
            })}
          ></Input>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={8} isInvalid={!!errors.password}>
          <Input
            type={'password'}
            size={['md', 'lg']}
            placeholder="密码"
            {...register('password', {
              required: '密码不能为空',
              minLength: {
                value: 4,
                message: '密码最少4位最多12位'
              },
              maxLength: {
                value: 12,
                message: '密码最少4位最多12位'
              }
            })}
          ></Input>
          <FormErrorMessage position={'absolute'} fontSize="xs">
            {!!errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          mt={8}
          w={'100%'}
          size={['md', 'lg']}
          colorScheme="blue"
          isLoading={requesting}
        >
          登录
        </Button>
        <Flex align={'center'} justifyContent={'flex-end'} mt={6} color={'myBlue.600'}>
          <Box
            cursor={'pointer'}
            _hover={{ textDecoration: 'underline' }}
            onClick={() => setPageType('forgetPassword')}
            fontSize="sm"
          >
            忘记密码?
          </Box>
        </Flex>
      </form>
    </>
  );
};

export default LoginForm;
