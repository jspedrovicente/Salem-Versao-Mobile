import {doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "./night.css"
import useSound from "use-sound";
import grimorioEffect from "../../assets/coven-grimorio-presente.mp3"
import werewolfPresentEffect from "../../assets/werewolf-present-soundeffect.mp3"
import nightmusic from "../../assets/nightsounds/nightmusic/nightMusic.mp3"

// SET THE Function wakeup ORDER IN FIREBASE FOR EACH CHARACTER, REMEMBER MERETRIZ IS FIRST IF THE EXECUTOR HAS ALREADY MADE HIS DECISION
const Night = () => {
    // SoundEffects for all the characters;
    const [playNightSound, { stop: stopNightSound }] = useSound(nightmusic, {volume: 0.90});
    const [playGrimorioSound] = useSound(grimorioEffect);
    const [playWerewolfPresentSound] = useSound(werewolfPresentEffect);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [isOpen, setIsOpen] = useState(true);
    const [user, setUser] = useState([]);
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);
    const [townRole, setTownRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [cultRole, setCultRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const navigateToMorning = useNavigate();
    const [allMessages, setAllMessages] = useState([]);
    const [hiddenEvilChat, setHiddenEvilChat] = useState([]);
    // Night Manipulation
    const [currentDay, setCurrentDay] = useState(1);
    const [notifierModalContent, setNotifierModalContent] = useState('');
    const [flageloCounter, setFlageloCounter] = useState(0);
    const [viuvaTarget, setViuvaTarget] = useState('');
    const [viuvaCount, setViuvaCount] = useState(99);
    const [nightTimerCounter, setNightTimerCounter] = useState(0);
    const [invocadoraCounter, setInvocadoraCounter] = useState([]);
    const [bloodmoonCount, setBloodmoonCount] = useState(99);
    const [isNotifierModal, setIsNotifierModal] = useState(false);
    const [isCovenWinning, setIsCovenWinning] = useState(false);
    // Night actions that transfers to morning

    // Information that is transfered solo
    const [mobilePlayerActionsSingle, setMobilePlayerActionsSingle] = useState([])
    // Night actions that do not transfer
    const [currentDayTemp, setCurrentDayTemp] = useState([]);


    useEffect(() => {
        const timer2 =  nightTimerCounter > 0 && setInterval(() => setNightTimerCounter(nightTimerCounter - 1), 1000)
        return () => clearInterval(timer2);

    }, [nightTimerCounter])

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
                            characterPoints: doc.data().characterPoints,
                            specialPoints: doc.data().specialPoints,
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
                            zeladorClear: doc.data().zeladorClear,
                            roleType: doc.data().roleType,
                            potionTime: doc.data().potionTime,
                            poisoned: doc.data().poisoned,
                            enchant: doc.data().enchant,
                            intoxicated: doc.data().intoxicated
                        })
                    }
                })
                setPlayers(list);
                setAlivePlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("alive")))
                setDeadPlayers(list.sort((a, b) => a.wakeOrder - b.wakeOrder).filter(player => player.life.includes("dead")))
            })

            const dayCounterSnapshot = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/dayCounter/dayCounter`), (snapshot) => {
                let currentDay = [];
                snapshot.forEach((doc) => {
                    currentDay.push({ currentDay: doc.data().currentDay })
                })
                setCurrentDayTemp(currentDay)

            })

            const characterSpecialCounters = onSnapshot(collection(database, `playeradmin/counters/counters`), (snapshot) => {
                let counter = [];
                let blood = [];
                let viuva = [];
                let viuvaTarget = '';
                let inv = [];
                snapshot.forEach((doc) => {
                    if (doc.id === 'flageloCounter') {
                        counter.push({ counter: doc.data().counter })
                    }
                    if (doc.id === 'covenBloodmoonCounter') {
                        blood.push({counter: doc.data().counter})
                    }
                    if (doc.id === 'viuvaCounter') {
                        viuva.push({ counter: doc.data().counter })
                        viuvaTarget = doc.data().viuvaTarget
                    }
                    if (doc.id === 'invocadoraCounter') {
                        inv.push({ counter: doc.data().counter, golemTarget: doc.data().golemTarget })
                    }
                })
                setFlageloCounter(counter[0].counter)
                setBloodmoonCount(blood[0].counter)
                setViuvaCount(viuva[0].counter)
                setViuvaTarget(viuvaTarget)
                setInvocadoraCounter(inv)

            })
        }
        loadPlayers();
    }, [user.email]);

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
                    category: doc.data().category,
                    roleType: doc.data().roleType
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
                    category: doc.data().category,
                    roleType: doc.data().roleType
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
                    category: doc.data().category,
                    roleType: doc.data().roleType
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
                    category: doc.data().category,
                    roleType: doc.data().roleType

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
                    category: doc.data().category,
                    roleType: doc.data().roleType

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
                    category: doc.data().category,
                    roleType: doc.data().roleType

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
        const loadRememberedData = () => {
            const snapshots = onSnapshot(collection(database, `playeradmin/playerStatuses/${user.email}/mobilePlayerActions/mobilePlayerActionsSingle`), (snapshot) => {
                let actionForThis = []
                snapshot.forEach((doc) => {
                    actionForThis.push({
                    id: doc.id,
                    user: doc.data().user,
                    userID: doc.data().userID,
                    userRole: doc.data().userRole,
                    target: doc.data().target,
                    targetRole: doc.data().targetRole,
                    wakeOrder: doc.data().wakeOrder,
                    targetId: doc.data().targetId
                })
                    setMobilePlayerActionsSingle(actionForThis);
            })
            })
        }
        loadRememberedData();
    }, [user.email])

    useEffect(() => {
        const mesagesSnapshot = onSnapshot(collection(database, `playeradmin/chatsLog/jspedrogarcia@gmail.com`),
        (snapshot) => {
            let currentMessages = [];
            snapshot.forEach((doc) => {
                currentMessages.push({id: doc.id, autor: doc.data().autor, message: doc.data().mensagem, horario: doc.data().horario})
            })
            const sortedMessages = currentMessages.sort((a, b) => a.horario - b.horario)
            setAllMessages(sortedMessages)
        })
    const familyMessageSnapshot = onSnapshot(collection(database, `playeradmin/familyChatLog/jspedrogarcia@gmail.com`),
        (snapshot) => {
            let currentMessages = [];
            snapshot.forEach((doc) => {
                currentMessages.push({id: doc.id, autor: doc.data().autor, message: doc.data().mensagem, horario: doc.data().horario})
            })
            const sortedMessages = currentMessages.sort((a, b) => a.horario - b.horario)
            setHiddenEvilChat(sortedMessages)
        })
    }, [])
    const interruptMusicPlaying = () => {
        stopNightSound();
    }
    const encerrarNoiteMobile = async () => {
        interruptMusicPlaying();
        let rolesImunetoBlocks = ['meretriz', 'taberneiro', 'miragem', 'executor', 'caloteira'];
        let rolesThatAttackBlockers = ['assassino em serie', 'mestre', 'lobisomen', 'morte', 'vigilante'];
        let rolesImunetoAttacks = ['piromaniaco', 'assassino em serie', 'sobrevivente', 'morte']
        let consideredEvilRoles = ['fome', 'guerra', 'morte', 'estranho', 'amaldicoadora', 'feiticeira benevolente', 'parasita', 'matriarca', 'mestre', 'mordomo', 'zelador', 'caloteira', 'piromaniaco', 'assassino em serie', 'bobo da corte', 'executor', 'lobisomen', 'medico da peste', 'palhaco', 'pistoleiro', 'ocultista', 'xerife corrupto', 'alquimista', 'clarividencia', 'encantadora', 'invocadora', 'errante', 'gritante', 'golem', 'ventriloquista', 'flagelo'  ]
        let blockedTargets = [];
        let attackingAction = [];
        let visitsThatOccured = [];
        let attackingActionSpecial = [];
        let healedTargets = [];
        let protectedTargets = [];
        let zeladorTarget = false;
        let fakeSuspect = [];
        let agressiveToVisits = [];
        var murderedPlayers = []
        let tabernTarget = []
        let caloteiraTarget = '';
        let golemTransformation = '';
        let newIntoxication = '';
        let voodooDoll = '';
        updateDoc(doc(database, "playeradmin", "blackout", user.email, 'blackout'), { blackout: 'true' })
        let Sactions = mobilePlayerActionsSingle.sort((a, b) => a.wakeOrder - b.wakeOrder);
        // variables for temporary aflictions
        if (currentDayTemp[0].currentDay % 2 === 0) {
            const lobisomenPerson = alivePlayers.filter((player) => player.role === 'lobisomen');
            if (lobisomenPerson.length > 0) {
                agressiveToVisits.push(lobisomenPerson[0].playerName);
            }
            rolesImunetoBlocks.push('lobisomen');
            rolesImunetoAttacks.push('lobisomen');
        }
        const allAliveWitches = alivePlayers.filter((player) => player.filliation === 'coven');
        if (allAliveWitches.length === 1 && bloodmoonCount === 1) {
            headToDayAndWinningCoven()
            return
        }
        // First FOR to run through for blocks
        for (let i = 0; i < Sactions.length; i++) {
            if (Sactions[i].userRole === 'meretriz' || Sactions[i].userRole === 'taberneiro' || Sactions[i].userRole === 'fome') {
                if (rolesImunetoBlocks.includes(Sactions[i].targetRole)) {
                    // in this case nothing happens
                    // If the person thats getting blocked is imune, nothing happens
                } else {
                    // if theyre not imune, they get blocked
                    blockedTargets.push(Sactions[i].target)
                    if (Sactions[i].userRole === 'taberneiro') {
                        if (rolesThatAttackBlockers.includes(Sactions[i].targetRole)) {
                            // if the person that got blocked is a role that attacks, then push into attackingAction the info
                            attackingAction.push({ attacker: Sactions[i].target, attackerRole: Sactions[i].targetRole, target: Sactions[i].user, targetRole: Sactions[i].userRole})
                            }
                        tabernTarget.push(Sactions[i].target);
                    }
                }
                
                // if (rolesThatAttackBlockers.includes(Sactions[i].targetRole)) {
                // // if the person that got blocked is a role that attacks, then push into attackingAction the info
                // attackingAction.push({ attacker: Sactions[i].target, attackerRole: Sactions[i].targetRole, target: Sactions[i].user, targetRole: Sactions[i].userRole})
                // }
            }
        }
        // For that loops through everyone and declares visits
        for (let i = 0; i < Sactions.length; i++) {
            // Loop for visits]
            if (blockedTargets.includes(Sactions[i].user)) {
            } else if (Sactions[i].user === Sactions[i].target) {
                // In case of veteran and zelador and all of that lol (all the classes that target themselves)
            } else if (tabernTarget.includes(Sactions[i].target) && Sactions[i].userRole !== 'taberneiro') {
                // This visit will not happen at all
            }
                else {
                    visitsThatOccured.push({ visitor: Sactions[i].user, visited: Sactions[i].target });
                }
        }


        // FOR that runs through everyone else
        for (let i = 0; i < Sactions.length; i++) {
            const ref = doc(database, "playeradmin", "players", user.email, Sactions[i].userID)
            // Checks if the target is blocked, case they are, responds to block and skips their continuation
            if (blockedTargets.includes(Sactions[i].user)) {
                updateDoc((ref), { newResponse: 'Você foi Bloqueado essa noite!' })
            } else if (tabernTarget.includes(Sactions[i].target) && Sactions[i].userRole !== 'taberneiro') {
                // Nothing should happen.
            }
            else {
                // Now the switch case for all the actions
                switch (Sactions[i].userRole) {
                    case 'investigador':
                        let determinedRole = allRoles.filter(role => role.role === Sactions[i].targetRole);
                        let allRoleofCategory = allRoles.filter(role => role.category === determinedRole[0].category);
                        updateDoc((ref), {
                            newResponse: `O jogador ${Sactions[i].target} está no segmento ${determinedRole[0].category}: Ele pode ser ${allRoleofCategory.map((role) => role.role)}` })
                        break;
                    case 'xerife':
                        if (consideredEvilRoles.includes(Sactions[i].targetRole) || fakeSuspect.includes(Sactions[i].target)) {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} é suspeito!` })
                        }else {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} NÃO é suspeito!` })
                        }
                        break;
                    case 'xerife corrupto':
                        if (consideredEvilRoles.includes(Sactions[i].targetRole) || fakeSuspect.includes(Sactions[i].target)) {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} é suspeito!` })
                        }else {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} NÃO é suspeito!` })
                        }
                        break;
                    case 'espiao':
                        const possibleVisits = visitsThatOccured.filter((visit) => visit.visitor === Sactions[i].target);
                        let actualVisitors = []
                        for (let i = 0; i < possibleVisits.length; i++) {
                            actualVisitors.push(possibleVisits[i].visited)
                        }
                        if (actualVisitors.length > 0) {
                            updateDoc((ref), { newResponse: `Seu alvo: (${Sactions[i].target}) visitou: ${actualVisitors.map((visitor) => visitor)} ` });
                        } else {
                            updateDoc((ref), { newResponse: `Seu alvo não visitou ninguém!` });
                        }
                        break;
                    case 'fuxiqueira':
                        let possibleVisitors = visitsThatOccured.filter((visit) => visit.visited === Sactions[i].target);
                        let ocurrences = [];
                        for (let index = 0; index < possibleVisitors.length; index++) {
                            if (possibleVisitors[index].visitor === Sactions[i].user) {
                            } else {
                              ocurrences.push(possibleVisitors[index].visitor)
                            }

                        }
                        if (ocurrences.length > 0) {
                            updateDoc((ref), { newResponse: `Os jogadores ${ocurrences.map((trigger) => trigger)} visitaram seu alvo: ${Sactions[i].target}` });
                        } else {
                            updateDoc((ref), { newResponse: `Ninguém visitou sem alvo essa noite` });
                        }
                        break; 
                    case 'gritante':
                        const peopleWhoVisitedMe = visitsThatOccured.filter((visit) => visit.visited === Sactions[i].user);
                        const gritanteDB = collection(database, `playeradmin/playerStatuses/${user.email}/gritanteShriek/gritanteShriek`)
                        for (let index = 0; index < peopleWhoVisitedMe.length; index++) {
                            await addDoc(gritanteDB, {
                                visitor: peopleWhoVisitedMe[index].visitor
                            })
                            const theVisitorInfo = alivePlayers.filter((player) => player.playerName === peopleWhoVisitedMe[index].visitor);
                        updateDoc((doc(database, "playeradmin", "players", user.email, theVisitorInfo[0].id)), { debuff: 'Silenciado, não pode conversar durante esse dia!' });

                        }
                        break; 
                    case 'armadilheiro':
                        let peopleThatLeftTheirHome = visitsThatOccured.filter((visit) => visit.visitor === Sactions[i].target);
                        if (peopleThatLeftTheirHome.length > 0) {
                            updateDoc((ref), { newResponse: `Seu alvo visitou alguém essa noite.` });
                        } else {
                            updateDoc((ref), { newResponse: `Seu alvo não saiu de casa essa noite.` });
                        }
                        break;                  
                    case 'curandeira':
                        healedTargets.push(Sactions[i].target);
                        break;                  
                    case 'padeira':
                        healedTargets.push(Sactions[i].target);
                        break;
                    case 'guardiao':
                        protectedTargets.push(Sactions[i].target);
                        break;
                    case 'bardo':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { buff: 'Você está Motivado! Seu voto em qualquer votação está dobrado!' });
                        break;
                    case 'veterano':
                        agressiveToVisits.push(Sactions[i].user);
                        rolesImunetoAttacks.push('veterano');
                        break;
                    case 'vigilante':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'medium':
                        // Nothing needs to be registered
                        break;
                    case 'ferreiro':
                        break;
                    case 'assassino em serie':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'executor':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { executorTarget: true });
                        break;
                    case 'viuva':
                        if (viuvaCount === 99) {
                            updateDoc((doc(database, "playeradmin", "counters", "counters", "viuvaCounter")), { counter: 2, viuvaTarget: Sactions[i].targetId });
                            updateDoc((ref), { newResponse: `Você está de LUTO e falta 3 noites para reviver seu alvo.` })

                        }
                        if (viuvaCount === 2 || viuvaCount === 1) {
                            updateDoc((ref), { newResponse: `Você está de LUTO e falta ${viuvaCount} noite(s) para reviver seu alvo.` })
                            updateDoc((doc(database, "playeradmin", "counters", "counters", "viuvaCounter")), { counter: viuvaCount - 1});
                        }
                        if (viuvaCount === 0) {
                            updateDoc((ref), { newResponse: `Você encerrou seu LUTO e seu alvo voltou para o jogo!` })

                            await updateDoc((doc(database, "playeradmin", "players", user.email, viuvaTarget)), { life: "alive" });
                            const chosenPlayer = players.filter((player) => player.id === viuvaTarget)
                            const viuvaDB = collection(database, `playeradmin/playerStatuses/${user.email}/viuvaAnnouncement/viuvaAnnouncement`)
                            await addDoc(viuvaDB, {
                                target: chosenPlayer[0].playerName
                            })
                            updateDoc((doc(database, "playeradmin", "counters", "counters", "viuvaCounter")), { counter: 99, viuvaTarget: "" });
                            
                        }
                        break;
                    case 'lobisomen':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'medico da peste':
                        healedTargets.push(Sactions[i].target);
                        break;
                    case 'palhaco':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { clownBomb: true });
                        break;
                    case 'alquimista':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { potionTime: true });
                        break;
                    case 'invocadora':
                        if (invocadoraCounter[0]?.counter === 0) {
                            const chosenTargetRoleType = allRoles.filter((role) => role.roleType === 'agressão')
                            let roleNames = []
                            for (let i = 0; i < chosenTargetRoleType.length; i++){
                                roleNames.push(chosenTargetRoleType[i].role)
                                updateDoc((ref), { newResponse: "Sua transformação foi feita com sucesso, o novo golem não sabe quem são as bruxas." })

                            }
                            if (roleNames.includes(Sactions[i].targetRole)) {
                                updateDoc((ref), { newResponse: "Sua transformação NÃO foi bem sucedida, talvez esse jogador é de Agressão..." })
                                
                            } else {
                                golemTransformation = Sactions[i].targetId
                            }
                        } else {
                            updateDoc((ref), { newResponse: "Você tem um Golem vivo no jogo ainda, não conseguiu transformar outro jogador no Golem" })
                            
                        }
                        break;
                    case 'clarividencia':
                        if (Sactions[i].targetRole === 'miragem') {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função meretriz` })
                        } else if (Sactions[i].targetRole === 'peste') {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função morte` })
                        } else {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função ${Sactions[i].targetRole}` })
                        }
                        break;
                    case 'encantadora':
                        const player = alivePlayers.filter((player) => player.id === Sactions[i].targetId);

                        if (player[0]?.enchant === true) {
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        } else {
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { enchant: true });
                        }
                        break;
                    case 'ventriloquista':
                        voodooDoll = Sactions[i].targetId
                        break;
                    case 'golem':
                        const chosenPlayer = alivePlayers.filter((player) => player.playerName === Sactions[i].target);
                        if (chosenPlayer[0]?.filliation === 'coven') {
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].user, targetRole: Sactions[i].userRole })
                        } else {
                            attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        }
                        break;
                    case 'pistoleiro':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { pistoleiroMark: true });
                        break;
                    case 'piromaniaco':
                        if (Sactions[i].user === Sactions[i].target) {
                            const dousedPlayers = alivePlayers.filter((player) => player.doused === true);
                            for (let j = 0; j < dousedPlayers.length; j++){
                                // Set as an attacking action?
                                attackingActionSpecial.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: dousedPlayers[j].playerName, targetRole: dousedPlayers[j].role })
                                updateDoc((doc(database, "playeradmin", "players", user.email, dousedPlayers[j].id)), { doused: false });
                                
                            }
                        } else {
                            updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { doused: true });
                        }
                        break;
                    case 'mestre':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'matriarca':
                        if (Sactions[i].targetRole === 'miragem') {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função meretriz` })
                        } else if (Sactions[i].targetRole === 'peste') {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função morte` })
                        } else {
                            updateDoc((ref), { newResponse: `O jogador ${Sactions[i].target} tem a função ${Sactions[i].targetRole}` })
                        }
                        break;
                    case 'mordomo':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { debuff: 'Chantageado, não pode conversar durante esse dia!' });
                        break;
                    case 'zelador':
                        zeladorTarget = true;
                        break;
                    case 'caloteira':
                        caloteiraTarget = Sactions[i].target;
                        break;
                    case 'morte':
                        attackingAction.push({ attacker: Sactions[i].user, attackerRole: Sactions[i].userRole, target: Sactions[i].target, targetRole: Sactions[i].targetRole })
                        break;
                    case 'guerra':
                        break;
                    case 'ocultista':
                        updateDoc((doc(database, "playeradmin", "players", user.email, Sactions[i].targetId)), { cultChoice: true });
                        break;
                    case 'cartomante':
                        if (alivePlayers.length > 5) {
                            let result = []
                            const townies = [...alivePlayers.filter((player) => player.filliation === 'town')]
                            const randomIndex = Math.floor(Math.random() * townies.length);
                            const randomItem = townies[randomIndex];
                            townies.splice(randomIndex, 1)
                            const randomindex2 = Math.floor(Math.random() * townies.length);
                            const randomItem2 = townies[randomindex2]
                            const everyoneElse = alivePlayers.filter((player) => player.filliation !== 'town');
                            const randomIndex3 = Math.floor(Math.random() * everyoneElse.length)
                            const randomItem3 = everyoneElse[randomIndex3];
                            result.push(randomItem.playerName)
                            result.push(randomItem2.playerName)
                            result.push(randomItem3.playerName)
                            shuffleArray(result)
                            updateDoc((ref), {
                                newResponse: `Suas cartas responderam e você recebeu esses três nomes: ${result.map((each) => each)}, 2 são da cidade e 1 não` })
                        } else {
                            updateDoc((ref), {
                                newResponse: `Sua habilidade não funciona com menos de 6 jogadores!` })
                        }
                        break;
                    case 'flagelo':
                        newIntoxication = Sactions[i].targetId
                    case 'FILLER HERE FOR ME TO REMEMBER':
                        // Mafia is getting written together, same as coven!
                        break;
                    default:
                        break;
                    
                    
                }


            }

        }
        // Trigger the alerted players
        var playersThatVisitedAgressors = []
        for (let i = 0; i < agressiveToVisits.length; i++) {
            const result = visitsThatOccured.filter((visit) => visit.visited === agressiveToVisits[i]);
            for (let i = 0; i < result.length; i++){
                playersThatVisitedAgressors.push(result[i]);
            }
        }
        for (let i = 0; i < playersThatVisitedAgressors.length; i++) {
            const roleofWhoAttacked = alivePlayers.filter((player) => player.playerName === playersThatVisitedAgressors[i].visited);
            const roleofWhosGettingAttacked = alivePlayers.filter((player) => player.playerName === playersThatVisitedAgressors[i].visitor);
            attackingAction.push({ attacker: playersThatVisitedAgressors[i].visited, attackerRole: roleofWhoAttacked[0].role, target: playersThatVisitedAgressors[i].visitor, targetRole: roleofWhosGettingAttacked[0].role });
        }
        // ATTACK actions
        for (let i = 0; i < attackingAction.length; i++) {
            const att = attackingAction[i];
            if (att.target === caloteiraTarget) {
                murderedPlayers.push({ killedPlayerName: att.target, killedPlayerRole: att.targetRole, attackerRole: att.attackerRole, attacker: att.attacker });
            } else if (rolesImunetoAttacks.includes(att.targetRole)) {
                // Nothing happens to the person
            } else if (protectedTargets.includes(att.target)) {
                // Nothing happens
                const theGuardian = alivePlayers.filter((player) => player.role === 'guardiao');
                attackingAction.push({ attacker: theGuardian[0].playerName, attackerRole: 'guardiao', target: att.attacker, targetRole: att.attackerRole });

            } else if (healedTargets.includes(att.target)) {
                // nothing happens to the healed person
              
            } else {
                if (att.attackerRole === 'vigilante') {
                    const targetFill = alivePlayers.filter(player => player.role === att.targetRole);
                    if (targetFill[0]?.filliation === 'town') {
                        murderedPlayers.push({ killedPlayerName: att.attacker, killedPlayerRole: att.attackerRole, attackerRole: att.attackerRole, attacker: att.attacker });
                    }
                }
                console.log(att)
                console.log(voodooDoll)
                if (att.targetRole === 'ventriloquista' && voodooDoll !== '') {
                    const ventTarget = alivePlayers.filter((player) => player.id === voodooDoll)
                    console.log(ventTarget)
                    const ventriloquist = players.filter((player) => player.role === 'ventriloquista')
                    console.log(ventriloquist)

                    attackingAction.push({ attacker: ventriloquist[0].playerName, attackerRole: 'ventriloquista', target: ventTarget[0].playerName, targetRole: ventTarget[0].role });
                    
                } else {
                    // kill the player
                    murderedPlayers.push({ killedPlayerName: att.target, killedPlayerRole: att.targetRole, attackerRole: att.attackerRole, attacker: att.attacker});
                }
                console.log('we got here')
            }
        }
        // Fazer a lista de jogadores envenenados
        const poisonedPlayers = alivePlayers.filter((player) => player.poisoned === true);
        for (let i = 0; i < poisonedPlayers.length; i++){
            attackingActionSpecial.push({ attacker: '???', attackerRole: 'alquimista', target: poisonedPlayers[i].playerName, targetRole: poisonedPlayers[i].role })
            updateDoc((doc(database, "playeradmin", "players", user.email, poisonedPlayers[i].id)), { poisoned: false });
        }
        // Fazer a lista de jogadores já intoxicados
        const intoxicatedPlayers = alivePlayers.filter((player) => player.intoxicated === true);
        for (let i = 0; i < intoxicatedPlayers.length; i++){
            attackingActionSpecial.push({ attacker: '???', attackerRole: 'flagelo', target: intoxicatedPlayers[i].playerName, targetRole: intoxicatedPlayers[i].role })
            updateDoc((doc(database, "playeradmin", "players", user.email, intoxicatedPlayers[i].id)), { intoxicated: false });
        }
        console.log('reply 2')

        if (newIntoxication !== '') {
            updateDoc((doc(database, "playeradmin", "players", user.email, newIntoxication)), { intoxicated: true });

        }

        // Special attacks (that can be healed but not protected);
        for (let i = 0; i < attackingActionSpecial.length; i++) {
            const att = attackingActionSpecial[i];
            if (healedTargets.includes(att.target)) {
                // nothing happens to the healed person
            } else {
                // kill the player
                murderedPlayers.push({ killedPlayerName: att.target, killedPlayerRole: att.targetRole, attackerRole: att.attackerRole, attacker: att.attacker });
            }
        }

        const eventsDatabase = collection(database, `playeradmin/playerStatuses/${user.email}/announcements/announcements`)
        for (let i = 0; i < murderedPlayers.length; i++){
            const killThisMFucker = players.filter((player) => player.playerName === murderedPlayers[i].killedPlayerName);

            if (murderedPlayers[i].attackerRole === 'mestre' && zeladorTarget === true) {
            
                await updateDoc(doc(database, "playeradmin", "players", user.email, killThisMFucker[0].id), { life: "dead", cultChoice: false, zeladorClear: true, newResponse: `Você está morto, sua função não poderá ser revelada e nem o agressor.` })
                await addDoc(eventsDatabase, {
                    killedPlayer: murderedPlayers[i].killedPlayerName,
                    killedPlayerRole: 'O Zelador Esteve por aqui!',
                    attackerRole: 'O Zelador Esteve por aqui!',
                })
            } else {
                await updateDoc(doc(database, "playeradmin", "players", user.email, killThisMFucker[0].id), { life: "dead", cultChoice: false,  newResponse: `Você está morto, quem te matou foi o ${murderedPlayers[i].attackerRole}` })
                await addDoc(eventsDatabase, {
                    killedPlayer: murderedPlayers[i].killedPlayerName,
                    killedPlayerRole: murderedPlayers[i].killedPlayerRole,
                    attackerRole: murderedPlayers[i].attackerRole,
                })
            }
            if (killThisMFucker[0].intoxicated && murderedPlayers[i].attackerRole === 'flagelo') {
                updateDoc((doc(database, "playeradmin", "counters", "counters", "flageloCounter")), { counter: flageloCounter + 1 });
                
            }
            if (killThisMFucker[0].role === 'golem') {
                await updateDoc(doc(database, "playeradmin", "counters", "counters", "invocadoraCounter"), { counter: 0, golemTarget: '' })
            }
            // If killed target is the chosen golem transformation
            if (killThisMFucker[0].id === golemTransformation) {
                const invocadoraPerson = players.filter((player) => player.role === 'invocadora');
                console.log(invocadoraPerson[0].id)
                await updateDoc(doc(database, "playeradmin", "players", "jspedrogarcia@gmail.com", invocadoraPerson[0].id), {newResponse: 'Quem você escolheu para transformar essa noite morreu antes da sua transformação!' })
                await updateDoc(doc(database, "playeradmin", "counters", "counters", "invocadoraCounter"), { counter: 0, golemTarget: '' })
                golemTransformation = '';
                console.log('golem transofrmation')
            }
        }


        // Do the Golem Transformation
        if (golemTransformation !== '') {
            const choosenGolemTarget = players.filter((player) => player.id === golemTransformation);
            const golem = allRoles.filter((role) => role.role === 'golem')
            await updateDoc(doc(database, "playeradmin", "players", user.email, choosenGolemTarget[0].id), { role: golem[0].role, filliation: golem[0].filliation, roleType: golem[0].roleType, wakeOrder: golem[0].wakeOrder, newResponse: 'Você foi transformado em um golem pela bruxa Invocadora, olhe sua carta nova! =)' })
            await updateDoc(doc(database, "playeradmin", "counters", "counters", "invocadoraCounter"), { counter: 1, golemTarget: golemTransformation })
            

        }
        // Update the current Day
        await updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "dayCounter", "dayCounter", "dayCounter"), { currentDay: currentDay + 1 });

        cleanUpAllEraseables()

        // Declaring all the visits
        const docRef = collection(database, `playeradmin/playerStatuses/${user.email}/visitAction/visitAction`)
        for (let i = 0; i < visitsThatOccured.length; i++){
            await addDoc(docRef, {
                visitor: visitsThatOccured[i].visitor,
                visited: visitsThatOccured[i].visited
            })
        }
        navigateToMorning('/day');

    }

    const cleanUpAllEraseables = async () => {
        for (let i = 0; i < allMessages.length; i++){
            await deleteDoc(doc(database, `playeradmin/chatsLog/jspedrogarcia@gmail.com/${allMessages[i].id}`))
        }
        for (let i = 0; i < hiddenEvilChat.length; i++){
            await deleteDoc(doc(database, `playeradmin/familyChatLog/jspedrogarcia@gmail.com/${hiddenEvilChat[i].id}`))
        }
        for (let i = 0; i < mobilePlayerActionsSingle.length; i++){
            const ref = doc(database, "playeradmin", "playerStatuses", user.email, "mobilePlayerActions", "mobilePlayerActionsSingle", mobilePlayerActionsSingle[i].id)
            await deleteDoc(ref);

        }
    }

    const headToDayAndWinningCoven = () => {
        cleanUpAllEraseables();
        stopNightSound()
        navigateToMorning('/day');

    }
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
    const playNightSounds = () => {
        playNightSound()
        const witchesInHere = alivePlayers.filter(witch => { return witch.filliation === 'coven'})
        const wolvesInHere = alivePlayers.filter(wolf => { return wolf.role === 'lobisomen' })
        let text = '';
        if (currentDayTemp[0].currentDay % 2 === 0 && wolvesInHere.length > 0) {
            playWerewolfPresentSound();
            setIsNotifierModal(true)
            text = text + 'O Lobisomen transformou essa noite.'
        }
        setNotifierModalContent(text)

    }
    const nightPrompt = () => {
        setNightTimerCounter(90)
        playNightSounds();
        setIsOpen(false);
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "noite"})
        setCurrentDay(currentDayTemp[0].currentDay)
        for (let i = 0; i < players.length; i++){
            updateDoc(doc(database, `playeradmin/players/${user.email}/${players[i].id}`), { newResponse: "", buff: "", debuff: "", clownBomb: false, pistoleiroMark: false, potionTime: false });
        }

    }
    return (

        <div className="night">
            <h3 className="page-title">
                Noite {currentDay} - Timer: {nightTimerCounter}
            </h3>
            <div className="nightMain">
                <div className="event-action event">
                        <h4>
                        Jogadores e Ações
                        </h4>
                    <div className="huge-container card-border scrollable">
                        <div className="actionContainer">
                            {alivePlayers.map(player => {
                                return player.action === 'pending' ?
                                    <div className="townies actionUnit"> <p>{player.playerName} </p><p> Ação Pendente</p></div>
                                :   <div className="mafiaies actionUnit"> <p>{player.playerName} </p> <p> Ação Completa</p></div>
                            })}
                        </div>
                    </div>
                    {/* <h4>
                        Chats Ativos
                    </h4>
                    <div className="card-border huge-container chatsAtivosNight scrollable">
                        <div className="card-border innerBox scrollable">
                        <h4 className="midTitle">
                            Chat Familia/Cavaleiros
                        </h4>
                            {hiddenEvilChat.map(message => (
                                <span>
                                    <p>{message.autor}: {message.message }</p>
                                </span>
                            ))}
                        </div>
                        <div className="card-border innerBox scrollable">
                        <h4 className="midTitle">
                            Chat Mortos
                        </h4>
                            {allMessages.map(message => (
                                <span>
                                    <p>{message.autor}: {message.message }</p>
                                </span>
                            ))}
                        </div>
                </div> */}
                </div>
                <div className="night-right">

                <div className="event-currentplayers event">
                        {/* <h4>
                        Jogadores Vivos
                        </h4> */}
                        {/* <div className="small-container card-border scrollable characters">
                            {alivePlayers.map((player) => (
                                <p key={player.key}>
                                    {player.playerName}
                                </p>
                            ))}
                        </div> */}
                    
                </div>
                <div className="event-buttons">
                    <button className="button" onClick={encerrarNoiteMobile}> Encerrar Noite!</button>

                </div>
                </div>
            </div>
            <Popup open={isOpen} modal >
                    <div className="modalNight">
                        <div className="header">Para iniciar a noite, clique abaixo </div>
                        <div className="content">

                            <button className="button" onClick={nightPrompt}>Iniciar Noite</button>
                        </div>
                        </div>
        </Popup>
            <Popup open={isNotifierModal} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                        <div className="header">{notifierModalContent}</div>
                        <div className="content">
                        <button className="button" onClick={() => setIsNotifierModal(false)}>Okay</button>
                    </div>
                    
                        </div>
        </Popup>
            {/* <Popup open={isCovenWinning} modal closeOnDocumentClick={false}>
                    <div className="modalNight">
                        <div className="header">VITORIA DO COVEN</div>
                    <div className="content">
                        A invocação da Lua de Sangue foi completada com sucesso... A maldição chegou ao vilarejo... Será o fim dos tempos.
                        <button className="button" onClick={headToDayAndWinningCoven}>Ir Para Dia</button>
                    </div>
                    
                        </div>
        </Popup> */}
        </div>
    )
}

export default Night;