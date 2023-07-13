import React, { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Box,
  Flex,
  Button,
  Tooltip,
  FormControl,
  Input,
  Tag,
  IconButton
} from '@chakra-ui/react';
import { QuestionOutlineIcon, DeleteIcon } from '@chakra-ui/icons';
import { useToast } from '@/hooks/useToast';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/user';
import { delKbById, putKbById } from '@/api/plugins/kb';
import { KbItemType } from '@/types/plugin';
import { useSelectFile } from '@/hooks/useSelectFile';
import { useConfirm } from '@/hooks/useConfirm';
import { compressImg } from '@/utils/file';
import DataCard from './DataCard';
import { getErrText } from '@/utils/tools';
import Avatar from '@/components/Avatar';

const Detail = ({ kbId }: { kbId: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const InputRef = useRef<HTMLInputElement>(null);
  const { setLastKbId, kbDetail, getKbDetail, loadKbList, myKbList } = useUserStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // const { getValues, formState, setValue, reset, register, handleSubmit } = useForm<KbItemType>({
  //   defaultValues: kbDetail
  // });

  // // useQuery([kbId, myKbList], () => getKbDetail(kbId), {
  // //   onSuccess(res) {
  // //     kbId && setLastKbId(kbId);
  // //     if (res) {
  // //       reset(res);
  // //       if (InputRef.current) {
  // //         InputRef.current.value = res.tags;
  // //       }
  // //     }
  // //   },
  // //   onError(err: any) {
  // //     toast({
  // //       title: getErrText(err, '获取知识库异常'),
  // //       status: 'error'
  // //     });
  // //     loadKbList(true);
  // //     setLastKbId('');
  // //     router.replace(`/kb?kbId=${myKbList[0]?._id || ''}`);
  // //   }
  // // });

  // /* 点击删除 */
  // const onclickDelKb = useCallback(async () => {
  //   setBtnLoading(true);
  //   try {
  //     await delKbById(kbId);
  //     toast({
  //       title: '删除成功',
  //       status: 'success'
  //     });
  //     router.replace(`/kb?kbId=${myKbList.find((item) => item._id !== kbId)?._id || ''}`);
  //     await loadKbList(true);
  //   } catch (err: any) {
  //     toast({
  //       title: err?.message || '删除失败',
  //       status: 'error'
  //     });
  //   }
  //   setBtnLoading(false);
  // }, [setBtnLoading, kbId, toast, router, myKbList, loadKbList]);

  // const saveSubmitSuccess = useCallback(
  //   async (data: KbItemType) => {
  //     setBtnLoading(true);
  //     try {
  //       await putKbById({
  //         id: kbId,
  //         ...data
  //       });
  //       await getKbDetail(kbId, true);
  //       toast({
  //         title: '更新成功',
  //         status: 'success'
  //       });
  //       loadKbList(true);
  //     } catch (err: any) {
  //       toast({
  //         title: err?.message || '更新失败',
  //         status: 'error'
  //       });
  //     }
  //     setBtnLoading(false);
  //   },
  //   [getKbDetail, kbId, loadKbList, toast]
  // );
  // const saveSubmitError = useCallback(() => {
  //   // deep search message
  //   const deepSearch = (obj: any): string => {
  //     if (!obj) return '提交表单错误';
  //     if (!!obj.message) {
  //       return obj.message;
  //     }
  //     return deepSearch(Object.values(obj)[0]);
  //   };
  //   toast({
  //     title: deepSearch(formState.errors),
  //     status: 'error',
  //     duration: 4000,
  //     isClosable: true
  //   });
  // }, [formState.errors, toast]);

  // const onSelectFile = useCallback(
  //   async (e: File[]) => {
  //     const file = e[0];
  //     if (!file) return;
  //     try {
  //       const base64 = await compressImg({
  //         file,
  //         maxW: 100,
  //         maxH: 100
  //       });
  //       setValue('avatar', base64);
  //       setRefresh((state) => !state);
  //     } catch (err: any) {
  //       toast({
  //         title: typeof err === 'string' ? err : '头像选择异常',
  //         status: 'warning'
  //       });
  //     }
  //   },
  //   [setRefresh, setValue, toast]
  // );

  return (
    <Box h={'100%'} p={5} overflow={'overlay'} position={'relative'}>
      <Card p={3} mt={2}>
        <DataCard kbId={kbId} />
      </Card>
    </Box>
  );
};

export default Detail;
