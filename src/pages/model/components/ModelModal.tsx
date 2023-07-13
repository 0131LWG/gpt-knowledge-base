import { useSelectFile } from '@/hooks/useSelectFile';
import { useUserStore } from '@/store/user';
import { ModelUpdateParams } from '@/types/model';
import { compressImg } from '@/utils/file';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/useToast';

const ModelModal = ({
  isOpen,
  onClose,
  onOpen,
  onSubmit
}: {
  onClose: () => void;
  onOpen: () => void;
  onSubmit: (name: string, avatar: string) => Promise<void>;
  isOpen: boolean;
}) => {
  const { toast } = useToast();

  const { modelDetail } = useUserStore();
  const [refresh, setRefresh] = useState(false);

  const { getValues, setValue, reset, register } = useForm<ModelUpdateParams>({
    defaultValues: modelDetail
  });

  const { File, onOpen: onOpenSelectFile } = useSelectFile({
    fileType: '.jpg,.png',
    multiple: false
  });

  const onSelectFile = useCallback(
    async (e: File[]) => {
      const file = e[0];
      if (!file) return;
      try {
        const base64 = await compressImg({
          file,
          maxW: 100,
          maxH: 100
        });
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新建应用</ModalHeader>
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
                    required: '应用名称不能为空'
                  })}
                />
              </Flex>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant={'outline'} mr={3} onClick={onClose}>
              取消
            </Button>
            <Button
              ml={3}
              onClick={() => {
                onSubmit(getValues('name'), getValues('avatar'));
                reset();
                // setTimeout(() => {

                //   setRefresh(!refresh);
                // }, 1000);
              }}
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

export default ModelModal;
