import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import React from 'react';

const KbDeleteAlert = ({
  isOpen,
  onClose,
  onOpen,
  onConfirmClick,
  deleteId
}: {
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
  onConfirmClick: (deleteId?: string) => void;
  deleteId?: string;
}) => {
  const cancelRef = React.useRef(null);

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              提示
            </AlertDialogHeader>

            <AlertDialogBody>确认删除该知识库？数据将无法恢复，请确认！</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant={'outline'}>
                取消
              </Button>
              <Button
                colorScheme={'red'}
                onClick={() => {
                  onConfirmClick(deleteId);
                  onClose();
                }}
                ml={3}
              >
                删除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default KbDeleteAlert;
