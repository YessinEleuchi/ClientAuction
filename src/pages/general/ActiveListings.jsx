import React, { useEffect, useState, useMemo } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Box,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Select,
    useBreakpointValue,
    useColorModeValue,
    VStack,
    FormControl,
    FormLabel,
    Button,
    Icon,
} from '@chakra-ui/react';
import { SearchIcon, CalendarIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { CardListing, Spinner } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCategories,
    getListings,
    getListingsByCategory,
} from '../../features/listings/listingsSlice';
import toast from '../toasts';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';

const MotionGrid = motion(Grid);

const ActiveListings = () => {
    const itemsDisplayCols = useBreakpointValue({ base: 1, md: 2, lg: 3 });
    const showSidebar = useBreakpointValue({ base: false, md: true });
    const [notFoundError, setNotFoundError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [endDate, setEndDate] = useState({ start: '', end: '' });
    const listingsPerPage = 9;

    const { listings, isLoading, isError, message, categories } = useSelector(
      (state) => state.listings
    );
    const dispatch = useDispatch();
    const { categorySlug } = useParams();

    // Dynamically calculate max price for price range
    const maxPrice = useMemo(() => {
        if (!listings || listings.length === 0) return 1000;
        return Math.max(...listings.map((listing) => listing.price || 0));
    }, [listings]);

    // Initialize price range with dynamic max
    useEffect(() => {
        setPriceRange([0, maxPrice]);
    }, [maxPrice]);

    // Parse mm/dd/yyyy date format for filtering
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [month, day, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    // Filter listings based on search term, category, price, and end date
    const filteredListings = useMemo(() => {
        let filtered = listings;
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(
              (listing) =>
                listing.name?.toLowerCase().includes(lowerSearch) ||
                listing.desc?.toLowerCase().includes(lowerSearch)
            );
        }
        if (selectedCategory) {
            filtered = filtered.filter(
              (listing) => listing.category?.name === selectedCategory
            );
        }
        filtered = filtered.filter(
          (listing) =>
            listing.price >= priceRange[0] && listing.price <= priceRange[1]
        );
        if (endDate.start || endDate.end) {
            filtered = filtered.filter((listing) => {
                const listingEndDate = new Date(listing.endDate);
                const start = parseDate(endDate.start);
                const end = parseDate(endDate.end);
                return (
                  (!start || listingEndDate >= start) &&
                  (!end || listingEndDate <= end)
                );
            });
        }
        return filtered;
    }, [listings, searchTerm, selectedCategory, priceRange, endDate]);

    // Pagination logic
    const totalPages = Math.ceil(filteredListings.length / listingsPerPage);
    const startIndex = (currentPage - 1) * listingsPerPage;
    const currentListings = filteredListings.slice(
      startIndex,
      startIndex + listingsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, priceRange, endDate]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (categorySlug) {
            dispatch(getListingsByCategory(categorySlug)).then((e) => {
                if (e?.payload?.status === 404) {
                    setNotFoundError(true);
                } else {
                    setNotFoundError(false);
                }
            });
        } else {
            setNotFoundError(false);
            dispatch(getListings());
        }
        dispatch(getCategories());
    }, [dispatch, isError, message, categorySlug]);

    // Color scheme for light and dark modes
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const accentColor = useColorModeValue('#6246EA', '#9D77F2');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const iconColor = useColorModeValue('gray.400', 'gray.500');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');
    const paginationBg = useColorModeValue('gray.200', 'gray.600');
    const paginationHoverBg = useColorModeValue('gray.300', 'gray.500');
    const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)');

    if (isLoading) return <Spinner />;

    if (notFoundError) return <NotFound />;

    return (
      <Box bg={bgColor} p={{ base: '20px 15px 50px 15px', md: '30px 50px 50px 50px' }}>
          <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={6}>
              {/* Sidebar for Filters */}
              {showSidebar && (
                <Box
                  bg={cardBg}
                  p={4}
                  borderRadius="lg"
                  boxShadow="sm"
                  position="sticky"
                  top="20px"
                  maxH="calc(100vh - 40px)"
                  overflowY="auto"
                >
                    <VStack spacing={6} align="stretch">
                        {/* Search Bar */}
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                                Search
                            </FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                  pointerEvents="none"
                                  top="50%"
                                  transform="translateY(-50%)"
                                >
                                    <SearchIcon color={iconColor} boxSize={4} />
                                </InputLeftElement>
                                <Input
                                  placeholder="Search listings..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  fontSize="sm"
                                  borderRadius="md"
                                  borderColor={borderColor}
                                  pl={10}
                                  h="40px"
                                  _hover={{ borderColor: accentColor }}
                                  _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                                  _placeholder={{
                                      color: iconColor,
                                      fontStyle: 'normal',
                                  }}
                                  aria-label="Search listings by name or description"
                                />
                            </InputGroup>
                        </FormControl>

                        {/* Category Filter */}
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                                Category
                            </FormLabel>
                            <Select
                              placeholder="Select a category"
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              borderRadius="md"
                              borderColor={borderColor}
                              h="40px"
                              fontSize="sm"
                              _hover={{ borderColor: accentColor }}
                              _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                              bg={cardBg}
                            >
                                {categories.map((category) => (
                                  <option key={category.id} value={category.name}>
                                      {category.name}
                                  </option>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Price Range Filter */}
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                                Price Range
                            </FormLabel>
                            <Flex gap={2}>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={priceRange[0]}
                                  onChange={(e) =>
                                    setPriceRange([Number(e.target.value), priceRange[1]])
                                  }
                                  borderRadius="md"
                                  borderColor={borderColor}
                                  h="40px"
                                  fontSize="sm"
                                  _hover={{ borderColor: accentColor }}
                                  _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                                  bg={cardBg}
                                />
                                <Input
                                  type="number"
                                  placeholder={`${maxPrice}`}
                                  value={priceRange[1]}
                                  onChange={(e) =>
                                    setPriceRange([priceRange[0], Number(e.target.value)])
                                  }
                                  borderRadius="md"
                                  borderColor={borderColor}
                                  h="40px"
                                  fontSize="sm"
                                  _hover={{ borderColor: accentColor }}
                                  _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                                  bg={cardBg}
                                />
                            </Flex>
                        </FormControl>

                        {/* End Date Filter */}
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                                End Date
                            </FormLabel>
                            <VStack spacing={4}>
                                <InputGroup>
                                    <Input
                                      placeholder="mm/dd/yyyy"
                                      value={endDate.start}
                                      onChange={(e) =>
                                        setEndDate({ ...endDate, start: e.target.value })
                                      }
                                      borderRadius="md"
                                      borderColor={borderColor}
                                      h="40px"
                                      fontSize="sm"
                                      _hover={{ borderColor: accentColor }}
                                      _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                                      bg={cardBg}
                                    />
                                    <InputRightElement>
                                        <Icon as={CalendarIcon} color={iconColor} boxSize={4} />
                                    </InputRightElement>
                                </InputGroup>
                                <InputGroup>
                                    <Input
                                      placeholder="mm/dd/yyyy"
                                      value={endDate.end}
                                      onChange={(e) =>
                                        setEndDate({ ...endDate, end: e.target.value })
                                      }
                                      borderRadius="md"
                                      borderColor={borderColor}
                                      h="40px"
                                      fontSize="sm"
                                      _hover={{ borderColor: accentColor }}
                                      _focus={{ borderColor: accentColor, boxShadow: 'none' }}
                                      bg={cardBg}
                                    />
                                    <InputRightElement>
                                        <Icon as={CalendarIcon} color={iconColor} boxSize={4} />
                                    </InputRightElement>
                                </InputGroup>
                            </VStack>
                        </FormControl>

                        {/* Clear Filters Button */}
                        <Button
                          bg="transparent"
                          borderColor={accentColor}
                          borderWidth="1px"
                          color={accentColor}
                          borderRadius="md"
                          h="40px"
                          fontSize="sm"
                          onClick={() => {
                              setSelectedCategory('');
                              setPriceRange([0, maxPrice]);
                              setEndDate({ start: '', end: '' });
                              setSearchTerm('');
                          }}
                          _hover={{ bg: accentColor, color: 'white' }}
                          _focus={{ outline: '2px solid', outlineColor: accentColor, outlineOffset: '2px' }}
                        >
                            Clear Filters
                        </Button>
                    </VStack>
                </Box>
              )}

              {/* Main Content */}
              <Box>
                  {/* Results Count */}
                  <Flex justify="flex-end" mb={4}>
                      <Text fontSize="sm" color={textColor}>
                          {filteredListings.length} résultats trouvés.
                      </Text>
                  </Flex>

                  {/* Listings Grid */}
                  <MotionGrid
                    templateColumns={`repeat(${itemsDisplayCols}, 1fr)`}
                    gap={6}
                    alignItems="start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    key={currentPage}
                  >
                      {(categorySlug && filteredListings.length < 1) ||
                      (!categorySlug && filteredListings.length < 1 && searchTerm) ? (
                        <GridItem textAlign="center" colSpan={itemsDisplayCols}>
                            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
                                <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                                    {searchTerm
                                      ? 'No listings match your search.'
                                      : 'No listings in this category yet.'}
                                </Text>
                            </Box>
                        </GridItem>
                      ) : (
                        currentListings.map((listing, i) => (
                          <Box
                            key={i}
                            transition="all 0.3s ease-in-out"
                            _hover={{
                                transform: 'scale(1.02)',
                                boxShadow: `0 4px 15px ${shadowColor}`,
                            }}
                            _focus={{
                                transform: 'scale(1.02)',
                                boxShadow: `0 4px 15px ${shadowColor}`,
                            }}
                          >
                              <CardListing listing={listing} cardHeight={400} />
                          </Box>
                        ))
                      )}
                  </MotionGrid>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Flex justify="center" mt={8} gap={2}>
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <Box
                            key={i}
                            px={4}
                            py={2}
                            borderRadius="full"
                            bg={i + 1 === currentPage ? accentColor : paginationBg}
                            color={i + 1 === currentPage ? 'white' : textColor}
                            cursor="pointer"
                            onClick={() => setCurrentPage(i + 1)}
                            _hover={{
                                bg: i + 1 === currentPage ? accentColor : paginationHoverBg,
                            }}
                            _focus={{
                                outline: '2px solid',
                                outlineColor: accentColor,
                                outlineOffset: '2px',
                            }}
                            transition="background-color 0.3s ease"
                            aria-label={`Go to page ${i + 1}`}
                            role="button"
                          >
                              {i + 1}
                          </Box>
                        ))}
                    </Flex>
                  )}
              </Box>
          </Grid>
      </Box>
    );
};

export default ActiveListings;