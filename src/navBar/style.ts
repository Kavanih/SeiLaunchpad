// Styled components
import styled from "styled-components"
import { color } from "styles/theme"
import { Hex2Rgba } from "utils/helpers"

export const Header = styled.div`
padding: 10px 50px;
position: relative;
top: 29px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    background-color: #333; /* This line sets the background color to green */

    @media (max-width: 768px) {
        flex-direction: row;
        padding-top:24px;
        &>*:nth-child(2){
            margin:8px 0;
        }
    }
`

export const Logo = styled.img`
    width:67px;
`


export const WalletConnect = styled.button`
    background-color:${color.primary};
    color:${color.black};
    padding:0px 24px;
    height:43px;
    display:flex;
    align-items:center;
    border-radius:8px;
    font-size:14px;
    font-weight:500;
    cursor:pointer;
    transition:all .1s ease-in-out;
    &:hover{
        background-color:${Hex2Rgba(color.primary, .8)};
    }
    outline:none;
    border:none;
    &:active{
        outline:none;
        border:none;
        background-color:${Hex2Rgba(color.primary, .5)};
    }
`

export const WalletConnected = styled.div`
    background-color:${color.primary};
    padding:8px 16px;
    border-radius:8px;
    font-size:14px;
    display:flex;
    align-items:center;
`

export const WBalance = styled.div`
    padding:8px 16px;
    background-color:${color.secondaryLight};
    border-radius:8px;
    margin-right:16px;
`

export const WAddress = styled.div`
    color:${color.black};
`