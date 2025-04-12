import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { FiRefreshCw } from 'react-icons/fi';
import { getListings } from '../../features/listings/listingsSlice';
import { translations } from '../../constants/translations';
import toast from '../toasts';
import Spinner from '../../components/Spinner';

// Subcomponents
import DashboardOverview from '../AdminDashboard/DashboardOverview';
import ManageListings from './ManageListings';
import ManageUsers from './ManageUsers';
import ManageBids from './ManageBids';
import Settings from './Settings';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import NewListingModal from './NewListingModal';

// Styles
import { buttonStyles, secondaryButtonStyles, useCustomColors } from './styles';

// Placeholder image
import placeholderImg from '../../assets/enchere1.jpg';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { listings, isLoading, isError, message } = useSelector((state) => state.listings);
  const currentLanguage = useSelector((state) => state.language?.currentLanguage || 'en');
  const t = translations[currentLanguage] || translations.en;
  const { bgColor, cardBgColor, textColor, secondaryTextColor } = useCustomColors();

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalAuctions: 124,
    activeAuctions: 42,
    totalUsers: 567,
    totalRevenue: 25780.50,
    recentAuctions: [
      { id: 1, title: "Vintage Watch Collection", currentBid: 450, bids: 12, endTime: "2025-04-12", status: "active", image: placeholderImg },
      { id: 2, title: "Art Deco Furniture Set", currentBid: 1200, bids: 8, endTime: "2025-04-15", status: "active", image: placeholderImg },
      { id: 3, title: "Classic Car Memorabilia", currentBid: 350, bids: 5, endTime: "2025-04-08", status: "ended", image: placeholderImg },
      { id: 4, title: "Rare Coin Collection", currentBid: 875, bids: 20, endTime: "2025-04-07", status: "active", image: placeholderImg },
      { id: 5, title: "Antique Book Set", currentBid: 220, bids: 3, endTime: "2025-04-12", status: "draft", image: placeholderImg }
    ],
    users: [
      { id: 1, name: "Sarah Johnson", email: "sarah@example.com", joined: "2025-01-15", bids: 24, purchases: 5, status: "active" },
      { id: 2, name: "Michael Chen", email: "michael@example.com", joined: "2025-02-03", bids: 18, purchases: 3, status: "active" },
      { id: 3, name: "Emily Rodriguez", email: "emily@example.com", joined: "2025-03-10", bids: 6, purchases: 1, status: "pending" },
      { id: 4, name: "David Kim", email: "david@example.com", joined: "2025-01-28", bids: 32, purchases: 7, status: "active" },
      { id: 5, name: "Jessica Patel", email: "jessica@example.com", joined: "2025-02-15", bids: 15, purchases: 2, status: "suspended" }
    ],
    transactions: [
      { id: 1, user: "Sarah Johnson", item: "Vintage Watch Collection", amount: 450, date: "2025-04-01", status: "completed" },
      { id: 2, user: "David Kim", item: "Art Deco Furniture Set", amount: 1200, date: "2025-03-28", status: "completed" },
      { id: 3, user: "Michael Chen", item: "Rare Coin Collection", amount: 875, date: "2025-03-25", status: "processing" },
      { id: 4, user: "Jessica Patel", item: "Antique Book Set", amount: 220, date: "2025-03-22", status: "completed" },
      { id: 5, user: "David Kim", item: "Classic Car Memorabilia", amount: 350, date: "2025-03-20", status: "refunded" }
    ]
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
      console.log(message);
    }
    dispatch(getListings());
  }, [dispatch, isError, message]);

  const handleEditItem = (item, type) => {
    setSelectedItem({ ...item, type });
  };

  const handleDeleteConfirm = (item, type) => {
    setSelectedItem({ ...item, type });
  };

  const deleteItem = () => {
    if (!selectedItem) return;
    if (selectedItem.type === 'auction') {
      setDashboardData(prev => ({
        ...prev,
        recentAuctions: prev.recentAuctions.filter(item => item.id !== selectedItem.id),
        totalAuctions: prev.totalAuctions - 1,
        activeAuctions: selectedItem.status === 'active' ? prev.activeAuctions - 1 : prev.activeAuctions
      }));
      toast.success("Auction successfully deleted");
    } else if (selectedItem.type === 'user') {
      setDashboardData(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== selectedItem.id),
        totalUsers: prev.totalUsers - 1
      }));
      toast.success("User successfully deleted");
    }
    setSelectedItem(null);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>Admin Dashboard</Heading>
          <Box color={secondaryTextColor}>Manage your auction platform</Box>
        </Box>
        <HStack>
          <Button {...secondaryButtonStyles} leftIcon={<FiRefreshCw />} onClick={() => dispatch(getListings())}>
            Refresh Data
          </Button>
        </HStack>
      </Flex>

      <Box bg={bgColor} borderRadius="xl" boxShadow="md" mb={8}>
        <Tabs colorScheme="purple" onChange={(index) => setActiveTab(index)} index={activeTab}>
          <TabList overflowX="auto" py={2} px={4}>
            <Tab>Dashboard</Tab>
            <Tab>Listings</Tab>
            <Tab>Users</Tab>
            <Tab>Bids</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DashboardOverview
                dashboardData={dashboardData}
                handleEditItem={handleEditItem}
                handleDeleteConfirm={handleDeleteConfirm}
              />
            </TabPanel>
            <TabPanel>
              <ManageListings
                dashboardData={dashboardData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                handleEditItem={handleEditItem}
                handleDeleteConfirm={handleDeleteConfirm}
              />
            </TabPanel>
            <TabPanel>
              <ManageUsers
                dashboardData={dashboardData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                handleEditItem={handleEditItem}
                handleDeleteConfirm={handleDeleteConfirm}
              />
            </TabPanel>
            <TabPanel>
              <ManageBids />
            </TabPanel>
            <TabPanel>
              <Settings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <EditModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <DeleteModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} deleteItem={deleteItem} />
      <NewListingModal />
    </Container>
  );
};

export default AdminDashboard;