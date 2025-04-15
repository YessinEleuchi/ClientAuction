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
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHandshake, FaShieldAlt, FaBolt, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { translations } from '../../constants/translations';
import aboutUsImage from '../../assets/1.12.webp';
import partnerLogo1 from '../../assets/attijari.png';
import partnerLogo2 from '../../assets/adex.png';
import partnerLogo3 from '../../assets/biat.jpg';
import partnerLogo4 from '../../assets/Logo_First-1.png';

const ExploreUs = () => {
  const language = useSelector((state) => state.language.currentLanguage);
  const t = translations[language].exploreUs;

  const primaryColor = useColorModeValue('#4F35DC', 'blue.500');
  const primaryHoverColor = useColorModeValue('#3a28b5', 'blue.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');
  const bgColor = useColorModeValue('white', 'gray.800');
  const gradientBg = useColorModeValue('linear(to-b, white, white)', 'linear(to-b, gray.900, gray.800)');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const buttonStyles = {
    bg: primaryColor,
    color: 'white',
    fontSize: { base: 'sm', md: 'md' },
    px: { base: 4, md: 6 },
    py: { base: 2, md: 3 },
    borderRadius: 'full',
    _hover: {
      bg: primaryHoverColor,
      transform: prefersReducedMotion ? 'none' : 'translateY(-2px)',
      transition: 'all 0.3s ease-in-out',
    },
    _focus: {
      outline: '3px solid',
      outlineColor: primaryColor,
      outlineOffset: '2px',
    },
  };

  const cardStyles = {
    bg: cardBg,
    p: { base: 4, md: 6 },
    borderRadius: 'lg',
    boxShadow: 'md',
    transition: 'all 0.3s ease-in-out',
    _hover: {
      transform: prefersReducedMotion ? 'none' : 'translateY(-4px)',
      boxShadow: 'lg',
    },
    _focusWithin: {
      boxShadow: 'lg',
    },
  };

  const partners = t.partners.names.map((name, index) => ({
    logo: [partnerLogo1, partnerLogo2, partnerLogo3, partnerLogo4][index],
    name,
  }));

  return (
    <Box bgGradient={gradientBg} color={textColor} fontFamily="'Inter', sans-serif">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }} py={{ base: 12, md: 20 }}>
        {/* Hero Section */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 8, md: 12 }} alignItems="center" mb={{ base: 16, md: 24 }}>
          <GridItem>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <VStack align="start" spacing={{ base: 4, md: 6 }}>
                <Heading
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  fontWeight="extrabold"
                  lineHeight="1.2"
                  letterSpacing="tight"
                >
                  {t.aboutUs.title}
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={secondaryTextColor} lineHeight="1.8">
                  {t.aboutUs.text1}
                </Text>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={secondaryTextColor} lineHeight="1.8">
                  {t.aboutUs.text2}
                </Text>
                <Flex gap={4} flexWrap="wrap">
                  <Button as={Link} to="/contact" {...buttonStyles} aria-label={t.aboutUs.contactUs}>
                    {t.aboutUs.contactUs}
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    variant="outline"
                    borderColor={primaryColor}
                    color={primaryColor}
                    fontSize={{ base: 'sm', md: 'md' }}
                    px={{ base: 4, md: 6 }}
                    py={{ base: 2, md: 3 }}
                    borderRadius="full"
                    _hover={{ bg: primaryColor, color: 'white', borderColor: primaryColor }}
                    _focus={{ outline: '3px solid', outlineColor: primaryColor, outlineOffset: '2px' }}
                    aria-label={t.aboutUs.joinNow}
                  >
                    {t.aboutUs.joinNow}
                  </Button>
                </Flex>
              </VStack>
            </motion.div>
          </GridItem>

          <GridItem>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <Box overflow="hidden" borderRadius="2xl" boxShadow="lg">
                <Image
                  src={aboutUsImage}
                  alt="Two professionals discussing auctions at a desk"
                  w="full"
                  h={{ base: '250px', md: '400px', lg: '450px' }}
                  objectFit="cover"
                  loading="lazy"
                />
              </Box>
            </motion.div>
          </GridItem>
        </Grid>

        {/* Vision and Mission Section */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={{ base: 6, md: 8 }} mb={{ base: 16, md: 24 }}>
          {t.visionMission.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.3 }}>
              <Box {...cardStyles}>
                <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb={3}>{item.title}</Heading>
                <Text fontSize={{ base: 'sm', md: 'md' }} color={secondaryTextColor} lineHeight="1.8">{item.content}</Text>
              </Box>
            </motion.div>
          ))}
        </Grid>

        {/* Core Values Section */}
        <Box mb={{ base: 16, md: 24 }} textAlign="center">
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="bold" mb={{ base: 8, md: 12 }}>
            {t.coreValues.title}
          </Heading>
          <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={{ base: 4, md: 6 }}>
            {t.coreValues.values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Box {...cardStyles} textAlign="center">
                  <VStack spacing={4}>
                    {[
                      <FaHandshake size="28" color={primaryColor} />,
                      <FaShieldAlt size="28" color={primaryColor} />,
                      <FaBolt size="28" color={primaryColor} />,
                      <FaUsers size="28" color={primaryColor} />,
                    ][index]}
                    <Heading fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold">{value.title}</Heading>
                    <Text fontSize={{ base: 'sm', md: 'md' }} color={secondaryTextColor} lineHeight="1.6">{value.text}</Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </Grid>
        </Box>

        {/* Partners Section */}
        <Box mb={{ base: 16, md: 24 }} textAlign="center">
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="bold" mb={{ base: 8, md: 12 }}>
            {t.partners.title}
          </Heading>
          <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={{ base: 4, md: 6 }}>
            {partners.map((partner, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Box p={{ base: 3, md: 4 }} borderRadius="lg">
                  <VStack spacing={3}>
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      w={{ base: '80px', md: '100px' }}
                      h={{ base: '50px', md: '60px' }}
                      objectFit="contain"
                      loading="lazy"
                      fallbackSrc="https://via.placeholder.com/100?text=Partner+Logo"
                    />
                    <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color={textColor}>{partner.name}</Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box textAlign="center" py={{ base: 10, md: 16 }} bg={cardBg} borderRadius="2xl" boxShadow="md">
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="bold" mb={6}>
            {t.cta.title}
          </Heading>
          <Button
            as={Link}
            to="/listings"
            size="lg"
            {...buttonStyles}
            fontSize={{ base: 'md', md: 'lg' }}
            px={{ base: 6, md: 8 }}
            py={{ base: 3, md: 4 }}
            aria-label={t.cta.button}
          >
            {t.cta.button}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ExploreUs;