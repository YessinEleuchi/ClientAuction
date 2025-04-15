import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../features/language/languageSlice';
import { logout } from '../features/auth/authSlice';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { translations } from '../constants/translations';

// Lucide Icons
import { Home, TrendingUp, Eye, PlusCircle, LogOut, User, Bell } from 'lucide-react';

// Chakra UI components
import {
  Box,
  Button,
  Image,
  useBreakpointValue,
  Slide,
  useColorModeValue,
  useColorMode,
  Text,
  Flex,
  Tooltip,
  IconButton,
  VisuallyHidden,
  VStack,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
  Divider,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';

// Logo imports
import Logo from '../assets/header-logo.png';
import LogoDark from '../assets/logo-dark.png';

// Fake notification data for WebsiteNotifications
const fakeNotifications = [
  {
    id: 1,
    message: "Your bid is terminally accepted for the website redesign project!",
    timestamp: "2025-04-15 10:30 AM",
    type: "success",
    icon: "bell",
  },
  {
    id: 2,
    message: "A new comment on your blog post 'Top 10 Web Design Trends'.",
    timestamp: "2025-04-15 09:15 AM",
    type: "info",
    icon: "bell",
  },
  {
    id: 3,
    message: "Your website hosting plan will renew in 3 days.",
    timestamp: "2025-04-14 03:45 PM",
    type: "warning",
    icon: "bell",
  },
];

// WebsiteNotifications component
const WebsiteNotifications = () => {
  const [notifications, setNotifications] = useState(fakeNotifications);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  return (
    <Box
      w="full"
      maxW="sm"
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      rounded="xl"
      shadow="lg"
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('gray.900', 'gray.100')}>
          <Bell className="h-5 w-5 mr-2 text-gray-600" />
          Notifications
        </Text>
        {notifications.length > 0 && (
          <Badge
            fontSize="xs"
            colorScheme="red"
            variant="solid"
            borderRadius="full"
            px={2}
            py={1}
          >
            {notifications.length}
          </Badge>
        )}
      </Flex>
      {notifications.length === 0 ? (
        <Text fontSize="sm" color="gray.500" textAlign="center">
          No new notifications
        </Text>
      ) : (
        <Box maxH="64" overflowY="auto" spaceY={3}>
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              display="flex"
              alignItems="flex-start"
              p={3}
              rounded="lg"
              border="1px"
              borderColor={
                notification.type === 'success'
                  ? 'green.200'
                  : notification.type === 'warning'
                    ? 'yellow.200'
                    : 'blue.200'
              }
              bg={
                notification.type === 'success'
                  ? 'green.50'
                  : notification.type === 'warning'
                    ? 'yellow.50'
                    : 'blue.50'
              }
              transition="all 0.2s"
            >
              <Box flex="1">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    notification.type === 'success'
                      ? 'green.800'
                      : notification.type === 'warning'
                        ? 'yellow.800'
                        : 'blue.800'
                  }
                >
                  {notification.message}
                </Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {notification.timestamp}
                </Text>
              </Box>
              <IconButton
                onClick={() => dismissNotification(notification.id)}
                icon={<Bell size={16} />}
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: 'gray.600' }}
                aria-label="Dismiss notification"
              />
            </Box>
          ))}
        </Box>
      )}
      {notifications.length > 0 && (
        <Button
          onClick={() => setNotifications([])}
          mt={4}
          fontSize="sm"
          color="gray.600"
          variant="link"
          _hover={{ color: 'gray.800', textDecoration: 'underline' }}
        >
          Clear all notifications
        </Button>
      )}
    </Box>
  );
};

// Flag icons (SVG inline for simplicity)
const FrenchFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="20" height="14">
    <rect width="1" height="2" x="0" fill="#002395" />
    <rect width="1" height="2" x="1" fill="#FFFFFF" />
    <rect width="1" height="2" x="2" fill="#ED2939" />
  </svg>
);

const EnglishFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="20" height="14">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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

  // Responsive values
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const navItemSpacing = useBreakpointValue({ base: 2, lg: 6, xl: 8 });
  const logoHeight = useBreakpointValue({ base: '36px', lg: '44px' });
  const fontSize = useBreakpointValue({ base: 'sm', lg: 'md' });
  const containerMaxW = useBreakpointValue({ base: 'container.md', lg: 'container.xl' });

  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (isMenuOpen) closeMenu();
  }, [location]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/login');
      closeMenu();
      toast({
        title: 'Logged out',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const NavLink = ({ to, icon, children, badgeCount }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} onClick={closeMenu} aria-label={`${children} page`}>
        <Flex
          direction="row"
          alignItems="center"
          px={3}
          py={2}
          borderRadius="full"
          transition="all 0.3s ease"
          position="relative"
          fontSize={fontSize}
          fontWeight="medium"
          color={isActive ? primaryColor : textColor}
          _hover={{
            color: primaryHoverColor,
            bg: hoverBgColor,
            transform: 'translateY(-2px)',
          }}
          role="menuitem"
          tabIndex={0}
        >
          {icon && (
            <Box mr={3} display="flex" alignItems="center">
              {icon}
            </Box>
          )}
          <Text>{children}</Text>
          {badgeCount > 0 && (
            <Badge
              ml={2}
              fontSize="xs"
              colorScheme="purple"
              variant="solid"
              borderRadius="full"
              px={2}
            >
              {badgeCount}
            </Badge>
          )}
          {isActive && (
            <Box
              position="absolute"
              bottom="-2px"
              left="0"
              height="3px"
              width="100%"
              bg={primaryColor}
              borderRadius="full"
              transition="all 0.3s ease"
            />
          )}
        </Flex>
      </Link>
    );
  };

  const LanguageSelector = () => (
    <Menu closeOnSelect={true}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bg="transparent"
        _hover={{ bg: hoverBgColor }}
        _active={{ bg: hoverBgColor }}
        size="sm"
        fontWeight="medium"
        borderRadius="full"
        px={3}
        py={1.5}
        aria-label="Select language"
      >
        <Flex alignItems="center" gap={2}>
          {currentLanguage === 'FR' ? <FrenchFlag /> : <EnglishFlag />}
          <Text fontSize={fontSize}>{currentLanguage === 'FR' ? 'FR' : 'EN'}</Text>
        </Flex>
      </MenuButton>
      <MenuList
        minWidth="140px"
        boxShadow={`0 2px 8px ${shadowColor}`}
        borderColor={borderColor}
        borderRadius="lg"
        p={2}
        bg={bgColor}
        zIndex={1100}
      >
        <MenuItem
          onClick={() => dispatch(setLanguage('FR'))}
          borderRadius="md"
          py={2}
          _hover={{ bg: hoverBgColor }}
          _focus={{ bg: hoverBgColor }}
        >
          <Flex alignItems="center" gap={3}>
            <FrenchFlag />
            <Text>Français</Text>
          </Flex>
        </MenuItem>
        <MenuItem
          onClick={() => dispatch(setLanguage('EN'))}
          borderRadius="md"
          py={2}
          _hover={{ bg: hoverBgColor }}
          _focus={{ bg: hoverBgColor }}
        >
          <Flex alignItems="center" gap={3}>
            <EnglishFlag />
            <Text>English</Text>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const UserMenu = () => (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        rounded="full"
        px={2}
        py={1}
        _hover={{ bg: hoverBgColor }}
        aria-label="User menu"
      >
        <Flex alignItems="center">
          <Box
            bg={primaryColor}
            color="white"
            borderRadius="full"
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <User size={20} />
          </Box>
        </Flex>
      </MenuButton>
      <MenuList zIndex={1100} bg={bgColor} borderColor={borderColor} borderRadius="lg">
        <MenuItem
          onClick={() => {
            navigate('/dashboard');
            closeMenu();
          }}
          icon={<Home size={18} />}
          _hover={{ bg: hoverBgColor }}
        >
          {t.myDashboard}
        </MenuItem>
        <Divider my={2} borderColor={borderColor} />
        <MenuItem
          onClick={handleLogout}
          icon={<LogOut size={18} />}
          color={accentColor}
          _hover={{ bg: accentHoverColor, color: 'white' }}
          _focus={{ bg: accentHoverColor, color: 'white' }}
        >
          {t.logout}
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const NotificationBell = () => (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={
          <Box position="relative">
            <Bell size={20} />
            {fakeNotifications.length > 0 && (
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                fontSize="xs"
                colorScheme="red"
                variant="solid"
                borderRadius="full"
                px={2}
              >
                {fakeNotifications.length}
              </Badge>
            )}
          </Box>
        }
        variant="ghost"
        size="sm"
        _hover={{ bg: hoverBgColor }}
        aria-label="Notifications"
      />
      <MenuList
        zIndex={1100}
        bg={bgColor}
        borderColor={borderColor}
        borderRadius="lg"
        p={0}
        minW="xs"
      >
        <WebsiteNotifications />
      </MenuList>
    </Menu>
  );

  return (
    <Box as="header" role="banner" aria-label="Main navigation">
      <Box
        bg={bgColor}
        color={textColor}
        boxShadow={`0 1px 6px ${shadowColor}`}
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="1000"
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Container maxW={containerMaxW} px={{ base: 4, md: 6 }}>
          <Flex
            h={{ base: '60px', md: '70px' }}
            alignItems="center"
            justifyContent="space-between"
            py={2}
          >
            {/* Left Section: Logo */}
            <Box>
              <Link to="/" aria-label="Home">
                <Flex alignItems="center">
                  <Image
                    src={colorMode === 'dark' ? LogoDark : Logo}
                    alt="Bid Out"
                    height={logoHeight}
                    objectFit="contain"
                    transition="transform 0.3s ease"
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                  <VisuallyHidden>Home</VisuallyHidden>
                </Flex>
              </Link>
            </Box>

            {/* Center Section: Navigation Links */}
            {isLargeScreen && (
              <Flex justifyContent="center" flex={1} ml={6} mr={6}>
                <HStack spacing={navItemSpacing}>
                  <NavLink to="/" icon={<Home size={20} />}>{t.home}</NavLink>
                  <NavLink to="/listings" icon={<TrendingUp size={20} />}>{t.activeListings}</NavLink>
                  {user?.access && (
                    <>
                      <NavLink to="/watchlist" icon={<Eye size={20} />} badgeCount={1}>
                        {t.watchList}
                      </NavLink>
                      <NavLink to="/create-listing" icon={<PlusCircle size={20} />}>
                        {t.createListing}
                      </NavLink>
                    </>
                  )}
                </HStack>
              </Flex>
            )}

            {/* Right Section: User Actions */}
            <Flex justifyContent="flex-end" alignItems="center" gap={3}>
              <HStack spacing={3}>
                <LanguageSelector />
                <NotificationBell /> {/* Added NotificationBell component */}
                <Tooltip label="Toggle color mode" hasArrow placement="bottom">
                  <IconButton
                    aria-label="Toggle color mode"
                    icon={<ColorModeSwitcher />}
                    variant="ghost"
                    size="sm"
                    _hover={{ bg: hoverBgColor }}
                  />
                </Tooltip>
              </HStack>

              {isLargeScreen && (
                <HStack spacing={3} ml={4}>
                  {!user?.access ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        fontWeight="medium"
                        onClick={() => {
                          navigate('/login');
                          closeMenu();
                        }}
                        _hover={{ bg: hoverBgColor }}
                        aria-label="Log in"
                      >
                        {t.login}
                      </Button>
                      <Button
                        bg={primaryColor}
                        _hover={{ bg: primaryHoverColor }}
                        color="white"
                        size="sm"
                        onClick={() => {
                          navigate('/signup');
                          closeMenu();
                        }}
                        fontWeight="medium"
                        aria-label="Sign up"
                      >
                        {t.signup}
                      </Button>
                    </>
                  ) : (
                    <UserMenu />
                  )}
                </HStack>
              )}

              {!isLargeScreen && (
                <IconButton
                  onClick={toggleMenu}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                  variant="ghost"
                  size="lg"
                  _hover={{ bg: hoverBgColor }}
                />
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Mobile menu */}
      {!isLargeScreen && (
        <>
          {isMenuOpen && (
            <Box
              position="fixed"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="blackAlpha.600"
              zIndex={998}
              onClick={closeMenu}
              aria-hidden="true"
            />
          )}

          <Slide
            direction="top"
            in={isMenuOpen}
            style={{ width: '100%', zIndex: 999 }}
            unmountOnExit
          >
            <Box
              pos="absolute"
              top="60px"
              left="0"
              right="0"
              bg={bgColor}
              p={4}
              borderBottomRadius="lg"
              boxShadow={`0 4px 12px ${shadowColor}`}
              borderBottom="1px"
              borderColor={borderColor}
              overflowY="auto"
              maxHeight="calc(100vh - 60px)"
            >
              <VStack spacing={3} align="stretch">
                <>
                  <NavLink to="/" icon={<Home size={20} />}>{t.home}</NavLink>
                  <NavLink to="/listings" icon={<TrendingUp size={20} />}>{t.activeListings}</NavLink>
                  {user?.access && (
                    <>
                      <NavLink to="/watchlist" icon={<Eye size={20} />} badgeCount={1}>
                        {t.watchList}
                      </NavLink>
                      <NavLink to="/create-listing" icon={<PlusCircle size={20} />}>
                        {t.createListing}
                      </NavLink>
                      <Divider my={3} borderColor={borderColor} />
                    </>
                  )}
                </>
                {user?.access ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate('/dashboard');
                        closeMenu();
                      }}
                      leftIcon={<Home size={20} />}
                      justifyContent="flex-start"
                      _hover={{ bg: hoverBgColor }}
                      aria-label="Go to dashboard"
                    >
                      {t.myDashboard}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate('/notifications');
                        closeMenu();
                      }}
                      leftIcon={<Bell size={20} />}
                      justifyContent="flex-start"
                      _hover={{ bg: hoverBgColor }}
                      aria-label="Notifications"
                    >
                      {t.settings || 'Notifications'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      leftIcon={<LogOut size={20} />}
                      justifyContent="flex-start"
                      color={accentColor}
                      _hover={{ bg: accentHoverColor, color: 'white' }}
                      aria-label="Log out"
                    >
                      {t.logout}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate('/signup');
                        closeMenu();
                      }}
                      _hover={{ bg: hoverBgColor }}
                      aria-label="Sign up"
                    >
                      {t.signup}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate('/login');
                        closeMenu();
                      }}
                      _hover={{ bg: hoverBgColor }}
                      aria-label="Log in"
                    >
                      {t.login}
                    </Button>
                  </>
                )}
              </VStack>
            </Box>
          </Slide>
        </>
      )}
    </Box>
  );
};

export default Header;