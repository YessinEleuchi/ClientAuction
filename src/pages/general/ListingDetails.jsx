import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Image,
    Input,
    Text,
    Badge,
    useColorModeValue,
    VStack,
    IconButton,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
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
    const [bidData, setBidData] = useState({ amount: '', autobid: '' });
    const [isAutobidActive, setIsAutobidActive] = useState(false);
    const [autobidThreshold, setAutobidThreshold] = useState('');
    const [autobidIncrement, setAutobidIncrement] = useState('');
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
    const { isOpen, onOpen, onClose } = useDisclosure();

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

    // Handle autobid submission from modal
    const handleAutobidSubmit = () => {
        const threshold = parseFloat(autobidThreshold);
        const increment = parseFloat(autobidIncrement);
        if (!threshold || threshold <= 0) {
            toast.warning('Please set a valid maximum autobid threshold.');
            return;
        }
        if (!increment || increment <= 0) {
            toast.warning('Please set a valid increment amount.');
            return;
        }
        setIsAutobidActive(true);
        setBidData({ ...bidData, autobid: autobidThreshold });
        onClose();
    };

    // Toggle Autobid
    const toggleAutobid = () => {
        if (isAutobidActive) {
            setIsAutobidActive(false);
            setBidData({ ...bidData, autobid: '' });
        } else {
            onOpen();
        }
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
            toast.error('Please enter a bid amount or enable autobid.');
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
                setBidData({ amount: '', autobid: isAutobidActive ? autobidThreshold : '' });
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
            p={{ base: 4, md: 8 }}
            borderRadius="2xl"
            boxShadow="lg"
            bg={cardBg}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            maxW="6xl"
            mx="auto"
          >
              <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
                  {/* Left Column: Image Carousel */}
                  <Box flex="1" position="relative" borderRadius="xl" overflow="hidden">
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
                              h={{ base: '300px', md: '500px' }}
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
                                  <Flex justify="center" position="absolute" bottom={4} w="100%" gap={2}>
                                      {images.map((_, index) => (
                                        <Box
                                          key={index}
                                          w="10px"
                                          h="10px"
                                          borderRadius="full"
                                          bg={index === currentImageIndex ? arrowColor : 'blue.200'}
                                          transition="background-color 0.3s ease"
                                        />
                                      ))}
                                  </Flex>
                              </>
                            )}
                            <Badge
                              colorScheme={isAuctionActive ? 'green' : 'red'}
                              position="absolute"
                              top={4}
                              left={4}
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="sm"
                              textTransform="uppercase"
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
                        </>
                      ) : (
                        <Box
                          borderRadius="xl"
                          w="100%"
                          h={{ base: '300px', md: '500px' }}
                          bg="gray.200"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                            <Text color="gray.500">No Image Available</Text>
                        </Box>
                      )}
                  </Box>

                  {/* Right Column: Listing Details and Bid Form */}
                  <VStack flex="1" spacing={6} align="start">
                      {/* Listing Details */}
                      <VStack spacing={4} align="start" w="full">
                          <Heading size="lg" color={accentColor} textAlign="left">
                              {listing?.listing?.name || 'Loading...'}
                          </Heading>
                          <Text color="gray.500" fontSize="md">
                              {listing?.listing?.desc || 'No description available.'}
                          </Text>
                          <HStack spacing={4}>
                              <Box>
                                  <Text fontSize="sm" color="gray.600">
                                      Starting Price
                                  </Text>
                                  <Text fontWeight="bold" fontSize="lg" color="black">
                                      ${listing?.listing?.price || '0.00'}
                                  </Text>
                              </Box>
                              <Box>
                                  <Text fontSize="sm" color="gray.600">
                                      Highest Bid
                                  </Text>
                                  <Text fontWeight="bold" fontSize="lg" color="blue.500">
                                      ${highestBid || listing?.listing?.highest_bid || '0.00'}
                                  </Text>
                              </Box>
                          </HStack>
                      </VStack>

                      {/* Bid Form */}
                      <form onSubmit={handlePlaceBid} style={{ width: '100%' }}>
                          <VStack spacing={4} w="full">
                              {/* Bid Amount Input */}
                              <Input
                                type="number"
                                placeholder="Enter your bid amount ($)"
                                value={bidData.amount}
                                onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                                borderRadius="md"
                                borderColor="gray.200"
                                h="48px"
                                fontSize="md"
                                _hover={{ borderColor: 'gray.300' }}
                                _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                                isDisabled={!isAuctionActive || createBidLoading}
                              />

                              {/* Autobid Toggle */}
                              <VStack spacing={2} w="full">
                                  <Button
                                    onClick={toggleAutobid}
                                    colorScheme={isAutobidActive ? 'green' : 'gray'}
                                    w="full"
                                    h="48px"
                                    borderRadius="md"
                                    fontSize="md"
                                    isDisabled={!isAuctionActive || createBidLoading}
                                  >
                                      {isAutobidActive ? 'Deactivate Autobid' : 'Activate Autobid'}
                                  </Button>
                              </VStack>

                              {/* Place Bid Button */}
                              <Button
                                type="submit"
                                bgGradient="linear(to-r, #4338CA, #7B6FE8)"
                                color="white"
                                w="full"
                                h="48px"
                                borderRadius="md"
                                fontSize="md"
                                isDisabled={
                                  !isAuctionActive ||
                                  currentUser?.id === listing?.listing?.auctioneer?.id ||
                                  createBidLoading
                                }
                                isLoading={createBidLoading}
                                loadingText="Submitting"
                                _hover={{ bgGradient: 'linear(to-r, #3730A3, #6B7280)' }}
                              >
                                  Place Bid
                              </Button>

                              {/* Close Auction Button (for auctioneer) */}
                              {currentUser?.id === listing?.listing?.auctioneer?.id && isAuctionActive && (
                                <Button
                                  colorScheme="red"
                                  w="full"
                                  h="48px"
                                  borderRadius="md"
                                  fontSize="md"
                                  onClick={handleCloseAuction}
                                  isDisabled={createBidLoading}
                                  variant="outline"
                                >
                                    Close Auction
                                </Button>
                              )}
                          </VStack>
                      </form>
                  </VStack>
              </Flex>
          </MotionCard>

          {/* Autobid Threshold and Increment Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
              <ModalOverlay backdropFilter="blur(5px)" />
              <ModalContent
                borderRadius="xl"
                boxShadow="xl"
                bg={cardBg}
                p={4}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                  <ModalHeader color={accentColor} fontSize="lg" fontWeight="bold">
                      Configure Autobid
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                      <Text mb={4} color="gray.500">
                          Set the maximum amount and increment for automatic bidding.
                      </Text>
                      <VStack spacing={4}>
                          <Input
                            type="number"
                            placeholder="Maximum Autobid ($)"
                            value={autobidThreshold}
                            onChange={(e) => setAutobidThreshold(e.target.value)}
                            borderRadius="md"
                            borderColor="gray.200"
                            h="48px"
                            fontSize="md"
                            _hover={{ borderColor: 'gray.300' }}
                            _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                            isDisabled={createBidLoading}
                          />
                          <Input
                            type="number"
                            placeholder="Increment Amount per Bid ($)"
                            value={autobidIncrement}
                            onChange={(e) => setAutobidIncrement(e.target.value)}
                            borderRadius="md"
                            borderColor="gray.200"
                            h="48px"
                            fontSize="md"
                            _hover={{ borderColor: 'gray.300' }}
                            _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                            isDisabled={createBidLoading}
                          />
                      </VStack>
                  </ModalBody>
                  <ModalFooter>
                      <Button
                        onClick={onClose}
                        mr={3}
                        variant="outline"
                        borderRadius="md"
                        h="40px"
                        fontSize="md"
                      >
                          Cancel
                      </Button>
                      <Button
                        bgGradient="linear(to-r, #4338CA, #7B6FE8)"
                        color="white"
                        borderRadius="md"
                        h="40px"
                        fontSize="md"
                        onClick={handleAutobidSubmit}
                        _hover={{ bgGradient: 'linear(to-r, #3730A3, #6B7280)' }}
                      >
                          Set Autobid
                      </Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>
      </Box>
    );
};

export default ListingDetails;