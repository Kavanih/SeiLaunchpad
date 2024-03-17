import React from 'react';
import * as C from "./style";

const SEIPenguinsLaunch: React.FC = () => {
    return (
        <>
            <C.Header>
                <C.Logo>
                    <img src="./images/logo.png" alt="SEI Penguins Logo" />
                    <div>SEI PENGUINS</div>
                </C.Logo>
                <C.WalletButton>Connect Wallet</C.WalletButton>
            </C.Header>
            <C.Container>
                <C.StepsNav>
                    <C.Step className="active">1 Details</C.Step>
                    <C.Step>2 MintPhases</C.Step>
                    <C.Step>3 Upload</C.Step>
                    <C.Step>4 Deploy</C.Step>
                    <C.Step>5 Mint Info</C.Step>
                </C.StepsNav>
                <main>
                    <h1>Launch Collection</h1>
                    <form>
                        <C.FormGroup>
                            <label htmlFor="collection-name">Collection Name</label>
                            <input type="text" id="collection-name" defaultValue="SEI penguins" />
                        </C.FormGroup>
                        <C.FormGroup>
                            <label htmlFor="symbol">Symbol</label>
                            <input type="text" id="symbol" defaultValue="SEIMU" />
                        </C.FormGroup>
                        <C.FormGroup>
                            <label htmlFor="description">Collection Description</label>
                            <textarea id="description" placeholder="Say something about your project 😊"></textarea>
                        </C.FormGroup>
                        <C.FormSection>
                            <C.InputGroup>
                                <label htmlFor="supply">Supply</label>
                                <input type="text" id="supply" defaultValue="10,000" />
                            </C.InputGroup>
                            <C.InputGroup>
                                <label htmlFor="royalty-wallet">Royalty Wallet</label>
                                <input type="text" id="royalty-wallet" />
                            </C.InputGroup>
                            <C.InputGroup>
                                <label htmlFor="royalty-percent">Royalty Percent</label>
                                <input type="text" id="royalty-percent" defaultValue="5%" />
                            </C.InputGroup>
                            <C.InputGroup>
                                <label htmlFor="iterated-uri">Iterated URI</label>
                                <select id="iterated-uri">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </C.InputGroup>
                            <C.InputGroup>
                                <label htmlFor="frozen">Frozen</label>
                                <select id="frozen">
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </C.InputGroup>
                            <C.InputGroup>
                                <label htmlFor="hidden-metadata">Hidden Metadata</label>
                                <select id="hidden-metadata">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </C.InputGroup>
                        </C.FormSection>
                        <C.NextButton>Next</C.NextButton>
                    </form>
                </main>
            </C.Container>
        </>
    );
};

export default SEIPenguinsLaunch;
