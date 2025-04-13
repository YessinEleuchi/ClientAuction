import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  useBreakpointValue,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import aboutUsImage from '../../assets/1.12.webp'; // Assuming you saved the image from user upload

const ExploreUs = () => {
  const primaryColor = useColorModeValue("#4F35DC", "blue.500");
  const primaryHoverColor = useColorModeValue("#3a28b5", "blue.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const bgColor = useColorModeValue("white", "gray.900");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBgColor = useColorModeValue("gray.50", "gray.800");

  const displayCols = useBreakpointValue({ base: 1, md: 1, lg: 2 });

  const buttonStyles = {
    bgColor: primaryColor,
    color: "white",
    _hover: {
      bgColor: primaryHoverColor,
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

  const boxStyles = {
    padding: { base: '4', md: '8', lg: '12' },
    minHeight: '28.7vh',
    color: textColor,
    bg: bgColor,
  };

  return (
    <Box {...boxStyles}>
      <Container maxW="container.xl">
        {/* About Us Section */}
        <Grid templateColumns={`repeat(${displayCols}, 1fr)`} gap={8} alignItems="center" mb={20}>
          <GridItem>
            <VStack align="start" spacing={6}>
              <Badge
                bg="#6a54e5"
                color="white"
                fontSize="md"
                px={4}
                py={2}
                borderRadius="full"
              >
                About Us
              </Badge>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                Who We Are
              </Heading>
              <Text fontSize={{ base: "md", lg: "lg" }} color={secondaryTextColor}>
                We are a passionate team dedicated to creating a secure, transparent, and efficient platform for online auctions. With years of expertise and a customer-first mindset, our mission is to transform the way people engage with auctions online.
              </Text>
              <Button
                size="lg"
                {...buttonStyles}
                as={Link}
                to="/contact"
              >
                Contact Us
              </Button>
            </VStack>
          </GridItem>
          <GridItem>
            <Box
              position="relative"
              overflow="hidden"
              borderRadius="xl"
              boxShadow="xl"
            >
              <Image
                w="full"
                h="auto"
                src={aboutUsImage}
                alt="Team collaboration"
                transform="scale(1.01)"
                transition="0.3s ease-in-out"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
          </GridItem>
        </Grid>

        {/* Our Vision & Mission */}
        <Grid templateColumns={`repeat(${displayCols}, 1fr)`} gap={12}>
          <GridItem>
            <Box
              bg={cardBgColor}
              p={8}
              borderRadius="xl"
              boxShadow="md"
              _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s ease-in-out' }}
              minHeight="250px"
            >
              <VStack align="start" spacing={4}>
                <Heading fontSize="2xl">Our Vision</Heading>
                <Text color={secondaryTextColor}>
                  To be the world’s leading digital auction platform, where every transaction is trusted, seamless, and accessible to everyone.
                </Text>
              </VStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={cardBgColor}
              p={8}
              borderRadius="xl"
              boxShadow="md"
              _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s ease-in-out' }}
              minHeight="250px"
            >
              <VStack align="start" spacing={4}>
                <Heading fontSize="2xl">Our Mission</Heading>
                <Text color={secondaryTextColor}>
                  Empower people and businesses by providing innovative auction experiences built on transparency, security, and outstanding customer service.
                </Text>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ExploreUs;