import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Image,
    NumberInput,
    NumberInputField,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    Text,
    Badge,
    useColorModeValue,
    VStack,
    IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getListing, placeBid, updateListing } from '../../features/listings/listingsSlice';
import { Spinner } from '../../components';
import toast from '../toasts';
import NotFound from './NotFound';

const MotionCard = motion(Card);

const ListingDetails = () => {
    const [bidData, setBidData] = useState({ amount: '', autobid: '' }); // Ajout du champ Autobid
    const [highestBid, setHighestBid] = useState(null);
    const [countdown, setCountdown] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [notFoundError, setNotFoundError] = useState(false);
    const [createBidLoading, setCreateBidLoading] = useState(false);

    const { listingSlug } = useParams();
    const currentUser = useSelector((state) => state.auth.user);
    const { listing, isLoading, statusCode } = useSelector((state) => state.listings);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const bgColor = useColorModeValue('#F9FAFB', 'gray.800');
    const cardBg = useColorModeValue('white', 'gray.700');
    const accentColor = useColorModeValue('#6246EA', '#9D77F2');
    const arrowBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.800');
    const arrowHoverBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');
    const arrowColor = '#6366F1';

    // Fetch listing and handle 404
    useEffect(() => {
        if (statusCode === 404) setNotFoundError(true);
        else setNotFoundError(false);

        dispatch(getListing(listingSlug));
    }, [dispatch, listingSlug, statusCode]);

    // Initialize highest bid and countdown
    useEffect(() => {
        if (listing?.listing) {
            setHighestBid(listing.listing.highest_bid || listing.listing.price);

            const serverDate = new Date(listing.listing.closing_date);
            const localDate = new Date(
              serverDate.toLocaleString('en-US', {
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })
            );

            const interval = setInterval(() => {
                const now = new Date();
                let diff = localDate.getTime() - now.getTime();

                if (!listing.listing.active || diff <= 0) {
                    clearInterval(interval);
                    setCountdown('Closed');
                } else {
                    const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
                    const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
                    const minutes = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
                    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
                    setCountdown(`${days}:${hours}:${minutes}:${seconds}`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [listing]);

    // Carousel navigation
    const handlePrevImage = (e) => {
        e.stopPropagation();
        const imageCount = images?.length || 1;
        setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        const imageCount = images?.length || 1;
        setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
    };

    // Handle bid submission
    const handlePlaceBid = (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast.warning('Please log in first.');
            navigate('/login');
            return;
        }

        const bidAmount = parseFloat(bidData.amount);
        const autobidAmount = parseFloat(bidData.autobid) || 0;
        const minBid = highestBid ? highestBid + 1 : listing?.listing?.price;

        if (!bidAmount && !autobidAmount) {
            toast.error('Please enter a bid amount or an autobid amount.');
            return;
        }

        const amountToSubmit = bidAmount || autobidAmount;
        if (amountToSubmit <= minBid) {
            toast.error(`Bid must be higher than $${minBid}.`);
            return;
        }

        setCreateBidLoading(true);
        dispatch(placeBid({ amount: amountToSubmit, slug: listingSlug })).then((res) => {
            setCreateBidLoading(false);
            if (res?.payload?.status === 'success') {
                toast.success('Bid placed successfully!');
                setHighestBid(amountToSubmit);
                setBidData({ amount: '', autobid: '' });
                dispatch(getListing(listingSlug));
            } else {
                toast.error(res.payload || 'Failed to place bid.');
            }
        });
    };

    // Handle auction close
    const handleCloseAuction = () => {
        dispatch(updateListing({ slug: listingSlug, active: false })).then((res) => {
            if (res?.payload?.status === 'success') {
                toast.success('Auction closed successfully!');
                dispatch(getListing(listingSlug));
            } else {
                toast.error('Failed to close auction.');
            }
        });
    };

    // Image handling
    const handleListingImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
    };

    if (isLoading) return <Spinner />;
    if (notFoundError) return <NotFound />;

    const images = Array.isArray(listing?.listing?.images) && listing?.listing?.images.length > 0
      ? listing.listing.images
      : [listing?.listing?.image].filter(Boolean);

    const isAuctionActive = listing?.listing?.active && countdown !== 'Closed';

    return (
      <Box bg={bgColor} minHeight="100vh" py={10} px={{ base: 4, md: 10 }}>
          <MotionCard
            p={8}
            borderRadius="2xl"
            boxShadow="xl"
            bg={cardBg}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            maxW="6xl" // Augmentation de la largeur de la carte
            mx="auto"
          >
              <VStack spacing={8}>
                  {/* Image Carousel */}
                  <Box position="relative" w="100%" h={{ base: "300px", md: "400px" }} borderRadius="xl" overflow="hidden">
                      {images.length > 0 ? (
                        <>
                            <Image
                              src={
                                  images[currentImageIndex]?.resource_type
                                    ? `http://127.0.0.1:8000/storage/${images[currentImageIndex].resource_type}`
                                    : images[currentImageIndex] || 'https://via.placeholder.com/400x300?text=No+Image'
                              }
                              alt={`Image ${currentImageIndex + 1} of ${listing?.listing?.name}`}
                              borderRadius="xl"
                              objectFit="cover"
                              w="100%"
                              h="100%"
                              onError={handleListingImageError}
                              transition="all 0.3s ease"
                              _hover={{ transform: 'scale(1.05)' }}
                            />
                            {images.length > 1 && (
                              <>
                                  <IconButton
                                    icon={<ChevronLeftIcon boxSize={6} />}
                                    aria-label="Previous image"
                                    position="absolute"
                                    left={2}
                                    top="50%"
                                    transform="translateY(-50%)"
                                    bg={arrowBg}
                                    color={arrowColor}
                                    borderRadius="full"
                                    size="md"
                                    _hover={{ bg: arrowHoverBg, transform: 'translateY(-52%)' }}
                                    onClick={handlePrevImage}
                                  />
                                  <IconButton
                                    icon={<ChevronRightIcon boxSize={6} />}
                                    aria-label="Next image"
                                    position="absolute"
                                    right={2}
                                    top="50%"
                                    transform="translateY(-50%)"
                                    bg={arrowBg}
                                    color={arrowColor}
                                    borderRadius="full"
                                    size="md"
                                    _hover={{ bg: arrowHoverBg, transform: 'translateY(-52%)' }}
                                    onClick={handleNextImage}
                                  />
                                  <Flex justify="center" position="absolute" bottom={4} w="100%" gap={1}>
                                      {images.map((_, index) => (
                                        <Box
                                          key={index}
                                          w="8px"
                                          h="8px"
                                          borderRadius="full"
                                          bg={index === currentImageIndex ? arrowColor : 'whiteAlpha.500'}
                                          transition="background-color 0.3s ease"
                                        />
                                      ))}
                                  </Flex>
                              </>
                            )}
                        </>
                      ) : (
                        <Box
                          borderRadius="xl"
                          w="100%"
                          h="100%"
                          bg="gray.200"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                            <Text color="gray.500">No Image Available</Text>
                        </Box>
                      )}
                      <Badge
                        colorScheme={isAuctionActive ? 'green' : 'red'}
                        position="absolute"
                        top={4}
                        left={4}
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                          {isAuctionActive ? 'Active' : 'Closed'}
                      </Badge>
                      <Flex
                        position="absolute"
                        top={4}
                        right={4}
                        bgGradient="linear(to-r, #4338CA, #7B6FE8)"
                        color="white"
                        fontFamily="monospace"
                        px={4}
                        py={2}
                        borderRadius="lg"
                        align="center"
                        fontWeight="bold"
                        fontSize={{ base: 'sm', md: 'md' }}
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                        gap={2}
                      >
                          <FontAwesomeIcon icon={faClock} style={{ color: 'white' }} />
                          {countdown || 'Loading...'}
                      </Flex>
                  </Box>

                  {/* Listing Details */}
                  <VStack spacing={4} alignItems="flex-start" w="full">
                      <Heading size="xl" color={accentColor} textAlign="center" w="full">
                          {listing?.listing?.name || 'Loading...'}
                      </Heading>
                      <Text color="gray.500" fontSize="md" fontWeight="bold" >
                          {listing?.listing?.desc || 'No description available.'}
                      </Text>
                      <Text fontWeight="bold" fontSize="lg" color="blue">
                          Starting Price: <Text as="span" color="black">${listing?.listing?.price || '0'}</Text>
                      </Text>
                      <Text fontWeight="bold" fontSize="lg" color="blue">
                          Highest Bid: <Text as="span" color="yellow.500">${highestBid || listing?.listing?.highest_bid || '0'}</Text>
                      </Text>
                  </VStack>

                  {/* Bid Form */}
                  <form onSubmit={handlePlaceBid} style={{ width: '100%' }}>
                      <VStack spacing={4}>
                          {/* Champ de Bid classique */}
                          <NumberInput
                            value={bidData.amount}
                            w="full"
                            maxW="lg" // Champ très large
                            isDisabled={!isAuctionActive || createBidLoading}
                          >
                              <NumberInputField
                                name="amount"
                                placeholder="Enter your bid amount ($)"
                                onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                                borderRadius="lg"
                                fontSize="lg"
                                py={6}
                              />
                              <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                              </NumberInputStepper>
                          </NumberInput>

                          {/* Champ Autobid */}
                          <NumberInput
                            value={bidData.autobid}
                            w="full"
                            maxW="lg" // Champ très large
                            isDisabled={!isAuctionActive || createBidLoading}
                          >
                              <NumberInputField
                                name="autobid"
                                placeholder="Set Autobid maximum ($)"
                                onChange={(e) => setBidData({ ...bidData, autobid: e.target.value })}
                                borderRadius="lg"
                                fontSize="lg"
                                py={6}
                              />
                              <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                              </NumberInputStepper>
                          </NumberInput>

                          {/* Boutons */}
                          <Button
                            type="submit"
                            colorScheme="purple"
                            w="full"
                            maxW="lg" // Bouton très large
                            size="md" // Bouton plus petit en hauteur
                            isDisabled={!isAuctionActive || currentUser?.id === listing?.listing?.auctioneer?.id || createBidLoading}
                            isLoading={createBidLoading}
                            loadingText="Submitting"
                            borderRadius="lg"
                            fontSize="md"
                            py={5}
                          >
                              Place Bid
                          </Button>
                          {currentUser?.id === listing?.listing?.auctioneer?.id && isAuctionActive && (
                            <Button
                              colorScheme="red"
                              w="full"
                              maxW="lg" // Bouton très large
                              size="md" // Bouton plus petit en hauteur
                              onClick={handleCloseAuction}
                              isDisabled={createBidLoading}
                              borderRadius="lg"
                              fontSize="md"
                              py={5}
                            >
                                Close Auction
                            </Button>
                          )}
                      </VStack>
                  </form>
              </VStack>
          </MotionCard>
      </Box>
    );
};

export default ListingDetails;