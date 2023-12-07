import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuthStore } from "../state/authentication";
import { Footer } from "./Footer";

export function Home() {
  const createNewAccount = useAuthStore((state) => state.createNewAccount);
  const authenticate = useAuthStore((state) => state.authenticate);

  const [walletName, setWalletName] = useState("");
  const [walletNameError, setWalletNameError] = useState("");

  function handleWalletNameChange(event) {
    setWalletName(event.target.value);
    setWalletNameError("");
  }

  function handleCreateNewAccount(e) {
    e.preventDefault();
    if (!walletName) {
      setWalletNameError("Please enter a wallet name");
      return;
    }
    createNewAccount({ walletName });
  }

  return (
    <Card width="500px" height="500px" margin="auto">
      <Text mt={8} fontSize="3xl" fontWeight="bold" mb={4}>
        Sign in or sign up
      </Text>

      <Text
        width="350px"
        margin="auto"
        mt={0}
        mb={2}
        fontSize="sm"
        fontFamily="mono"
      >
        A demo app using passkeys, plaid, and the bitcoin regtest to buy bitcoin
        🚀
      </Text>
      <Box>
        <form onSubmit={handleCreateNewAccount}>
          <FormControl
            isInvalid={!!walletNameError}
            width="350px"
            margin="auto"
            marginTop={8}
          >
            <InputGroup>
              <Input
                type="text"
                name="walletName"
                value={walletName}
                onChange={handleWalletNameChange}
                placeholder="Enter your wallet name"
              />
              <InputRightAddon
                width="80px"
                padding={0}
                ml={walletNameError ? "1px" : 0}
              >
                <Button
                  type="submit"
                  cursor="pointer"
                  onClick={handleCreateNewAccount}
                  minWidth="80px"
                >
                  <Text fontSize="xs">Sign up</Text>
                </Button>
              </InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{walletNameError}</FormErrorMessage>
          </FormControl>
        </form>
        <Flex width="350px" margin="auto" mt={6} mb={6} alignItems={"center"}>
          <Divider mr="12px" />
          <Text fontSize="sm" opacity={0.4}>
            or
          </Text>
          <Divider ml="12px" />
        </Flex>

        <Button
          width="350px"
          onClick={authenticate}
          padding="0"
          cursor="pointer"
        >
          Sign in with a passkey
        </Button>
      </Box>
      <Footer />
    </Card>
  );
}
