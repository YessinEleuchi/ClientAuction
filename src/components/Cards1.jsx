import React, { useEffect, useState } from 'react';
import {
  Heading,
  Text,
  Box,
  Button,
  Image,
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
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addListingToWatchlist, placeBid, removeFromWatchlist } from '../features/listings/listingsSlice';
import { store } from '../app/store';
import { handleListingImageError, parseInteger } from '../features/utils';
import toast from '../pages/toasts';
import { updateGuestUser } from '../features/auth/authSlice';

const Cards1 = ({ listing, cardHeight }) => {
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

  useEffect(() => {
    setHeartColour(listing.watchlist ? 'red' : 'grey');

    const serverDate = new Date(listing.closing_date);
    const localDate = new Date(serverDate.toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }));

    const interval = setInterval(() => {
      const now = new Date();
      let diff = localDate.getTime() - now.getTime();

      if (!listing.active || diff <= 0) {
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
  }, [listing]);

  const handleWatchlist = async (event) => {
    event.preventDefault();
    const response = await dispatch(addListingToWatchlist({ slug: listing.slug }));

    if (response?.payload?.status === 'success') {
      if (window.location.pathname.includes('/watchlist')) {
        const listings = store.getState().listings.listings;
        dispatch(removeFromWatchlist({ listings, slug: listing.slug }));
      }

      const guestId = response?.payload?.data?.guestuser_id;
      if (guestId) dispatch(updateGuestUser({ id: guestId }));

      setHeartColour(response.payload.message.includes('added') ? 'red' : 'grey');
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

  return (
    <>
      <Box
        bg={colors.bg}
        borderRadius="lg"
        boxShadow={`0 6px 20px ${colors.shadow}`}
        border="1px solid"
        borderColor={colors.border}
        overflow="hidden"
        h={`${cardHeight}px`} // Fixed height passed from Home component
        w="260px" // Fixed width
        display="flex"
        flexDirection="column"
        position="relative"
        _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)', transition: 'all 0.2s' }}
      >
        {/* Countdown Timer */}
        <Flex
          position="absolute"
          top="10px"
          left="10px"
          bgGradient="linear(to-r, #4338CA, #7B6FE8)"
          color="white"
          fontFamily="monospace"
          px={3}
          py={1}
          borderRadius="md"
          align="center"
          fontWeight="bold"
          fontSize="sm"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
          zIndex="10"
          gap={1}
        >
          <FontAwesomeIcon icon={faClock} style={{ color: "white" }} />
          <Text>{countdown}</Text>
        </Flex>

        {/* Clickable Image */}
        <Box
          role="button"
          onClick={() => navigate(`/listings/${listing.slug}/`)}
          h="200px" // Fixed height for the image
          w="100%"
          overflow="hidden"
        >
          <Image
            src={`http://127.0.0.1:8000/storage/${listing.images[0]?.resource_type}`}
            onError={handleListingImageError}
            alt={`Image of ${listing.name}`}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>

        {/* Content Section */}
        <Box p={4} flex="1" display="flex" flexDirection="column" justifyContent="space-between">
          <Box>
            <Heading fontSize="md" color={colors.text} fontWeight="bold" noOfLines={1}>
              {listing.name}
            </Heading>
            <Flex align="center" mt={2}>
              <Text fontSize="sm" color={colors.text}>
                By {listing.auctioneer.first_name}
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="green.400" ml={2}>
                ${parseInteger(listing.price)}
              </Text>
            </Flex>
          </Box>

          {/* Actions */}
          <Flex justify="space-between" align="center" mt={3}>
            <Button
              size="sm"
              bg={colors.primary}
              color="white"
              _hover={{ bg: colors.primaryHover }}
              _active={{ transform: 'scale(0.95)' }}
              isDisabled={currentUserId === listing.auctioneer.id || !listing.active}
              onClick={currentUserAccess ? onOpen : () => navigate('/login')}
            >
              Place a Bid
            </Button>
            <FontAwesomeIcon
              icon={faHeart}
              style={{ color: heartColour, cursor: 'pointer' }}
              size="lg"
              onClick={handleWatchlist}
              aria-label="Add to watchlist"
            />
          </Flex>
        </Box>
      </Box>

      {/* Bid Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={colors.bg} color={colors.text}>
          <form onSubmit={submitHandler}>
            <ModalHeader>
              Highest Bid: ${highestBid || parseInteger(listing.highest_bid)}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <NumberInput value={bidData.amount} mb={4}>
                <NumberInputField
                  name="amount"
                  placeholder="$0.00"
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
              <Button onClick={onClose} mr={3} bg={colors.accent} _hover={{ bg: colors.accentHover }} color="white">
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

export default Cards1;