import React, { useEffect, useState } from 'react';
import {
  Heading,
  Text,
  Box,
  Button,
  Image,
  CardBody,
  Stack,
  Card,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  addListingToWatchlist,
  placeBid,
  removeFromWatchlist,
} from '../features/listings/listingsSlice';
import { store } from '../app/store';
import {
  handleAuctioneerImageError,
  handleListingImageError,
  parseInteger,
} from '../features/utils';
import toast from '../pages/toasts';
import { updateGuestUser } from '../features/auth/authSlice';

const CardListing = ({ listing }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentUser = store.getState().auth?.user;
  const currentUserId = currentUser?.id;
  const currentUserAccess = currentUser?.access;

  const [bidData, setBidData] = useState({ amount: '' });
  const [createBidLoading, setCreateBidLoading] = useState(false);
  const [highestBid, setHighestBid] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [heartColour, setHeartColour] = useState('grey');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for carousel

  const colors = {
    bg: useColorModeValue('white', 'gray.900'),
    text: useColorModeValue('gray.700', 'gray.300'),
    primary: useColorModeValue('#6246EA', '#9D77F2'),
    primaryHover: useColorModeValue('#5538D4', '#8C66E0'),
    accent: useColorModeValue('#FF7849', '#FF9A76'),
    accentHover: useColorModeValue('#E6633A', '#E68564'),
    border: useColorModeValue('gray.200', 'gray.700'),
    shadow: useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.3)'),
  };

  // Carousel navigation
  const handlePrevImage = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking arrows
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking arrows
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    setHeartColour(listing.watchlist ? 'red' : 'grey');

    const serverDate = new Date(listing.closing_date);
    const localDate = new Date(
      serverDate.toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );

    const interval = setInterval(() => {
      const now = new Date();
      let diff = localDate.getTime() - now.getTime();

      if (!listing.active || diff <= 0) {
        clearInterval(interval);
        setCountdown('Closed');
      } else {
        const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(
          2,
          '0'
        );
        const hours = String(
          Math.floor((diff / (1000 * 60 * 60)) % 24)
        ).padStart(2, '0');
        const minutes = String(Math.floor((diff / 60000) % 60)).padStart(
          2,
          '0'
        );
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(
          2,
          '0'
        );
        setCountdown(`${days}:${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [listing]);

  const handleWatchlist = async (event) => {
    event.preventDefault();
    const response = await dispatch(
      addListingToWatchlist({ slug: listing.slug })
    );

    if (response?.payload?.status === 'success') {
      if (window.location.pathname.includes('/watchlist')) {
        const listings = store.getState().listings.listings;
        dispatch(removeFromWatchlist({ listings, slug: listing.slug }));
      }

      const guestId = response?.payload?.data?.guestuser_id;
      if (guestId) dispatch(updateGuestUser({ id: guestId }));

      setHeartColour(
        response.payload.message.includes('added') ? 'red' : 'grey'
      );
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setCreateBidLoading(true);
    const bidPayload = { ...bidData, slug: listing.slug };
    const result = await dispatch(placeBid(bidPayload));
    setCreateBidLoading(false);

    if (result?.payload?.status === 'success') {
      setHighestBid(parseInteger(parseFloat(bidData.amount)));
      setBidData({ amount: '' });
      toast.success(result.payload.message);
      onClose();
    } else {
      toast.error(result.payload);
    }
  };

  // Arrow styles for carousel
  const arrowBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.800');
  const arrowHoverBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');
  const arrowColor = '#6366F1'; // Matches the "Place a Bid" button

  return (
    <>
      <Card
        bg={colors.bg}
        boxShadow={`0 6px 20px ${colors.shadow}`}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="2xl"
        overflow="hidden"
        position="relative"
      >
        {/* Countdown Timer */}
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
          fontSize={{ base: 'sm', md: 'lg' }}
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
          zIndex="10"
          textAlign="center"
          gap={2}
        >
          <FontAwesomeIcon icon={faClock} style={{ color: 'white' }} />
          {countdown}
        </Flex>

        <CardBody p={4}>
          {/* Carousel for all images */}
          <Box
            position="relative"
            role="button"
            onClick={() => navigate(`/listings/${listing.slug}/`)}
          >
            {listing.images && listing.images.length > 0 ? (
              <>
                <Image
                  src={`http://127.0.0.1:8000/storage/${
                    listing.images[currentImageIndex].resource_type
                  }`}
                  onError={handleListingImageError}
                  borderRadius="xl"
                  w="100%"
                  h="16em"
                  objectFit="cover"
                  mb={3}
                  alt={`Image ${currentImageIndex + 1} of ${listing.name}`}
                />
                {/* Navigation Arrows (only show if there are multiple images) */}
                {listing.images.length > 1 && (
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
                      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
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
                      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                      _hover={{ bg: arrowHoverBg, transform: 'translateY(-52%)' }}
                      onClick={handleNextImage}
                    />
                    {/* Image Indicator Dots */}
                    <Flex
                      justify="center"
                      position="absolute"
                      bottom={4}
                      w="100%"
                      gap={1}
                    >
                      {listing.images.map((_, index) => (
                        <Box
                          key={index}
                          w="8px"
                          h="8px"
                          borderRadius="full"
                          bg={
                            index === currentImageIndex
                              ? arrowColor
                              : 'whiteAlpha.500'
                          }
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
                h="16em"
                bg="gray.200"
                mb={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="gray.500">No Image Available</Text>
              </Box>
            )}
          </Box>

          {/* Title and details */}
          <Stack spacing={4} mt={4}>
            <Heading fontSize="xl" color={colors.text} fontWeight="bold">
              {listing.name}
            </Heading>

            <Flex align="center">
              <Image
                src={`http://127.0.0.1:8000/storage/${
                  listing.auctioneer.avatar.path
                }`}
                onError={handleAuctioneerImageError}
                alt={`Avatar of ${listing.auctioneer.first_name}`}
                borderRadius="full"
                boxSize="40px"
                objectFit="cover"
                mr={3}
              />
              <Text color={colors.text} fontWeight="medium">
                By {listing.auctioneer.first_name}
              </Text>
              <Flex
                ml="auto"
                align="center"
                color="green.400"
                fontWeight="bold"
                fontSize="xl"
              >
                {parseInteger(listing.price)} DT
              </Flex>
            </Flex>

            {/* Actions */}
            <Flex mt={2} align="center" gap={3}>
              <Button
                bg={'#6366F1'}
                color="white"
                _hover={{ bg: colors.primaryHover }}
                isDisabled={
                  currentUserId === listing.auctioneer.id || !listing.active
                }
                onClick={currentUserAccess ? onOpen : () => navigate('/login')}
              >
                Place a Bid
              </Button>
              <FontAwesomeIcon
                icon={faHeart}
                style={{
                  marginLeft: 'auto',
                  color: heartColour,
                  cursor: 'pointer',
                }}
                size="2x"
                onClick={handleWatchlist}
                aria-label="Add to watchlist"
              />
            </Flex>
          </Stack>
        </CardBody>
      </Card>

      {/* Bid Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={colors.bg} color={colors.text}>
          <form onSubmit={submitHandler}>
            <ModalHeader>
              Highest Bid:{' '}
              {highestBid || parseInteger(listing.highest_bid)} DT
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <NumberInput value={bidData.amount} mb={4}>
                <NumberInputField
                  name="amount"
                  placeholder="0.00 DT"
                  required
                  onChange={(e) => setBidData({ amount: e.target.value })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={onClose}
                mr={3}
                bg={colors.accent}
                _hover={{ bg: colors.accentHover }}
                color="white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={createBidLoading}
                loadingText="Submitting"
                spinnerPlacement="start"
              >
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CardListing;