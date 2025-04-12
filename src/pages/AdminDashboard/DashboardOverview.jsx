import React from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  HStack
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { cardStyles, secondaryButtonStyles, useCustomColors } from './styles';

const DashboardOverview = ({ dashboardData, handleEditItem, handleDeleteConfirm }) => {
  const { secondaryTextColor, textColor } = useCustomColors();

  return (
    <>
      {/* Stats Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        <GridItem>
          <Card {...cardStyles}>
            <CardBody>
              <Stat>
                <StatLabel color={secondaryTextColor}>Total Auctions</StatLabel>
                <StatNumber color={textColor} fontSize="3xl">{dashboardData.totalAuctions}</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="purple">{dashboardData.activeAuctions} active</Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card {...cardStyles}>
            <CardBody>
              <Stat>
                <StatLabel color={secondaryTextColor}>Total Users</StatLabel>
                <StatNumber color={textColor} fontSize="3xl">{dashboardData.totalUsers}</StatNumber>
                <StatHelpText color="green.500">+8% from last month</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card {...cardStyles}>
            <CardBody>
              <Stat>
                <StatLabel color={secondaryTextColor}>Total Revenue</StatLabel>
                <StatNumber color={textColor} fontSize="3xl">${dashboardData.totalRevenue.toLocaleString()}</StatNumber>
                <StatHelpText color="green.500">+5.2% from last month</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card {...cardStyles}>
            <CardBody>
              <Stat>
                <StatLabel color={secondaryTextColor}>Conversion Rate</StatLabel>
                <StatNumber color={textColor} fontSize="3xl">24.5%</StatNumber>
                <StatHelpText color="red.500">-2.3% from last month</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Recent Auctions */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent Auctions</Heading>
          <Button as={Link} to="/admin/listings" size="sm" {...secondaryButtonStyles} leftIcon={<FiEye />}>
            View All
          </Button>
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
                {dashboardData.recentAuctions.slice(0, 3).map((auction) => (
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
                      <HStack>
                        <Button size="sm" variant="ghost" colorScheme="blue" onClick={() => handleEditItem(auction, 'auction')}>
                          <FiEdit />
                        </Button>
                        <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleDeleteConfirm(auction, 'auction')}>
                          <FiTrash2 />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Box>

      {/* Recent Users */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent Users</Heading>
          <Button as={Link} to="/admin/users" size="sm" {...secondaryButtonStyles} leftIcon={<FiEye />}>
            View All
          </Button>
        </Flex>

        <Card {...cardStyles}>
          <CardBody p={0} overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Joined</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dashboardData.users.slice(0, 3).map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <Flex align="center">
                        <Image src="" alt={user.name} boxSize="40px" borderRadius="full" bg="gray.300" mr={3} />
                        <Text fontWeight="medium">{user.name}</Text>
                      </Flex>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>{new Date(user.joined).toLocaleDateString()}</Td>
                    <Td>
                      <Badge colorScheme={user.status === 'active' ? 'green' : user.status === 'pending' ? 'yellow' : 'red'}>
                        {user.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack>
                        <Button size="sm" variant="ghost" colorScheme="blue" onClick={() => handleEditItem(user, 'user')}>
                          <FiEdit />
                        </Button>
                        <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleDeleteConfirm(user, 'user')}>
                          <FiTrash2 />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Box>

      {/* Recent Transactions */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent Transactions</Heading>
          <Button as={Link} to="/admin/transactions" size="sm" {...secondaryButtonStyles} leftIcon={<FiEye />}>
            View All
          </Button>
        </Flex>

        <Card {...cardStyles}>
          <CardBody p={0} overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Item</Th>
                  <Th>Amount</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dashboardData.transactions.slice(0, 3).map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>{transaction.user}</Td>
                    <Td>{transaction.item}</Td>
                    <Td>${transaction.amount}</Td>
                    <Td>{new Date(transaction.date).toLocaleDateString()}</Td>
                    <Td>
                      <Badge colorScheme={
                        transaction.status === 'completed' ? 'green' :
                          transaction.status === 'processing' ? 'yellow' :
                            transaction.status === 'refunded' ? 'orange' : 'red'
                      }>
                        {transaction.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

export default DashboardOverview;