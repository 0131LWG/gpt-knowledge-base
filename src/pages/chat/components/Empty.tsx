import React from 'react';
import { Card, Box, Flex } from '@chakra-ui/react';
import { useMarkdown } from '@/hooks/useMarkdown';
import Markdown from '@/components/Markdown';
import { LOGO_ICON } from '@/constants/chat';
import Avatar from '@/components/Avatar';
import { useGlobalStore } from '@/store/global';

const Empty = ({
  showChatProblem,
  model: { name, intro, avatar }
}: {
  showChatProblem: boolean;
  model: {
    name: string;
    intro: string;
    avatar: string;
  };
}) => {
  const { data: chatProblem } = useMarkdown({ url: '/chatProblem.md' });
  const { data: versionIntro } = useMarkdown({ url: '/versionIntro.md' });
  const { isPc } = useGlobalStore();

  return (
    <Box
      minH={'100%'}
      w={'85%'}
      maxW={'1000px'}
      m={'auto'}
      py={'5vh'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {name && (
        <Card p={4} mb={10}>
          <Flex mb={2} alignItems={'center'} justifyContent={'center'}>
            <Avatar src={avatar} w={'32px'} h={'32px'} />
            <Box ml={3} fontSize={'3xl'} fontWeight={'bold'}>
              {name}
            </Box>
          </Flex>
          <Box whiteSpace={'pre-line'}>{intro}</Box>
        </Card>
      )}

      {showChatProblem && (
        <Flex flexDirection={isPc ? 'row' : 'column'}>
          {/* version intro */}
          <Card p={4} flex="1">
            <Markdown source={versionIntro} />
          </Card>
          <Card p={4} flex="1" ml={isPc ? '20px' : '0'} mt={isPc ? '0' : '20px'}>
            <Markdown source={chatProblem} />
          </Card>
        </Flex>
      )}
    </Box>
  );
};

export default Empty;
