import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  Select,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { cardStyles, buttonStyles, secondaryButtonStyles } from './styles';

const ManageBids = () => (
  <>
    <Flex justify="space-between" align="center" mb={6}>
      <Heading size="md">Manage Bids</Heading>
      <Button {...secondaryButtonStyles} leftIcon={<FiRefreshCw />}>
        Refresh Data
      </Button>
    </Flex>

    <Flex gap={4} mb={6} wrap="wrap">
      <Input
        placeholder="Search bids..."
        w={{ base: "100%", md: "300px" }}
      />
      <Select w={{ base: "100%", md: "200px" }}>
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </Select>
    </Flex>

    <Card {...cardStyles}>
      <CardBody p={0} overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Item</Th>
              <Th>Bid Amount</Th>
              <Th>Bid Time</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* MOCK Static Data */}
            <Tr>
              <Td>Sarah Johnson</Td>
              <Td>Vintage Watch Collection</Td>
              <Td>$450</Td>
              <Td>Apr 1, 2025 14:32</Td>
              <Td><Badge colorScheme="green">Highest</Badge></Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
                  <MenuList>
                    <MenuItem icon={<FiEdit />}>Edit Bid</MenuItem>
                    <MenuItem icon={<FiXCircle />} color="red.500">Cancel Bid</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
            <Tr>
              <Td>David Kim</Td>
              <Td>Art Deco Furniture Set</Td>
              <Td>$1200</Td>
              <Td>Mar 28, 2025 10:15</Td>
              <Td><Badge colorScheme="green">Won</Badge></Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
                  <MenuList>
                    <MenuItem icon={<FiEdit />}>Edit Bid</MenuItem>
                    <MenuItem icon={<FiXCircle />} color="red.500">Cancel Bid</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
            <Tr>
              <Td>Jessica Patel</Td>
              <Td>Classic Car Memorabilia</Td>
              <Td>$325</Td>
              <Td>Mar 25, 2025 16:45</Td>
              <Td><Badge colorScheme="red">Outbid</Badge></Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
                  <MenuList>
                    <MenuItem icon={<FiEdit />}>Edit Bid</MenuItem>
                    <MenuItem icon={<FiXCircle />} color="red.500">Cancel Bid</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  </>
);

export default ManageBids;
