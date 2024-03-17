import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Wallet, { DropdownItem } from "components/wallet";
import { useWalletConnect } from "hooks/walletConnect";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import BigNumber from 'bignumber.js';
import config from 'config.json'; // Make sure to correctly import your config
import * as C from "./style";




const NavBar = () => {
  const [balance, setBalance] = useState('');
  const { wallet, openWalletConnect, disconnectWallet } = useWalletConnect();

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet) {
        try {
          const client = await SigningCosmWasmClient.connect(config.rpc);
          const balanceResult = await client.getBalance(wallet.accounts[0].address, "usei");
          const formattedBalance = new BigNumber(balanceResult.amount).div(1e6).toString();
          setBalance(formattedBalance);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          // Handle error (e.g., set balance to "Error" or 0)
        }
      }
    };

    fetchBalance();
  }, [wallet]); // Depend on `wallet` to refetch balance when wallet changes

  return (
    <C.Header>
      <C.Logo src="/images/logo.png" alt="Logo" />
      {wallet === null ? (
        <C.WalletConnect onClick={openWalletConnect}>Connect Wallet</C.WalletConnect>
      ) : (
        <Wallet
          balance={balance + " SEI"}
          address={wallet.accounts[0].address}
        >
          <DropdownItem onClick={() => navigator.clipboard.writeText(wallet.accounts[0].address)}>Copy Address</DropdownItem>
          <DropdownItem onClick={() => { disconnectWallet(); openWalletConnect(); }}>Change Wallet</DropdownItem>
          <DropdownItem onClick={disconnectWallet}>Disconnect</DropdownItem>
        </Wallet>
      )}
    </C.Header>
  );
};

export default NavBar;
