import { useCallback, useState, useEffect, useRef } from "react"
import * as C from "./style"
import { useWalletConnect } from "hooks/walletConnect"
import config from "config.json"
import { Bg } from "styles/bg"
import Wallet, { DropdownItem } from "components/wallet"
// import cors from "cors";

// iNTx 
import { getSigningCosmWasmClient } from "@sei-js/core"
import { useCosmWasmClient, useSigningCosmWasmClient, useWallet, WalletConnectButton } from '@sei-js/react';


import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { GasPrice } from "@cosmjs/stargate";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faCircleNotch, faGlobe } from "@fortawesome/free-solid-svg-icons"
import BigNumber from "bignumber.js"
import { Timer } from "components/timer"

import { keccak_256 } from '@noble/hashes/sha3'
import { MerkleTree } from 'merkletreejs';
import { toast } from "react-hot-toast"
import MintedModal from "components/mintedModal"
import axios from "axios"



var phaseTimer: any = {}
var interval: any = null
var phaseSwitch = false

const CONTRACT_ADDRESS = 'sei1lymek0rmgmgx4f4agmh6y5exrwr4zhtwczdruqc5cew5sagf0mwq5a2e79';

const Home = () => {

    const { openWalletConnect, wallet, disconnectWallet } = useWalletConnect()

    const [loading, setLoading] = useState(true)
    const [collection, setCollection] = useState<any>(null)
    const [phases, setPhases] = useState<any[]>([])
    const [currentPhase, setCurrentPhase] = useState<any>(null)
    const [walletWhitelisted, setWalletWhitelisted] = useState(true)
    const [myMintedNfts, setMyMintedNfts] = useState<any[]>([])
    const [myMintedNftsData, setMyMintedNftsData] = useState<any[]>([])

    const [amount, setAmount] = useState(1)
    const amountInput = useRef<any>(null)

    const [showMintedModal, setShowMintedModal] = useState(false)
    const [mintedInfo, setMintedInfo] = useState<any>({})
    const [showMintedNfts, setShowMintedNfts] = useState(false)
    const [balance, setBalance] = useState('')

    useEffect(() => {

        refresh()
        clearInterval(interval)

        interval = setInterval(() => {
            refresh()
        }, 60000)

        return () => {
            clearInterval(interval)
        }

    })

    useEffect(() => {

    }, [])

    const refresh = async () => {
        const client = await SigningCosmWasmClient.connect(config.rpc)
        client.queryContractSmart(CONTRACT_ADDRESS, { get_collection: { collection: config.collection_address } }).then((result) => {
            console.log(result)
            let collectionData: any = {
                supply: result.supply,
                mintedSupply: result.next_token_id,
                phases: result.mint_groups.map((group: { name: any; merkle_root: any; max_tokens: any; unit_price: any; start_time: any; end_time: any }) => ({
                    name: group.name,
                    merkleRoot: group.merkle_root,
                    maxTokens: group.max_tokens,
                    unitPrice: group.unit_price,
                    startTime: group.start_time,
                    endTime: group.end_time,
                })),
                tokenUri: result.token_uri,
                name: result.name,
            }

            for (let i = 0; i < config.groups.length; i++) {
                for (let j = 0; j < result.mint_groups.length; j++) {
                    let group = result.mint_groups[j]
                    let groupConfig: any = config.groups[i]
                    if (groupConfig.name.toLowerCase().trim() === group.name.toLowerCase().trim()) {
                        collectionData.phases.push({
                            ...group,
                            allowlist: groupConfig.allowlist,
                        })
                    }
                }
            }
            
            console.log(collectionData);
            

            setCollection(collectionData)
            // here too
            managePhases(collectionData.phases)
            setLoading(false)
            refreshMyMintedNfts()
            client.disconnect()
        })
    }

    const refreshMyMintedNfts = async () => {
        if (wallet === null) {
            setMyMintedNfts([])
            return
        }
        const client = await SigningCosmWasmClient.connect(config.rpc)

        let balance = await client.getBalance(wallet!.accounts[0].address, "usei")
        setBalance(new BigNumber(balance.amount).div(1e6).toString())

        client.queryContractSmart(CONTRACT_ADDRESS, { balance_of: { address: wallet!.accounts[0].address, collection: config.collection_address } }).then((result) => {
            setMyMintedNfts(result.mints)

            client.disconnect()
        })
    }
    
    const managePhases = (phases: any[]) => {

        let currentPhase = null

        for (let i = 0; i < phases.length; i++) {
            let phase = phases[i]
            
            phase.startTime *= 1
            phase.endTime = phase.endTime === 0 ? 0 : phase.endTime * 1000

            let start = new Date(phase.startTime)
            let end = new Date(phase.endTime)
            let now = new Date()

            if (phase.endTime === 0)
                end = new Date(32503680000000)

            if (end.getTime() - start.getTime() > 31536000000)
                phases[i].noend = true
            else
                phases[i].noend = false

            if (now > start && now < end)
                currentPhase = phase
        }

        if (currentPhase === null) {
            let closest = null
            for (let i = 0; i < phases.length; i++) {
                let phase = phases[i]
                let start = new Date(phase.startTime)

                if (closest === null)
                    closest = phase
                else {
                    let closestStart = new Date(closest.startTime)
                    if (start < closestStart) closest = phase
                }
            }

            currentPhase = closest
        }

        //order phases by start date
        phases.sort((a: any, b: any) => {
            let aStart = new Date(a.startTime)
            let bStart = new Date(b.startTime)

            if (aStart < bStart) {
                return -1
            } else if (aStart > bStart) {
                return 1
            } else {
                return 0
            }
        })



        // im getting error
        //  if (phaseTimer.name !== currentPhase.name) {
        if (phaseTimer && currentPhase && phaseTimer.name !== currentPhase.name){
            if (phaseTimer.timeout) clearTimeout(phaseTimer.timeout)

            const now = new Date()
            const start = new Date(currentPhase.startTime)
            const end = new Date(currentPhase.endTime)

            console.log(start, end);
            

            phaseTimer.name = currentPhase.name

            if (now > start && now < end) {
                if (end.getTime() - now.getTime() < 31536000000) {
                    phaseTimer.timeout = setTimeout(() => {
                        refresh()
                        phaseTimer.timeout = null
                        phaseTimer.name = null
                    }, new Date(currentPhase.endTime).getTime() - new Date().getTime())
                } else {
                    currentPhase.noend = true
                }
            } else if (now < start) {
                phaseTimer.timeout = setTimeout(() => {
                    managePhases(phases)
                    refresh()
                    phaseTimer.timeout = null
                    phaseTimer.name = null
                }, new Date(currentPhase.startTime).getTime() - new Date().getTime())
            } else if (now > end) {
                // Identify the next phase based on the current phase's end time
                const nextPhaseIndex = phases.findIndex(p => new Date(p.startTime) > end);
                if (nextPhaseIndex !== -1) {
                    // There is a next phase. Transition to this phase.
                    const nextPhase = phases[nextPhaseIndex];
                    managePhases([nextPhase]); // Or any other logic to initiate the next phase
                    console.log(`Transitioning to next phase: ${nextPhase.name}`);
                } else {
                    // No more phases. Handle the end of all phases.
                    console.log("All phases have concluded.");
                    // Implement logic for when all phases are finished, such as resetting the system, notifying users, etc.
                    // handleEndOfAllPhases(); This is a placeholder for whatever logic you need to implement.
                }
            }
            
        }

        setPhases(phases)
        if (!phaseSwitch) {
            manageWhitelist(currentPhase)
            setCurrentPhase(currentPhase)
        }
        console.log(`this is ${currentPhase.unitPrice}`);

        
    }

    const manageWhitelist = (currentPhase: any) => {
        if (wallet !== null) {
            if (typeof currentPhase.allowlist !== 'undefined' && currentPhase.allowlist !== null) {
                let allowlist = currentPhase.allowlist.find((a: any) => a === wallet!.accounts[0].address)
                if (allowlist) {
                    setWalletWhitelisted(true)
                } else {
                    setWalletWhitelisted(false)
                }
            } else {
                setWalletWhitelisted(true)
            }
        } else {
            setWalletWhitelisted(true)
        }
    }

    const switchPhase = (phase: any) => {
        if (!phase.noend && (new Date(phase.endTime) < new Date() || phase.name === currentPhase.name))
            return;

        setCurrentPhase(phase)
        manageWhitelist(phase)
        phaseSwitch = true
    }

    const incrementAmount = () => {
        amountInput.current.value = amount + 1
        setAmount(amount + 1)
    }

    const decrementAmount = () => {
        if (amount > 1) {
            amountInput.current.value = amount - 1
            setAmount(amount - 1)
        }
    }

    const onAmountChange = () => {
        let value = amountInput.current.value
        if (value === '') value = 1
        try {
            setAmount(parseInt(value))
        } catch (e) { }
    }

    const mint = async () => {
        if (wallet === null) return openWalletConnect()

        //check if amount is larger than max tokens
        if (currentPhase.max_tokens > 0 && amount > currentPhase.max_tokens) {
            toast.error("You can only mint " + currentPhase.max_tokens + " tokens per wallet")
            return
        }

        if (currentPhase.max_tokens > 0 && myMintedNfts.length + amount > currentPhase.max_tokens) {
            toast.error("You can only mint " + currentPhase.max_tokens + " tokens per wallet")
            return
        }

        //check if amount is larger than remaining tokens
        if (amount > collection.supply - collection.mintedSupply) {
            toast.error("There are only " + (collection.supply - collection.mintedSupply) + " tokens left")
            return
        }

        //check if current phase is active
        if (new Date(currentPhase.startTime) > new Date()) {
            toast.error("This phase has not started yet")
            return
        }

        //check if current phase has ended
        if (!currentPhase.noend && new Date(currentPhase.endTime) < new Date()) {
            toast.error("This phase has ended")
            return
        }

        //load client
        const client = await getSigningCosmWasmClient(config.rpc, wallet.offlineSigner, {
            gasPrice: GasPrice.fromString("0.01usei")
        })

        let lighthouseConfig = await client.queryContractSmart(CONTRACT_ADDRESS, { get_config: {} })

        //check if wallet have enough balance
        if (currentPhase.unitPrice > 0 && new BigNumber(currentPhase.unitPrice).div(1e6).plus((new BigNumber(lighthouseConfig.fee).div(1e6))).times(amount).gt(new BigNumber(balance))) {
            toast.error("Insufficient balance")
            return
        }

        let merkleProof: any = null
        let hashedAddress: any = null

        if (currentPhase.merkle_root !== '' && currentPhase.merkle_root !== null) {
            let hashedWallets = currentPhase.allowlist.map(keccak_256)
            const tree = new MerkleTree(hashedWallets, keccak_256, { sortPairs: true })
            merkleProof = tree.getProof(Buffer.from(keccak_256(wallet!.accounts[0].address))).map(element => Array.from(element.data))
            hashedAddress = Array.from(Buffer.from(keccak_256(wallet!.accounts[0].address)))
        }

        const instruction: any = {
            contractAddress: CONTRACT_ADDRESS,
            msg: {
                mint_native: {
                    collection: config.collection_address,
                    group: currentPhase.name,
                    recipient: wallet!.accounts[0].address,
                    merkle_proof: merkleProof,
                    hashed_address: hashedAddress
                }
            },
            funds: [{
                denom: 'usei',
                amount: new BigNumber(currentPhase.unitPrice).plus(new BigNumber(lighthouseConfig.fee)).toString()
            }]
        }

        let instructions = []

        for (let i = 0; i < amount; i++) {
            instructions.push(instruction)
        }

        let loading = toast.loading("Allocating Ticket...")
        try {

            const mintReceipt = await client.executeMultiple(wallet!.accounts[0].address, instructions, "auto")
            toast.dismiss(loading)
            toast.success("Ticket Purchased")

            //console.log(mintReceipt)

            let tokenIds: any[] = [];

            const logs = mintReceipt.logs
            for (const log of logs) {
                const events = log.events
                for (const event of events) {
                    if (event.type === 'wasm') {
                        // Find the attribute with the key 'collection'
                        for (const attribute of event.attributes) {
                            if (attribute.key === 'token_id') {
                                tokenIds.push(attribute.value)
                                break
                            }
                        }
                    }
                }
            }

            refresh()
            refreshMyMintedNfts()

            loadNowMintedMetadata(tokenIds).then((metadata: any) => {
                setMintedInfo({ mints: metadata })
                setShowMintedModal(true)
            }).catch((e) => {
                setMintedInfo({ mints: tokenIds })
                setShowMintedModal(true)
                console.log(e)
            })
        } catch (e: any) {
            toast.dismiss(loading)
            if (e.message !== "Transaction declined")
                toast.error("Purchase failed")
            console.log(e)
        }
    }

    const loadNowMintedMetadata = async (mints: any) => new Promise((resolve, reject) => {
        let metadata: any[] = []
        let promises: any[] = []

        for (let i = 0; i < mints.length; i++) {
            promises.push(axios.get(`${collection.tokenUri}/${mints[i]}`).then((response) => response.data))
        }

        Promise.all(promises).then((results) => {
            //merge with myMintedNfts
            mints.forEach((mint: any, index: number) => {
                metadata.push({
                    mint: mint,
                    data: results[index]
                })
            })

            resolve(metadata)
        }).catch((e) => {
            reject(e)
        })
    })

    const loadMinted = async () => {
        setLoading(true)
        setShowMintedNfts(true)
        setMyMintedNftsData([])

        let metadata: any[] = []
        let promises: any[] = []

        for (let i = 0; i < myMintedNfts.length; i++) {
            promises.push(axios.get(`${collection.tokenUri}/${myMintedNfts[i]}`).then((response) => response.data))
        }

        Promise.all(promises).then((results) => {
            //merge with myMintedNfts
            myMintedNfts.forEach((mint: any, index: number) => {
                metadata.push({
                    mint: mint,
                    data: results[index]
                })
            })

            setMyMintedNftsData(metadata)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <C.Home>

            <C.Container>
                
                    {/* <C.Header>
                        <C.Logo src="/images/logo.png" />
                        {wallet === null && (
                            <C.WalletConnect onClick={openWalletConnect}>Connect Wallet</C.WalletConnect>
                        )}
                        {wallet !== null && (
                            <Wallet
                                balance={balance + " SEI"}
                                address={wallet!.accounts[0].address}
                            >
                                <DropdownItem onClick={() => navigator.clipboard.writeText(wallet!.accounts[0].address)}>Copy Address</DropdownItem>
                                <DropdownItem onClick={() => { disconnectWallet(); openWalletConnect() }}>Change Wallet</DropdownItem>
                                <DropdownItem onClick={disconnectWallet}>Disconnect</DropdownItem>
                            </Wallet>
                        )}
                    </C.Header> */}
                {/* <C.banner>
                <img src="/images/bg.jpg" alt="bg" />
                </C.banner> */}
                {/* <Start/> */}
                <C.Launch showMintedNfts={showMintedNfts ? "true" : "false"}>

                    {loading && (
                        <C.Loading><FontAwesomeIcon icon={faCircleNotch} spin /></C.Loading>
                    )}

                    {!loading && (
                        <>
                            <C.LaunchBg></C.LaunchBg>
                            {!showMintedNfts && (
                                <>
                                    <C.LaunchInfo>
                                        <C.Title>{config.name}</C.Title>
                                        

                                        <C.Description>{config.description}</C.Description>

                                        {(config.website || config.twitter || config.discord) && (
                                            <C.Links>
                                                {config.website &&
                                                    <C.Link href={config.website} target="_blank" rel="noreferrer">
                                                        <FontAwesomeIcon icon={faGlobe} />
                                                    </C.Link>
                                                }
                                                {config.twitter &&
                                                    <C.Link href={config.twitter} target="_blank" rel="noreferrer">
                                                        <FontAwesomeIcon icon={faTwitter} />
                                                    </C.Link>
                                                }
                                                {config.discord &&
                                                    <C.Link href={config.discord} target="_blank" rel="noreferrer">
                                                        <FontAwesomeIcon icon={faDiscord} />
                                                    </C.Link>
                                                }
                                            </C.Links>
                                        )}
                                          <C.about>
                                          Welcome to SeiPenguins! SP is a limited supply NFT collection on the Sei blockchain, transcends traditional digital ownership. With 3000 distinct NFTs featuring charming penguin-themed assets, SeiPenguins merges creativity and scarcity and where innovation meets community prosperity. SP invites you to join the revolution on the Sei blockchain. With 3000 unique NFTs and a commitment to an engaging community experience, SeiPenguins represents more than just digital art; it's a dynamic ecosystem of shared
                                           success.
                                          </C.about>
                                        <C.Phases>
                                            {phases.map((phase, index) => (
                                                <C.Phase key={index} active={currentPhase.name === phase.name ? "true" : "false"} switch={!(!phase.noend && new Date(phase.endTime) < new Date()) ? "true" : "false"} onClick={() => switchPhase(phase)}>
                                                    <C.PhaseTop>
                                                        <C.PhaseTitle>{phase.name}</C.PhaseTitle>
                                                        {!phase.noend && (
                                                            <>
                                                                {new Date(phase.startTime) < new Date() && new Date(phase.endTime) > new Date() && (
                                                                    <C.PhaseDate>
                                                                        <span>Ends In</span> <Timer date={phase.endTime} />
                                                                    </C.PhaseDate>
                                                                )}
                                                            </>
                                                        )}
                                                        {new Date(phase.startTime) > new Date() && (
                                                            <C.PhaseDate>
                                                                <span>Starts In</span> <Timer date={phase.startTime} />
                                                            </C.PhaseDate>
                                                        )}
                                                    </C.PhaseTop>
                                                    <C.PhaseBottom>
                                                        {phase.max_tokens > 0 ? phase.max_tokens + ' Per Wallet •' : ''} {new BigNumber(phase.unitPrice).div(1e6).toString()} SEI
                                                    </C.PhaseBottom>
                                                    {(!phase.noend && new Date(phase.endTime) < new Date()) && (
                                                        <C.PhaseBadge>
                                                            Ended
                                                        </C.PhaseBadge>
                                                    )}
                                                </C.Phase>
                                            ))}
                                        </C.Phases>
                                    </C.LaunchInfo>
                                    <C.Mid></C.Mid>
                                    <C.LaunchMint>
                                        <C.TitleMobile>
                                            {config.name}
                                        </C.TitleMobile>
                                        <C.Image>
                                            <img src="/images/raffle.gif" alt="raffle" />
                                        </C.Image>
                                        <C.MintInfo>
                                            <C.Price>
                                                Price: <span>{new BigNumber(currentPhase.unitPrice).div(1e6).times(amount).toString()} SEI</span>
                                            </C.Price>
                                            <C.Amount>
                                                <C.AmountButton onClick={decrementAmount}>
                                                    &minus;
                                                </C.AmountButton>
                                                <C.AmountValue ref={amountInput} type="number" step="1" min={1} defaultValue={1} onChange={onAmountChange} />
                                                <C.AmountButton onClick={incrementAmount}>
                                                    &#43;
                                                </C.AmountButton>
                                            </C.Amount>
                                        </C.MintInfo>
                                        <C.MintButton onClick={mint} disabled={walletWhitelisted === false || collection.supply - collection.mintedSupply <= 0}>
                                            {collection.supply - collection.mintedSupply <= 0 ? (
                                                <>Raffle closed !</>
                                            ) : (
                                                <>{walletWhitelisted === true ? 'Buy Ticket' : 'Not Whitelisted'}</>
                                            )}
                                        </C.MintButton>
                                        {/* <C.MintButton> mint
                                        </C.MintButton> */}
                                        <C.TotalMinted>
                                            <C.TotalMintedInfo>
                                                <C.TotalMintedTitle>TOTAL TICKET SOLD</C.TotalMintedTitle>
                                                <C.TotalMintedValue>{Math.floor((collection.mintedSupply / 3000 * 100) * 100) / 100}% <span>{collection.mintedSupply}/{collection.supply}</span></C.TotalMintedValue>
                                            </C.TotalMintedInfo>
                                            <C.TotalMintedProgress value={Math.floor((collection.mintedSupply / 3000 * 100) * 100) / 100}></C.TotalMintedProgress>
                                        </C.TotalMinted>
                                        {myMintedNfts.length > 0 && (
                                            <C.MintedBalance onClick={() => loadMinted()}>
                                                You have purchased <span>{myMintedNfts.length}</span> {myMintedNfts.length === 1 ? 'NFT' : 'NFTs'} ticket
                                            </C.MintedBalance>
                                        )}
                                    </C.LaunchMint>
                                </>
                            )}

                            {showMintedNfts && (
                                <C.MintedNfts>
                                    <C.MintedNftsHeader>
                                        <C.GoBack onClick={() => setShowMintedNfts(false)}>Back</C.GoBack>
                                    </C.MintedNftsHeader>
                                    <C.MintedNftsBody>
                                        {myMintedNftsData.map((mint: any, i: any) => (
                                            <C.Nft key={i}>
                                                <C.NftImage src={`${mint.data.image}`}></C.NftImage>
                                                <C.NftTitle>{config.nft_name_type === "token_id" ? config.name + " #" + mint.mint : mint.data.name}</C.NftTitle>
                                            </C.Nft>
                                        ))}
                                    </C.MintedNftsBody>
                                </C.MintedNfts>
                            )}
                        </>
                    )}
                </C.Launch>
            </C.Container>

            {showMintedModal && (
                <MintedModal close={() => setShowMintedModal(false)} name={collection.name} mints={mintedInfo.mints} tokenUri={collection.tokenUri} />
            )}
        </C.Home>
    )

}

export default Home