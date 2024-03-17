// Importing necessary dependencies
import React from "react";
import * as C from "./styles"
import styled from "styled-components";
import { Container } from "./styles";


// Sample data structure for NFTs
interface Nft {
    id: number;
    image: string;
    title: string;
    endDate: string;
    mintPrice: string;
    supply: string;
    mintedPercentage: string;
}

// Sample NFT data
const nftData: Nft[] = [
    {
        id: 1,
        image: './img/5.webp',
        title: 'Kyoshi Rangers',
        endDate: 'Ends February 12, 2024',
        mintPrice: '8 SEI',
        supply: '7560',
        mintedPercentage: '33%',
    },
    // Additional NFTs can be added here
];

const NftGallery: React.FC = () => {
    return (
        <C.Container>
            <C.Header>
                <h1>Utopia</h1>
                <p>You will never miss an NFT drop again</p>
            </C.Header>
            <C.Card>
                {nftData.map((nft) => (
                    <C.NftCard key={nft.id}>
                        <C.NftImage src={nft.image} alt={nft.title} />
                        <C.NftContent>
                            <C.NftTitle>{nft.title}</C.NftTitle>
                            <C.NftEndDate>{nft.endDate}</C.NftEndDate>
                            <C.NftDetails>
                                <C.NftDetail>
                                    <C.NftLabel>Mint Price</C.NftLabel>
                                    <C.NftValue>{nft.mintPrice}</C.NftValue>
                                </C.NftDetail>
                                <C.NftDetail>
                                    <C.NftLabel>Supply</C.NftLabel>
                                    <C.NftValue>{nft.supply}</C.NftValue>
                                </C.NftDetail>
                                <C.NftDetail>
                                    <C.NftLabel>Minted</C.NftLabel>
                                    <C.NftValue>{nft.mintedPercentage}</C.NftValue>
                                </C.NftDetail>
                            </C.NftDetails>
                            <C.NftStatus>Live</C.NftStatus>
                        </C.NftContent>
                    </C.NftCard>
                ))}
            </C.Card>
        </C.Container>
    );
};

export default NftGallery;
