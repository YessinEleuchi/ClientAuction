import React, { useEffect } from 'react';
import {
    Grid,
    GridItem,
    Text,
    useBreakpointValue,
    useColorModeValue,
    Box,
    Heading,
    Flex,
    Center
} from '@chakra-ui/react';

import { CardListing, Spinner, SubHeader } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getWatchlistListings } from '../../features/listings/listingsSlice';
import toast from '../toasts';

const WatchList = () => {
    const itemsDisplayCols = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3 });

    const { listings, isLoading, isError, message } = useSelector((state) => state.listings);
    const dispatch = useDispatch();

    // Color scheme
    const bgColor = useColorModeValue('white', 'gray.900');
    const textColor = useColorModeValue('gray.700', 'gray.300');
    const primaryColor = useColorModeValue('#6246EA', '#9D77F2');
    const accentColor = useColorModeValue('#FF7849', '#FF9A76');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.15)');

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        dispatch(getWatchlistListings());
    }, [dispatch, isError, message]);

    if (isLoading) return <Spinner />;

    return (
      <Box bg={bgColor} minH="100vh" pt={12} px={{ base: 6, md: 10 }} pb={20}>
          <Flex justify="center" mb={10}>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} color={primaryColor}>
                  My Watchlist
              </Heading>
          </Flex>

          <Grid
            templateColumns={`repeat(${itemsDisplayCols}, 1fr)`}
            gap={8}
            alignItems="stretch"
          >
              {listings.length > 0 ? (
                listings.map((listing, i) => (
                  <Box
                    key={i}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow={`0 4px 10px ${shadowColor}`}
                    transition="transform 0.2s ease"
                    _hover={{ transform: 'scale(1.02)' }}
                  >
                      <CardListing listing={listing} />
                  </Box>
                ))
              ) : (
                <GridItem colSpan={itemsDisplayCols}>
                    <Center py={12}>
                        <Text fontSize="lg" fontWeight="semibold" color={accentColor}>
                            You have no listings in your watchlist.
                        </Text>
                    </Center>
                </GridItem>
              )}
          </Grid>
      </Box>
    );
};

export default WatchList;
