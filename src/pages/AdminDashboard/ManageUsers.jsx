import React from 'react';
import {
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
  Text,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { cardStyles, buttonStyles } from './styles';

const ManageUsers = ({ dashboardData, searchTerm, setSearchTerm, statusFilter, setStatusFilter, handleEditItem, handleDeleteConfirm }) => (
  <>
    <Flex justify="space-between" align="center" mb={6}>
      <Heading size="md">Manage Users</Heading>
      <Button {...buttonStyles} leftIcon={<FiCheckCircle />}>
        Add New User
      </Button>
    </Flex>

    <Flex gap={4} mb={6} wrap="wrap">
      <Input
        placeholder="Search users..."
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
        <option value="pending">Pending</option>
        <option value="suspended">Suspended</option>
      </Select>
    </Flex>

    <Card {...cardStyles}>
      <CardBody p={0} overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Joined</Th>
              <Th>Bids</Th>
              <Th>Purchases</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dashboardData.users
              .filter(user =>
                (statusFilter === 'all' || user.status === statusFilter) &&
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(user => (
                <Tr key={user.id}>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" name={user.name} mr={3} />
                      <Text fontWeight="medium">{user.name}</Text>
                    </Flex>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>{new Date(user.joined).toLocaleDateString()}</Td>
                  <Td>{user.bids}</Td>
                  <Td>{user.purchases}</Td>
                  <Td>
                    <Badge colorScheme={
                      user.status === 'active' ? 'green' :
                        user.status === 'pending' ? 'yellow' : 'red'
                    }>
                      {user.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
                      <MenuList>
                        <MenuItem icon={<FiEdit />} onClick={() => handleEditItem(user, 'user')}>
                          Edit User
                        </MenuItem>
                        <MenuItem icon={user.status === 'active' ? <FiXCircle /> : <FiCheckCircle />}>
                          {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                        </MenuItem>
                        <MenuItem icon={<FiTrash2 />} onClick={() => handleDeleteConfirm(user, 'user')}>
                          Delete User
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

export default ManageUsers;