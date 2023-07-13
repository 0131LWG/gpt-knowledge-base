import React, { useEffect } from 'react';
import { Card, Box, Link, Flex, Image, Button, keyframes } from '@chakra-ui/react';
import Markdown from '@/components/Markdown';
import { useMarkdown } from '@/hooks/useMarkdown';
import { getFilling } from '@/api/system';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useGlobalStore } from '@/store/global';

const rotation = keyframes`
from {
  -webkit-transform: rotate(0deg);
}
to {
  -webkit-transform: rotate(360deg);
}
`;

const Home = () => {
  const router = useRouter();
  const { inviterId } = router.query as { inviterId: string };
  const { data } = useMarkdown({ url: '/intro.md' });
  const { isPc } = useGlobalStore();
  const rotationAnimation = `${rotation} infinite 2s linear`;

  const shapeImgs = [
    { right: '140px', top: '500px' },
    { right: '900px', top: '200px' },
    { right: '300px', top: '160px' },
    { left: '300px', top: '660px' },
    { left: '250px', top: '300px' },
    { left: '800px', top: '680px' }
  ];

  const phoneShapeImgs = [
    { right: '40px', top: '100px' },
    { left: '30px', top: '280px' },
    { right: '50px', bottom: '60px' },
    { left: '20px', top: '30px' },
    { left: '40px', bottom: '200px' },
    { right: '80px', bottom: '400px' }
  ];

  useEffect(() => {
    if (inviterId) {
      localStorage.setItem('inviterId', inviterId);
    }
  }, [inviterId]);

  const { data: { beianText = '' } = {} } = useQuery(['init'], getFilling);

  return (
    <Box>
      <Flex
        flexDirection={isPc ? 'row' : 'column-reverse'}
        alignItems={'center'}
        justifyContent={'space-around'}
        h={'100vh'}
        position={'relative'}
      >
        {/* <Box id={'particles-js'} position={'absolute'} top={0} left={0} right={0} bottom={0} /> */}

        <Flex
          flexDirection={'column'}
          alignItems={'center'}
          pl={isPc ? '80px' : 0}
          userSelect={'none'}
        >
          <Image src="/icon/logo.png" w={['70px', '120px']} h={['70px', '120px']} alt={''}></Image>
          <Box
            fontWeight={'bold'}
            fontSize={['40px', '70px']}
            letterSpacing={'5px'}
            color={'myBlue.600'}
          >
            FastGpt
          </Box>
          <Box color={'myBlue.600'} fontSize={['30px', '50px']}>
            三分钟
          </Box>
          <Box color={'myBlue.600'} fontSize={['30px', '50px']}>
            搭建 AI 知识库
          </Box>

          <Button
            my={5}
            fontSize={['xl', '3xl']}
            h={'auto'}
            py={[2, 3]}
            onClick={() => router.push(`/model`)}
          >
            点击开始
          </Button>
        </Flex>
        <Image src="/imgs/b1.png" w={isPc ? '600px' : '300px'} alt={''} />
        {(isPc ? shapeImgs : phoneShapeImgs).map((item, index) => (
          <Image
            src={`/imgs/shape${index + 1}.png`}
            w={isPc ? '50px' : '36px'}
            alt={''}
            position={'absolute'}
            animation={rotationAnimation}
            key={index}
            {...item}
          />
        ))}
      </Flex>

      <Box w={'100%'} px={[5, 10]} pb={[5, 10]}>
        <Card p={5} lineHeight={2}>
          <Markdown source={data} isChatting={false} />
        </Card>

        <Card p={5} mt={4} textAlign={'center'}>
          {beianText && (
            <Link href="https://beian.miit.gov.cn/" target="_blank">
              {beianText}
            </Link>
          )}

          <Box>Made by FastGpt Team.</Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Home;
