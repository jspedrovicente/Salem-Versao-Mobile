import { database } from "../../firebaseConnection";
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import Form from "../../components/Forms";
import { Store } from 'react-notifications-component';
import Popup from 'reactjs-popup';
import scrollSVG from "../../assets/svgs/scroll-svg.svg"
import cardSVG from "../../assets/svgs/card-svg.svg"
import loadingEffect from "../../assets/svgs/loading-effect.svg"
import eyeSVG from "../../assets/svgs/eye-svg.svg"
import eyeCloseSVG from "../../assets/svgs/eye-closed-svg.svg"
import questionSVG from "../../assets/svgs/question-svg.svg"
import ghostSVG from "../../assets/svgs/ghost-svg.svg"
import lifeDeadSVG from "../../assets/svgs/life-death-svg.svg"
import xSVG from "../../assets/svgs/x-svg.svg"
import ButtonMobile from "../../components/ButtonMobile";
import './style.css';


const PlayerMobile = () => {
    const [playerList, setPlayerList] = useState([]);
    const [user, setUser] = useState([])
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [gameState, setGameState] = useState('inicio');
    const [name, setName] = useState('');
    const [registeredPlayerId, setRegisteredPlayerId] = useState('')
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [cultRole, setCultRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [playerCurrentRole, setPlayerCurrentRole] = useState([]);
    const [playerCurrentInformation, setPlayerCurrentInformation] = useState([]);
    const [currentDay, setCurrentDay] = useState(0);
    const [willText, setWillText] = useState('');
    const [fauxTextBox, setFauxTextBox] = useState('');
    const [copiedText, setCopiedText] = useState('Eu sou jogador beta de salem');
    const [target1, setTarget1] = useState('');
    const [target2, setTarget2] = useState('');
    const [weaponChoice, setWeaponChoice] = useState('');
    const [mensagemDeMorto, setMensagemDeMorto] = useState('');
    const [mensagemdoMal, setMensagemdoMal] = useState('');
    const [allMessages, setAllMessages] = useState([])
    const [hiddenPrivateInfo, setHiddenPrivateInfo] = useState(false);
    const [allEvilChat, setHiddenEvilChat] = useState([]);
    const [noActionsNight1, setNoActionsNight1] = useState(['assassino em serie', 'mestre', 'vigilante', 'lobisomen', 'palhaco', 'pistoleiro', 'zelador', 'caloteira', 'veterano'])
    const [everythingSetUp, setEverythingSetUp] = useState(false);
    const [willOpen, setWillOpen] = useState(false);
    const [playerListingOpen, setPlayerListingOpen] = useState(false);
    const [cardOpen, setCardOpen] = useState(false);
    const [questionOpen, setQuestionOpen] = useState(false);
    const [eraseModalOpen, setEraseModalOpen] = useState(false);

    useEffect(() => {
        const loadPlayers = () => {
            const x = onSnapshot(collection(database, `playeradmin/players/jspedrogarcia@gmail.com`), (snapshot) => {
                let list = [];
                let playerInfo = [];
                snapshot.forEach((doc) => {
                    if (doc.data().activePlayer === true) {
                        list.push({
                            id: doc.id,
                            key: doc.id,
                            playerName: doc.data().playerName,
                            victoryPoints: doc.data().victoryPoints,
                            role: doc.data().role,
                            filliation: doc.data().filliation,
                            image: doc.data().image,
                            action: doc.data().action,
                            newResponse: doc.data().newResponse,
                            wakeOrder: doc.data().wakeOrder,
                            buff: doc.data().buff,
                            debuff: doc.data().debuff,
                            clownBomb: doc.data().clownBomb,
                            pistoleiroMark: doc.data().pistoleiroMark,
                            doused: doc.data().doused,
                            executorTarget: doc.data().executorTarget,
                            life: doc.data().life,
                            actionforRoleCounter: doc.data().actionforRoleCounter,
                            cultChoice: doc.data().cultChoice,
                            activePlayer: doc.data().activePlayer
                        })
                    }
                        if (doc.id === registeredPlayerId) {
                            playerInfo.push({
                                id: doc.id,
                                key: doc.id,
                                playerName: doc.data().playerName,
                                victoryPoints: doc.data().victoryPoints,
                                role: doc.data().role,
                                filliation: doc.data().filliation,
                                image: doc.data().image,
                                action: doc.data().action,
                                newResponse: doc.data().newResponse,
                                wakeOrder: doc.data().wakeOrder,
                                buff: doc.data().buff,
                                debuff: doc.data().debuff,
                                clownBomb: doc.data().clownBomb,
                                pistoleiroMark: doc.data().pistoleiroMark,
                                doused: doc.data().doused,
                                executorTarget: doc.data().executorTarget,
                                life: doc.data().life,
                                actionforRoleCounter: doc.data().actionforRoleCounter,
                                cultChoice: doc.data().cultChoice,
                                activePlayer: doc.data().activePlayer
                            })
                            if (playerInfo[0].role !== 'none') {
                                const chosenRole = allRoles.filter((role) => role.role === playerInfo[0].role)
                                setPlayerCurrentRole(chosenRole);
                                console.log(chosenRole)
                            }
                            console.log(playerInfo);
                            setPlayerCurrentInformation(playerInfo);
                        
                        }
                    
                })
                setPlayers(list);
                setAlivePlayers(list.filter(player => player.life.includes("alive")))
                setDeadPlayers(list.filter(player => player.life.includes("dead")))
            })
        }

        const a = onSnapshot(collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/gameState/gameState`), (snapshot) => {
            let gameState = 'inicio';
            snapshot.forEach((doc) => {
                gameState = (doc.data().gameState)
            })
            setGameState(gameState);
        })
        loadPlayers();

        setEverythingSetUp(true);
    }, [registeredPlayerId, allRoles]);
    useEffect(() => {
        
        const townSnapshot = onSnapshot(collection(database, "gamedata/roles/town"), (snapshot) => {
            let roles = [];
            snapshot.forEach((doc) => {
                roles.push({
                    filliation: "town",
                    role: doc.data().role,
                    skill: doc.data().skill,
                    special: doc.data().special,
                    wakeOrder: doc.data().wakeOrder,
                    actionforRoleCounter: doc.data()?.actionforRoleCounter,
                    enabledRole: doc.data().enabledRole,
                    multiple: doc.data().multiple,
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger,
                })
            })
            setTownRole(roles)

        })
        const mafiaSnapshot = onSnapshot(collection(database, "gamedata/roles/the family"), (snapshot) => {
            let roles = [];
            snapshot.forEach((doc) => {
                roles.push({
                    filliation: "the family",
                    role: doc.data().role,
                    skill: doc.data().skill,
                    special: doc.data().special,
                    wakeOrder: doc.data().wakeOrder,
                    actionforRoleCounter: doc.data()?.actionforRoleCounter,
                    enabledRole: doc.data().enabledRole,
                    multiple: doc.data().multiple,
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger,
                })
            })
            setMafiaRole(roles);
        })
        const covenSnapshot = onSnapshot(collection(database, "gamedata/roles/coven"), (snapshot) => {
            let roles = [];
            snapshot.forEach((doc) => {
                roles.push({
                    filliation: "coven",
                    role: doc.data().role,
                    skill: doc.data().skill,
                    special: doc.data().special,
                    wakeOrder: doc.data().wakeOrder,
                    actionforRoleCounter: doc.data()?.actionforRoleCounter,
                    enabledRole: doc.data().enabledRole,
                    multiple: doc.data().multiple,
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger,
                })
            })
            setCovenRole(roles);
            
        })
        const horsemenSnapshot = onSnapshot(collection(database, "gamedata/roles/horsemen"), (snapshot) => {
            let roles = [];
            snapshot.forEach((doc) => {
                roles.push({
                    filliation: "horsemen",
                    role: doc.data().role,
                    skill: doc.data().skill,
                    special: doc.data().special,
                    wakeOrder: doc.data().wakeOrder,
                    actionforRoleCounter: doc.data()?.actionforRoleCounter,
                    enabledRole: doc.data().enabledRole,
                    multiple: doc.data().multiple,
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger,

                })
            })
            setHorsemenRole(roles);
            
        })
        const cultSnapshot = onSnapshot(collection(database, "gamedata/roles/cult"), (snapshot) => {
            let roles = [];
            snapshot.forEach((doc) => {
                roles.push({
                    filliation: "cult",
                    role: doc.data().role,
                    skill: doc.data().skill,
                    special: doc.data().special,
                    wakeOrder: doc.data().wakeOrder,
                    actionforRoleCounter: doc.data()?.actionforRoleCounter,
                    enabledRole: doc.data().enabledRole,
                    multiple: doc.data().multiple,
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger,

                })
            })
            setCultRole(roles);
            
        })
        const neutralSnapshot = onSnapshot(collection(database, "gamedata/roles/neutral"), (snapshot) => {
            let roles = [];
            snapshot.forEach((doc) => {
                roles.push({
                    filliation: "neutral",
                    role: doc.data().role,
                    skill: doc.data().skill,
                    special: doc.data().special,
                    wakeOrder: doc.data().wakeOrder,
                    actionforRoleCounter: doc.data()?.actionforRoleCounter,
                    enabledRole: doc.data().enabledRole,
                    multiple: doc.data().multiple,
                    image: doc.data().image,
                    wakeTrigger: doc.data().WakeTrigger,

                })
            })
            setNeutralRole(roles);
            
        })
    }, [])
    useEffect(() => {

        function addAllRoles(townRole, mafiaRole, covenRole, horsemenRole, neutralRole, cultRole) {
            setAllRoles([...townRole, ...mafiaRole, ...covenRole, ...horsemenRole, ...neutralRole, ...cultRole])
           
        }
        addAllRoles(covenRole, mafiaRole, townRole, horsemenRole, neutralRole, cultRole);

    }, [covenRole, mafiaRole, townRole, horsemenRole, neutralRole, cultRole])
    useEffect(() => {
        if (everythingSetUp) {
            
            let playerId = localStorage.getItem("playerID");
            console.log(playerId)
            if (playerId != null) {
                    setRegisteredPlayerId(playerId);
            } else {
                setRegisteredPlayerId('');
            }
        }
    }, [everythingSetUp])
    // Load all the Roles

    useEffect(() => {
        
            const dayCounterSnapshot = onSnapshot(collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/dayCounter/dayCounter`), (snapshot) => {
                let currentDayx = [];
                snapshot.forEach((doc) => {
                    currentDayx = ({ currentDay: doc.data().currentDay })
                })
                setCurrentDay(currentDayx.currentDay)
            })
        
        const mesagesSnapshot = onSnapshot(collection(database, `playeradmin/chatsLog/jspedrogarcia@gmail.com`),
            (snapshot) => {
                let currentMessages = [];
                snapshot.forEach((doc) => {
                    currentMessages.push({autor: doc.data().autor, message: doc.data().mensagem, horario: doc.data().horario})
                })
                const sortedMessages = currentMessages.sort((a, b) => a.horario - b.horario)
                setAllMessages(sortedMessages)
            })
        const familyMessageSnapshot = onSnapshot(collection(database, `playeradmin/familyChatLog/jspedrogarcia@gmail.com`),
            (snapshot) => {
                let currentMessages = [];
                snapshot.forEach((doc) => {
                    currentMessages.push({autor: doc.data().autor, message: doc.data().mensagem, horario: doc.data().horario})
                })
                const sortedMessages = currentMessages.sort((a, b) => a.horario - b.horario)
                setHiddenEvilChat(sortedMessages)
            })
        }, [registeredPlayerId])
            
    function handlePlayerSignUp(event) {
            event.preventDefault()
            const ref = collection(database, `playeradmin/players/jspedrogarcia@gmail.com`)
            const fixedName = name.replace(/ /g, '')
            addDoc(ref, {
                playerName: fixedName,
                victoryPoints: 0,
                role: "none",
                filliation: "none",
                life: "none",
                image: "none",
                willText: "none",
                action: "pending",
                newResponse: '',
                buff: '',
                debuff: '',
                clownBomb: false,
                pistoleiroMark: false,
                doused: false,
                executorTarget: false,
                cultChoice: false,
                activePlayer: false,
            }) 
            .then(function (docRef) {
                setRegisteredPlayerId(docRef.id);
                localStorage.setItem("playerID", docRef.id);
            })
            .then(() => {
                        Store.addNotification({
                            title: "Cadastro feito com Sucesso",
                            message: "Agora só aguardar futuras instruções.",
                            type: "success",
                            insert: "top",
                            container: "top-right",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                              duration: 5000,
                              onScreen: true
                            }
                        })
            })
    }
    const erasePlayerInfo = async () => {
        localStorage.setItem("playerID", '')
        setRegisteredPlayerId('');
        setEraseModalOpen(false);
        const filteredPlayer = players.filter(player => player.id === registeredPlayerId);
        console.log(filteredPlayer);
        if (filteredPlayer.length > 0) {
            const theRef = doc(database, `playeradmin/players/jspedrogarcia@gmail.com`, filteredPlayer[0].id);
            await deleteDoc(theRef)
        }
    }
    const handleWillSave = async () => {
            Store.addNotification({
                message: "Testamento Salvo com sucesso",
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 3000,
                  onScreen: true
                }
            })
        setWillOpen(false);

    }
    const handleFerreiroWeapon = () => {
    }
    const handlePadeiraSave = () => {
        const playersInGame = alivePlayers;
        const targetRole = playersInGame.filter((player) => player.playerName === target1);
        const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
        addDoc(ref, {
            user: playerCurrentInformation[0].playerName,
            userID: playerCurrentInformation[0].id,
            userRole: playerCurrentInformation[0].role,
            target: target1,
            targetRole: targetRole[0].role,
            wakeOrder: playerCurrentInformation[0].wakeOrder
        })
        updateDoc((doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", playerCurrentInformation[0].id)), { actionforRoleCounter: playerCurrentInformation[0].actionforRoleCounter - 1 });
    }
    const piromaniacoFire = () => {
        // I gotta think of how I am handling this.
        const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
        addDoc(ref, {
            user: playerCurrentInformation[0].playerName,
            userID: playerCurrentInformation[0].id,
            userRole: playerCurrentInformation[0].role,
            target: playerCurrentInformation[0].playerName,
            targetRole: playerCurrentInformation[0].role,
            wakeOrder: playerCurrentInformation[0].wakeOrder,
            targetId: playerCurrentInformation[0].id
        })    
        updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
    }

    const setRandomFauxText = () => {
        const randomNum = Math.round(Math.random() * 10)
        switch (randomNum) {

            case 1:
                setCopiedText('Eva é o nome da assassina em serie')
                break;
            case 2:
                setCopiedText('O carteiro não é mais um personagem no jogo')
                break;
            case 3:
                setCopiedText('O coven retornará')
                break;
            case 4:
                setCopiedText('A medium é o personagem mais alterado')
                break;
            case 5:
                setCopiedText('O culto agora está presente no jogo')
                break;
            case 6:
                setCopiedText('O lore do jogo está em produção')
                break;
            case 7:
                setCopiedText('O lobisomen assassinou o carteiro no lore')
                break;
            case 8:
                setCopiedText('O prefeito que iniciou a aquisição')
                break;
            case 9:
                setCopiedText('Roland é o nome do bobo da corte')
                break;
            case 10:
                setCopiedText('O investigador é o personagem mais influente no jogo')

                break;
        }
    }
    const handleActionSave = () => {
        setFauxTextBox('')
        setRandomFauxText();
        if (playerCurrentRole[0].wakeTrigger === 6) {
            if (currentDay % 2 === 1) {
                
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
            } else {
            const targetRole = alivePlayers.filter((player) => player.playerName === target1);
            const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
            addDoc(ref, {
                user: playerCurrentInformation[0].playerName,
                userID: playerCurrentInformation[0].id,
                userRole: playerCurrentInformation[0].role,
                target: target1,
                targetRole: targetRole[0].role,
                wakeOrder: playerCurrentInformation[0].wakeOrder,
                targetId: targetRole[0].id
            })
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
            }
        }
        if (playerCurrentRole[0].role === 'padeira') { 
            updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
        } else if (playerCurrentRole[0].role === 'executor') {
            
            if (playerCurrentInformation[0].actionforRoleCounter < 1) {
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
            } else {
                const playersInGame = alivePlayers;
                const targetRole = playersInGame.filter((player) => player.playerName === target1);
                const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
                addDoc(ref, {
                    user: playerCurrentInformation[0].playerName,
                    userID: playerCurrentInformation[0].id,
                    userRole: playerCurrentInformation[0].role,
                    target: target1,
                    targetRole: targetRole[0].role,
                    wakeOrder: playerCurrentInformation[0].wakeOrder,
                    targetId: targetRole[0].id
                })
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
                updateDoc((doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", playerCurrentInformation[0].id)), { actionforRoleCounter: playerCurrentInformation[0].actionforRoleCounter - 1 });
            }
        } else {
            if ((playerCurrentRole[0].wakeTrigger === 1 && playerCurrentInformation[0].actionforRoleCounter > 0) ||(playerCurrentRole[0].wakeTrigger === 1 && playerCurrentInformation[0].actionforRoleCounter === null)) {
                const targetRole = alivePlayers.filter((player) => player.playerName === target1);
            const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
            addDoc(ref, {
                user: playerCurrentInformation[0].playerName,
                userID: playerCurrentInformation[0].id,
                userRole: playerCurrentInformation[0].role,
                target: target1,
                targetRole: targetRole[0].role,
                wakeOrder: playerCurrentInformation[0].wakeOrder,
                targetId: targetRole[0].id
            })
                updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
                
            } else if (playerCurrentRole[0].wakeTrigger === 4 && playerCurrentInformation[0].actionforRoleCounter > 0) {
                const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
                
            addDoc(ref, {
                user: playerCurrentInformation[0].playerName,
                userID: playerCurrentInformation[0].id,
                userRole: playerCurrentInformation[0].role,
                target: playerCurrentInformation[0].playerName,
                targetRole: playerCurrentInformation[0].role,
                wakeOrder: playerCurrentInformation[0].wakeOrder,
                targetId: playerCurrentInformation[0].id
            })    
            updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
            
        } else {
        if (playerCurrentInformation[0].actionforRoleCounter === 0) {
                    updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
                }    
                if (playerCurrentRole[0].wakeTrigger === 2) {
                    const playersInGame = alivePlayers;
                    const targetRole = playersInGame.filter((player) => player.playerName === target1);
                    const ref = collection(database, `playeradmin/playerStatuses/jspedrogarcia@gmail.com/mobilePlayerActions/mobilePlayerActionsSingle`)
                    addDoc(ref, {
                        user: playerCurrentInformation[0].playerName,
                        userID: playerCurrentInformation[0].id,
                        userRole: playerCurrentInformation[0].role,
                        target: target1,
                        targetRole: targetRole[0].role,
                        wakeOrder: playerCurrentInformation[0].wakeOrder,
                        targetId: targetRole[0].id
                    })
                    const targetRole2 = playersInGame.filter((player) => player.playerName === target1);
                    addDoc(ref, {
                        user: playerCurrentInformation[0].playerName,
                        userID: playerCurrentInformation[0].id,
                        userRole: playerCurrentInformation[0].role,
                        target: target2,
                        targetRole: targetRole2[0].role,
                        wakeOrder: playerCurrentInformation[0].wakeOrder,
                        targetId: targetRole2[0].id
                    })
                        updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
          }      
        }
        }
        // This triggers for players that have limited roles except for Executor and Padeira that do something else.
        if ((playerCurrentRole[0].role === 'investigador' && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].role === 'zelador' && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].role === 'matriarca' && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].role === 'veterano' && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].role === 'caloteira' && playerCurrentInformation[0].actionforRoleCounter > 0) ) {
            updateDoc((doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", playerCurrentInformation[0].id)), { actionforRoleCounter: playerCurrentInformation[0].actionforRoleCounter - 1 });
        }
        if (playerCurrentRole[0].wakeTrigger === 0) {
            updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" })
        }
        setTarget1('');
        setTarget2('');
    }
    const enviarMensagemDeMorto = () => {
        addDoc(collection(database, `playeradmin/chatsLog/jspedrogarcia@gmail.com`), {
            autor: playerCurrentInformation[0].playerName,
            autorRole: playerCurrentInformation[0].role,
            mensagem: mensagemDeMorto,
            horario: serverTimestamp()
        })
        setMensagemDeMorto('');
    }

    const sendEvilMessage = () => {
        addDoc(collection(database, `playeradmin/familyChatLog/jspedrogarcia@gmail.com`), {
            autor: playerCurrentInformation[0].playerName,
            autorRole: playerCurrentInformation[0].role,
            mensagem: mensagemdoMal,
            horario: serverTimestamp()
        })
        setMensagemdoMal('');
    }
    const handleSkipTurn = () => {
        // Make it so the pending turns into completed
        setFauxTextBox('');
        setRandomFauxText()
        updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", registeredPlayerId), { action: "complete" } )
    }
    return (
        <div >
            <div className="mainMobilePage">
            {registeredPlayerId === '' ? (
                <>
                <div className="signUp">
            <h3>
                Digite seu nome abaixo!
            </h3>
            <form onSubmit={handlePlayerSignUp} className="form">
                                <Form type="text" label="Nome:" state={name} changeState={setName}> </Form>
                                <p>Aguarde um aviso prévio do Administrador para Cadastrar seu nome!</p>
                                <button type="submit" className="button">Cadastrar</button>
            </form>
            </div>
            </>
            )
                    :
                playerCurrentInformation[0]?.activePlayer === false ? (
                        <div className="waitingForMatch">
                                <p>
                                Bem-vindo {playerCurrentInformation[0]?.playerName}!
                                </p>
                                Você está cadastrado, porém está desativado e não irá participar dessa rodada, caso for participar, avise seu adm!
                                <div className="loading">
                                <img src={ghostSVG}></img>
                                </div>
                                <div className="interactiveButtons">
                                    {/* <ButtonMobile clickFunctionality={() => setEraseModalOpen(true)} svgChoice={xSVG} /> */}

                                </div>
                        </div>
                    ) :
            gameState === 'inicio' ?
            (
                            <div className="waitingForMatch">
                                <p>
                                Bem-vindo {playerCurrentInformation[0]?.playerName}!
                                </p>
                                Você está cadastrado, agora aguarde o inicio da partida!
                                <div className="loading">
                                <img src={loadingEffect}></img>
                                </div>
                                <div className="interactiveButtons">
                                    <ButtonMobile clickFunctionality={() => setEraseModalOpen(true)} svgChoice={xSVG} />

                                </div>
            </div>
            ) :
            gameState === 'entregueCartas' ? (
                            <div className="cardDelivered">
                                Bem-vindo ao jogo
                            
                            {playerCurrentInformation.length > 0 ? (
                                <div>
                                    {playerCurrentInformation[0].playerName} - {playerCurrentInformation[0].role }
                                </div>
                                ) : (null)}
                                <div className="interactiveButtons">
                                    <ButtonMobile clickFunctionality={() => setCardOpen(true)} svgChoice={cardSVG} />

                                </div>

            </div>
            ) :
            gameState === 'dia' && playerCurrentRole.length > 0 ? (
                                <div className="widthNightAdjust">
                                    <h2 className="header">Dia {currentDay} </h2>
                                    <div className="interactiveButtons">
                                    <ButtonMobile clickFunctionality={() => setHiddenPrivateInfo(hiddenPrivateInfo => !hiddenPrivateInfo)} svgChoice={hiddenPrivateInfo? eyeCloseSVG : eyeSVG} />
                                    <ButtonMobile clickFunctionality={() => setCardOpen(true)} svgChoice={cardSVG} />
                                    <ButtonMobile clickFunctionality={() => setWillOpen(true)} svgChoice={scrollSVG} />
                                    <ButtonMobile clickFunctionality={() => setPlayerListingOpen(true)} svgChoice={lifeDeadSVG} />
                                    <ButtonMobile clickFunctionality={() => setQuestionOpen(true)} svgChoice={questionSVG} />
                                        
                                    </div>
                                    <div className="playerNoticeBox">
                                        <div>Informações Importantes</div>
                                        <div className="playerNotice">
                                            {playerCurrentInformation[0].life === 'dead' ? (
                                                <div>VOCÊ ESTÁ MORTO</div>
                                            ) : (<>
                                        {playerCurrentInformation[0].newResponse ? (
                                            <div>Informativo: {playerCurrentInformation[0].newResponse}</div>
                                            ) : (<div>Informativo: Não há informativos por agora.</div>)}
                                        {playerCurrentInformation[0].debuff ? (
                                            <div>Efeito Negativo: {playerCurrentInformation[0].debuff}</div>
                                            ) : (null)}
                                        {playerCurrentInformation[0].buff ? (
                                            <div>Efeito Positivo: {playerCurrentInformation[0].buff}</div>
                                                    ) : (null)}
                                                    {playerCurrentInformation[0].cultChoice ? (
                                                        <div>
                                                            Ocultismo: Agora você faz parte do culto.
                                                    </div>
                                        ): (null)}
                                            </>)}
                                            </div>
                                    </div>
                                    <div className="playerInfoBox">
                                        <div>Suas Informações</div>
                                        <div className="playerInfo fadeMe" hidden={hiddenPrivateInfo}>
                                        <p>
                                            Nome: {playerCurrentInformation[0].playerName}
                                        </p>
                                        <p>
                                                Filliação: {playerCurrentInformation[0].filliation === 'town' ? 'Cidade' : playerCurrentInformation[0].filliation === 'the family' ? 'A Familia' :
                                                playerCurrentInformation[0].filliation === 'cult' ? 'Culto' : playerCurrentInformation[0].filliation === 'coven' ? 'Coven' : playerCurrentInformation[0].filliation === 'neutral' ? 'Neutro' : playerCurrentInformation[0].filliation === 'horsemen' ? 'Cavaleiros do Apocalipse' : ''}
                                        </p>
                                        <p>
                                            Função: {playerCurrentInformation[0].role}
                                        </p>
                                        </div>
                                    </div>
                                    

                                    {playerCurrentInformation[0]?.life === 'dead' ? (
                                        <div className="chatMortosBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Chat dos Mortos</div>
                                            <div className="chatMortos fadeMe" hidden={hiddenPrivateInfo}>

                                            <div className="chatMortosLog">
                                                {allMessages.map((message) => (
                                                    <div className="chatMortosLogMsg">
                                                        <span>{message.autor}:</span><span>{message.message}</span>
                                                    </div>
                                                ))}
                                                </div>
                                                <div className="chatMortosTextType">
                                            <input type="text" value={mensagemDeMorto} onChange={(e) => setMensagemDeMorto(e.target.value)} />
                                                    <button className="button" onClick={enviarMensagemDeMorto}>Enviar</button>
                                                </div>
                                                    <span>Informativo: O medium pode ler suas mensagens a noite!</span>
                                            </div>
                                        </div>
                                    ) : (null)}

                                    {playerCurrentInformation[0]?.filliation === 'the family' && playerCurrentInformation[0]?.life === "alive" ? (
                                        <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro da Familia</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.filliation === 'the family').map(player => (
                                                <span>
                                                    <p>{player.playerName} - {player.role}</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                    ):(null)}
                                    {playerCurrentInformation[0]?.filliation === 'horsemen' && playerCurrentInformation[0]?.life === "alive" ? (
                                        <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro dos Cavaleiros</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.filliation === 'horsemen').map(player => (
                                                <span>
                                                    <p>{player.playerName} - {player.role}</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                    ):(null)}
                                </div>
            ) : gameState === 'noite' && playerCurrentRole.length > 0 && playerCurrentInformation[0].life === 'alive' ? (
                                    <div className="widthNightAdjust">

                                    <div className="header">Noite {currentDay} </div>
                                    <div className="interactiveButtons">
                                    <ButtonMobile clickFunctionality={() => setCardOpen(true)} svgChoice={cardSVG} />
                                    <ButtonMobile clickFunctionality={() => setWillOpen(true)} svgChoice={scrollSVG} />
                                    <ButtonMobile clickFunctionality={() => setQuestionOpen(true)} svgChoice={questionSVG} />
                                    </div>
        
                                        <div className="nightAction">
                                        {playerCurrentInformation[0].playerName} - {playerCurrentInformation[0].role}

                                            {playerCurrentInformation[0]?.actionforRoleCounter !== null && (
                                                <div className="informativoActions">
                                                    Quantidade de ações restantes: {playerCurrentInformation[0]?.actionforRoleCounter}
                                                </div>
                                            )}
                                            {(playerCurrentRole[0].role === 'lobisomen' && currentDay % 2 === 0) || (playerCurrentRole[0].wakeTrigger === 1 && playerCurrentInformation[0].action === "pending" && playerCurrentInformation[0].actionforRoleCounter > 0) || (playerCurrentRole[0].wakeTrigger === 1 && playerCurrentInformation[0].action === "pending" && playerCurrentInformation[0]?.actionforRoleCounter === null) || (playerCurrentInformation[0].action === "pending" && playerCurrentRole[0].wakeTrigger === 2) ? (
                                            
                                                (currentDay === 1 && noActionsNight1.includes(playerCurrentInformation[0].role)) ? (null) : (
                                            
                                                                                        
                                                <div className="actualAction">

                                                    <span>
                                                        Selecione seu Alvo
                                                    </span>
                                                    <select  name="alivePlayerTarget1" id="alivePlayerTarget1" value={target1} onChange={(e) => setTarget1(e.target.value)}>
                                                    <option value="" defaultValue disabled>Selecione Alguém</option>
                                                        {alivePlayers
                                                            .filter((player) => player.playerName !== playerCurrentInformation[0].playerName)
                                                            .map((player) => (
                                                                <option key={player.key}>{player.playerName}</option>
                                                            ))
                                                        }
                                                    </select>
                                            
                                                    </div>
                                                )
                                            ) : (null)}
                                            {playerCurrentRole[0].wakeTrigger === 2 && playerCurrentInformation[0].action === "pending" ? (
                                                <div className="actualAction">
                                                    <span>
                                                        Selecione seu Alvo 2
                                                    </span>
                                                    <select  name="alivePlayerTarget2" id="alivePlayerTarget2" value={target2} onChange={(e) => setTarget2(e.target.value)}>
                                                    <option value="" defaultValue disabled>Selecione</option>
                                                        {alivePlayers
                                                            .filter((player) => player.playerName !== playerCurrentInformation[0].playerName)
                                                            .map((player) => (
                                                                <option key={player.key}>{player.playerName}</option>
                                                            ))
                                                        }
                                                    </select>
                                            
                                                </div>
                                            ) : (null)}
                                            {playerCurrentRole[0].wakeTrigger === 5 && (
                                                <div>

                                                <select name="weaponChoice" id="weaponChoice" value={weaponChoice} onChange={(e) => setWeaponChoice(e.target.value)}>
                                                    <option value="" defaultValue disabled>Selecione</option>
                                                    <option value="espada">Espada</option>
                                                    <option value="escudo">Escudo</option>
                                                    
                                                    </select>
                                                <button className="button" onClick={handleFerreiroWeapon}>Fazer Arma</button>
                                                </div>
                                                
                                            )}
                                            {playerCurrentRole[0].role === 'medium' && (
                                                <div className="chatMortosBox">
                                            <div>Chat dos Mortos</div>
                                            <div className="chatMortos">

                                            <div className="chatMortosLog">
                                                {allMessages.map((message) => (
                                                    <div className="chatMortosLogMsg">
                                                        <span>Jogador:</span><span>{message.message}</span>
                                                    </div>
                                                ))}
                                                </div>
                                            </div>
                                        </div>
                                            )}
                                            {playerCurrentRole[0].role === 'piromaniaco' ? (
                                            <div className="piromaniacoInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro do Piromaniaco</div>
                                            <div className="piromaniacoInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.doused === true).map(player => (
                                                <span>
                                                    <p>{player.playerName} está encharcado!</p>
                                                </span>
                                            ))}    
                                            </div>

                                                </div>) : (null)}
                                            {/* Informativo de Familia */}
                                            {playerCurrentInformation[0]?.filliation === 'the family' && playerCurrentInformation[0]?.life === "alive" ? (
                                            <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro da Familia</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.filliation === 'the family').map(player => (
                                                <span>
                                                    <p>{player.playerName} - {player.role}</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                            ) : (null)}
                                            {(playerCurrentInformation[0]?.filliation === 'cult' && playerCurrentInformation[0]?.life === "alive") || (playerCurrentInformation[0]?.cultChoice === true && playerCurrentInformation[0]?.life === "alive") ? (
                                            <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro do Culto</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                                {alivePlayers.filter((player) => player.filliation === "cult").map(player => (
                                                    <span>
                                                        <p>{player.playerName} - Ocultista</p>
                                                    </span>
                                                ))}    
                                            {alivePlayers.filter((player) => player.cultChoice === true).map(player => (
                                                <span>
                                                    <p>{player.playerName} - Seguidor do Culto</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                            ) : (null)}
                                            {/* Informativo de Cavaleiros */}
                                            {playerCurrentInformation[0]?.filliation === 'horsemen' && playerCurrentInformation[0]?.life === "alive" ? (
                                            <div className="mafiaInfoBox">
                                            <div className="fadeMe" hidden={hiddenPrivateInfo}>Centro dos Cavaleiros</div>
                                            <div className="mafiaInfo fadeMe" hidden={hiddenPrivateInfo}>
                                            {alivePlayers.filter((player) => player.filliation === 'horsemen').map(player => (
                                                <span>
                                                    <p>{player.playerName} - {player.role}</p>
                                                </span>
                                            ))}    
                                            </div>

                                        </div>
                                            ) : (null)}
                                            {/* Chat particular de quem é do mal */}
                                            {playerCurrentInformation[0].filliation === 'horsemen' || playerCurrentInformation[0].filliation === 'the family' ? (
                                                <div className="evilChatBox">
                                                    <div>Chat Privado</div>
                                                    <div className="evilChatInfo">
                                                        {allEvilChat.map((chat) => (
                                                            <span>
                                                                <p>{chat.autor}: { chat.message }</p>
                                                        </span>
                                                    ))}
                                                    </div>
                                                    <div className="evilChatButtons">
                                                    <input type="text" value={mensagemdoMal} onChange={(e) => setMensagemdoMal(e.target.value)}/>
                                                    <button type="button" className="button" onClick={sendEvilMessage} disabled={mensagemdoMal === ''}>Enviar Mensagem</button>
                                                    </div>
                                                </div>
                                            ) : (null)}
                                            {playerCurrentInformation[0].action === "pending" && (
                                                <div className="basicFlex">
                                                    {playerCurrentRole[0].role === 'padeira' && playerCurrentInformation[0]?.actionforRoleCounter > 0 && (
                                                    <button className="button" onClick={handlePadeiraSave}>Curar Jogador!</button>
                                                    )}
                                                    {playerCurrentRole[0].role === 'piromaniaco' &&(
                                                    <button className="button" onClick={piromaniacoFire}>Tacar fogo!</button>
                                                    )}
                                                    {playerCurrentRole[0].filliation === 'neutral' || playerCurrentRole[0].filliation === 'cult' || playerCurrentRole[0].filliation === 'town' ? (
                                                        <div className="mafiaInfoBox fadeMe">
                                                            <div>
                                                                {copiedText}
                                                            </div>
                                                            <input type="text" value={fauxTextBox} onChange={(e) => setFauxTextBox(e.target.value)} placeholder="Copie o texto acima" autoCorrect="off" autoComplete="off" />
                                                            <div className="littleinformativo">
                                                                Você só pode completar sua ação se preencher a caixa acima!
                                                            </div>
                                                        </div>
                                                    ) : (null)}
                                                    {(currentDay === 1 && noActionsNight1.includes(playerCurrentInformation[0].role)) || playerCurrentRole[0].wakeTrigger === 0 ? (null) : (

                                                        <button disabled={playerCurrentRole[0].filliation === 'neutral' || playerCurrentRole[0].filliation === 'cult' || playerCurrentRole[0].filliation === 'town' ? fauxTextBox !== copiedText : false} className="button" onClick={handleActionSave}>{playerCurrentRole[0].role === 'padeira' ? 'Encerrar Jogada' : 'Confirmar Ação' }</button>
                                                    )}
                                                    <button disabled={playerCurrentRole[0].filliation === 'neutral' || playerCurrentRole[0].filliation === 'cult' || playerCurrentRole[0].filliation === 'town' ? fauxTextBox !== copiedText : false} className="button" onClick={handleSkipTurn}>{playerCurrentRole[0].wakeTrigger === 0 ? 'Encerrar Noite' : 'Pular Vez'}</button>
                                                </div>
                                            )}
                                            {playerCurrentInformation[0].action === "complete" && (
                                                <div className="completedActionWaiting">
                                                    Aguardando encerramento da noite!
                                                    <div className="loading">
                                                    <img src={loadingEffect}></img>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
            </div>
            ) : ('')
            }
                
            </div>


            {/* The popups */}
            <Popup position="center" open={eraseModalOpen} modal closeOnEscape={true} closeOnDocumentClick={true}>
                <div>
                    <div className="header"> Apagar Cadastro</div>
                    <div className="cardDetailedInformation">
                        Você quer mesmo apagar seu cadastro?
                <button className="button" onClick={() => erasePlayerInfo()}>Sim</button>
                <button className="button" onClick={() => setEraseModalOpen(false)}>Não</button>
                    </div>
                    </div>
            </Popup>
            <Popup className="modalMobile" position="center" open={cardOpen} modal closeOnEscape={false} closeOnDocumentClick={false}>
                <div>

                
                    <div className="header"> Sua Carta</div>
                    <div className="cardDetailedInformation">
            {playerCurrentRole.length > 0 ? (
                        <img className="cardImg img-responsive" src={playerCurrentRole[0].image} alt={playerCurrentRole[0].role} /> 
                ) : (<div>Você ainda não possui carta! Só aguardar!</div>)}
                <button className="button fixedButton" onClick={() => setCardOpen(false)}>Fechar</button>
                    </div>
                    </div>
            </Popup>
            <Popup className="modalMobile" position="center" open={questionOpen} modal closeOnEscape={false} closeOnDocumentClick={false}>
                <div>
                    <div className="header">Ajuda</div>
                    <div className="cardDetailedInformation">
                    <div>O que te ajudará</div>
                <button className="button fixedButton" onClick={() => setQuestionOpen(false)}>Fechar</button>
                    </div>
                    </div>
            </Popup>
            <Popup position="center">

            </Popup>
            <Popup className="modalMobile"  open={willOpen} modal closeOnEscape={false} closeOnDocumentClick={false}>
                <div className="modal-testatamentcontent">

                    <div className="header"> Seu Testamento</div>
                    <div className="testamentInformation">
                        <p>Informações que você gostaria de lembrar</p>
                        <textarea className="testamentTextArea" name="" id="" value={willText} onChange={(e) => setWillText(e.target.value)}></textarea>
                    </div>
                    <div className="fixedButton">
                <button className="button " onClick={handleWillSave}>Salvar Testamento</button>
                <button className="button " onClick={() => setWillOpen(false)}>Fechar</button>
                    </div>
                </div>
            </Popup>
            <Popup className="modalMobile"  open={playerListingOpen} modal closeOnEscape={false} closeOnDocumentClick={false}>
                <div className="modal-testatamentcontent">

                    <div className="header"> Lista de Jogadores</div>
                    <div className="playerListingModal">
                        <div className="listing-inner-modal scrollable">
                            Jogadores Vivos
                        <span>{alivePlayers.map((player) => (
                            <p key={player.id}>{player.playerName }</p>
                            )) }</span>
                        </div>
                        <div className="listing-inner-modal scrollable">
                            Jogadores Mortos
                        <span>{deadPlayers.map((player) => (
                            <p key={player.id}>{player.playerName}</p>
                            )) }</span>
                        </div>
                    </div>
                <button className="button fixedButton" onClick={() => setPlayerListingOpen(false)}>Fechar</button>
                </div>
            </Popup>

    </div>
    )
}

export default PlayerMobile;