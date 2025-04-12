import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Input,
  Select,
  Divider,
  Card,
  CardBody
} from '@chakra-ui/react';
import { buttonStyles, secondaryButtonStyles, cardStyles } from './styles';

const Settings = () => (
  <>
    <Heading size="md" mb={6}>General Settings</Heading>

    <Card {...cardStyles} mb={8}>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="maintenance-mode" mb="0">
              Maintenance Mode
            </FormLabel>
            <Switch id="maintenance-mode" colorScheme="purple" />
          </FormControl>

          <Divider />

          <FormControl>
            <FormLabel>Site Name</FormLabel>
            <Input defaultValue="AuctionPro" />
          </FormControl>

          <FormControl>
            <FormLabel>Admin Email</FormLabel>
            <Input defaultValue="admin@auctionpro.com" />
          </FormControl>

          <FormControl>
            <FormLabel>Currency</FormLabel>
            <Select defaultValue="usd">
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
              <option value="jpy">JPY (¥)</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Default Auction Duration (days)</FormLabel>
            <Input type="number" defaultValue="7" />
          </FormControl>
        </VStack>
      </CardBody>
    </Card>

    <Heading size="md" mb={6}>Notification Settings</Heading>

    <Card {...cardStyles}>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="email-notifications" mb="0">
              Email Notifications
            </FormLabel>
            <Switch id="email-notifications" colorScheme="purple" defaultChecked />
          </FormControl>

          <Divider />

          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="new-auction-notifications" mb="0">
              New Auction Notifications
            </FormLabel>
            <Switch id="new-auction-notifications" colorScheme="purple" defaultChecked />
          </FormControl>

          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="bid-notifications" mb="0">
              Bid Notifications
            </FormLabel>
            <Switch id="bid-notifications" colorScheme="purple" defaultChecked />
          </FormControl>

          <FormControl display="flex" alignItems="center" justifyContent="space-between">
            <FormLabel htmlFor="user-notifications" mb="0">
              New User Notifications
            </FormLabel>
            <Switch id="user-notifications" colorScheme="purple" defaultChecked />
          </FormControl>
        </VStack>
      </CardBody>
    </Card>

    <Flex justify="end" mt={6}>
      <Button mr={3} {...secondaryButtonStyles}>
        Cancel
      </Button>
      <Button {...buttonStyles}>
        Save Settings
      </Button>
    </Flex>
  </>
);

export default Settings;
