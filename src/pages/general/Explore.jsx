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
import { FaHandshake, FaShieldAlt, FaBolt, FaUsers} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import { translations } from '../../constants/translations'; // Import translations
import aboutUsImage from '../../assets/1.12.webp';
import partnerLogo1 from '../../assets/attijari.png';
import partnerLogo2 from '../../assets/adex.png';
import partnerLogo3 from '../../assets/biat.jpg';
import partnerLogo4 from '../../assets/Logo_First-1.png';


const ExploreUs = () => {
  // Get the current language from the Redux store
  const language = useSelector((state) => state.language.currentLanguage);
  const t = translations[language].exploreUs; // Shortcut to exploreUs translations

  const primaryColor = useColorModeValue('#4F35DC', 'blue.500');
  const primaryHoverColor = useColorModeValue('#3a28b5', 'blue.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');
  const gradientBg = useColorModeValue('linear(to-b, white, gray.50)', 'linear(to-b, gray.900, gray.800)');
  const footerBg = useColorModeValue('gray.900', 'gray.800');
  const footerTextColor = useColorModeValue('white', 'gray.200');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const buttonStyles = {
    bg: primaryColor,
    color: 'white',
    fontSize: { base: 'md', md: 'lg' },
    px: 6,
    py: 3,
    borderRadius: 'md',
    _hover: {
      bg: primaryHoverColor,
      transform: prefersReducedMotion ? 'none' : 'scale(1.02)',
      transition: 'all 0.3s ease-in-out',
    },
    _focus: {
      outline: '2px solid',
      outlineColor: primaryColor,
      outlineOffset: '2px',
    },
  };

  const cardHoverStyles = {
    _hover: {
      transform: prefersReducedMotion ? 'none' : 'translateY(-4px)',
      boxShadow: 'lg',
      transition: 'all 0.3s ease-in-out',
    },
    _focusWithin: {
      transform: 'translateY(-4px)',
      boxShadow: 'lg',
    },
  };

  const partners = t.partners.names.map((name, index) => ({
    logo: [partnerLogo1, partnerLogo2, partnerLogo3, partnerLogo4][index],
    name,
  }));

  return (
    <Box bgGradient={gradientBg} color={textColor}>
      <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={{ base: 10, md: 16 }}>
        {/* About Us Section */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 6, md: 10 }} alignItems="center" mb={20}>
          <GridItem>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <VStack align="start" spacing={4}>
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="bold">
                  {t.aboutUs.title}
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={secondaryTextColor}>
                  {t.aboutUs.text1}
                </Text>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={secondaryTextColor}>
                  {t.aboutUs.text2}
                </Text>
                <Flex gap={4}>
                  <Button as={Link} to="/contact" {...buttonStyles} aria-label={t.aboutUs.contactUs}>
                    {t.aboutUs.contactUs}
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    variant="outline"
                    borderColor={primaryColor}
                    color={primaryColor}
                    fontSize={{ base: 'md', md: 'lg' }}
                    px={6}
                    py={3}
                    borderRadius="md"
                    _hover={{ bg: primaryColor, color: 'white' }}
                    _focus={{ outline: '2px solid', outlineColor: primaryColor, outlineOffset: '2px' }}
                    aria-label={t.aboutUs.joinNow}
                  >
                    {t.aboutUs.joinNow}
                  </Button>
                </Flex>
              </VStack>
            </motion.div>
          </GridItem>

          <GridItem>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <Box overflow="hidden" borderRadius="xl" boxShadow="md">
                <Image
                  src={aboutUsImage}
                  alt="Two professionals discussing auctions at a desk"
                  w="full"
                  h={{ base: '200px', md: '350px', lg: '400px' }}
                  objectFit="cover"
                  loading="lazy"
                />
              </Box>
            </motion.div>
          </GridItem>
        </Grid>

        {/* Vision and Mission Section */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={20}>
          {t.visionMission.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.2 }}>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" {...cardHoverStyles}>
                <Heading fontSize={{ base: 'xl', md: '2xl' }} mb={3}>{item.title}</Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={secondaryTextColor}>{item.content}</Text>
              </Box>
            </motion.div>
          ))}
        </Grid>

        {/* Core Values Section */}
        <Box mb={20} textAlign="center">
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} mb={8}>{t.coreValues.title}</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            {t.coreValues.values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" {...cardHoverStyles}>
                  <VStack spacing={3}>
                    {[
                      <FaHandshake size="32" color={primaryColor} />,
                      <FaShieldAlt size="32" color={primaryColor} />,
                      <FaBolt size="32" color={primaryColor} />,
                      <FaUsers size="32" color={primaryColor} />,
                    ][index]}
                    <Heading fontSize="lg" fontWeight="semibold">{value.title}</Heading>
                    <Text fontSize="md" color={secondaryTextColor} textAlign="center">{value.text}</Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </Grid>
        </Box>

        {/* Partners Section */}
        <Box mb={20} textAlign="center">
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} mb={8}>{t.partners.title}</Heading>
          <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            {partners.map((partner, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Box p={4} borderRadius="lg" {...cardHoverStyles}>
                  <VStack spacing={3}>
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      w={{ base: '100px', md: '120px' }}
                      h={{ base: '60px', md: '80px' }}
                      objectFit="contain"
                      loading="lazy"
                      fallbackSrc="https://via.placeholder.com/120?text=Partner+Logo"
                    />
                    <Text fontSize="md" fontWeight="medium" color={textColor}>{partner.name}</Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box textAlign="center" mb={12}>
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} mb={6}>{t.cta.title}</Heading>
          <Button
            as={Link}
            to="/listings"
            size="lg"
            {...buttonStyles}
            fontSize={{ base: 'lg', md: 'xl' }}
            px={8}
            py={4}
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