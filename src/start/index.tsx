import React from 'react'
import * as C from "./style"
import { useCallback } from "react";
// import { useRouter } from "next/router";



const Start = () => {

  // const router = useRouter();
  const Enter = useCallback(() => {
    window.open("Home");
  }, []);


  const Discord = useCallback(() => {
    window.open("https://discord.com/invite/apeskullsociety");
  }, []);

  const Twitter = useCallback(() => {
    window.open("https://twitter.com/ApeSkullSociety");
  }, []);

  return (
    <C.about>
      {/* <C.header>
        <C.Image1>
        <img src="/images/logo.png" alt="logo" />
        </C.Image1>
        <C.info>
        <C.Image2 onClick={Discord}><img src="/images/discord.svg" alt="logo" /></C.Image2>
        <C.Image3 onClick={Twitter}><img src="/images/twitter.svg" alt="logo" /></C.Image3>
        </C.info>
      </C.header> */}
      {/* "collection_address": "sei1uuuum0p9nttfmdlu5lljwg8wxequpssuwgmq6vuw6fgl0su2x3aqw4degn" */}
    <C.start>
      <C.left>
        <C.title>Sei Penguins</C.title>
        <C.powered>Powered by PenguLabs</C.powered>
        <C.word>Welcome to SeiPenguins! SP is a limited supply NFT collection on the Sei blockchain, transcends traditional digital ownership. With 3000 distinct NFTs featuring charming penguin-themed assets, SeiPenguins merges creativity and scarcity and where innovation meets community prosperity. SP invites you to join the revolution on the Sei blockchain. With 3000 unique NFTs and a commitment to an engaging community experience, SeiPenguins represents more than just digital art; it's a dynamic ecosystem of shared
success</C.word>
      </C.left>
      <C.Image>
      <img src="/images/peq1.png" alt="peq1" />
     </C.Image>
    </C.start>
    </C.about>
  )
}

export default Start