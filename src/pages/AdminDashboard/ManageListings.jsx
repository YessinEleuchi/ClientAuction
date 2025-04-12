import React from 'react';
import { Box, Flex, Heading, Button, Input, Select, Card, CardBody, Table, Thead, Tbody, Tr, Th, Td, Image, Text, Badge, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { FiMoreVertical, FiEdit, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { cardStyles, buttonStyles } from './styles';

const ManageListings = ({ dashboardData, searchTerm, setSearchTerm, statusFilter, setStatusFilter, handleEditItem, handleDeleteConfirm }) => (
  <>
    <Flex justify="space-between" align="center" mb={6}>
      <Heading size="md">Manage Listings</Heading>
      <Button {...buttonStyles} leftIcon={<FiCheckCircle />}>
        Add New Listing
      </Button>
    </Flex>

    <Flex gap={4} mb={6} wrap="wrap">
      <Input
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        w={{ base: "100%", md: "300px" }}
      />
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        w={{ base: "100%", md: "200px" }}
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="ended">Ended</option>
        <option value="draft">Draft</option>
      </Select>
    </Flex>

    <Card {...cardStyles}>
      <CardBody p={0} overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Item</Th>
              <Th>Current Bid</Th>
              <Th>Bids</Th>
              <Th>End Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dashboardData.recentAuctions
              .filter(auction =>
                (statusFilter === 'all' || auction.status === statusFilter) &&
                auction.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(auction => (
                <Tr key={auction.id}>
                  <Td>
                    <Flex align="center">
                      <Image src={auction.image} alt={auction.title} boxSize="40px" borderRadius="md" mr={3} />
                      <Text fontWeight="medium">{auction.title}</Text>
                    </Flex>
                  </Td>
                  <Td>${auction.currentBid}</Td>
                  <Td>{auction.bids}</Td>
                  <Td>{new Date(auction.endTime).toLocaleDateString()}</Td>
                  <Td>
                    <Badge colorScheme={auction.status === 'active' ? 'green' : auction.status === 'ended' ? 'gray' : 'yellow'}>
                      {auction.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
                      <MenuList>
                        <MenuItem icon={<FiEdit />} onClick={() => handleEditItem(auction, 'auction')}>
                          Edit Listing
                        </MenuItem>
                        <MenuItem icon={<FiCheckCircle />}>
                          {auction.status === 'active' ? 'End Auction' : 'Activate Auction'}
                        </MenuItem>
                        <MenuItem icon={<FiTrash2 />} onClick={() => handleDeleteConfirm(auction, 'auction')}>
                          Delete Listing
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  </>
);

export default ManageListings;