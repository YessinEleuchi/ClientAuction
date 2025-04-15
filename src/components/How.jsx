import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  useColorMode,
  List,
  ListItem,
  ListIcon,
  Link,
  Tooltip,
} from '@chakra-ui/react';
import { FaGavel, FaUserCheck, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { translations } from '../constants/translations';

// Motion components pour les animations
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

const HowItWorks = () => {
  // Récupérer la langue depuis Redux
  const language = useSelector((state) => state.language.currentLanguage);
  const t = translations[language].howItWorks;

  // Couleurs adaptées au thème
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const accentColor = '#020229';
  const accentColorDark = '#ececf1';

  // Détection du mode (clair/sombre)
  const { colorMode } = useColorMode();
  const currentAccentColor = colorMode === 'dark' ? accentColorDark : accentColor;

  // Animation pour les sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Animation pour les éléments de liste
  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <Box bg={sectionBg} py={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
      <Container maxW="4xl">
        <VStack spacing={10} align="start">
          {/* Titre avec animation */}
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <Heading as="h2" size="xl" color={headingColor} mb={4}>
              {t.title}
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={textColor}
              dangerouslySetInnerHTML={{ __html: t.intro }}
            />
          </MotionBox>

          {/* Sections dynamiques */}
          {t.sections.map((section, index) => (
            <MotionBox
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
            >
              <Heading size="md" mb={4} color={currentAccentColor}>
                {section.title}
              </Heading>
              {section.items ? (
                <List spacing={3} color={textColor}>
                  {section.items.map((item, idx) => (
                    <Tooltip
                      key={idx}
                      label={index === 4 ? t.supportTooltip : ''}
                      placement="top"
                      hasArrow
                      bg={currentAccentColor}
                      color="white"
                    >
                      <MotionListItem
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={listItemVariants}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      >
                        <ListIcon
                          as={
                            index === 0
                              ? FaUserCheck
                              : index === 1
                                ? FaGavel
                                : index === 2
                                  ? FaShieldAlt
                                  : index === 3
                                    ? FaShieldAlt
                                    : FaQuestionCircle
                          }
                          color={
                            index === 0
                              ? currentAccentColor
                              : index === 1
                                ? 'blue.500'
                                : index === 2
                                  ? 'green.500'
                                  : index === 3
                                    ? 'red.500'
                                    : 'teal.400'
                          }
                          boxSize={5}
                        />
                        {item}
                        {index === 4 && idx === 1 && (
                          <Link
                            href="/support"
                            color={currentAccentColor}
                            ml={2}
                            _hover={{ textDecoration: 'underline' }}
                          >
                            {t.supportLinkText}
                          </Link>
                        )}
                      </MotionListItem>
                    </Tooltip>
                  ))}
                </List>
              ) : (
                <Text color={textColor} fontSize={{ base: 'sm', md: 'md' }}>
                  {section.content}
                </Text>
              )}
            </MotionBox>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default HowItWorks;
