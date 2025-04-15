import React, { useEffect, useState, useRef } from 'react';
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
} from '@chakra-ui/react';
import Enchere1 from '../../assets/enchere1.jpg';
import kay from '../../assets/kay.png';
import quoteImg from '../../assets/quote-red.svg';
import { Spinner, Cards1 } from '../../components';
import { Link } from 'react-router-dom';
import toast from '../toasts';
import { getListings } from '../../features/listings/listingsSlice';
import { translations } from '../../constants/translations';

const Home = () => {
  // Color and responsive hooks
  const primaryColor = useColorModeValue("#4F35DC", "blue.500");
  const primaryHoverColor = useColorModeValue("#3a28b5", "blue.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("gray.50", "gray.800");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");

  const firstDisplayCols = useBreakpointValue({ base: 1, md: 1, lg: 2 });
  const itemsDisplayCols = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const buttonStyles = {
    bg: primaryColor,
    color: "white",
    _hover: {
      bg: primaryHoverColor,
      transform: 'scale(1.05)',
      transition: 'all 0.2s ease-in-out',
    },
    _active: { transform: 'scale(0.95)' },
    _focus: { boxShadow: '0 0 0 3px rgba(79, 53, 220, 0.3)' },
  };

  const boxStyles = {
    py: { base: '6', md: '10', lg: '14' },
    px: { base: '4', md: '6', lg: '8' },
    color: textColor,
    bg: bgColor,
  };

  const { listings, isLoading: listingsLoading, isError: listingsError, message: listingsMessage } = useSelector(
    (state) => state.listings
  );

  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  // Scroll handling
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = 280; // Card width (260px) + gap (20px)
  const cardsPerGroup = 4; // Number of cards per dot
  const totalDots = 3; // Fixed number of dots
  const totalGroups = Math.min(totalDots, Math.ceil(listings.length / cardsPerGroup)); // Limit to 3 dots

  const scrollToGroup = (groupIndex) => {
    if (scrollRef.current) {
      const scrollPosition = groupIndex * cardsPerGroup * cardWidth;
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
      setActiveIndex(groupIndex);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const newGroupIndex = Math.round(scrollPosition / (cardWidth * cardsPerGroup));
      setActiveIndex(Math.min(newGroupIndex, totalGroups - 1));
    }
  };

  useEffect(() => {
    if (listingsError) {
      toast.error(listingsMessage);
      console.log(listingsMessage);
    }
    dispatch(getListings(12)); // Fetch enough listings for 3 dots (3 groups of 4 cards = 12 listings)
  }, [dispatch, listingsError, listingsMessage]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (listingsLoading) return <Spinner />;

  return (
    <Box {...boxStyles}>
      <Container maxW="container.xl">
        {/* Hero Section */}
        <Grid templateColumns={`repeat(${firstDisplayCols}, 1fr)`} gap={8} alignItems="center" mb={16}>
          <GridItem>
            <VStack align="start" spacing={6}>
              <Heading
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                lineHeight="shorter"
              >
                {t.heroHeading}
              </Heading>
              <Text fontSize={{ base: "md", lg: "lg" }} color={secondaryTextColor}>
                {t.heroText}
              </Text>
              <Button size="lg" {...buttonStyles} as={Link} to="/explore">
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
              _hover={{ transform: 'scale(1.02)', transition: 'transform 0.3s ease-in-out' }}
            >
              <Image
                w="full"
                h={{ base: "300px", md: "400px" }}
                objectFit="cover"
                src={Enchere1}
                alt="Auction showcase"
              />
            </Box>
          </GridItem>
        </Grid>

        {/* Live Auction Section */}
        <Box my={20}>
          <Grid templateColumns={`repeat(${firstDisplayCols}, 1fr)`} gap={6} alignItems="center" mb={8}>
            <GridItem>
              <VStack align="start" spacing={4}>
                <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>{t.liveAuctionHeading}</Heading>
                <Text fontSize={{ base: "md", lg: "lg" }} color={secondaryTextColor}>
                  {t.liveAuctionText}
                </Text>
              </VStack>
            </GridItem>
            <GridItem display="flex" justifyContent={{ base: "start", lg: "end" }}>
              <Button {...buttonStyles} as={Link} to="/listings">
                {t.viewAll}
              </Button>
            </GridItem>
          </Grid>

          {/* Listings Scrollable Section */}
          {listings.length > 0 ? (
            <Box
              ref={scrollRef}
              overflowX="auto"
              css={{
                display: 'flex',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                WebkitOverflowScrolling: 'touch',
              }}
              role="region"
              aria-label="Live auctions carousel"
            >
              <Box
                display="flex"
                flexDirection="row"
                gap={5}
                py={4}
                minW="max-content"
              >
                {listings.map((listing, i) => (
                  <Box
                    key={i}
                    w="260px"
                    minW="260px"
                    maxW="260px"
                    scrollSnapAlign="start"
                    aria-label={`Auction item ${i + 1}`}
                  >
                    <Cards1 listing={listing} />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Text textAlign="center" color={secondaryTextColor}>
              {t.noListingsAvailable}
            </Text>
          )}

          {/* Navigation Dots (Fixed to 3) */}
          {listings.length > 0 && (
            <Flex justify="center" mt={6} gap={4}>
              {Array.from({ length: totalDots }).map((_, i) => (
                <Box
                  key={i}
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  border={i === activeIndex ? 'none' : '2px solid #D3D3D3'}
                  bg={i === activeIndex ? primaryColor : 'transparent'}
                  cursor="pointer"
                  onClick={() => scrollToGroup(i)}
                  _hover={{
                    bg: i === activeIndex ? primaryColor : 'gray.200',
                    borderColor: i === activeIndex ? 'none' : 'gray.400',
                  }}
                  transition="all 0.2s"
                  aria-label={`Go to auction group ${i + 1}`}
                  role="button"
                />
              ))}
            </Flex>
          )}
        </Box>

        {/* Reviews Section */}
        <Box my={20}>
          <VStack spacing={8} mb={12}>
            <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>{t.reviewsHeading}</Heading>
            <Text maxW="800px" textAlign="center" color={secondaryTextColor}>
              {t.reviewsText}
            </Text>
          </VStack>

          <Grid templateColumns={`repeat(${itemsDisplayCols}, 1fr)`} gap={6}>
            {reviews.map((review, i) => (
              <Card
                key={i}
                bg={cardBgColor}
                borderRadius="xl"
                boxShadow="md"
                transition="all 0.2s ease-in-out"
                _hover={{ transform: 'translateY(-6px)', boxShadow: 'lg' }}
              >
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Flex w="full" justify="space-between" align="center">
                      <Flex align="center" gap={4}>
                        <Image
                          src={review.user?.avatar || kay}
                          alt={`${review.user?.name || 'Anonymous'}'s avatar`}
                          borderRadius="full"
                          boxSize="50px"
                          objectFit="cover"
                        />
                        <Box>
                          <Heading size="sm">{review.user?.name || 'Anonymous'}</Heading>
                        </Box>
                      </Flex>
                      <Image src={quoteImg} alt="Quote" w="20px" opacity={0.5} />
                    </Flex>
                    <Text fontSize="sm" color={secondaryTextColor}>
                      {t.reviewsList[i]}
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