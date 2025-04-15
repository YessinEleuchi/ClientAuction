

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Text,
  Textarea,
  useBreakpointValue,
  VStack,
  FormControl,
  FormLabel,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { Spinner } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  createListing,
  getCategories,
  getListing,
  updateListing,
} from '../../features/listings/listingsSlice';
import toast from '../toasts';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadImage } from '../imageUploader';
import NotFound from '../general/NotFound';

const CreateListing = ({ type }) => {
  const [createLoading, setCreateLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const [listingData, setListingData] = useState({
    name: '',
    category: '',
    price: '',
    closing_date: '',
    desc: '',
    file: null,
    file_type: null,
  });

  const { categories } = useSelector((state) => state.listings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listingSlug } = useParams();

  // 🎨 Couleurs adaptées IHM
  const primaryColor = useColorModeValue('#4F35DC', '#9D77F2');
  const primaryHoverColor = useColorModeValue('#3a28b5', '#7A5CE0');
  const accentColor = useColorModeValue('#FF7849', '#FF9A76');
  const accentHoverColor = useColorModeValue('#E6633A', '#E68564');
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const inputBgColor = useColorModeValue('white', 'gray.800');

  const buttonStyles = {
    bg: primaryColor,
    color: 'white',
    _hover: { bg: primaryHoverColor },
    _active: { transform: 'scale(0.98)' },
    _focus: { boxShadow: '0 0 0 3px rgba(79, 53, 220, 0.3)' },
  };

  useEffect(() => {
    if (listingSlug) {
      dispatch(getListing(listingSlug)).then((e) => {
        if (e?.payload?.status === 'success') {
          setNotFoundError(false);
          const listing = e.payload.data;
          dispatch(getCategories()).then((e) => {
            if (e?.payload?.status === 'success') {
              const categories = e.payload.data;
              const listingCategory = categories.find(
                (category) => category.name === listing?.listing?.category
              );

              const closingDate = new Date(listing?.listing?.closing_date);
              const closingDateLocal = new Date(
                closingDate.getTime() - closingDate.getTimezoneOffset() * 60000
              ).toISOString();

              setListingData((prevListingData) => ({
                ...prevListingData,
                name: listing?.listing?.name,
                category: listingCategory ? listingCategory.slug : 'other',
                price: listing?.listing?.price,
                closing_date: closingDateLocal.substring(0, closingDateLocal.lastIndexOf('.')),
                desc: listing?.listing?.desc,
              }));
              setIsLoading(false);
            }
          });
        } else if (e?.payload?.status === 404) {
          setNotFoundError(true);
          setIsLoading(false);
        } else {
          setNotFoundError(false);
          setIsLoading(false);
        }
      });
    } else {
      setNotFoundError(false);
      setIsLoading(false);
      dispatch(getCategories());
    }
  }, [dispatch, listingSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (e.target?.files) {
      const file = e.target.files[0];
      setListingData({ ...listingData, [name]: file.type, file: file });
    } else {
      setListingData({ ...listingData, [name]: value });
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setCreateLoading(true);
    const file = listingData.file;
    const updatedListingData = {
      ...listingData,
      closing_date: new Date(listingData.closing_date).toISOString(),
    };
    delete updatedListingData['file'];
    if (!file) delete updatedListingData['file_type'];

    if (type) updatedListingData['slug'] = listingSlug;

    dispatch(type ? updateListing(updatedListingData) : createListing(updatedListingData)).then(
      (e) => {
        if (e?.payload?.status === 'success') {
          const fileData = e.payload.data.file_upload_data;
          if (file) {
            uploadImage(file, fileData.public_id, fileData.signature, fileData.timestamp).then(() => {
              setCreateLoading(false);
              toast.success(e.payload.message);
              navigate('/dashboard/listings');
            });
          } else {
            setCreateLoading(false);
            toast.success(e.payload.message);
            navigate('/dashboard/listings');
          }
        } else {
          setCreateLoading(false);
          toast.error(e.payload.message || 'Failed to create/update listing');
        }
      }
    );
  };

  if (isLoading && !createLoading) return <Spinner />;
  if (notFoundError) return <NotFound />;

  return (
    <Box p={{ base: 8, md: 10 }} w="100%" maxW="700px" mx="auto">
      <Text fontSize="3xl" fontWeight="bold" mb={8} textAlign="center" color={primaryColor}>
        {!type ? 'Add New Listing' : 'Edit Listing'}
      </Text>

      <form onSubmit={submitHandler}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel color={labelColor}>Product Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Input the product name"
              onChange={handleChange}
              value={listingData.name}
              bg={inputBgColor}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={labelColor}>Select Product Category</FormLabel>
            <Select
              placeholder="Choose a category"
              name="category"
              onChange={handleChange}
              value={listingData.category}
              bg={inputBgColor}
            >
              {categories.map((category, i) => (
                <option value={category.slug} key={i}>
                  {category.name}
                </option>
              ))}
              <option value="other">Other</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={labelColor}>Bidding Price</FormLabel>
            <InputGroup>
              <InputLeftAddon children="DT" />
              <NumberInput value={listingData.price} w="100%">
                <NumberInputField
                  name="price"
                  placeholder="Enter a starting price"
                  onChange={handleChange}
                  bg={inputBgColor}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={labelColor}>Closing Date</FormLabel>
            <Input
              type="datetime-local"
              name="closing_date"
              onChange={handleChange}
              value={listingData.closing_date}
              min={new Date().toISOString().slice(0, 16)}
              bg={inputBgColor}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={labelColor}>Product Description</FormLabel>
            <Textarea
              name="desc"
              placeholder="Enter description"
              onChange={handleChange}
              value={listingData.desc}
              rows={6}
              bg={inputBgColor}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={labelColor}>Upload Images</FormLabel>
            <Input
              type="file"
              name="file_type"
              onChange={handleChange}
              accept="image/png, image/jpeg, image/bmp, image/webp"
              required={!type}
              bg={inputBgColor}
            />
          </FormControl>
        </VStack>

        <Flex justify="flex-end" mt={8} gap={4}>
          <Button
            bg={accentColor}
            color="white"
            _hover={{ bg: accentHoverColor }}
            onClick={() => navigate('/dashboard/listings')}
          >
            Cancel
          </Button>
          <Button
            {...buttonStyles}
            type="submit"
            isLoading={createLoading}
            loadingText={type ? 'Updating...' : 'Creating...'}
          >
            {!type ? 'Create Listing' : 'Update Listing'}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default CreateListing;