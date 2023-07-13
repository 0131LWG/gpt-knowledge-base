import React, { useMemo } from 'react';
import { Box, Flex, Text, Center } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import MyIcon from '../Icon';
import { useUserStore } from '@/store/user';
import { useChatStore } from '@/store/chat';
import HeaderUserAction from './headerUserAction';
import Avatar from '../Avatar';

export enum NavbarTypeEnum {
  normal = 'normal',
  small = 'small'
}

const Navbar = () => {
  const router = useRouter();
  const { userInfo, lastModelId } = useUserStore();
  const { lastChatModelId, lastChatId } = useChatStore();
  const navbarList = useMemo(
    () => [
      {
        label: '聊天',
        icon: 'chat',
        link: `/chat?modelId=${lastChatModelId}&chatId=${lastChatId}`,
        activeLink: ['/chat']
      },
      {
        label: '我的应用',
        icon: 'model',
        link: `/model?modelId=${lastModelId}`,
        activeLink: ['/model']
      },
      {
        label: '知识库',
        icon: 'kb',
        link: `/kb`,
        activeLink: ['/kb']
      },
      {
        label: '应用市场',
        icon: 'appStore',
        link: '/model/share',
        activeLink: ['/model/share']
      },
      {
        label: '邀请',
        icon: 'promotion',
        link: '/promotion',
        activeLink: ['/promotion']
      }
    ],
    [lastChatId, lastChatModelId, lastModelId]
  );

  return (
    <Center
      backgroundColor={'#F3F4F6'}
      h={'100%'}
      boxShadow={'4px 0px 4px 0px rgba(43, 45, 55, 0.01)'}
    >
      <Flex
        w={'100%'}
        flexDirection={'row'}
        align={'center'}
        justify={'space-between'}
        h={'100%'}
        userSelect={'none'}
        padding={'0 20px'}
        borderBottom={'1px solid #E3E3EE'}
      >
        {/* logo */}
        <Box
          border={'2px solid #465069'}
          borderRadius={'36px'}
          overflow={'hidden'}
          cursor={'pointer'}
          onClick={() => router.push('/number')}
        >
          <Avatar w={'36px'} h={'36px'} src={userInfo?.avatar} fallbackSrc={'/icon/human.png'} />
        </Box>
        {/* 导航列表 */}
        <Flex flexDirection={'row'}>
          {navbarList.map((item) => (
            <Flex
              key={item.label}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'center'}
              onClick={() => {
                if (item.link === router.asPath) return;
                router.push(item.link);
              }}
              cursor={'pointer'}
              padding={'0 10px'}
              h={'30px'}
              ml={'10px'}
              _hover={{
                backgroundColor: '#E3E3EE',
                borderRadius: '10px'
              }}
              {...(item.activeLink.includes(router.pathname)
                ? {
                    color: '#1C64F2 ',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 5px -1px rgba(0,0,0,.05),0 2px 4px -2px rgba(0,0,0,.05)',
                    borderRadius: '10px'
                  }
                : {
                    color: '#9096a5',
                    backgroundColor: 'transparent'
                  })}
            >
              <MyIcon name={item.icon as any} width={'14px'} height={'14px'} />
              <Text ml={'10px'}>{item.label}</Text>
            </Flex>
          ))}
        </Flex>
        <HeaderUserAction />
      </Flex>
    </Center>
  );
};

export default Navbar;
