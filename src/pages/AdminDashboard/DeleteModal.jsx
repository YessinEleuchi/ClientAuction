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
  Text,
  useDisclosure,
} from '@chakra-ui/react';

const DeleteModal = ({ selectedItem, setSelectedItem, deleteItem }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ isOpen: !!selectedItem });

  const handleClose = () => {
    setSelectedItem(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>
            Are you sure you want to delete this {selectedItem?.type}? This action cannot be undone.
          </Text>
          {selectedItem?.type === 'auction' && (
            <Text mt={4} fontWeight="bold">
              {selectedItem?.title}
            </Text>
          )}
          {selectedItem?.type === 'user' && (
            <Text mt={4} fontWeight="bold">
              {selectedItem?.name}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={handleClose}>Cancel</Button>
          <Button colorScheme="red" onClick={() => { deleteItem(); handleClose(); }}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
