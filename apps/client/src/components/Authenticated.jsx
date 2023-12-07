import {
  Box,
  Button,
  Card,
  Code,
  Divider,
  Flex,
  Text,
  Image,
  VStack,
  Tooltip,
} from "@chakra-ui/react";

import { usePlaidLink } from "react-plaid-link";

import BTCLogo from "../assets/btc.png";
import { useAuthStore } from "../state/authentication";
import { useEffect, useState } from "react";
import { PurchaseModal } from "./PurchaseModal";
import { Footer } from "./Footer";
import { usePlaidStore } from "../state/plaid";
import { useCryptoStore } from "../state/crypto";

export function Authenticated() {
  const [showModal, setShowModal] = useState(false);

  const { logout } = useAuthStore((state) => ({
    logout: state.logout,
  }));

  const { link_token, plaidAccounts, getPlaidAccounts } = usePlaidStore(
    (state) => ({
      link_token: state.link_token,
      plaidAccounts: state.plaidAccounts,
      getPlaidAccounts: state.getPlaidAccounts,
    })
  );

  const { getCurrentBitcoinPrice, price, balance, address } = useCryptoStore(
    (state) => ({
      getCurrentBitcoinPrice: state.getCurrentBitcoinPrice,
      price: state.BTCPrice,
      balance: state.BTCBalance,
      address: state.BTCAddress,
    })
  );

  const { open, ready } = usePlaidLink({
    token: link_token,
    onSuccess: (publicToken) => {
      getPlaidAccounts(publicToken);
    },
  });

  useEffect(() => {
    getCurrentBitcoinPrice();
    const intervalId = setInterval(() => {
      getCurrentBitcoinPrice();
    }, 60000); // Run every 60 seconds
    return () => clearInterval(intervalId);
  }, []);

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Card width="500px" minHeight="500px" margin="auto">
      <PurchaseModal showModal={showModal} setShowModal={setShowModal} />
      <Flex alignItems="center" justifyContent="space-between" padding="24px">
        <Button size="sm" cursor="pointer" onClick={logout} variant="ghost">
          Logout
        </Button>
        <Flex alignItems="center" flexDir={"col"}>
          <Image
            cursor="pointer"
            src={BTCLogo}
            alt="Logo"
            height="48px"
            mr={4}
            _hover={{ animation: "rotation 2s infinite linear" }}
          />

          <Flex alignItems="center" flexDir={"column"}>
            <Text fontSize="md" fontWeight="bold" color="green.500">
              {priceFormatter.format(price)}
            </Text>
          </Flex>
        </Flex>
        <Tooltip
          p={3}
          borderRadius={"4px"}
          label={
            !plaidAccounts?.length
              ? "Link bank account below to purchase crypto"
              : ""
          }
          placement="top"
          isDisabled={!!plaidAccounts?.length}
        >
          <span>
            <Button
              size="sm"
              colorScheme="green"
              cursor="pointer"
              isDisabled={!plaidAccounts?.length}
              onClick={() => setShowModal(true)}
            >
              Buy BTC
            </Button>
          </span>
        </Tooltip>
      </Flex>

      <Divider margin="24x 0" />
      <Text fontSize="xl" fontWeight="bold" mb="4" mt="4">
        {" "}
        BTC address information
      </Text>
      <Box borderWidth="1px" borderRadius="lg" m="4" mt={0} p="4">
        <Code pl={4} pr={4} mb={2}>
          {address}
        </Code>
        <Text fontSize="md" mb="2">
          Address Balance: {balance} BTC
        </Text>
      </Box>

      {!plaidAccounts?.length && (
        <Button
          onClick={open}
          disabled={!ready}
          size={"md"}
          width="300px"
          margin="auto"
          marginTop="24px"
          colorScheme="blue"
        >
          Link you bank account
        </Button>
      )}

      {!!plaidAccounts?.length && (
        <Box p="4">
          <Text fontSize="xl" fontWeight="bold" mb="4">
            Linked fiat accounts
          </Text>

          <VStack spacing="4" align="stretch">
            {plaidAccounts.map((account) => {
              const formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account.balances.iso_currency_code,
              });
              const formattedValue = formatter.format(
                account.balances.available
              );

              return (
                <Box
                  key={account.account_id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p="4"
                >
                  <Text fontSize="lg" fontWeight="bold" mb="2">
                    {account.name}
                  </Text>
                  <Text fontSize="md" mb="2">
                    Available Balance: {formattedValue}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Account ID: {account.account_id}
                  </Text>
                </Box>
              );
            })}
          </VStack>
        </Box>
      )}
      <Footer />
    </Card>
  );
}
