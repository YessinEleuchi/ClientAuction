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

const EditModal = ({ selectedItem, setSelectedItem }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ isOpen: !!selectedItem });

  const handleClose = () => {
    setSelectedItem(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit {selectedItem?.type === 'auction' ? 'Auction' : 'User'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {selectedItem?.type === 'auction' ? (
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input defaultValue={selectedItem?.title} />
              </FormControl>
              <FormControl>
                <FormLabel>Current Bid</FormLabel>
                <Input type="number" defaultValue={selectedItem?.currentBid} />
              </FormControl>
              <FormControl>
                <FormLabel>End Date</FormLabel>
                <Input type="date" defaultValue={selectedItem?.endTime} />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select defaultValue={selectedItem?.status}>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                  <option value="draft">Draft</option>
                </Select>
              </FormControl>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input defaultValue={selectedItem?.name} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input defaultValue={selectedItem?.email} />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select defaultValue={selectedItem?.status}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </Select>
              </FormControl>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={handleClose}>Cancel</Button>
          <Button {...buttonStyles} onClick={handleClose}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;