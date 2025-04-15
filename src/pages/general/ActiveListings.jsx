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
    Select,
    Badge,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaFilter } from 'react-icons/fa'; // Icône pour le filtre
import { motion } from 'framer-motion'; // Pour l'animation
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

// Animation pour le fade-in lors du changement de page
const MotionGrid = motion(Grid);

const ActiveListings = () => {
    const itemsDisplayCols = useBreakpointValue({ base: 1, md: 2, lg: 3 });
    const [notFoundError, setNotFoundError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const listingsPerPage = 9;

    const { listings, isLoading, isError, message, categories } = useSelector(
      (state) => state.listings
    );
    const dispatch = useDispatch();
    const { categorySlug } = useParams();

    // Filter listings based on search term and category (instant filtering)
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
        return filtered;
    }, [listings, searchTerm, selectedCategory]);

    // Pagination logic for filtered listings
    const totalPages = Math.ceil(filteredListings.length / listingsPerPage);
    const startIndex = (currentPage - 1) * listingsPerPage;
    const currentListings = filteredListings.slice(
      startIndex,
      startIndex + listingsPerPage
    );

    // Reset to page 1 when search term or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

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

    // Color scheme matching the screenshot
    const bgColor = useColorModeValue('#F5F5F5', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const accentColor = useColorModeValue('#6246EA', '#9D77F2');
    const gradientBg = useColorModeValue(
      'linear(to-r, #F5F5F5, #E8E8E8)',
      'linear(to-r, gray.800, gray.700)'
    );

    if (isLoading) return <Spinner />;

    if (notFoundError) return <NotFound />;

    return (
      <Box p={{ base: '20px 30px 50px 30px', md: '30px 50px 50px 50px' }}>
          {/* Search Bar with Category Filter */}
          <Flex
            mb={10}
            maxW={{ base: '100%', md: '700px' }}
            mx="auto"
            alignItems="center"
            gap={4}
            flexDirection={{ base: 'column', md: 'row' }}
          >
              {/* Category Filter with Icon */}
              <Flex alignItems="center" position="relative">
                  <Box
                    position="absolute"
                    left="12px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1}
                  >
                      <FaFilter color={accentColor} size={16} />
                  </Box>
                  <Select
                    placeholder="Select a category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    maxW={{ base: '100%', md: '200px' }}
                    borderRadius="full"
                    bg="white"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                    pl={10}
                    _hover={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)' }}
                    _focus={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)' }}
                  >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                      ))}
                  </Select>
              </Flex>

              {/* Search Bar with Hover Effect */}
              <Box
                flex="1"
                bgGradient={gradientBg}
                p={4}
                borderRadius="full"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
                transition="all 0.3s ease-in-out"
                _hover={{
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)', // Ajout d'un boxShadow au hover
                    bg: 'whiteAlpha.200', // Changement léger de couleur
                }}
                _focusWithin={{
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    transform: 'scale(1.02)',
                }}
              >
                  <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        top="50%"
                        transform="translateY(-50%)"
                      >
                          <SearchIcon color={accentColor} boxSize={5} />
                      </InputLeftElement>
                      <Input
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Filtrage instantané
                        fontSize="md"
                        fontWeight="medium"
                        border="none"
                        bg="transparent"
                        pl={12}
                        h="48px"
                        _focus={{
                            boxShadow: 'none',
                            bg: 'whiteAlpha.100',
                        }}
                        _placeholder={{
                            color: textColor,
                            opacity: 0.7,
                            fontStyle: 'italic',
                        }}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        borderRadius="full"
                        aria-label="Search listings by name or description"
                      />
                  </InputGroup>
              </Box>
          </Flex>

          {/* Results Count */}
          <Flex justify="flex-end" mb={4}>
              <Text fontSize="sm" color={textColor}>
                  {filteredListings.length} résultat
                  {filteredListings.length !== 1 ? 's' : ''} trouvé
                  {filteredListings.length !== 1 ? 's' : ''}.
              </Text>
          </Flex>

          {/* Main Content with Fade-In Animation */}
          <MotionGrid
            templateColumns={`repeat(${itemsDisplayCols}, 1fr)`}
            gap={6}
            alignItems="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }} // Fade-in animation
            key={currentPage} // Key ensures animation triggers on page change
          >
              {(categorySlug && filteredListings.length < 1) ||
              (!categorySlug && filteredListings.length < 1 && searchTerm) ? (
                <GridItem textAlign="center" colSpan={itemsDisplayCols}>
                    <Box bg="gray.50" p={6} borderRadius="lg" boxShadow="md">
                        <Text fontSize="xl" fontWeight="bold" color="blue.500">
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
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                      <CardListing listing={listing} cardHeight={400} />
                      {/* Badge for listing status */}
                  </Box>
                ))
              )}
          </MotionGrid>

          {/* Pagination with Numbers */}
          {totalPages > 1 && (
            <Flex justify="center" mt={8} gap={2}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Box
                    key={i}
                    px={4}
                    py={2}
                    borderRadius="full"
                    bg={i + 1 === currentPage ? accentColor : 'gray.300'}
                    color={i + 1 === currentPage ? 'white' : 'gray.800'}
                    cursor="pointer"
                    onClick={() => setCurrentPage(i + 1)}
                    _hover={{
                        bg: i + 1 === currentPage ? accentColor : 'gray.400',
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
    );
};

export default ActiveListings;