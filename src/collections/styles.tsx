import styled from "styled-components";

export const Container = styled.div`
    max-width: 1400px;
    margin: auto;
    padding: 0 50px;
`;

export const Header = styled.div`
    text-align: center;
    padding: 20px 0;
`;

export const Card = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
`;

export const NftCard = styled.div`
    width: 400px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
    position: relative;

    &:hover {
        transform: scale(1.05);
    }
`;

export const NftImage = styled.img`
    width: 100%;
    height: 300px;
    display: block;
`;

export const NftContent = styled.div`
    background-color: #1a1a1a;
    padding: 15px;
    color: white;
`;

export const NftTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 5px;
`;

export const NftEndDate = styled.p`
    font-size: 0.875rem;
    color: #aaaaaa;
    margin-bottom: 15px;
`;

export const NftDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #333;
    padding-top: 10px;
`;

export const NftDetail = styled.div`
    text-align: center;
`;

export const NftLabel = styled.span`
    display: block;
    font-size: 0.75rem;
    color: #aaaaaa;
    margin-bottom: 5px;
`;

export const NftValue = styled.span`
    display: block;
    font-size: 1.25rem;
    color: white;

    &.minted {
        color: #e91e63;
    }
`;

export const NftStatus = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ffa726;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 0.875rem;
    display: block;
`;

// Responsive adjustments
// Adjustments for smaller screens, if necessary
// @media (max-width: 600px) {
//     export const Card = styled(Card)`
//         grid-template-columns: 1fr;
//     `;

//     export const NftDetails = styled(NftDetails)`
//         flex-direction: column;
//         align-items: flex-start;

//         ${NftDetail} {
//             margin-bottom: 10px;
//         }
//     `;
// }
