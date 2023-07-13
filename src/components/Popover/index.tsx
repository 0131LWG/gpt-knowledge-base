import React from 'react';
import type { PopoverProps } from '@chakra-ui/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverFooter,
  PopoverCloseButton
} from '@chakra-ui/react';

interface Props extends PopoverProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  isCloseBtn?: boolean;
  isArrow?: boolean;
}

const defaultProps: Props = {
  children: '请传入children',
  isCloseBtn: false,
  isArrow: true
};

const CustomPopover = (props: Props = defaultProps) => {
  return (
    <Popover {...props}>
      <PopoverTrigger>{props.children}</PopoverTrigger>;
      <PopoverContent>
        {props.isArrow && <PopoverArrow />}
        {props.isCloseBtn && <PopoverCloseButton />}
        {props.header && <PopoverHeader>{props.header}</PopoverHeader>}
        {props.body && <PopoverBody>{props.body}</PopoverBody>}
        {props.footer && <PopoverFooter>{props.footer}</PopoverFooter>}
      </PopoverContent>
    </Popover>
  );
};

export default CustomPopover;
