import styled from "styled-components"
import { color } from "styles/theme"
import { Hex2Rgba } from "utils/helpers"




export const start = styled.div`
max-width: 1255px;
margin: 0 auto;
padding: 0 20px;
height: 100%;
width: 100%;
position: relative;
z-index: 1;
display: flex;
justify-content: space-around;
flex-wrap: nowrap;
line-height: 29px;
position: relative;
    top: -107px;

    @media (max-width: 768px) {
        padding: 0 10px;
    }
`

export const left = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 150px;
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`
export const title = styled.button`
display: flex;
font-family: 'Gemstone';
color: #ff0d00;
    font-size: 60px;
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`

export const word = styled.p`
    
    font-size: 19px;
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`
export const powered = styled.h3`
display: flex;
font-size: 16px;
color: #ff0d00;
margin-top: -6px;
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`

export const right = styled.div`
    display: flex
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`

export const Image = styled.div`
    width:100%;

    img {
        width: 630px;
    height: 524px;
    border-radius: 16px;
    margin-top: 127px;
    left: 53px;
    position: relative;
    }
`
export const about =styled.div`
display: flex;
flex-wrap: nowrap;
flex-direction: column;
align-items: center;
`
export const enter =styled.button`
width: 100%;
    padding: 16px 0;
    border-radius: 8px;
    background-color: #F0E4CF;
    color: #0A0A0B;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    -webkit-transition: all .1s ease-in-out;
    transition: all .1s ease-in-out;
    outline: none;
    border: none;
    margin-top: 24px;
`
export const header =styled.div`
width: 73vw;
    position: relative;
    top: 42px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`
export const Image1 = styled.div`


    img {
        width: 55px
    }
`
export const Image2 = styled.button`
background: transparent;
    border: none;
    cursor: pointer;
}
    img {
        width: 70px
    }
`
export const Image3 = styled.button`
background: transparent;
border: none;
cursor: pointer;
}

    img {
        width: 70px
    }
`
export const info = styled.div`
    display:flex;
    gap: 10px;
    }
`

