import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  Box,
  Flex,
  useTheme,
  Input,
  IconButton,
  Tooltip,
  Tag,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { Button, Menu, MenuButton, MenuList, MenuItem, Image } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { delKbById, postCreateKb } from '@/api/plugins/kb';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/user';
import MyIcon from '@/components/Icon';
import Avatar from '@/components/Avatar';
import KbModal from './KbModal';
// import { useConfirm } from '@/hooks/useConfirm';
import KbDeleteAlert from './KbDeleteAlert';
import { defaultKbDetail } from '@/constants/kb';

const KbList = ({ kbId }: { kbId: string }) => {
  const theme = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const { Loading, setIsLoading } = useLoading();
  const { myKbList, loadKbList } = useUserStore();
  const [searchText, setSearchText] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const { setLastKbId, setKbDetail, kbDetail, getKbDetail } = useUserStore();
  const kbs = useMemo(
    () => myKbList.filter((item) => new RegExp(searchText, 'ig').test(item.name + item.tags)),
    [myKbList, searchText]
  );
  /* 加载模型 */
  const { isLoading } = useQuery(['loadModels'], () => loadKbList(false));

  const handleCreateModel = useCallback(
    async () => {
      setIsLoading(true);
      try {
        // const name = `知识库${myKbList.length + 1}`;
        // const id = await postCreateKb({ name });
        // await loadKbList(true);
        // toast({
        //   title: '创建成功',
        //   status: 'success'
        // });
        console.log(defaultKbDetail);
        setKbDetail(defaultKbDetail);

        onOpen();
        console.log('-----isOpen-', isOpen, kbDetail);
        // router.replace(`/kb?kbId=${id}`);
      } catch (err: any) {
        toast({
          title: typeof err === 'string' ? err : err.message || '出现了意外',
          status: 'error'
        });
      }
      setIsLoading(false);
    },
    // [loadKbList, myKbList.length, onOpen, router, setIsLoading, toast]
    [isOpen, kbDetail, onOpen, setIsLoading, setKbDetail, toast]
  );

  const handleClick = (event: any) => {
    event.stopPropagation();
    console.log('Child div clicked');
  };

  const deleteOpenConfirm = (item: any) => {
    setDeleteId(item._id);
    onOpenAlert();
  };

  const editKbClick = useCallback(
    async (item: any) => {
      setLastKbId(item._id);
      setKbDetail(item);
      onOpen();
    },
    [onOpen, setKbDetail, setLastKbId]
  );

  /* 点击删除 */
  const onclickDelKb = useCallback(
    async (editId?: string) => {
      // setBtnLoading(true);
      console.log(editId, 'editId');
      try {
        editId ? await delKbById(editId) : delKbById(kbId);
        toast({
          title: '删除成功',
          status: 'success'
        });
        router.replace(`/kb?kbId=${myKbList.find((item) => item._id !== kbId)?._id || ''}`);
        await loadKbList(true);
      } catch (err: any) {
        toast({
          title: err?.message || '删除失败',
          status: 'error'
        });
      }
      // setBtnLoading(false);
    },
    [kbId, toast, router, myKbList, loadKbList]
  );

  return (
    <>
      <Flex
        position={'relative'}
        flexDirection={'column'}
        w={'100%'}
        h={'100%'}
        bg={'white'}
        mt={'25px'}
        borderRight={['', theme.borders.base]}
      >
        <Flex w={'90%'} my={5} mx={'auto'}>
          <Flex flex={1} mr={2} position={'relative'} alignItems={'center'}>
            <Input
              h={'32px'}
              placeholder="搜索知识库"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <MyIcon
                zIndex={10}
                position={'absolute'}
                right={3}
                name={'closeSolid'}
                w={'16px'}
                h={'16px'}
                color={'myGray.500'}
                cursor={'pointer'}
                onClick={() => setSearchText('')}
              />
            )}
          </Flex>
          <Tooltip label={'新建一个知识库'}>
            <IconButton
              h={'32px'}
              icon={<AddIcon />}
              aria-label={''}
              variant={'outline'}
              onClick={handleCreateModel}
            />
          </Tooltip>
        </Flex>
        <Box flex={'1 0 0'} h={0} overflow={'overlay'}>
          {kbs.map((item: any) => (
            <Flex
              key={item._id}
              position={'relative'}
              alignItems={['flex-start', 'center']}
              p={3}
              mb={[2, 0]}
              cursor={'pointer'}
              transition={'background-color .2s ease-in'}
              borderLeft={['', '5px solid transparent']}
              _hover={{
                backgroundColor: ['', '#dee0e3']
              }}
              {...(kbId === item._id
                ? {
                    backgroundColor: '#eff0f1',
                    borderLeftColor: 'myBlue.600 !important'
                  }
                : {})}
              onClick={() => {
                if (item._id === kbId) return;
                router.push(`/kb?kbId=${item._id}`);
              }}
            >
              <Avatar src={item.avatar} w={'34px'} h={'34px'} />
              <Box flex={'1 0 0'} w={0} ml={3}>
                <Box className="textEllipsis" color={'myGray.1000'}>
                  {item.name}
                </Box>
                {/* tags */}
                <Box className="textEllipsis" color={'myGray.400'} mt={1} fontSize={'sm'}>
                  {!item.tags ? (
                    <>{item.tags || '你还没设置标签~'}</>
                  ) : (
                    item.tags.split(' ').map((item: any, i: any) => (
                      <Tag
                        key={i}
                        mr={2}
                        mb={2}
                        variant={'outline'}
                        colorScheme={'blue'}
                        size={'sm'}
                      >
                        {item}
                      </Tag>
                    ))
                  )}
                </Box>
              </Box>
              {kbId === item._id ? (
                <>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Menu>
                      <MenuButton onClick={handleClick}>....</MenuButton>
                      <MenuList>
                        <MenuItem minH="48px" onClick={() => editKbClick(item)}>
                          <span>编辑</span>
                        </MenuItem>
                        <MenuItem minH="40px" onClick={() => deleteOpenConfirm(item)}>
                          <span>删除</span>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </>
              ) : (
                ''
              )}
            </Flex>
          ))}

          {!isLoading && myKbList.length === 0 && (
            <Flex h={'100%'} flexDirection={'column'} alignItems={'center'} pt={'30vh'}>
              <MyIcon name="empty" w={'48px'} h={'48px'} color={'transparent'} />
              <Box mt={2} color={'myGray.500'}>
                知识库空空如也~
              </Box>
            </Flex>
          )}
        </Box>
        <Loading loading={isLoading} fixed={false} />
      </Flex>
      <KbModal isOpen={isOpen} onClose={onClose} onOpen={onOpen}></KbModal>

      <KbDeleteAlert
        isOpen={isOpenAlert}
        onOpen={onOpenAlert}
        onClose={onCloseAlert}
        onConfirmClick={onclickDelKb}
        deleteId={deleteId}
      />
    </>
  );
};

export default KbList;
