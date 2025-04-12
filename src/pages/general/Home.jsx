
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import reviews from '../../assets/reviews.json';
import {
  Heading,
  Text,
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  useBreakpointValue,
  useColorModeValue,
  CardBody,
  Card,
  Flex,
  VStack,
  Container,
  Badge,
} from '@chakra-ui/react';
import Enchere1 from '../../assets/enchere1.jpg';
import kay from '../../assets/kay.png';
import quoteImg from '../../assets/quote-red.svg';
import { Spinner, CardListing } from '../../components';
import { Link } from 'react-router-dom';
import toast from '../toasts';
import { getListings } from '../../features/listings/listingsSlice';
import { translations } from '../../constants/translations'; // Import translations

const Home = () => {
  // Move all useColorModeValue hooks to the top
  const primaryColor = useColorModeValue("#4F35DC", "blue.500");
  const primaryHoverColor = useColorModeValue("#3a28b5", "blue.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("gray.50", "gray.800");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");

  const firstDisplayCols = useBreakpointValue({ base: 1, md: 1, lg: 2 });
  const itemsDisplayCols = useBreakpointValue({ base: 1, md: 2, lg: 3 });


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

  const { listings, isLoading: listingsLoading, isError: listingsError, message: listingsMessage } = useSelector(
    (state) => state.listings
  );

  const dispatch = useDispatch();

  // Language state (you might want to sync this with your Header component)
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
const t = translations[currentLanguage];
  console.log(t.heroText)


  useEffect(() => {
    if (listingsError) {
      toast.error(listingsMessage);
      console.log(listingsMessage);
    }
    dispatch(getListings(6));
  }, [dispatch, listingsError, listingsMessage]);

  if (listingsLoading) return <Spinner />;

  return (
    <Box {...boxStyles}>
      <Container maxW="container.xl">
        {/* Hero Section */}
        <Grid templateColumns={`repeat(${firstDisplayCols}, 1fr)`} gap={8} alignItems="center">
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
  {t.welcomeBadge}
</Badge>

              <Heading 
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                lineHeight="shorter"
              >
                {t.heroHeading}
              </Heading>
              <Text 
                fontSize={{ base: "md", lg: "lg" }}
                color={secondaryTextColor}
              >
                {t.heroText}
              </Text>
              <Button 
                size="lg"
                {...buttonStyles}
                as={Link}
                to="/listings"
              >
                {t.startExploring}
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
                src={Enchere1}
                alt="Auction showcase"
                transform="scale(1.01)"
                transition="0.3s ease-in-out"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
          </GridItem>
        </Grid>

        {/* Live Auction Section */}
        <Box my={20}>
          <Grid templateColumns={`repeat(${firstDisplayCols}, 1fr)`} gap={6} alignItems="center">
            <GridItem>
              <VStack align="start" spacing={4}>
                <Heading fontSize={{ base: "3xl", md: "4xl" }}>{t.liveAuctionHeading}</Heading>
                <Text 
                  fontSize={{ base: "md", lg: "lg" }}
                  color={secondaryTextColor}
                >
                  {t.liveAuctionText}
                </Text>
              </VStack>
            </GridItem>
            <GridItem display="flex" justifyContent={{ base: "start", lg: "end" }}>
              <Button
                {...buttonStyles}
                as={Link}
                to="/listings"
              >
                {t.viewAll}
              </Button>
            </GridItem>
          </Grid>

          {/* Listings Grid */}
          <Grid 
            mt={12} 
            templateColumns={`repeat(${itemsDisplayCols}, 1fr)`} 
            gap={8}
          >
            {listings.map((listing, i) => (
              <CardListing listing={listing} key={i} />
            ))}
          </Grid>
        </Box>

        {/* Reviews Section */}
        <Box my={20}>
          <VStack spacing={8} mb={12}>
            <Heading fontSize={{ base: "3xl", md: "4xl" }}>{t.reviewsHeading}</Heading>
            <Text 
              maxW="800px" 
              textAlign="center"
              color={secondaryTextColor}
            >
              {t.reviewsText}
            </Text>
          </VStack>

          <Grid 
            templateColumns={`repeat(${itemsDisplayCols}, 1fr)`} 
            gap={6}
          >
            {reviews.map((review, i) => (
              <Card 
                key={i} 
                bg={cardBgColor}
                borderRadius="xl"
                boxShadow="md"
                _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s ease-in-out' }}
              >
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Flex w="full" justify="space-between" align="center">
                      <Flex align="center" gap={4}>
                        <Image
                          src={review.user?.avatar || kay}
                          alt={`${review.user?.name || 'Anonymous'}'s avatar`}
                          borderRadius="full"
                          boxSize="60px"
                          objectFit="cover"
                        />
                        <Box>
                          <Heading size="md">
                            {review.user?.name || 'Anonymous'}
                          </Heading>
                        </Box>
                      </Flex>
                      <Image 
                        src={quoteImg} 
                        alt="Quote" 
                        w="24px"
                        opacity={0.6}
                      />
                    </Flex>
                    <Text color={secondaryTextColor}>
                      {review.comment}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;