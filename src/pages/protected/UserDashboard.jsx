import React, { useEffect, useState } from 'react';
import { Spinner } from '../../components';
import {
    Box,
    Button,
    Grid,
    GridItem,
    Image,
    Input,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useBreakpointValue,
    useColorModeValue,
    IconButton,
    VStack,
    Flex,
    HStack,
    Avatar,
    Badge,
    Card,
    CardBody,
    CardHeader,
    Heading,
    FormControl,
    FormLabel,
    Divider,
    useDisclosure,
    Container,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { HamburgerIcon, CloseIcon, AddIcon, EditIcon, ViewIcon, CheckIcon } from '@chakra-ui/icons';
import kay from '../../assets/kay.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faShoppingCart, faUser, faSignOutAlt, faTags } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAuctioneerListings, updateListing } from '../../features/listings/listingsSlice';
import toast from '../toasts';
import { uploadImage } from '../imageUploader';
import { getProfile, logout, updateProfile } from '../../features/auth/authSlice';
import { parseInteger } from '../../features/utils';

// Motion components for animations
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionBox = motion(Box);

const UserDashboard = () => {
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        file: null,
        file_type: null,
        file_url: '',
    });
    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState('dashboard');

    // Use Chakra's useDisclosure for drawer/sidebar management
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure({ defaultIsOpen: true });

    const isMobile = useBreakpointValue({ base: true, md: false });
    const tabDisplayCols = useBreakpointValue({ base: 1, sm: 1, md: 4, lg: 4 });
    const profileDisplayCols = useBreakpointValue({ base: 1, sm: 1, md: 2, lg: 2 });

    const navigate = useNavigate();
    const { listings, isLoading } = useSelector((state) => state.listings);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // Adjusted color scheme to match the screenshot
    const primaryColor = useColorModeValue('#6A54E5', '#818CF8');
    const primaryHoverColor = useColorModeValue('#5A45D1', '#6366F1');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const bgColor = useColorModeValue('#F5F9FF', 'gray.900');
    const cardBgColor = useColorModeValue('white', 'gray.800');
    const sidebarBgColor = useColorModeValue('white', 'gray.800');
    const accentColor = useColorModeValue('#10B981', '#34D399');
    const boughtColor = useColorModeValue('#3B82F6', '#60A5FA');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const tableHeaderBg = useColorModeValue('#E8ECEF', 'gray.700');
    const logoutColor = useColorModeValue('#FF0000', '#FF4D4F');

    const navButtonStyles = {
        borderRadius: 'md',
        py: 3,
        px: 4,
        fontWeight: 'medium',
        justifyContent: 'flex-start',
        width: '100%',
        transition: 'all 0.3s ease',
        fontSize: 'md',
    };

    const activeNavButtonStyles = {
        bg: primaryColor,
        color: 'white',
        boxShadow: 'sm',
    };

    const tableCardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                await dispatch(getAuctioneerListings(10)).unwrap();
                const res = await dispatch(getProfile()).unwrap();
                const profile = res.data;

                setUserData({
                    ...userData,
                    first_name: profile?.first_name,
                    last_name: profile?.last_name,
                    file_url: profile?.avatar || kay,
                });
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('Session expirée. Veuillez vous reconnecter.');
                dispatch(logout());
                navigate('/login');
            }
        };

        fetchData();
    }, [dispatch, navigate]);

    if (isLoading) return <Spinner />;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target?.files) {
            const file = e.target.files[0];
            setUserData({ ...userData, [name]: file.type, file });
        } else {
            setUserData({ ...userData, [name]: value });
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setProfileUpdateLoading(true);
        const file = userData.file;
        delete userData['file'];
        dispatch(updateProfile(userData)).then((e) => {
            if (e?.payload?.status === 'success') {
                const fileData = e.payload.data.file_upload_data;
                if (file) {
                    uploadImage(file, fileData.public_id, fileData.signature, fileData.timestamp).then(() => {
                        setProfileUpdateLoading(false);
                        toast.success(e.payload.message);
                        setUserData({ ...userData, file_url: URL.createObjectURL(file), file_type: null });
                    });
                } else {
                    setProfileUpdateLoading(false);
                    toast.success(e.payload.message);
                }
            } else {
                setProfileUpdateLoading(false);
                toast.error(e?.payload?.message || 'Erreur lors de la mise à jour.');
            }
        });
    };

    const handleLogout = () => {
        dispatch(logout()).then(() => {
            setTimeout(() => {
                navigate('/login');
            }, 100);
        });
    };

    const handleUpdateStatus = (event, listingSlug, timeLeftSeconds) => {
        const status = event.target.textContent;
        const listingData = { slug: listingSlug, active: true };

        if (status === 'Active') {
            listingData['active'] = false;
        }

        if (status === 'Closed' && timeLeftSeconds < 1) {
            toast.warning('Expired Listing');
        } else {
            dispatch(updateListing(listingData)).then((e) => {
                if (e?.payload?.status === 'success') {
                    if (status === 'Active') {
                        event.target.textContent = 'Closed';
                        event.target.style.color = 'red';
                    } else {
                        event.target.textContent = 'Active';
                        event.target.style.color = 'blue';
                    }
                } else {
                    toast.error(e?.payload?.message);
                }
            });
        }
    };

    const soldListings = [
        { id: 1, name: 'Ordinateur', price: 800, buyer: 'John Doe', date: '2025-04-01' },
        { id: 2, name: 'Téléphone', price: 500, buyer: 'Jane Smith', date: '2025-04-05' },
    ];

    const boughtListings = [
        { id: 1, name: 'Casque', price: 100, seller: 'Alice Brown', date: '2025-04-02' },
        { id: 2, name: 'Tablette', price: 300, seller: 'Bob Wilson', date: '2025-04-06' },
    ];

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: faClipboardList },
        { id: 'sold', label: 'Listings Vendus', icon: faTags },
        { id: 'bought', label: 'Listings Achetés', icon: faShoppingCart },
        { id: 'profile', label: 'My Profile', icon: faUser },
    ];

    const renderMainContent = () => {
        switch (currentTab) {
            case 'dashboard':
                return (
                  <MotionCard
                    variant="outline"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    bg={cardBgColor}
                    initial="hidden"
                    animate="visible"
                    variants={tableCardVariants}
                  >
                      <CardHeader bg={primaryColor} py={4}>
                          <Heading size="md" color="white" fontWeight="bold">
                              Your Active Listings
                          </Heading>
                      </CardHeader>
                      <CardBody p={0}>
                          <Box overflowX="auto">
                              <Table variant="simple" width="100%">
                                  <Thead bg={tableHeaderBg}>
                                      <Tr>
                                          <Th color={textColor} fontSize="sm">S/N</Th>
                                          <Th color={textColor} fontSize="sm">Product</Th>
                                          <Th color={textColor} fontSize="sm" isNumeric>Price</Th>
                                          <Th color={textColor} fontSize="sm">Status</Th>
                                          <Th color={textColor} fontSize="sm" isNumeric>Bids</Th>
                                          <Th color={textColor} fontSize="sm">Actions</Th>
                                      </Tr>
                                  </Thead>
                                  <Tbody>
                                      {listings.map((listing, i) => (
                                        <Tr key={i} _hover={{ bg: borderColor }}>
                                            <Td>
                                                <Link to={`/listings/${listing.slug}`}>
                                                    {i + 1}
                                                </Link>
                                            </Td>
                                            <Td>
                                                <Link to={`/listings/${listing.slug}`}>
                                                    <Text fontWeight="medium">{listing.name}</Text>
                                                </Link>
                                            </Td>
                                            <Td isNumeric fontWeight="bold" color={primaryColor}>
                                                ${parseInteger(listing.price)}
                                            </Td>
                                            <Td>
                                                <Badge
                                                  onClick={(event) => handleUpdateStatus(event, listing.slug, listing.time_left_seconds)}
                                                  cursor="pointer"
                                                  colorScheme={listing.active ? 'green' : 'red'}
                                                  px={2}
                                                  py={1}
                                                  borderRadius="md"
                                                >
                                                    {listing.active ? 'Active' : 'Closed'}
                                                </Badge>
                                            </Td>
                                            <Td isNumeric>
                                                <Link to={`/dashboard/listings/${listing.slug}/bids`}>
                                                    <Badge colorScheme="blue" borderRadius="full" px={2}>
                                                        {listing.bids_count}
                                                    </Badge>
                                                </Link>
                                            </Td>
                                            <Td>
                                                <IconButton
                                                  aria-label="Edit listing"
                                                  icon={<EditIcon />}
                                                  size="sm"
                                                  colorScheme="indigo"
                                                  variant="ghost"
                                                  onClick={() => navigate(`/dashboard/listings/${listing.slug}/update`)}
                                                />
                                                <IconButton
                                                  aria-label="View listing"
                                                  icon={<ViewIcon />}
                                                  size="sm"
                                                  colorScheme="blue"
                                                  variant="ghost"
                                                  ml={2}
                                                  onClick={() => navigate(`/listings/${listing.slug}`)}
                                                />
                                            </Td>
                                        </Tr>
                                      ))}
                                  </Tbody>
                              </Table>
                          </Box>

                          {listings.length > 0 ? (
                            <Flex justifyContent="center" py={6}>
                                <Button
                                  leftIcon={<ViewIcon />}
                                  bg={primaryColor}
                                  color="white"
                                  _hover={{ bg: primaryHoverColor }}
                                  borderRadius="md"
                                  onClick={() => navigate('/dashboard/listings')}
                                >
                                    View All Listings
                                </Button>
                            </Flex>
                          ) : (
                            <Box textAlign="center" py={10}>
                                <Text fontSize="lg" mb={4} color={textColor} fontWeight="medium">
                                    You don't have any listings yet!
                                </Text>
                                <Button
                                  leftIcon={<AddIcon />}
                                  bg={primaryColor}
                                  color="white"
                                  _hover={{ bg: primaryHoverColor }}
                                  borderRadius="md"
                                  onClick={() => navigate('/create-listing')}
                                >
                                    Create New Listing
                                </Button>
                            </Box>
                          )}
                      </CardBody>
                  </MotionCard>
                );
            case 'sold':
                return (
                  <MotionCard
                    variant="outline"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    bg={cardBgColor}
                    initial="hidden"
                    animate="visible"
                    variants={tableCardVariants}
                  >
                      <CardHeader bg={accentColor} py={4}>
                          <Heading size="md" color="white" fontWeight="bold">
                              Your Sold Listings
                          </Heading>
                      </CardHeader>
                      <CardBody p={0}>
                          <Box overflowX="auto">
                              <Table variant="simple" width="100%">
                                  <Thead bg={tableHeaderBg}>
                                      <Tr>
                                          <Th color={textColor} fontSize="sm">S/N</Th>
                                          <Th color={textColor} fontSize="sm">Product</Th>
                                          <Th color={textColor} fontSize="sm" isNumeric>Price</Th>
                                          <Th color={textColor} fontSize="sm">Buyer</Th>
                                          <Th color={textColor} fontSize="sm">Date</Th>
                                      </Tr>
                                  </Thead>
                                  <Tbody>
                                      {soldListings.map((listing, i) => (
                                        <Tr key={i} _hover={{ bg: borderColor }}>
                                            <Td>{i + 1}</Td>
                                            <Td fontWeight="medium">{listing.name}</Td>
                                            <Td isNumeric fontWeight="bold" color={accentColor}>
                                                ${listing.price}
                                            </Td>
                                            <Td>{listing.buyer}</Td>
                                            <Td>{listing.date}</Td>
                                        </Tr>
                                      ))}
                                  </Tbody>
                              </Table>
                          </Box>

                          {soldListings.length === 0 && (
                            <Box textAlign="center" py={10}>
                                <Text fontSize="lg" color={textColor} fontWeight="medium">
                                    You haven't sold any listings yet!
                                </Text>
                            </Box>
                          )}
                      </CardBody>
                  </MotionCard>
                );
            case 'bought':
                return (
                  <MotionCard
                    variant="outline"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    bg={cardBgColor}
                    initial="hidden"
                    animate="visible"
                    variants={tableCardVariants}
                  >
                      <CardHeader bg={boughtColor} py={4}>
                          <Heading size="md" color="white" fontWeight="bold">
                              Your Purchased Items
                          </Heading>
                      </CardHeader>
                      <CardBody p={0}>
                          <Box overflowX="auto">
                              <Table variant="simple" width="100%">
                                  <Thead bg={tableHeaderBg}>
                                      <Tr>
                                          <Th color={textColor} fontSize="sm">S/N</Th>
                                          <Th color={textColor} fontSize="sm">Product</Th>
                                          <Th color={textColor} fontSize="sm" isNumeric>Price</Th>
                                          <Th color={textColor} fontSize="sm">Seller</Th>
                                          <Th color={textColor} fontSize="sm">Date</Th>
                                      </Tr>
                                  </Thead>
                                  <Tbody>
                                      {boughtListings.map((listing, i) => (
                                        <Tr key={i} _hover={{ bg: borderColor }}>
                                            <Td>{i + 1}</Td>
                                            <Td fontWeight="medium">{listing.name}</Td>
                                            <Td isNumeric fontWeight="bold" color={boughtColor}>
                                                ${listing.price}
                                            </Td>
                                            <Td>{listing.seller}</Td>
                                            <Td>{listing.date}</Td>
                                        </Tr>
                                      ))}
                                  </Tbody>
                              </Table>
                          </Box>

                          {boughtListings.length === 0 && (
                            <Box textAlign="center" py={10}>
                                <Text fontSize="lg" color={textColor} fontWeight="medium">
                                    You haven't bought any listings yet!
                                </Text>
                            </Box>
                          )}
                      </CardBody>
                  </MotionCard>
                );
            case 'profile':
                return (
                  <MotionCard
                    variant="outline"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    bg={cardBgColor}
                    initial="hidden"
                    animate="visible"
                    variants={tableCardVariants}
                  >
                      <CardHeader bg={primaryColor} py={4}>
                          <Heading size="md" color="white" fontWeight="bold">
                              Edit Your Profile
                          </Heading>
                      </CardHeader>
                      <CardBody p={6}>
                          <form method="POST" onSubmit={submitHandler}>
                              <Grid templateColumns={`repeat(${profileDisplayCols}, 1fr)`} gap={8}>
                                  <GridItem>
                                      <Flex direction="column" alignItems="center">
                                          <Text fontSize="lg" fontWeight="medium" mb={4} color={textColor}>
                                              Profile Picture
                                          </Text>
                                          <Avatar
                                            size="2xl"
                                            src={userData.file_url}
                                            mb={6}
                                            border="4px solid"
                                            borderColor={borderColor}
                                            _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
                                          />
                                          <FormControl>
                                              <FormLabel
                                                htmlFor="profile-image"
                                                as={Button}
                                                bg={primaryColor}
                                                color="white"
                                                _hover={{ bg: primaryHoverColor }}
                                                leftIcon={<EditIcon />}
                                                cursor="pointer"
                                                mb={4}
                                                borderRadius="md"
                                              >
                                                  Change Avatar
                                              </FormLabel>
                                              <Input
                                                id="profile-image"
                                                type="file"
                                                name="file_type"
                                                onChange={handleChange}
                                                display="none"
                                              />
                                          </FormControl>
                                      </Flex>
                                  </GridItem>
                                  <GridItem>
                                      <VStack spacing={6} align="stretch">
                                          <FormControl>
                                              <FormLabel fontSize="lg" fontWeight="medium" color={textColor}>
                                                  First Name
                                              </FormLabel>
                                              <Input
                                                type="text"
                                                name="first_name"
                                                required
                                                onChange={handleChange}
                                                value={userData.first_name}
                                                size="lg"
                                                borderRadius="md"
                                                borderColor={borderColor}
                                                bg={cardBgColor}
                                                boxShadow="sm"
                                                _hover={{ borderColor: primaryColor }}
                                                _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                                              />
                                          </FormControl>
                                          <FormControl>
                                              <FormLabel fontSize="lg" fontWeight="medium" color={textColor}>
                                                  Last Name
                                              </FormLabel>
                                              <Input
                                                type="text"
                                                name="last_name"
                                                required
                                                onChange={handleChange}
                                                value={userData.last_name}
                                                size="lg"
                                                borderRadius="md"
                                                borderColor={borderColor}
                                                bg={cardBgColor}
                                                boxShadow="sm"
                                                _hover={{ borderColor: primaryColor }}
                                                _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                                              />
                                          </FormControl>
                                      </VStack>
                                  </GridItem>
                              </Grid>
                              <Flex justify="center" mt={10}>
                                  <Button
                                    isLoading={profileUpdateLoading}
                                    loadingText="Updating"
                                    leftIcon={<CheckIcon />}
                                    size="lg"
                                    type="submit"
                                    bg={primaryColor}
                                    color="white"
                                    _hover={{ bg: primaryHoverColor }}
                                    borderRadius="md"
                                    px={10}
                                  >
                                      Update Profile
                                  </Button>
                              </Flex>
                          </form>
                      </CardBody>
                  </MotionCard>
                );
            default:
                return null;
        }
    };

    // Sidebar variants for smooth animation
    const sidebarVariants = {
        open: {
            width: '250px',
            transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
        closed: {
            width: '80px',
            transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
    };

    return (
      <Box minH="100vh" bg={bgColor} fontFamily="'Inter', sans-serif">
          {/* Mobile header with hamburger menu */}
          <Flex
            bg={primaryColor}
            color="white"
            px={4}
            py={3}
            justifyContent="space-between"
            alignItems="center"
            display={{ base: 'flex', md: 'none' }}
            position="sticky"
            top={0}
            zIndex={10}
            boxShadow="md"
          >
              <HStack>
                  <IconButton
                    icon={<HamburgerIcon />}
                    variant="ghost"
                    onClick={onOpen}
                    aria-label="Open menu"
                    color="white"
                    _hover={{ bg: primaryHoverColor }}
                  />
                  <Heading size="md" fontWeight="bold">User Dashboard</Heading>
              </HStack>
              <Avatar size="sm" src={userData.file_url} />
          </Flex>

          {/* Sidebar as Drawer for mobile */}
          <Drawer isOpen={isOpen && isMobile} placement="left" onClose={onClose} size="xs">
              <DrawerOverlay />
              <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader bg={primaryColor} color="white" boxShadow="sm">
                      <Flex align="center">
                          <Avatar size="sm" src={userData.file_url} mr={3} />
                          <Text fontWeight="bold">
                              {userData.first_name} {userData.last_name}
                          </Text>
                      </Flex>
                  </DrawerHeader>
                  <DrawerBody p={0} bg={sidebarBgColor}>
                      <VStack spacing={0} align="stretch">
                          {navItems.map((item) => (
                            <Button
                              key={item.id}
                              leftIcon={<FontAwesomeIcon icon={item.icon} />}
                              {...navButtonStyles}
                              {...(currentTab === item.id && activeNavButtonStyles)}
                              bg={currentTab === item.id ? primaryColor : 'transparent'}
                              color={currentTab === item.id ? 'white' : textColor}
                              onClick={() => {
                                  setCurrentTab(item.id);
                                  if (isMobile) onClose();
                              }}
                              borderRadius={0}
                              borderBottomWidth="1px"
                              borderBottomColor={borderColor}
                              _hover={{ bg: primaryHoverColor, color: 'white' }}
                              aria-label={item.label}
                            >
                                {item.label}
                            </Button>
                          ))}
                          <Button
                            leftIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
                            onClick={handleLogout}
                            color={logoutColor}
                            variant="ghost"
                            justifyContent="flex-start"
                            borderRadius={0}
                            py={3}
                            px={4}
                            _hover={{ bg: 'red.600', color: 'white' }}
                            aria-label="Logout"
                          >
                              Logout
                          </Button>
                      </VStack>
                  </DrawerBody>
              </DrawerContent>
          </Drawer>

          {/* Desktop layout with permanent sidebar */}
          <Grid
            templateColumns={{ base: '1fr', md: isOpen ? '250px 1fr' : '80px 1fr' }}
            transition="grid-template-columns 0.3s ease"
          >
              {/* Sidebar for desktop */}
              <MotionBox
                as={GridItem}
                bg={sidebarBgColor}
                boxShadow="md"
                position="sticky"
                top={0}
                height="100vh"
                overflow="auto"
                display={{ base: 'none', md: 'block' }}
                initial={isOpen ? 'open' : 'closed'}
                animate={isOpen ? 'open' : 'closed'}
                variants={sidebarVariants}
                borderRightWidth="1px"
                borderColor={borderColor}
              >
                  <Flex direction="column" height="100%">
                      {/* Header with user info */}
                      <Flex
                        direction="column"
                        align={isOpen ? 'flex-start' : 'center'}
                        p={4}
                        bg={primaryColor}
                        color="white"
                        boxShadow="sm"
                        onClick={() => setCurrentTab('profile')}
                        _hover={{ cursor: 'pointer', bg: primaryHoverColor }}
                      >
                          {/* Toggle Button */}
                          <Flex justify={isOpen ? 'flex-end' : 'center'} width="100%" mb={isOpen ? 2 : 0}>
                              <IconButton
                                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                                variant="ghost"
                                onClick={onToggle}
                                aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                                color="white"
                                _hover={{ bg: 'whiteAlpha.200' }}
                                size="sm"
                                _focus={{ boxShadow: 'outline' }}
                              />
                          </Flex>

                          {/* User Info */}
                          <Flex
                            direction={isOpen ? 'row' : 'column'}
                            align="center"
                            justify={isOpen ? 'flex-start' : 'center'}
                            mb={isOpen ? 2 : 4}
                            mt={isOpen ? 0 : 2}
                            opacity={isOpen ? 1 : 0.7}
                            transition="opacity 0.3s ease"
                          >
                              <Avatar
                                size={isOpen ? 'md' : 'sm'}
                                src={userData.file_url}
                                mb={isOpen ? 0 : 2}
                                border="2px solid white"
                                boxShadow="sm"
                              />
                              <Box
                                ml={isOpen ? 3 : 0}
                                opacity={isOpen ? 1 : 0}
                                transform={isOpen ? 'translateX(0)' : 'translateX(-20px)'}
                                transition="opacity 0.3s ease, transform 0.3s ease"
                              >
                                  <Text fontWeight="bold" fontSize="lg" letterSpacing="wide">
                                      {userData.first_name} {userData.last_name}
                                  </Text>
                                  <Text fontSize="sm" opacity={0.9} mt={0.5}>
                                      User
                                  </Text>
                              </Box>
                          </Flex>
                      </Flex>

                      {/* Navigation links */}
                      <VStack spacing={1} align="stretch" flex={1} py={4}>
                          {navItems.map((item) => (
                            <Tooltip
                              key={item.id}
                              label={item.label}
                              placement="right"
                              hasArrow
                              isDisabled={isOpen}
                              bg={primaryColor}
                              color="white"
                            >
                                <Button
                                  leftIcon={<FontAwesomeIcon icon={item.icon} />}
                                  {...navButtonStyles}
                                  {...(currentTab === item.id && activeNavButtonStyles)}
                                  justifyContent={isOpen ? 'flex-start' : 'center'}
                                  onClick={() => setCurrentTab(item.id)}
                                  mx={isOpen ? 2 : 1}
                                  _hover={{ bg: primaryHoverColor, color: 'white' }}
                                  aria-label={item.label}
                                  opacity={isOpen ? 1 : 0.7}
                                  transition="opacity 0.3s ease"
                                >
                                    {isOpen ? item.label : ''}
                                </Button>
                            </Tooltip>
                          ))}
                      </VStack>

                      {/* Logout button at bottom */}
                      <Box p={isOpen ? 4 : 2} mt="auto" borderTopWidth="1px" borderColor={borderColor}>
                          <Tooltip label="Logout" placement="right" hasArrow isDisabled={isOpen} bg="red.500" color="white">
                              <Button
                                leftIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
                                onClick={handleLogout}
                                color={logoutColor}
                                variant="ghost"
                                width="100%"
                                justifyContent={isOpen ? 'flex-start' : 'center'}
                                _hover={{ bg: 'red.600', color: 'white' }}
                                aria-label="Logout"
                                opacity={isOpen ? 1 : 0.7}
                                transition="opacity 0.3s ease"
                              >
                                  {isOpen ? 'Logout' : ''}
                              </Button>
                          </Tooltip>
                      </Box>
                  </Flex>
              </MotionBox>

              {/* Main content */}
              <GridItem
                p={{ base: 4, md: 6, lg: 8 }}
                transition="margin-left 0.3s ease"
              >
                  <Container maxW="container.xl" py={6}>
                      {renderMainContent()}
                  </Container>
              </GridItem>
          </Grid>
      </Box>
    );
};

export default UserDashboard;