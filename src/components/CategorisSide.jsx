import React from 'react';
import {
  Card,
  CloseButton,
  Heading,
  Box,
  Button,
  Slide,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

const CategoriesSidebar = ({ isSideMenuOpen, setIsSideMenuOpen, categories }) => {
  const categoryButtonStyles = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    bg: useColorModeValue('gray.100', 'gray.700'),
    color: useColorModeValue('gray.800', 'gray.200'),
    _hover: {
      bg: useColorModeValue('gray.200', 'gray.600'),
      transform: 'translateX(5px)',
      transition: 'all 0.2s',
    },
    py: 3,
    px: 4,
    my: 2,
    borderRadius: 'md',
    fontWeight: 'medium',
  };

  return (
    <Slide direction="left" in={isSideMenuOpen} style={{ zIndex: 10 }}>
      <Card
        width={{ base: '250px', md: '300px' }}
        maxW="100%"
        height="100vh"
        p={4}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="lg"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton
          size="lg"
          ml="auto"
          mt={4}
          mr={4}
          onClick={() => setIsSideMenuOpen(false)}
          color={useColorModeValue('gray.600', 'gray.400')}
        />
        <Heading
          color={useColorModeValue('gray.700', 'gray.200')}
          mt={6}
          ml={5}
          fontSize="2xl"
          fontWeight="bold"
        >
          Categories
        </Heading>
        <Box p={5}>
          <Button {...categoryButtonStyles}>
            <Link to="/listings" onClick={() => setIsSideMenuOpen(false)}>
              All
            </Link>
          </Button>
          {categories.map((category, i) => (
            <Button {...categoryButtonStyles} key={i}>
              <Link
                to={`/listings/categories/${category.slug}`}
                onClick={() => setIsSideMenuOpen(false)}
              >
                {category.name}
              </Link>
            </Button>
          ))}
          <Button {...categoryButtonStyles}>
            <Link to="/listings/categories/other" onClick={() => setIsSideMenuOpen(false)}>
              Other
            </Link>
          </Button>
        </Box>
      </Card>
    </Slide>
  );
};

export default CategoriesSidebar;