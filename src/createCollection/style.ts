import styled from 'styled-components';
//  import backgroundImage from './images/mint.gif'; Adjust the path as needed

export const Container = styled.div`
  color: white;
  margin: 20px auto;
  padding: 26px;
  background: rgba(28, 28, 28, 0.8);
  border-radius: 8px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #f00;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  img {
    height: 3rem;
  }
`;

export const WalletButton = styled.button`
  padding: 10px 20px;
  background-color: #f00;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
`;

export const StepsNav = styled.nav`
  display: flex;
  justify-content: space-between;
  background-color: #333;
  margin-bottom: 20px;
  border-radius: 4px;
`;

export const Step = styled.div`
  color: #aaa;
  padding: 10px 20px;

  &.active {
    color: white;
    border-bottom: 2px solid #f00;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
  width: 100%;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const NextButton = styled.button`
  padding: 15px 30px;
  background-color: #f00;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 20px;
  border-radius: 4px;
`;

// Global style for body to apply background
// export const GlobalStyle = createGlobalStyle`
//   body, html {
//     height: 100%;
//     margin: 0;
//     padding: 24px;
//     font-family: 'Arial', sans-serif;
//     background-image: url(${backgroundImage});
//     background-size: cover;
//     background-repeat: no-repeat;
//     background-position: center;
//     background-attachment: fixed;
//   }
// `;

