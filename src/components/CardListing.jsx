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
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addListingToWatchlist, placeBid, removeFromWatchlist } from '../features/listings/listingsSlice';
import { store } from '../app/store';
import { handleAuctioneerImageError, handleListingImageError, parseInteger } from '../features/utils';
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

  // Elegant color scheme
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const primaryColor = useColorModeValue('#6246EA', '#9D77F2');
  const primaryHoverColor = useColorModeValue('#5538D4', '#8C66E0');
  const accentColor = useColorModeValue('#FF7849', '#FF9A76');
  const accentHoverColor = useColorModeValue('#E6633A', '#E68564');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.800');
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.15)');

  useEffect(() => {
    if (listing.watchlist) setHeartColour('red');
    else setHeartColour('grey');

    const serverDateUTC = new Date(listing.closing_date);
    const serverDateLocal = new Date(
      serverDateUTC.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
    );

    const interval = setInterval(() => {
      const currentDate = new Date();
      let timeDifference = serverDateLocal.getTime() - currentDate.getTime();

      if (!listing.active) timeDifference = 0;

      if (timeDifference <= 0) {
        clearInterval(interval);
        setCountdown('Closed!!!');
      } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000).toString().padStart(2, '0');

        setCountdown(`-${days}D :${hours}H :${minutes}M :${seconds}S`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [listing]);

  const handleWatchlist = (event) => {
    event.preventDefault();
    dispatch(addListingToWatchlist({ slug: listing.slug })).then((e) => {
      if (e?.payload?.status === 'success') {
        if (window.location.pathname.includes('/watchlist')) {
          const listings = store.getState().listings.listings;
          dispatch(removeFromWatchlist({ listings, slug: listing.slug }));
        } else {
          if (e.payload.message.includes('added')) {
            const guestUserId = e?.payload?.data?.guestuser_id;
            if (guestUserId) dispatch(updateGuestUser({ id: guestUserId }));
            setHeartColour('red');
          } else {
            setHeartColour('grey');
          }
        }
      }
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setCreateBidLoading(true);
    const biddingData = { ...bidData, slug: listing.slug };
    dispatch(placeBid(biddingData)).then((res) => {
      setCreateBidLoading(false);
      if (res?.payload?.status === 'success') {
        setHighestBid(parseInteger(parseFloat(bidData.amount)));
        setBidData({ amount: '' });
        toast.success(res.payload.message);
        onClose();
      } else {
        toast.error(res.payload);
      }
    });
  };

  return (
    <>
      <Card
        bg={bgColor}
        boxShadow={`0 4px 12px ${shadowColor}`}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        overflow="hidden"
        transition="0.3s ease"
        _hover={{ boxShadow: `0 6px 18px ${shadowColor}`, transform: 'translateY(-4px)' }}
      >
        <CardBody p={4}>
          <Box role="button" onClick={() => navigate(`/listings/${listing.slug}/`)}>
            <Image
              src={'http://127.0.0.1:8000/storage/' + listing.images[0].resource_type}
              onError={handleListingImageError}
              borderRadius="xl"
              w="100%"
              h="16em"
              objectFit="cover"
              mb={3}
            />
            <Text
              textAlign="center"
              fontWeight="bold"
              fontSize="lg"
              color={primaryColor}
              bg="white"
              borderRadius="xl"
              px={4}
              py={2}
              width="fit-content"
              mx="auto"
              mt="-12"
              boxShadow="md"
            >
              {countdown}
            </Text>
          </Box>

          <Stack spacing={4} mt={4}>
            <Heading fontSize="xl" color={textColor}>{listing.name}</Heading>

            <Flex align="center">
              <Image
                src={'http://127.0.0.1:8000/storage/' + listing.auctioneer.avatar.path}
                onError={handleAuctioneerImageError}
                alt="avatar"
                borderRadius="full"
                boxSize="40px"
                objectFit="cover"
                mr={3}
              />
              <Text color={textColor} fontWeight="medium">By {listing.auctioneer.first_name}</Text>
              <Text ml="auto" color={accentColor} fontWeight="bold" fontSize="xl">
                ${parseInteger(listing.price)}
              </Text>
            </Flex>

            <Flex mt={2} align="center" gap={3}>
              <Button
                bg={primaryColor}
                color="white"
                _hover={{ bg: primaryHoverColor }}
                isDisabled={currentUserId === listing.auctioneer.id || !listing.active}
                onClick={currentUserAccess ? onOpen : () => navigate('/login')}
              >
                Place a Bid
              </Button>
              <FontAwesomeIcon
                icon={faHeart}
                style={{ marginLeft: 'auto', color: heartColour, cursor: 'pointer' }}
                size="2x"
                onClick={handleWatchlist}
              />
            </Flex>
          </Stack>
        </CardBody>
      </Card>

      {/* Bid Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={bgColor} color={textColor}>
          <form onSubmit={submitHandler}>
            <ModalHeader>Highest Bid: ${highestBid || parseInteger(listing.highest_bid)}</ModalHeader>
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
              <Button onClick={onClose} mr={3} bg={accentColor} _hover={{ bg: accentHoverColor }} color="white">
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="purple"
                {...(createBidLoading && {
                  isLoading: true,
                  loadingText: 'Submitting',
                  spinnerPlacement: 'start',
                })}
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
