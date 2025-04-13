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
  Badge,
  Flex,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHandshake, FaShieldAlt, FaBolt, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations
import aboutUsImage from '../../assets/1.12.webp';
import { keyframes } from '@emotion/react'; // Your image

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const ExploreUs = () => {
  // Color scheme aligned with BidTun
  const primaryColor = useColorModeValue('#4F35DC', 'blue.500');
  const primaryHoverColor = useColorModeValue('#3a28b5', 'blue.600');
  const accentColor = useColorModeValue('#6a54e5', 'purple.400');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const lightCardBgColor = useColorModeValue('gray.50', 'gray.800');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');
  const gradientBg = useColorModeValue(
    'linear(to-b, white, gray.50)',
    'linear(to-b, gray.900, gray.800)'
  );

  // Responsive values
  const displayCols = useBreakpointValue({ base: '1fr', md: '1fr', lg: '1fr 1fr' });
  const fontSizeHeading = useBreakpointValue({ base: '3xl', md: '4xl', lg: '5xl' });
  const fontSizeSubheading = useBreakpointValue({ base: 'xl', md: '2xl' });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Button styles
  const buttonStyles = {
    bg: primaryColor,
    color: 'white',
    fontSize: { base: 'md', md: 'lg' },
    px: 6,
    py: 3,
    borderRadius: 'lg',
    boxShadow: 'md',
    _hover: {
      bg: primaryHoverColor,
      transform: prefersReducedMotion ? 'none' : 'scale(1.05)',
      boxShadow: 'lg',
      transition: 'all 0.3s ease-in-out',
    },
    _active: {
      transform: 'scale(0.98)',
      boxShadow: 'sm',
    },
    _focus: {
      boxShadow: 'outline',
      outline: 'none',
    },
  };

  // Animation for cards and image
  const floatAnimation = prefersReducedMotion ? undefined : `${float} 4s ease-in-out infinite`;

  return (
    <Box
      bgGradient={gradientBg}
      color={textColor}
      pt={{ base: 12, md: 20 }}
      pb={{ base: 16, md: 24 }}
      position="relative"
      role="region"
      aria-labelledby="about-us-heading"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
        {/* About Us Section */}
        <Grid
          templateColumns={displayCols}
          gap={{ base: 8, md: 16 }}
          alignItems="center"
          mb={{ base: 16, md: 24 }}
        >
          <GridItem>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <VStack align="start" spacing={{ base: 5, md: 7 }}>
                <Badge
                  bg={accentColor}
                  color="white"
                  fontSize={{ base: 'sm', md: 'md' }}
                  px={4}
                  py={2}
                  borderRadius="full"
                  textTransform="uppercase"
                >
                  About BidTun
                </Badge>
                <Heading
                  id="about-us-heading"
                  as="h1"
                  fontSize={fontSizeHeading}
                  fontWeight="extrabold"
                  lineHeight="shorter"
                >
                  Welcome to BidTun
                </Heading>
                <VStack align="start" spacing={4}>
                  <Text
                    fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                    color={secondaryTextColor}
                    lineHeight="tall"
                  >
                    At BidTun, we’re redefining online auctions with a platform built on trust, innovation, and excitement. Our team is driven by a passion for connecting buyers and sellers worldwide, offering a seamless experience for discovering and bidding on unique items.
                  </Text>
                  <Text
                    fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                    color={secondaryTextColor}
                    lineHeight="tall"
                  >
                    Founded with a vision to make auctions accessible and secure, we combine cutting-edge technology with a customer-first approach. Whether you’re a collector, a business, or a casual bidder, BidTun is your gateway to thrilling auction experiences.
                  </Text>
                </VStack>
                <Flex gap={4} flexWrap="wrap">
                  <Button
                    as={Link}
                    to="/contact"
                    size="lg"
                    {...buttonStyles}
                    aria-label="Contact BidTun"
                  >
                    Get in Touch
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    size="lg"
                    variant="outline"
                    colorScheme={useColorModeValue('blue', 'purple')}
                    borderWidth={2}
                    fontWeight="semibold"
                    _hover={{
                      bg: useColorModeValue('blue.50', 'purple.900'),
                      transform: prefersReducedMotion ? 'none' : 'scale(1.05)',
                    }}
                    aria-label="Join BidTun now"
                  >
                    Join Now
                  </Button>
                </Flex>
              </VStack>
            </motion.div>
          </GridItem>

          <GridItem>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <Box
                as="figure"
                overflow="hidden"
                borderRadius="2xl"
                boxShadow="2xl"
                position="relative"
                _hover={{
                  transform: prefersReducedMotion ? 'none' : 'scale(1.02)',
                  transition: 'transform 0.3s ease-in-out',
                }}
                animation={floatAnimation}
              >
                <Image
                  src={aboutUsImage}
                  alt="BidTun team collaborating on auctions"
                  fallbackSrc="https://via.placeholder.com/600x400?text=BidTun+Explore"
                  w="full"
                  h={{ base: '300px', md: '500px' }}
                  objectFit="cover"
                  loading="lazy"
                />
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bgGradient="linear(to-t, rgba(0,0,0,0.1), transparent)"
                  borderRadius="2xl"
                />
              </Box>
            </motion.div>
          </GridItem>
        </Grid>

        {/* Vision and Mission Section */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={{ base: 6, md: 8 }}
          mb={{ base: 16, md: 24 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          >
            <Box
              bg={lightCardBgColor}
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
              boxShadow="sm"
              minHeight="250px"
              _hover={{
                boxShadow: 'md',
                transform: prefersReducedMotion ? 'none' : 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <VStack align="start" spacing={4}>
                <Heading as="h2" fontSize={fontSizeSubheading} fontWeight="bold">
                  Our Vision
                </Heading>
                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} color={secondaryTextColor} lineHeight="tall">
                  We envision BidTun as the global leader in online auctions, where every bid is an opportunity to connect, compete, and celebrate. Our platform aims to make auctions inclusive, secure, and exciting for users everywhere.
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} color={secondaryTextColor} lineHeight="tall">
                  By leveraging innovative technology, we strive to create a marketplace that transcends borders, empowering individuals and businesses to trade with confidence.
                </Text>
              </VStack>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          >
            <Box
              bg={lightCardBgColor}
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
              boxShadow="sm"
              minHeight="250px"
              _hover={{
                boxShadow: 'md',
                transform: prefersReducedMotion ? 'none' : 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <VStack align="start" spacing={4}>
                <Heading as="h2" fontSize={fontSizeSubheading} fontWeight="bold">
                  Our Mission
                </Heading>
                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} color={secondaryTextColor} lineHeight="tall">
                  Our mission is to empower users with a seamless, secure auction platform that delivers real-time excitement and fair opportunities. We’re committed to making every transaction transparent and rewarding.
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} color={secondaryTextColor} lineHeight="tall">
                  From intuitive bidding tools to robust security measures, BidTun is designed to provide outstanding service, fostering a community where everyone thrives.
                </Text>
              </VStack>
            </Box>
          </motion.div>
        </Grid>

        {/* Core Values Section */}
        <Box mb={{ base: 16, md: 24 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
          >
            <VStack spacing={{ base: 6, md: 8 }} mb={{ base: 8, md: 12 }} textAlign="center">
              <Badge
                bg={accentColor}
                color="white"
                fontSize={{ base: 'sm', md: 'md' }}
                px={4}
                py={2}
                borderRadius="full"
                textTransform="uppercase"
              >
                Our Core Values
              </Badge>
              <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="extrabold">
                What Drives Us
              </Heading>
              <Text
                maxW="800px"
                fontSize={{ base: 'md', md: 'lg' }}
                color={secondaryTextColor}
                lineHeight="tall"
              >
                At BidTun, our core values shape every decision we make. They reflect our commitment to creating a trusted, innovative, and inclusive auction platform that puts users first.
              </Text>
            </VStack>
          </motion.div>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={{ base: 6, md: 8 }}
          >
            {[
              {
                icon: <FaHandshake size="40px" color={primaryColor} />,
                title: 'Trust',
                text: [
                  'Trust is the cornerstone of BidTun. We ensure every auction is transparent, with clear rules and verified listings.',
                  'Our commitment to fairness builds confidence, letting you bid and sell with peace of mind.',
                ],
              },
              {
                icon: <FaShieldAlt size="40px" color={primaryColor} />,
                title: 'Security',
                text: [
                  'Your safety is our priority. We use advanced encryption and fraud detection to protect every transaction.',
                  'BidTun’s secure platform lets you focus on finding treasures without worry.',
                ],
              },
              {
                icon: <FaBolt size="40px" color={primaryColor} />,
                title: 'Innovation',
                text: [
                  'We’re always evolving, introducing smart features like real-time bidding and personalized alerts.',
                  'BidTun pushes the boundaries of what an auction platform can be, keeping you ahead of the curve.',
                ],
              },
              {
                icon: <FaUsers size="40px" color={primaryColor} />,
                title: 'Community',
                text: [
                  'BidTun is more than a platform—it’s a global community of passionate bidders and sellers.',
                  'We celebrate diversity and inclusion, creating a space where everyone feels valued.',
                ],
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 + index * 0.2 }}
              >
                <Box
                  bg={lightCardBgColor}
                  p={{ base: 6, md: 8 }}
                  borderRadius="lg"
                  boxShadow="sm"
                  textAlign="center"
                  _hover={{
                    boxShadow: 'md',
                    transform: prefersReducedMotion ? 'none' : 'translateY(-4px)',
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Box mb={4}>{value.icon}</Box>
                  <Heading as="h3" fontSize="xl" mb={3} fontWeight="bold">
                    {value.title}
                  </Heading>
                  {value.text.map((paragraph, i) => (
                    <Text
                      key={i}
                      fontSize={{ base: 'sm', md: 'md' }}
                      color={secondaryTextColor}
                      mb={2}
                    >
                      {paragraph}
                    </Text>
                  ))}
                </Box>
              </motion.div>
            ))}
          </Grid>
        </Box>

        {/* Why Choose BidTun Section */}
        <Box textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
          >
            <VStack spacing={{ base: 6, md: 8 }} mb={{ base: 8, md: 12 }}>
              <Badge
                bg={accentColor}
                color="white"
                fontSize={{ base: 'sm', md: 'md' }}
                px={4}
                py={2}
                borderRadius="full"
                textTransform="uppercase"
              >
                Why BidTun?
              </Badge>
              <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="extrabold">
                Why Choose BidTun
              </Heading>
              <Text
                maxW="800px"
                fontSize={{ base: 'md', md: 'lg' }}
                color={secondaryTextColor}
                lineHeight="tall"
                mx="auto"
              >
                From unparalleled security to an intuitive bidding experience, BidTun offers everything you need to succeed in online auctions. Join a platform that’s designed with you in mind.
              </Text>
            </VStack>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.4 }}
          >
            <Button
              as={Link}
              to="/listings"
              size="lg"
              {...buttonStyles}
              fontSize={{ base: 'lg', md: 'xl' }}
              px={8}
              py={6}
              aria-label="Explore auctions on BidTun"
            >
              Discover Auctions
            </Button>
          </motion.div>
        </Box>
      </Container>

      {/* Decorative Divider */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="6px"
        bgGradient={useColorModeValue(
          'linear(to-r, blue.400, purple.500)',
          'linear(to-r, blue.600, purple.600)'
        )}
      />
    </Box>
  );
};

export default ExploreUs;