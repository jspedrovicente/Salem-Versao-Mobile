import "./day.css"
import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import useSound from "use-sound";
import julgamentoSound from "../../assets/julgamento-soundeffect.mp3"
import morteSound from "../../assets/morte-soundeffect.mp3"
import bombFizzle from "../../assets/bomb fizzle effect.mp3"
import bombBoom from "../../assets/bomb effect.mp3"
import gunSound from "../../assets/gun shot effect.mp3"
import dayMusic from "../../assets/daysounds/daymusic.mp3"
import roosterEffect from "../../assets/daysounds/rooster-soundeffect.mp3"
import deadEffectMusic from "../../assets/daysounds/sadDeathMusic.mp3"
import cancelEffectMusic from "../../assets/daysounds/cancelDeathMusic.mp3"
import pesteDeathMusic from "../../assets/daysounds/pesteDeathlongeffect.mp3"
import dramaticDeathMusic from "../../assets/daysounds/dramaticMusic.mp3"
import jesterDeathMusic from "../../assets/daysounds/jesterDeathEffect.mp3"
import apocalipseMusic from "../../assets/daysounds/ApocalipseVictoryMusic.mp3"
import revivalCallEffect from "../../assets/daysounds/revivalCallEffect.mp3"
import ActiveRevivalEffect from "../../assets/daysounds/ActiveRevivalEffect.mp3"
import ocultistVictoryEffect from "../../assets/daysounds/OcultistVictory.mp3"
import boneBreakSoundEffect from "../../assets/daysounds/boneBreakSoundEffect.mp3"
import handBellSoundEffect from "../../assets/daysounds/handBellSoundEffect.mp3"
import bombSvg from "../../assets/svgs/bomb-svg.svg"
import bulletSvg from "../../assets/svgs/bullet-svg.svg"
import wingSvg from "../../assets/svgs/wing-svg.svg"
const Day = () => {

    // sound effects
    const [playJulgamentoSound] = useSound(julgamentoSound);
    const [playFizzleSound] = useSound(bombFizzle);
    const [playHandBellSoundEffect] = useSound(handBellSoundEffect);
    const [playBombSound] = useSound(bombBoom);
    const [PlayboneBreakSoundEffect] = useSound(boneBreakSoundEffect);
    const [playmorteSound] = useSound(morteSound);
    const [playGunSound] = useSound(gunSound);
    const [playDayMusic, { stop: stopDayMusic }] = useSound(dayMusic);
    const [playRoosterSound] = useSound(roosterEffect, { volume: 0.60 });
    const [playCancelEffectMusic] = useSound(cancelEffectMusic);
    const [playPesteDeathMusic] = useSound(pesteDeathMusic);
    const [playJesterDeathMusic] = useSound(jesterDeathMusic);
    const [playRevivalCallEffect] = useSound(revivalCallEffect, { volume: 0.60 });
    const [playActiveRevivalEffect] = useSound(ActiveRevivalEffect, { volume: 0.60 });
    const [playDramaticDeathMusic, { stop: stopDramaticDeathMusic }] = useSound(dramaticDeathMusic);
    const [playApocalipseMusic] = useSound(apocalipseMusic);
    const [playOcultistVictoryEffect] = useSound(ocultistVictoryEffect);
    const [isOpen, setIsOpen] = useState(true);
    const [judgementTarget, setJudgementTarget] = useState([])
    const [judgementPanelIsOpen, setJudgementPanelIsOpen] = useState(false);
    const [prefeitoPanelisOpen, setPrefeitoPanelisOpen] = useState(false);
    const [adminPanelIsOpen, setAdminPanelIsOpen] = useState(false);
    const [plaguePanelIsOpen, setPlaguePanelIsOpen] = useState(false);
    const [jesterPanelIsOpen, setJesterPanelIsOpen] = useState(false);
    const [prefeitoChoice, setPrefeitoChoice] = useState('');
    const [judgementvoting, setJudgementvoting] = useState(false);
    const [killPanelIsOpen, setKillPanelIsOpen] = useState(false);
    const [openOcultistModal, setOpenOcultistModal] = useState(false);
    const [apocalipsePanelIsOpen, setApocalipsePanelIsOpen] = useState(false);
    const [judgeCultFollowers, setJudgeCultFollowers] = useState(false);
    const [judgeCultResultModal, setJudgeCultResultModal] = useState(false);
    const [judgeCultResponse, setJudgeCultResponse] = useState('');
    const [is2ModalOpen, setIs2ModalOpen] = useState(false);
    const [isReviveModalOpen, setIsReviveModalOpen] = useState(false);
    const [notifierNewsIsOpen, setNotifierNewsIsOpen] = useState(false);
    const [updatePanelInfo, setUpdatePanelInfo] = useState(false);
    const [posiviteCounter, setPosiviteCounter] = useState(0)
    const [negativeCounter, setNegativeCounter] = useState(0)
    const [negativeCultCounter, setNegativeCultCounter] = useState(0)
    const [positiveCultCounter, setPositiveCultCounter] = useState(0)
    const [notifierNews, setNotifierNews] = useState('')
    const [user, setUser] = useState([]);
    const [judgementCounter, setJudmentCounter] = useState(0);
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [allAcusations, setAllAcusations] = useState([]);
    const [allAcusationsKillingVotes, setAllAcusationsKillingVotes] = useState([]);
    const [allCultAcusationsKillingVotes, setAllCultAcusationsKillingVotes] = useState([]);
    const [cultRole, setCultRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [currentDay, setCurrentDay] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [allPublicEvents, setAllPublicEvents] = useState([]);
    const navigateToNight = useNavigate();
    const [playerKilling, setPlayerKilling] = useState('');
    const [playerKilling2, setPlayerKilling2] = useState('');
    const [killAnouncementUpdate, setKillAnouncementUpdate] = useState('');
    const [visitAction, setVisitAction] = useState([]);
    

    useEffect(() => {
        const timer =  judgementCounter > 0 && setInterval(() => setJudmentCounter(judgementCounter - 1), 1000)
        return () => clearInterval(timer);
    }, [judgementCounter])
    useEffect(() => {
        const loadUserInformation = () => {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
            const data = JSON.parse(userDetail);
        }
        loadUserInformation();
    }, [])
    useEffect(() => {
        const loadPlayers = () => {
            const x = onSnapshot(collection(database, `playeradmin/players/${user.email}`), (snapshot) => {
                let list = [];
                snapshot.forEach((doc) => {
                    if (doc.data().activePlayer === true) {
                        list.push({
                            id: doc.id,
                            key: doc.id,
                            playerName: doc.data().playerName,
                            victoryPoints: doc.data().victoryPoints,
                            role: doc.data().role,
                            filliation: doc.data().filliation,
                            life: doc.data().life,
                            action: doc.data().action,
                            wakeOrder: doc.data().wakeOrder,    
                            willText: doc.data().willText,
                            clownBomb: doc.data().clownBomb,
                            pistoleiroMark: doc.data().pistoleiroMark,
                            buff: doc.data().buff,
                            debuff: doc.data().debuff,
                            executorTarget: doc.data().executorTarget,
                            newResponse: doc.data().newResponse,
                            doused: doc.data().doused,
                            actionforRoleCounter: doc.data().actionforRoleCounter,
                            cultChoice: doc.data().cultChoice,
                            zeladorClear: doc.data().zeladorClear
                        })
                    }
                })
                setPlayers(list);
                setAlivePlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("alive")))
                setDeadPlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("dead")))
            })
           
             const dayCounterSnapshot = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/dayCounter/dayCounter`), (snapshot) => {
                let currentDayx = [];
                snapshot.forEach((doc) => {
                    currentDayx = ({ currentDay: doc.data().currentDay })
                })
                setCurrentDay(currentDayx.currentDay)
            })
        }
    
        loadPlayers();
    }, [user]);
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
                    category: doc.data().category
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
                    category: doc.data().category
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
                    category: doc.data().category
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
                    category: doc.data().category

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
                    category: doc.data().category

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
                    category: doc.data().category

                })
            })
            setNeutralRole(roles);
            
        })
    }, [])
    useEffect(() => {

        function addAllRoles(townRole, mafiaRole, covenRole, horsemenRole, neutralRole, cultRole) {
            setAllRoles([...townRole, ...mafiaRole, ...covenRole, ...horsemenRole, ...neutralRole, ...cultRole])
           console.log(allRoles)
        }
        addAllRoles(covenRole, mafiaRole, townRole, horsemenRole, neutralRole, cultRole);

    }, [covenRole, mafiaRole, townRole, horsemenRole, neutralRole, cultRole])
    useEffect(() => {
        const importData = () => {
            const visitData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        visitor: doc.data().visitor,
                        visited: doc.data().visited,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setVisitAction(temp);
            })
            const annoucedData = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`), (snapshot) => {
                let lol = [];
                snapshot.forEach((doc) => {
                    lol.push({
                        killedPlayer: doc.data().killedPlayer,
                        killedPlayerRole: doc.data().killedPlayerRole,
                        attackerRole: doc.data().attackerRole,
                        key: doc.id,
                        id: doc.id
                    })
                })
                setAnnouncements(lol);
            })
            const publicEvents = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        target: doc.data().target,
                        event: doc.data().event,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setAllPublicEvents(temp);
            })
            const accusations = onSnapshot(collection(database, `playeradmin/judgementAction/judgementAcusations`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        acuser: doc.data().acuser,
                        acuserName: doc.data().acuserName,
                        acused: doc.data().acused,
                        acusedName: doc.data().acusedName,
                        value: doc.data().value,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setAllAcusations(temp);
            })
            const accusationKills = onSnapshot(collection(database, `playeradmin/judgementAction/judgementKillingAction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        voter: doc.data().voter,
                        vote: doc.data().vote,
                        value: doc.data().value,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setAllAcusationsKillingVotes(temp);
            })
            const accusationsKillsCult = onSnapshot(collection(database, `playeradmin/judgementAction/judgementCultKillingAction`), (snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                    temp.push({
                        voter: doc.data().voter,
                        vote: doc.data().vote,
                        value: doc.data().value,
                        id: doc.id,
                        key: doc.id
                    })
                })
                setAllCultAcusationsKillingVotes(temp);
            })
        }
        importData();
    }, [user.email])
    const endGameCompletely = async () => {
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'false' })
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "inicio"})

        clearNeedlessData();
        stopDayMusic();
        stopDramaticDeathMusic();

        // Limpando o todos status effects
        for (let i = 0; i < players.length; i++){
            updateDoc(doc(database, `playeradmin/players/${user.email}/${players[i].id}`), { newResponse: "", buff: "", debuff: "", clownBomb: false, pistoleiroMark: false, doused: false, executorTarget: false, cultChoice: false, zeladorClear: false });
        }
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "dayCounter", "dayCounter", "dayCounter"), { currentDay: 1 })
        navigateToNight('/playerrole')
    }
    const clearNeedlessData = () => {
        // clears visitAction
        for (let p = 0; p < visitAction.length; p++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`, visitAction[p].id)
            deleteDoc(theRef);
        }
        for (let i = 0; i < announcements.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`, announcements[i].id)
            deleteDoc(theRef);
        }
        for (let i = 0; i < allPublicEvents.length; i++) {
            const theRef = doc(database, `playeradmin/playerStatuses/${user.email}/publicEvents/publicEvents`, allPublicEvents[i].id)
            deleteDoc(theRef)

        }
    }
    const explodeBomb = () => {
        const playerbombed = alivePlayers.filter((player) => player.clownBomb === true);
        stopDayMusic()
        for (let i = 0; i < playerbombed.length; i++){
            let num = Math.random();
            if (num < 0.60) {
                playBombSound();
                setTimeout(() => {
                    setKillPanelIsOpen(true);
                    updateDoc(doc(database, "playeradmin", "players", user.email, playerbombed[0].id), { life: "dead", clownBomb: false })
                }, 12000);
                setKillAnouncementUpdate(`O jogador ${playerbombed[0].playerName} explodiu. Sua função era ${playerbombed[0].role}`)
            } else {
                playFizzleSound();
                updateDoc(doc(database, "playeradmin", "players", user.email, playerbombed[0].id), {clownBomb: false })

            }
        }
        setTimeout(() => {
            playDayMusic();
       }, 10000) 

    }
    const explodeMark = () => {
        const markedPlayer = alivePlayers.filter((player) => player.pistoleiroMark === true);
        for (let i = 0; i < markedPlayer.length; i++) {
            playGunSound();
            updateDoc(doc(database, "playeradmin", "players", user.email, markedPlayer[0].id), { life: "dead", pistoleiroMark: false });
        }
    }
    const revivePlayer = () => {
        setIsReviveModalOpen(false);
        const target = deadPlayers.filter(player => { return player.playerName === playerKilling });
        const martir = alivePlayers.filter(player => player.role === 'martir')
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "alive", newResponse: '', action: 'pending' });
        updateDoc(doc(database, "playeradmin", "players", user.email, martir[0].id), { life: "dead" });
        setKillPanelIsOpen(true);
        setKillAnouncementUpdate(`O jogador ${target[0].playerName} foi ressucitado, o mártir ${martir[0].playerName} se sacrificou por essa troca.`)

        playActiveRevivalEffect();
    }
    const revivePopup = () => {
        playRevivalCallEffect();
        setIsReviveModalOpen(true)
        stopDayMusic();
        stopDramaticDeathMusic();
    }
    const filliationChecks = () => {
        const mafiaCheck = alivePlayers.filter((player) => player.filliation === 'the family')
        // Do same thing for coven in chase you want to program it in man.

        if (mafiaCheck.length > 0) {
            // Check if the godfather is alive, if yes, then nothing happens
            // If the godfather is dead, then promote the afilhado to godfather, if the afilhado is dead, promote the Conselheira
            // If conselheira is dead promote the Vigarista
            // if vigarista is dead promote the Zelador
            const godfatherPresent = mafiaCheck.filter((player) => player.role === 'mestre')
            if (godfatherPresent.length === 0) {
                const afilhadoPresent = mafiaCheck.filter((player) => player.role === 'patriarca');
                if (afilhadoPresent.length > 0) {
                    updateDoc(doc(database, `playeradmin/players/jspedrogarcia@gmail.com/${afilhadoPresent[0].id}`), {role: 'mestre'});
                } else {
                    const conselheiraPresent = mafiaCheck.filter((player) => player.role === 'matriarca');
                    if (conselheiraPresent.length > 0) {
                    updateDoc(doc(database, `playeradmin/players/jspedrogarcia@gmail.com/${conselheiraPresent[0].id}`), {role: 'mestre', actionforRoleCounter: null });
                    } else {
                        const vigaristaPresent = mafiaCheck.filter((player) => player.role === 'mordomo');
                        if (vigaristaPresent.length > 0) {
                        updateDoc(doc(database, `playeradmin/players/jspedrogarcia@gmail.com/${vigaristaPresent[0].id}`), {role: 'mestre'});
                        } else {
                        const zeladorPresent = mafiaCheck.filter((player) => player.role === 'zelador');
                            if (zeladorPresent.length > 0) {
                                updateDoc(doc(database, `playeradmin/players/jspedrogarcia@gmail.com/${zeladorPresent[0].id}`), {role: 'mestre', actionforRoleCounter: null});
                            } else {
                                const caloteiraPresent = mafiaCheck.filter((player) => player.role === 'caloteira');
                                if (caloteiraPresent.length > 0) {
                                    updateDoc(doc(database, `playeradmin/players/jspedrogarcia@gmail.com/${caloteiraPresent[0].id}`), {role: 'mestre', actionforRoleCounter: null});
                                    
                                }
                            }
                        }
                    }
                }
            } else {
            }
        }
    } 
    const startNight = () => {
        clearNeedlessData();
        stopDayMusic();
        stopDramaticDeathMusic();
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'sleep' })
        filliationChecks();
        navigateToNight('/night');
    }
    const judgementStartPeriod = (factor) => {
        setJudgementvoting(false)
        setPrefeitoPanelisOpen(false)
        updateDoc(doc(database, "playeradmin", "counters", "counters", "judgementCounter"), { counter: 0 })
        const judgementCounters = {}
        allAcusations.forEach(obj => {
            const value = obj.acused
            judgementCounters[value] = (judgementCounters[value] || 0) + obj.value;
            console.log(judgementCounters)

        });
        let mostRepeatedValue;
        let maxCounter = 0;
        for (const value in judgementCounters) {
            if (judgementCounters[value] > maxCounter) {
                maxCounter = judgementCounters[value];
              mostRepeatedValue = value;
            }
        }
        let ChosenTarget = ''
        if (factor) {
            ChosenTarget = alivePlayers.filter(player => player.id === prefeitoChoice);
        } else {
            ChosenTarget = alivePlayers.filter(player => player.id === mostRepeatedValue);
        }
        setJudgementTarget({ target: ChosenTarget[0].id, targetName: ChosenTarget[0].playerName, votes: maxCounter });
        setJudgementPanelIsOpen(true);
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "judgementKilling" })
        updateDoc(doc(database, "playeradmin", "counters", "counters", "judgementKillCounter"), { counter: 60, target: ChosenTarget[0].playerName, votes: maxCounter})
        playJulgamentoSound();
        stopDayMusic();
    }
    const killPlayer = () => {
        const target = alivePlayers.filter(player => { return player.playerName === playerKilling });
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" })

    }
    const playerjudgementAction = () => {
        const positiveVotes = 0 + allAcusationsKillingVotes.filter((acusation) => acusation.vote === 'culpado').map((acuse) => acuse.value).reduce(function (a,b) { return a + b }, 0)
        const negativeVotes = 0 + allAcusationsKillingVotes.filter((acusation) => acusation.vote === 'inocente').map((acuse) => acuse.value).reduce(function (a, b) { return a + b }, 0)
        if (positiveVotes > negativeVotes) {
            playmorteSound();
            const target = alivePlayers.filter(player => { return player.id === judgementTarget.target });
            console.log(target)
            updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" })
            setJudgementPanelIsOpen(false);
            if (target[0].role === 'peste') {
                setTimeout(() => {
                    stopDayMusic();
                    playPesteDeathMusic();
                    setPlaguePanelIsOpen(true)
                }, 5000)
            } else {
                if (target[0].role === 'bobo da corte') {
                    setTimeout(() => {
                        stopDayMusic();
                        playJesterDeathMusic();
                        setJesterPanelIsOpen(true);
                    }, 5000)
                } else if (target[0].role === 'ocultista') {
                    setTimeout(() => {
                        const cultFollowers = alivePlayers.filter(player => player.cultChoice === true);
                        if (cultFollowers.length > 0) {
                            setJudgeCultFollowers(true);
                            stopDayMusic();
                            updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "cultKilling" })
                        } else {
                            setKillPanelIsOpen(true)
                            setKillAnouncementUpdate(`O jogador ${target[0].playerName} foi julgado. Sua função era ${target[0].role}`)
                            playDramaticDeathMusic();
                        }
                    }, 5000)
                }
                else {
                    setKillPanelIsOpen(true);
                    setKillAnouncementUpdate(`O jogador ${target[0].playerName} foi julgado. Sua função era ${target[0].role}`)
                    setTimeout(() => {
                        playDramaticDeathMusic();
                    }, 5000);
                }
            }
            if (target[0].executorTarget === true ) {
                const executor = alivePlayers.filter(player => player.role === 'executor');
                if (executor.length > 0) {
                    updateDoc(doc(database, "playeradmin", "players", user.email, executor[0].id), { role: 'executor vitorioso' });
                    setNotifierNews('O Alvo do executor acabou de ser executado. Executor ganhou sua parte do jogo!')
                    setNotifierNewsIsOpen(true);
                }
            }
        } else {
            setJudgementPanelIsOpen(false);
            playCancelEffectMusic();
            setTimeout(() => {
                playDayMusic();
            }, 10000);
        }
        setPosiviteCounter(0);
        setNegativeCounter(0);
        for (let i = 0; i < allAcusations.length; i++){
            const theRef = doc(database, `playeradmin/judgementAction/judgementAcusations`, allAcusations[i].id)
            deleteDoc(theRef)
        }
        for (let i = 0; i < allAcusationsKillingVotes.length; i++){
            const theRef = doc(database, `playeradmin/judgementAction/judgementKillingAction`, allAcusationsKillingVotes[i].id)
            deleteDoc(theRef)
        }
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "dia" })
    }
    const savePlayer = () => {
        setJudgementPanelIsOpen(false);
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "dia" })
        for (let i = 0; i < allAcusations.length; i++){
            const theRef = doc(database, `playeradmin/judgementAction/judgementAcusations`, allAcusations[i].id)
            deleteDoc(theRef)
        }
        for (let i = 0; i < allAcusationsKillingVotes.length; i++){
            const theRef = doc(database, `playeradmin/judgementAction/judgementKillingAction`, allAcusationsKillingVotes[i].id)
            deleteDoc(theRef)
        }   
        setTimeout(() => {
            playDayMusic();
        }, 2000);
    }
    const dayPrompt = () => {
        setIsOpen(false);
        playRoosterSound();
        setTimeout(() => {
            playDayMusic();

        }, 3000);
    }
    const executorCheck = () => {
        const executor = alivePlayers.filter(player => player.role === 'executor');
        if (executor.length > 0) {
            const executorTarget = alivePlayers.filter((player) => player.executorTarget === true);
            if (executorTarget.length === 0) {
                setUpdatePanelInfo('O alvo do executor morreu, ele agora virou Bobo da corte!');
                updateDoc(doc(database, "playeradmin", "players", user.email, executor[0].id), { role: 'bobo da corte' });
            }
        };
    }
    const dayPrompt2 = () => {
        executorCheck();
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "dia" })
        for (let i = 0; i < alivePlayers.length; i++){
            updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", alivePlayers[i].id), { action: "pending" } )
        }
        const horsemen = alivePlayers.filter(player => player.filliation === 'horsemen');
        if (horsemen.length > 0 && currentDay === 8) {
            setIsOpen(false);
            playRoosterSound();
            setApocalipsePanelIsOpen(true)
            setTimeout(() => {
                playApocalipseMusic();
                
            }, 3000);
        } else {
            setIsOpen(false);
            setIs2ModalOpen(true);
            playRoosterSound();
            setTimeout(() => {
                playDayMusic();
                
            }, 3000);
        }
    }
    const adminPanel = () => {
        setAdminPanelIsOpen(true);
    }
    const plagueMurder = () => {
        setPlaguePanelIsOpen(false);
        const target = alivePlayers.filter(player => { return player.playerName === playerKilling });
        const target2 = alivePlayers.filter(player => { return player.playerName === playerKilling2 });
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" });
        updateDoc(doc(database, "playeradmin", "players", user.email, target2[0].id), { life: "dead" });
        setKillPanelIsOpen(true);
        setKillAnouncementUpdate(`Os jogadores ${target[0].playerName} e ${target2[0].playerName} morreram com a peste bubônica. Suas funções eram: ${target[0].role} e ${target2[0].role} respectivamente.`)
        playDramaticDeathMusic();
    }
    const jesterMurder = () => {
        setJesterPanelIsOpen(false);
        const target = alivePlayers.filter(player => { return player.playerName === playerKilling });
        updateDoc(doc(database, "playeradmin", "players", user.email, target[0].id), { life: "dead" });
        setKillPanelIsOpen(true);
        PlayboneBreakSoundEffect();
        setKillAnouncementUpdate(`O jogador ${target[0].playerName} morreu com a brincadeira do Bobo da Corte. Sua função era: ${target[0].role}.`)
        playDramaticDeathMusic();
    }
    const finalizeReadings = () => {
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'false' })
        setIs2ModalOpen(false)
        const cultLeader = alivePlayers.filter(player => player.filliation === 'cult');
        const cultFollowers = alivePlayers.filter(player => player.cultChoice === true);
        if (cultLeader.length > 0 && cultFollowers.length > 3) {
            stopDayMusic();
            playOcultistVictoryEffect();
            setOpenOcultistModal(true)
        }

        const filteredAnnouncements = announcements.filter(announcement => announcement.killedPlayerRole === 'ocultista');

        if (filteredAnnouncements.length > 0 && cultFollowers.length > 0) {
            setJudgeCultFollowers(true);
            stopDayMusic();
            updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "cultKilling" })
        }
    }
    const judgeTheCultFollowers = () => {
        const positiveVotes = 0 + allCultAcusationsKillingVotes.filter((acusation) => acusation.vote === 'culpado').map((acuse) => acuse.value).reduce(function (a,b) { return a + b }, 0)
        const negativeVotes = 0 + allCultAcusationsKillingVotes.filter((acusation) => acusation.vote === 'inocente').map((acuse) => acuse.value).reduce(function (a, b) { return a + b }, 0)
        const allCultFollowers = alivePlayers.filter(player => player.cultChoice === true);
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "dia" })
        if (positiveVotes > negativeVotes) {
            setJudgeCultResponse(`Os jogadores ${allCultFollowers.map((pl) => `${pl.playerName} com a função de ${pl.role}`).join(", ")} não foram perdoados e agora vão queimar com seu lider`)
            console.log(allCultFollowers)
            setJudgeCultResultModal(true)
            for (let i = 0; i < allCultFollowers.length; i++){
                updateDoc(doc(database, "playeradmin", "players", user.email, allCultFollowers[i].id), { life: "dead", cultChoice: false })
            }
            // KILL THE CULT FOLLOWERS
        } else {
            setJudgeCultResponse(`Os jogadores ${allCultFollowers.map(pl => (pl.playerName))}  foram perdoados e agora vão continuar na nossa cidade devido a bondade de todos.`)
            setJudgeCultResultModal(true)
            for (let i = 0; i < allCultFollowers.length; i++){
                updateDoc(doc(database, "playeradmin", "players", user.email, allCultFollowers[i].id), {cultChoice: false })
            }

            // dont kill the cult followers
        }
        playDayMusic()
        for (let i = 0; i < allCultAcusationsKillingVotes.length; i++){
            const theRef = doc(database, `playeradmin/judgementAction/judgementCultKillingAction`, allCultAcusationsKillingVotes[i].id)
            deleteDoc(theRef)
        }
        setJudgeCultFollowers(false)
    }

    const startPrefeitoJudgement = () => {
        setPrefeitoPanelisOpen(true);
        setJudgementPanelIsOpen(false);
    }
    const startJudgementAcusationPeriod = () => {
        playHandBellSoundEffect();
        setJudmentCounter(120);
        setJudgementvoting(true);
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "judgementVoting" })
        updateDoc(doc(database, "playeradmin", "counters", "counters", "judgementCounter"), { counter: 60})
    }
    const endJudgementAcusationPeriod = () => {
        setJudgementvoting(false)
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "dia" })
        for (let i = 0; i < allAcusations.length; i++){
            const theRef = doc(database, `playeradmin/judgementAction/judgementAcusations`, allAcusations[i].id)
            deleteDoc(theRef)
        }
        updateDoc(doc(database, "playeradmin", "counters", "counters", "judgementCounter"), { counter: 0})
    }
    return (
        <div className="day">

            <h3 className="page-title">
                Dia {currentDay}
            </h3>

            <div className="dayMain">
                <Popup open={isOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Para iniciar o dia, clique abaixo! </div>
                    <div className="content">

                        <button className="button" onClick={currentDay === 1 ? dayPrompt : dayPrompt2}>Iniciar Dia</button>
                        <div className="contentRead">

                        </div>
                    </div>
                    </div>
                </Popup>
                <Popup open={is2ModalOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Leia os Acontecimentos e siga a ordem! </div>
                        <div className="contentRead">
                            {announcements.length > 0 ? (
                                <span className="modalNotifier fade-in-text1">
                                    <h4 className="notifier-title">Mortes esta noite:</h4>
                                    {announcements.map((announcement) => (
                                        <span key={announcement.key} className="announcePlace">
                                            <p className="announcePlace-announce"> O Jogador: {announcement.killedPlayer} morreu</p>
                                            <p className="announcePlace-function"> Sua Função era: {announcement.killedPlayerRole}</p>
                                            <p className="announcePlace-killer"> Quem o Matou: {announcement.attackerRole}</p>
                                        </span>
                                    ))}
                                    </span>
                            ) : (
                                    <span className="modalNotifier fade-in-text1">
                                        <h4 className="notifier-title">Mortes esta noite:</h4>
                                        <p>Não houve mortes essa noite</p>   

                                    </span>
                            )}
                                <span className="modalNotifier fade-in-text2 ">
                                <h4 className="notifier-title ">Efeitos Públicos:</h4>
                                {alivePlayers.filter((player) => player.clownBomb === true).map(player => (
                                    <span className="statusPlace statusPlaceModal">
                                                <p className="statusPlace-player">{player.playerName}</p>
                                                <p className="statusPlace-estado">tem </p>
                                                <p className="statusPlace-evento">uma bomba!</p>
                                                <button className="smallButton" id="innerbomb" onClick={explodeBomb}><img src={bombSvg}></img></button>
                                    </span>
                                ))}
                                {alivePlayers.filter(player => player.debuff !== '').map(player => (
                            <p>{player.playerName} está Chantageado!</p>
                        ))}
                                {alivePlayers.filter(player => player.buff !== '').map(player => (
                            <p>{player.playerName} está Motivado!</p>
                                ))}
                                
                                <span>
                                    {updatePanelInfo}
                                </span>
                                </span>
                            <button className="button" onClick={() => finalizeReadings()}>Finalizar</button>
                    </div>    
                </div>
                </Popup>
                <div className="event-ocurrence event">
                        <h4>
                        Acontecimentos
                        </h4>
                    <div className="large-container card-border scrollable">
                        {announcements.map((announcement) => (
                            <span key={announcement.key} className="announcePlace">
                                <p className="announcePlace-announce"> {announcement.killedPlayer} morreu</p>
                                 <p className="announcePlace-function"> Função: {announcement.killedPlayerRole}</p>
                                <p className="announcePlace-killer"> Ataque: {announcement.attackerRole}</p>
                            </span>
                        ))}
                        {alivePlayers.filter(player => player.debuff !== '').map(player => (
                            <p>{player.playerName} está Chantageado!</p>
                        ))}
                        {alivePlayers.filter(player => player.buff !== '').map(player => (
                            <p>{player.playerName} está Motivado!</p>
                        ))}
                        </div>
                </div>
                <div className="event-hiddenocurrence event">
                        <h4>
                        Visitas que ocorreram
                        </h4>
                    <div className="card-border scrollable event-hiddenocurrence-inner">
                        {visitAction.map((visit) => (
                            <span className="visitPlace" key={visit.key}>
                            <p className="visitPlace-visitee">{visit.visitor}</p>
                            <p>V</p>
                            <p className="visitPlace-visited">{visit.visited}</p>
                            </span>
                    ))}    
                    </div>
                </div>
                <div className="event-status event">
                        <h4>
                        Informações Secretas
                        </h4>
                    <div className="large-container card-border scrollable">
                        {alivePlayers.filter((player) => player.pistoleiroMark === true).map((player) => (
                            <span className="statusAflictions">
                                <p className="statusAfliction-player">{player.playerName}</p>
                                <p className="statusAfliction-estado">está</p>
                                <p className="statusAfliction-evento">Marcado... </p>
                                <button className="miniButton trigger" onClick={explodeMark}><img src={bulletSvg} alt="bullet" /></button>
                            </span>
                    ))}
                        {alivePlayers.filter((player) => player.executorTarget === true).map((player) => (
                            <span className="statusAflictions">
                                <p className="statusAfliction-player">{player.playerName}</p>
                                <p className="statusAfliction-estado">é o alvo do</p>
                                <p className="statusAfliction-evento">Executor</p>
                            </span>
                        ))}
                        {alivePlayers.filter((player) => player.cultChoice === true).map((player) => (
                            <span className="statusAflictions">
                                    <p className="statusAfliction-player">{player.playerName}</p>
                                    <p className="statusAfliction-estado">faz parte do</p>
                                    <p className="statusAfliction-evento">Culto</p>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="event-aliveplayers event">
                    <div className="alivePlayersTitle">
                        <h4>
                        Jogadores Vivos
                    </h4>
                           
                        <div className="counterBox townies"> {alivePlayers.filter((player) => player.filliation === "town").length}</div>
                    <div className="counterBox mafiaies"> {alivePlayers.filter((player) => player.filliation === "the family").length}</div>
                    <div className="counterBox covenies"> {alivePlayers.filter((player) => player.filliation === "coven").length}</div>
                    <div className="counterBox neutraies" > {alivePlayers.filter((player) => player.filliation === "neutral").length}</div>
                    <div className="counterBox horsies" > {alivePlayers.filter((player) => player.filliation === "horsemen").length}</div>
                    <div className="counterBox cultisties" > {alivePlayers.filter((player) => player.filliation === "cult").length}</div>
                    </div> 
                    <div className="large-container card-border scrollable">
                        {alivePlayers.map((player => (
                            <span className="alivePlayersConfig" key={player.key}>
                                {player.playerName} - {player.filliation === 'town' && <p className="townies">{player.role} </p>} {player.role === 'martir' && <button className="miniButton trigger" onClick={revivePopup}><img src={wingSvg} alt="Wings" /></button>}
                                {player.filliation === 'the family' && <p className="mafiaies">{player.role} </p>}
                                {player.filliation === 'coven' && <p className="covenies">{player.role}</p>}
                                {player.filliation === 'neutral' && <p className="neutraies">{player.role}</p>}
                                {player.filliation === 'horsemen' && <p className="horsies">{player.role}</p>}
                                {player.filliation === 'cult' && <p className="cultisties">{player.role}</p>}
                            </span>
                        )))}
                        </div>
                </div>
                <div className="event-death event">
                        <h4>
                        Jogadores Mortos
                        </h4>
                    <div className="large-container card-border scrollable">
                        {deadPlayers.map((player) => (
                            <span className="alivePlayersConfig" key={player.key + '3'}>
                                {player.playerName} -
                                {player.filliation === 'town' && <p className="townies">{player.role} </p>}
                                {player.filliation === 'the family' && <p className="mafiaies">{player.role}</p>}
                                {player.filliation === 'coven' && <p className="covenies">{player.role}</p>}
                                {player.filliation === 'horsemen' && <p className="horsies">{player.role}</p>}
                                {player.filliation === 'neutral' && <p className="neutraies">{player.role}</p>}
                                {player.filliation === 'cult' && <p className="cultisties">{player.role}</p>}
                            </span>
                                    ))}
                    </div>
                </div>
                <div className="event-killplayer event">
                    <div className="event-killplayer-inner">
                        <button type="button" onClick={startJudgementAcusationPeriod} className="button">Liberar Votação de Julgamento</button>
                        <button type="button" onClick={startNight} className="button">Começar Noite</button>
                        <button className="button" onClick={adminPanel}>Administrativo</button>

                    </div>

                </div>                   
            </div>
            <div className="upper-page-area">
            </div>
            <Popup open={judgementvoting} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">
                        Votos para julgamento
                    </div>
                    <div className="content judgementBox">
                        {alivePlayers.map((player) => (
                            <div className="voteLines">
                                <span className="counterBox">
                                { 0 + allAcusations.filter((acusation) => acusation.acused === player.id).map((particular) => particular.value).reduce( function(a,b){return a + b}, 0)}
                                </span>
                            {player.playerName}
                            </div>
                        ))}
                        
                    </div>
                    <div className="voteLines">
                        <span className="voteLines">
                        Jogadores:  <span className="counterBox">
                        {alivePlayers.length}
                        </span>
                        </span>
                        <span className="voteLines">
                        Votos Necessários:  <span className="counterBox">
                        {Math.ceil(alivePlayers.length * 0.4)}
                        </span>
                        </span>
                         
                    </div>
                    <span>Timer: {judgementCounter} segundos </span>
                    <button className="button" onClick={() => judgementStartPeriod(false)}>Iniciar Julgamento</button>
                    <button className="button" onClick={() => endJudgementAcusationPeriod()}>Encerrar Acusações</button>
                    </div>
                    
            </Popup>
            <Popup open={prefeitoPanelisOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">
                        Selecione o Alvo do Prefeito
                    </div>
                    <div className="content judgementPrefeito">
                                <select name="prefeitoChoice" id="prefeitoChoice" value={prefeitoChoice} onChange={(e) => setPrefeitoChoice(e.target.value)}>
                                    {alivePlayers.map((player) => (
                                        <option value={player.id}>{player.playerName}</option>
                                    ))}
                                </select>
    
                        
                    </div>
                    <span>Timer: {judgementCounter} segundos </span>
                    <button className="button" onClick={() => judgementStartPeriod(true)}>Iniciar Julgamento</button>
                    </div>
                    
            </Popup>
            <Popup open={adminPanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Painel Administrativo, Use apenas para EMERGENCIAS </div>
                    <div className="content">
                    <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                        <button className="button" onClick={killPlayer}>Matar o Jogador</button>
                        <hr />
                    <button className="button" onClick={explodeMark}>Atirar na Marca</button>
                    <button className="button" onClick={explodeBomb}>Bomba do Palhaço</button>  
                    <button className="button" onClick={endGameCompletely}>Encerrar Jogo</button>
                    <button className="button" onClick={() => { setAdminPanelIsOpen(false) }}>Fechar Painel</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={plaguePanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Peste morreu no julgamento, mate dois jogadores </div>
                    <div className="content">
                    <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled hidden></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                    <select name="playerName2" id="playerName2" value={playerKilling2} onChange={(e) => setPlayerKilling2(e.target.value)}>
                            <option value="" defaultValue disabled hidden></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                    <button className="button" onClick={plagueMurder}>Matar os jogadores</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={jesterPanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">O Bobo da Corte morreu! Mate 1 jogador </div>
                    <div className="content">
                    <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled></option>
                            {alivePlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                    <button className="button" onClick={jesterMurder}>Matar os jogadores</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={isReviveModalOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">O Mártir está se sacrificando por um jogador. Seleciona alguém morto: </div>
                    <div className="content">
                    <select name="playerName" id="playerName" value={playerKilling} onChange={(e) => setPlayerKilling(e.target.value)}>
                            <option value="" defaultValue disabled></option>
                            {deadPlayers.map(player => (
                                <option key={player.key}>{player.playerName}</option>
                            ))}
                        </select>
                    <button className="button" onClick={revivePlayer}>Reviver Jogador</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={killPanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Anúncio de Morte </div>
                    <div className="contentDeathAnouncement">
                        <span>{killAnouncementUpdate}</span>
                    <button className="button" onClick={() => setKillPanelIsOpen(false)}>Ok!</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={apocalipsePanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Vitória dos Cavaleiros do Apocalipse </div>
                    <div className="contentDeathAnouncement">
                    <button className="button" onClick={endGameCompletely}>Encerrar Jogo</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={openOcultistModal} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Vitória do Ocultista e seus seguidores </div>
                    <div className="contentDeathAnouncement">
                        O Ocultista {alivePlayers.filter(player => player.filliation === 'cult').map(pl => (pl.playerName))} iniciou o ritual de Invocação junto com seus seguidores: {alivePlayers.filter(player => player.cultChoice === true).map(pl => (<p key={pl.id}>{pl.playerName}</p> ))} Após se sacrificarem, foi invocado algo do além que os humanos não conseguiram conter, com isso o Fim da Humanidade.
                    <button className="button" onClick={endGameCompletely}>Encerrar Jogo</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={judgeCultFollowers} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">O Ocultista morreu. Julgaremos seus seguidores </div>
                    <div className="contentDeathAnouncement">
                        O Ocultista {deadPlayers.filter(player => player.filliation === 'cult').map(pl => (pl.playerName))} morreu essa noite. Seus seguidores: {alivePlayers.filter(player => player.cultChoice === true).map(pl => (<p key={pl.id}>{pl.playerName}</p>))} estão agora sem um lider e gostariam do perdão da cidade para que eles possam se livrar desse peso.
                        Votem para mata-los ou salva-los.
                        <span>
                                Votos positivos:
                                    {0 + allCultAcusationsKillingVotes.filter((acusation) => acusation.vote === 'inocente').map((acuse) => acuse.value).reduce(function (a,b) { return a + b }, 0)}
                        </span>
                        <span>
                                Votos Negativos: {0 + allCultAcusationsKillingVotes.filter((acusation) => acusation.vote === 'culpado').map((acuse) => acuse.value).reduce(function (a,b) { return a + b }, 0)}
                        </span>
                    <button className="button" onClick={judgeTheCultFollowers}>Julgar</button>
                        
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={judgeCultResultModal} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Resultado:</div>
                    <div className="contentDeathAnouncement">
                    {judgeCultResponse}
                    <button className="button" onClick={() => setJudgeCultResultModal(false)}>Fechar</button>
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={judgementPanelIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">Painel de Julgamento</div>
                    <div className="content modalNotifier modalkill">
                        <p>Jogador Acusado: {judgementTarget?.targetName} </p>
                        <p>Com um total de {judgementTarget?.votes} votos</p>
                        <div className="voteCountMain">
                        
                        <div className="voteCountCard">
                                <span>Inocente</span>
                                <span className="counterBox">
                                    {0 + allAcusationsKillingVotes.filter((acusation) => acusation.vote === 'inocente').map((acuse) => acuse.value).reduce(function (a,b) { return a + b }, 0)}
                            </span>
                        </div>
                        <div className="voteCountCard">
                                <span>Abster</span>
                                <span className="counterBox">
                                    {0 + allAcusationsKillingVotes.filter((acusation) => acusation.vote === 'abster').map((acuse) => acuse.value).reduce(function (a,b) { return a + b }, 0)}
                            </span>
                        </div>
                        <div className="voteCountCard">

                            <span>Culpado</span>
                                <span className="counterBox">
                                    {0 + allAcusationsKillingVotes.filter((acusation) => acusation.vote === 'culpado').map((acuse) => acuse.value).reduce(function (a,b) { return a + b }, 0)}
                                </span>
                            
                            </div>
                        </div>
                        <button className="button" onClick={playerjudgementAction}>Confirmar Votos</button>
                        <button className="button" onClick={savePlayer}>Cancelar Votação</button>
                        <button className="button" onClick={startPrefeitoJudgement}>Cancelamento do Prefeito</button>
                    </div>
                    </div>
                    
            </Popup>
            <Popup open={notifierNewsIsOpen} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                    <div className="header">{notifierNews}</div>
                    <div className="content">
                    <button className="button" onClick={() => setNotifierNewsIsOpen(false)}>Okay</button>
                        
                    </div>
                    </div>
                    
            </Popup>
        </div>
    )
}

export default Day;