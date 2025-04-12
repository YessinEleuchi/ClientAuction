import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { buttonStyles } from './styles';

const NewListingModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button {...buttonStyles} onClick={onOpen} mb={4}>
        Add New Listing
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input placeholder="Enter listing title" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input placeholder="Enter description" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Starting Bid</FormLabel>
                <Input type="number" placeholder="Enter starting bid" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select defaultValue="draft">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Upload Images</FormLabel>
                <Input type="file" accept="image/*" multiple />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button {...buttonStyles} onClick={onClose}>
              Create Listing
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewListingModal;