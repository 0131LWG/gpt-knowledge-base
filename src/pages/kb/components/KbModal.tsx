import { useSelectFile } from '@/hooks/useSelectFile';
import { useUserStore } from '@/store/user';
import { KbItemType } from '@/types/plugin';
import { compressImg } from '@/utils/file';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Tooltip
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/useToast';
import { postCreateKb, putKbById } from '@/api/plugins/kb';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { getErrText } from '@/utils/tools';
import { defaultKbDetail } from '@/constants/kb';
const KbModal = ({
  isOpen,
  onClose,
  onOpen
}: {
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { kbDetail, getKbDetail, loadKbList } = useUserStore();
  const [refresh, setRefresh] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const { getValues, formState, setValue, reset, register, handleSubmit } = useForm<KbItemType>({
    defaultValues: kbDetail
  });

  useEffect(() => {
    reset(kbDetail);
    console.log(getValues(), 'useEffect----11111111');
  }, [getValues, kbDetail, reset]);

  // useQuery([kbId, myKbList], () => {
  //   console.log('useQuery', kbId)
  //   kbId? getKbDetail(kbId): ''

  // }, {
  //   onSuccess(res: any) {
  //     kbId && setLastKbId(kbId);
  //     if (res) {
  //       reset(res);
  //       if (InputRef.current) {
  //         InputRef.current.value = res.tags;
  //       }
  //     }
  //   },
  //   onError(err: any) {
  //     toast({
  //       title: getErrText(err, '获取知识库异常'),
  //       status: 'error'
  //     });
  //     loadKbList(true);
  //     setLastKbId('');
  //     router.replace(`/kb?kbId=${myKbList[0]?._id || ''}`);
  //   }
  // });

  // const { getValues, formState, setValue, reset, register, handleSubmit } = useForm<KbItemType>({
  //   defaultValues: kbDetail
  // });

  console.log(kbDetail, 'kbDetail222222222222222222');
  console.log(getValues(), 'getValues33333333333333');
  const { File, onOpen: onOpenSelectFile } = useSelectFile({
    fileType: '.jpg,.png',
    multiple: false
  });

  const onSelectFile = useCallback(
    async (e: File[]) => {
      const file = e[0];
      if (!file) return;
      console.log('onSelectFile');
      try {
        const base64 = await compressImg({
          file,
          maxW: 100,
          maxH: 100
        });
        console.log('base64', base64);
        setValue('avatar', base64);
        setRefresh((state: any) => !state);
      } catch (err: any) {
        toast({
          title: typeof err === 'string' ? err : '头像选择异常',
          status: 'warning'
        });
      }
    },
    [setRefresh, setValue, toast]
  );

  const saveSubmitSuccess = useCallback(
    async (data: KbItemType) => {
      setBtnLoading(true);
      try {
        if (kbDetail._id) {
          await putKbById({
            id: kbDetail._id,
            ...data
          });
          await getKbDetail(kbDetail._id, true);
          toast({
            title: '更新成功',
            status: 'success'
          });
          onClose();
          loadKbList(true);
          reset(defaultKbDetail);
        } else {
          console.log(data, '----data----');
          const id = await postCreateKb({ ...data });
          await loadKbList(true);
          toast({
            title: '创建成功',
            status: 'success'
          });
          onClose();
          reset(defaultKbDetail);
          router.replace(`/kb?kbId=${id}`);
        }
      } catch (err: any) {
        toast({
          title: err?.message || '更新失败',
          status: 'error'
        });
      }
      setBtnLoading(false);
    },
    [getKbDetail, kbDetail._id, loadKbList, onClose, reset, router, toast]
  );
  const saveSubmitError = useCallback(() => {
    // deep search message
    const deepSearch = (obj: any): string => {
      if (!obj) return '提交表单错误';
      if (!!obj.message) {
        return obj.message;
      }
      return deepSearch(Object.values(obj)[0]);
    };
    toast({
      title: deepSearch(formState.errors),
      status: 'error',
      duration: 4000,
      isClosable: true
    });
  }, [formState.errors, toast]);

  const InputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>维护知识库</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex mt={5} alignItems={'center'}>
              <Box flex={'0 0 60px'} w={0}>
                头像
              </Box>
              <Avatar
                src={getValues('avatar')}
                w={['28px', '36px']}
                h={['28px', '36px']}
                cursor={'pointer'}
                title={'点击切换头像'}
                onClick={onOpenSelectFile}
              />
            </Flex>
            <FormControl mt={5}>
              <Flex alignItems={'center'} maxW={'350px'}>
                <Box flex={'0 0 60px'} w={0}>
                  名称
                </Box>
                <Input
                  {...register('name', {
                    required: '知识库名称不能为空'
                  })}
                />
              </Flex>
            </FormControl>
            <Box>
              <Flex mt={5} alignItems={'center'} maxW={'350px'} flexWrap={'wrap'}>
                <Box flex={'0 0 60px'} w={0}>
                  标签
                  <Tooltip label={'仅用于记忆，用空格隔开多个标签'}>
                    <QuestionOutlineIcon ml={1} />
                  </Tooltip>
                </Box>
                <Input
                  flex={1}
                  ref={InputRef}
                  placeholder={'标签,使用空格分割。'}
                  onChange={(e) => {
                    setValue('tags', e.target.value);
                    setRefresh(!refresh);
                  }}
                />
                <Box pl={'60px'} mt={2} w="100%">
                  {getValues('tags')
                    .split(' ')
                    .filter((item) => item)
                    .map((item, i) => (
                      <Tag mr={2} mb={2} key={i} variant={'outline'} colorScheme={'blue'}>
                        {item}
                      </Tag>
                    ))}
                </Box>
              </Flex>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant={'outline'} mr={3} onClick={onClose}>
              取消
            </Button>
            <Button
              isLoading={btnLoading}
              ml={3}
              onClick={handleSubmit(saveSubmitSuccess, saveSubmitError)}
            >
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <File onSelect={onSelectFile} />
    </>
  );
};

export default KbModal;
