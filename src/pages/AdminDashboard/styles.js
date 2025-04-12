import { useColorModeValue } from '@chakra-ui/react';

// Create a custom hook for colors
export const useCustomColors = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return {
    bgColor,
    cardBgColor,
    textColor,
    secondaryTextColor,
    borderColor,
    primaryColor: "#4F35DC",
    primaryHoverColor: "#3a28b5"
  };
};

export const buttonStyles = {
  bgColor: "#4F35DC",
  color: "white",
  _hover: {
    bgColor: "#3a28b5",
    transform: 'scale(1.02)',
    transition: 'all 0.2s ease-in-out',
  },
  _active: {
    transform: 'scale(0.98)',
  },
  _focus: {
    boxShadow: 'outline',
  },
};

export const secondaryButtonStyles = {
  bgColor: "transparent",
  color: "#4F35DC",
  border: "1px solid",
  borderColor: "#4F35DC",
  _hover: {
    bgColor: "#4F35DC10",
    transform: 'scale(1.02)',
    transition: 'all 0.2s ease-in-out',
  },
};

export const cardStyles = {
  borderRadius: "xl",
  boxShadow: "md",
  p: 4,
  _hover: {
    transform: 'translateY(-2px)',
    transition: 'all 0.2s ease-in-out',
    boxShadow: "lg"
  }
};