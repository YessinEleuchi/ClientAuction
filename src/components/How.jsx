import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaGavel, FaUserCheck, FaClock, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import { translations } from '../constants/translations'; // Import translations

const HowItWorks = () => {
  // Get the current language from the Redux store
  const language = useSelector((state) => state.language.currentLanguage);
  const t = translations[language].howItWorks; // Shortcut to howItWorks translations

  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const sectionBg = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box bg={sectionBg} py={{ base: 12, md: 16 }} px={{ base: 4, md: 8 }}>
      <Container maxW="4xl">
        <VStack spacing={8} align="start">
          <Heading as="h2" size="xl" color={headingColor}>
            {t.title}
          </Heading>

          <Text
            fontSize="lg"
            color={textColor}
            dangerouslySetInnerHTML={{ __html: t.intro }}
          />

          {/* Render Sections Dynamically */}
          {t.sections.map((section, index) => (
            <Box key={index}>
              <Heading size="md" mb={2} color={headingColor}>
                {section.title}
              </Heading>
              {section.items ? (
                <List spacing={2} color={textColor}>
                  {section.items.map((item, idx) => (
                    <ListItem key={idx}>
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
                            ? 'purple.500'
                            : index === 1
                              ? 'blue.500'
                              : index === 2
                                ? 'green.500'
                                : index === 3
                                  ? 'red.500'
                                  : 'teal.400'
                        }
                      />
                      {item}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text color={textColor}>{section.content}</Text>
              )}
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default HowItWorks;