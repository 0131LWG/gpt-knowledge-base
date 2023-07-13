import React, { useCallback } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, MenuDivider, Flex } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Avatar from '@/components/Avatar';
import { useUserStore } from '@/store/user';
import { useRouter } from 'next/router';
import { clearCookie } from '@/utils/user';

const HeaderUserAction = () => {
  const { userInfo, setUserInfo } = useUserStore();
  const router = useRouter();

  const onclickLogOut = useCallback(() => {
    clearCookie();
    setUserInfo(null);
    router.replace('/login');
  }, [router, setUserInfo]);

  return (
    <Menu placement="bottom-end">
      <MenuButton as={Button} colorScheme="#000" variant="ghost" rightIcon={<ChevronDownIcon />}>
        <Avatar src={userInfo?.avatar} w="35px" h="35px" />
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Flex align="center">
            <Avatar src={userInfo?.avatar} w={'30px'} h={'30px'} />
            {userInfo?.username}
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => router.push('/openapi')}>API KEY 设置</MenuItem>
        <MenuItem onClick={() => router.push('/number')}>账号</MenuItem>
        <MenuItem onClick={onclickLogOut}>退出登录</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HeaderUserAction;
