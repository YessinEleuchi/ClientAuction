import React, { useState, useEffect } from 'react';
import { IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bg = useColorModeValue('blue.500', 'blue.300');
  const color = useColorModeValue('white', 'gray.800');

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <IconButton
      icon={<FaArrowUp />}
      onClick={scrollToTop}
      position="fixed"
      bottom="20px"
      right="20px"
      bg={bg}
      color={color}
      aria-label="Retour en haut"
      size="lg"
      zIndex="1000"
      _hover={{ bg: ('blue.600', 'blue.400') }}
    />
  );
};

export default ScrollToTopButton;