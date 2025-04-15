import React, { useEffect, useState } from 'react';
import {
    Grid,
    GridItem,
    Text,
    Box,
    Heading,
    Flex,
    Center,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';

import { CardListing, Spinner } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getWatchlistListings } from '../../features/listings/listingsSlice';
import toast from '../toasts';

const WatchList = () => {
    const itemsDisplayCols = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3 });
    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 9; // Display 9 listings per page, as seen in the image

    const { listings, isLoading, isError, message } = useSelector((state) => state.listings);
    const dispatch = useDispatch();

    // Color scheme
    const bgColor = useColorModeValue('white', 'gray.900');
    const textColor = useColorModeValue('gray.700', 'gray.300');
    const primaryColor = useColorModeValue('#6246EA', '#9D77F2');
    const accentColor = useColorModeValue('#FF7849', '#FF9A76');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.15)');

    // Pagination logic
    const totalPages = Math.ceil(listings.length / listingsPerPage);
    const startIndex = (currentPage - 1) * listingsPerPage;
    const currentListings = listings.slice(startIndex, startIndex + listingsPerPage);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        dispatch(getWatchlistListings());
    }, [dispatch, isError, message]);

    if (isLoading) return <Spinner />;

    return (
      <Box bg={bgColor} minH="100vh" pt={0} px={{ base: 6, md: 10 }} pb={20}>

          {/* Main Content */}
          <Box p={{ base: "20px 30px 50px 30px", md: "30px 50px 50px 50px" }}>
              <Grid
                templateColumns={`repeat(${itemsDisplayCols}, 1fr)`}
                gap={6}
                alignItems="start"
              >
                  {listings.length > 0 ? (
                    currentListings.map((listing, i) => (
                      <Box
                        key={i}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                        boxShadow={`0 4px 10px ${shadowColor}`}
                        transition="transform 0.2s ease"
                        _hover={{ transform: 'scale(1.02)' }}
                      >
                          <CardListing listing={listing} cardHeight={400} />
                      </Box>
                    ))
                  ) : (
                    <GridItem colSpan={itemsDisplayCols}>
                        <Center py={12}>
                            <Box
                              bg="gray.50"
                              p={6}
                              borderRadius="lg"
                              boxShadow="md"
                            >
                                <Text fontSize="xl" fontWeight="bold" color="blue.500">
                                    You have no listings in your watchlist.
                                </Text>
                            </Box>
                        </Center>
                    </GridItem>
                  )}
              </Grid>

              {/* Pagination Dots */}
              {totalPages > 1 && (
                <Flex justify="center" mt={8} gap={3}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Box
                        key={i}
                        w="12px"
                        h="12px"
                        borderRadius="full"
                        bg={i + 1 === currentPage ? "blue.500" : "gray.300"}
                        cursor="pointer"
                        onClick={() => setCurrentPage(i + 1)}
                        _hover={{ bg: i + 1 === currentPage ? "blue.500" : "gray.400" }}
                        transition="background-color 0.2s"
                        aria-label={`Go to page ${i + 1}`}
                        role="button"
                      />
                    ))}
                </Flex>
              )}
          </Box>
      </Box>
    );
};

export default WatchList;