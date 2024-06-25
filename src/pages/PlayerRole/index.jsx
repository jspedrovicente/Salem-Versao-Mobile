import { useState, useEffect } from "react";
import "./playerRole.css"
import ButtonLink from "../../components/ButtonLink"
import { database } from "../../firebaseConnection";
import { Link, useNavigate } from "react-router-dom";
import {doc, collection, onSnapshot, updateDoc, deleteField } from "firebase/firestore";
import Popup from 'reactjs-popup';


const PlayerRole = () => {
    const [isManualRandomizerOpen, setIsManualRandomizerOpen] = useState(false);
    const [isAutoRoleGiver, setAutoRoleGiver] = useState(false);
    const [townRole, setTownRole] = useState([]);
    const [covenRole, setCovenRole] = useState([]);
    const [horsemenRole, setHorsemenRole] = useState([]);
    const [cultRole, setCultRole] = useState([]);
    const [mafiaRole, setMafiaRole] = useState([]);
    const [user, setUser] = useState({});
    const [allRoles, setAllRoles] = useState([]);
    const [playerList, setPlayerList] = useState([]);
    const [neutralRole, setNeutralRole] = useState([]);
    const [checkboxCounter, setCheckboxCounter] = useState(0);
    // information for setting the current information for a player
    const [currentFilliation, setCurrentFilliation] = useState('town');
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const [randomizerChosenRoles, setRandomizerChosenRoles] = useState([]);
    const [autoChosenRoles, setAutoChosenRoles] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        function loadInfo() {
            const userDetail = localStorage.getItem("UserLogin");
            setUser(JSON.parse(userDetail));
            const data = JSON.parse(userDetail);
            const unsub = onSnapshot(collection(database, `playeradmin/players/${data.email}`), (snapshot) => {
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
                            actionForRoleCounter: doc.data()?.actionForRoleCounter,
                            activePlayer: doc.data().activePlayer,
                            roleType: doc.data().roleType
                        })
                    }
                })
                setPlayerList(list);
            })

        }
        loadInfo();
    }, [])
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
            console.log(roles)
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
    const handleConfirm = async (e) => {
        e.preventDefault();
        const chosenPlayer = playerList.filter(player => player.playerName === currentPlayer);
        const chosenRole = allRoles.filter(role => role.role === currentRole);
        const chosenPlayerId = chosenPlayer[0].id
        const chosenRoleWakeOrder = chosenRole[0].wakeOrder
        await updateDoc(doc(database, "playeradmin", "players", user.email, chosenPlayerId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: chosenRoleWakeOrder, roleType: chosenRole[0].roleType, willText: "", actionforRoleCounter: chosenRole[0].actionforRoleCounter? chosenRole[0].actionforRoleCounter : null})

    }

    const handleReset = async (e) => {
        e.preventDefault();
        for (let i = 0; i < playerList.length; i++) {
            const currentId = playerList[i].id;
            const ref = doc(database, "playeradmin", "players", user.email, currentId)

            await updateDoc(ref, { role: "none", filliation: "none", life: "none", action: "none", wakeOrder: 0, actionforRoleCounter: 0, roleType: "", potionTime: false, poisoned: false, intoxicated: false})
        }
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "inicio"})
    }
    const handleEraseSpecificPlayer = (playerId) => {
        updateDoc(doc(database, "playeradmin", "players", user.email, playerId), { role: "none", filliation: "none", life: "none", action: "none", wakeOrder: 0, roleType: "" })

    }
    const isManualDisabled = () => {
        return randomizerChosenRoles.length !== playerList.length;
    }
    const startGame = () => {
        navigate('/day');
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "dia"})

    }
    async function handleManualRandomizer() {
        var randomizedPlayers = []
        const players = playerList.slice();
        const roleList = randomizerChosenRoles;
        const chosenRoles = []
        for (let i = 0; i < roleList.length; i++){
            const temp = allRoles.filter(role => role.role === roleList[i]) 
            chosenRoles.push(temp[0]);
        }
        for (let i = 0; players.length > 0; i++) {
            const roleIndex = Math.floor(Math.random() * chosenRoles.length)
            var selectedIndex = Math.floor(Math.random() * players.length);
            var selectedName = players.splice(selectedIndex, 1)[0];
            var selectedRole = chosenRoles[roleIndex];
            var usedRole = chosenRoles.filter(role => role.role === selectedRole.role);
            var index = chosenRoles.findIndex(function (obj) {
                return obj.role === usedRole[0].role;
            })
            const deleted = chosenRoles.splice(index, 1)[0];
            randomizedPlayers.push({ selectedName, selectedRole })
        }
        for (let i = 0; i < randomizedPlayers.length; i++) {
            const currentId = randomizedPlayers[i].selectedName.id;
            const currentRole = randomizedPlayers[i].selectedRole.role;
            const currentType = randomizedPlayers[i].selectedRole.roleType;
            const wakeOrder = randomizedPlayers[i].selectedRole.wakeOrder;
            const currentFilliation = randomizedPlayers[i].selectedRole.filliation
            await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", wakeOrder: wakeOrder, roleType: currentType, willText: "none", actionforRoleCounter: randomizedPlayers[i].selectedRole.actionforRoleCounter? randomizedPlayers[i].selectedRole.actionforRoleCounter : null})
        }
        setRandomizerChosenRoles([]);
        setIsManualRandomizerOpen(false);
    }
    const handleCardDelivery = () => {
        updateDoc(doc(database, "playeradmin", "playerStatuses", user.email, "gameState", "gameState", "gameState"), { gameState: "entregueCartas"})

    }
    const handleFilliationChange = (e) => {
        setCurrentRole('?')
        setCurrentFilliation(e.target.value)

    }
    const addFunctionToRole = (addedRole) => {
        setRandomizerChosenRoles([...randomizerChosenRoles, addedRole]);
    }

    const removeFunctionToRole = (removedRole) => {
        let tempArray = [...randomizerChosenRoles];
        const removedRoleIndex = tempArray.indexOf(removedRole);
        if (removedRoleIndex === -1) {
            // nothing happens
        } else {
            tempArray.splice(removedRoleIndex, 1);
            setRandomizerChosenRoles(tempArray);
        }
    }
    const handleAutoRandomizer = async (enemyChosen) => {
        const quantityOfPlayersInGame = playerList.length
        var possibleNeutral = false 
        var listOfroles = []
        if (enemyChosen === 'familia') {
            var numberofFamilyMembers = 1
            if (quantityOfPlayersInGame < 12) {
                numberofFamilyMembers = 2
            } else if (quantityOfPlayersInGame > 11 && quantityOfPlayersInGame < 16) {
                numberofFamilyMembers = 3
            } else if (quantityOfPlayersInGame > 15 && quantityOfPlayersInGame < 21) {
                numberofFamilyMembers = 3
            } else if (quantityOfPlayersInGame > 20) {
                numberofFamilyMembers = 4
            }
            // Add the roles chosen based on quantity
            let availableList = [...mafiaRole];
            for (let i = 0; i < numberofFamilyMembers; i++){
                if (listOfroles.length === 0) {
                    listOfroles.push('mestre')
                    
                } else {
                    for (let i = 0; i < availableList.length; i++){
                        if (listOfroles.includes(availableList[i].role)) {
                            availableList.splice(i, 1)
                        }
                    }
                    const randomIndex = Math.floor(Math.random() * availableList.length);
                    const randomItem = availableList[randomIndex];
                    listOfroles.push(randomItem.role)
                    // Now lets choose a random family member

                }
                console.log(listOfroles)
            }
            possibleNeutral = true
        }
        if (enemyChosen === 'culto') {
            listOfroles.push('ocultista')
            possibleNeutral = true
        }
        if (enemyChosen === 'cavaleiros') {
            listOfroles.push('morte', 'fome', 'guerra', 'peste')
        }
        if (enemyChosen === 'coven') {
            var numberofCoven = 1
            if (quantityOfPlayersInGame < 12) {
                numberofCoven = 2
            } else if (quantityOfPlayersInGame > 11 && quantityOfPlayersInGame < 16) {
                numberofCoven = 3
            } else if (quantityOfPlayersInGame > 15 && quantityOfPlayersInGame < 21) {
                numberofCoven = 3
            } else if (quantityOfPlayersInGame > 20) {
                numberofCoven = 4
            }
            // Add the roles chosen based on quantity
            let availableList = [...covenRole];
            
            for (let i = 0; i < numberofCoven; i++){
                    for (let i = 0; i < availableList.length; i++){
                        if (listOfroles.includes(availableList[i].role)) {
                            availableList.splice(i, 1)
                        }
                    }
                    const randomIndex = Math.floor(Math.random() * availableList.length);
                    const randomItem = availableList[randomIndex];
                    listOfroles.push(randomItem.role)
                    // Now lets choose a random coven member

                
                console.log(listOfroles)
            }
            possibleNeutral = true
        }
        if (possibleNeutral) {
            var numberOfNeutrals = 0
            if (quantityOfPlayersInGame < 12) {
                numberOfNeutrals = 2
            } else if (quantityOfPlayersInGame > 11 && quantityOfPlayersInGame < 16) {
                numberOfNeutrals = 2
            } else if (quantityOfPlayersInGame > 15 && quantityOfPlayersInGame < 21) {
                numberOfNeutrals = 3
            } else if (quantityOfPlayersInGame > 20) {
                numberOfNeutrals = 3
            }
            let availableList = []
            for (let i = 0; i < neutralRole.length; i++){
                if (neutralRole[i].enabledRole && neutralRole[i].role !== "bobo da corte" && neutralRole[i].role !== "executor" && neutralRole[i].role  !== "medico da peste" && neutralRole[i].enabledRole === true) {
                    availableList.push(neutralRole[i])
                }
            }
            for (let i = 0; i < numberOfNeutrals; i++){
                if (i === 0) {
                    const tempList = ['bobo da corte', 'executor', 'medico da peste']
                    // Se for o primeiro, adicione 1 bobo da corte ou executor
                    const randomIndex = Math.floor(Math.random() * tempList.length);
                    const randomItem = tempList[randomIndex];
                    listOfroles.push(randomItem)
                } else {
                    for (let i = 0; i < availableList.length; i++){
                        if (listOfroles.includes(availableList[i].role)) {
                            availableList.splice(i, 1)
                        }
                    }
                    const randomIndex = Math.floor(Math.random() * availableList.length);
                    const randomItem = availableList[randomIndex];
                    listOfroles.push(randomItem.role)
                    console.log(listOfroles)
                }
            }
        }
        // Now choose the town members
        // Now lets push the obligatory characters
        listOfroles.push('investigador', 'xerife', 'curandeira', 'meretriz', 'vigilante')
        // count how many towniest we need based on this

        const remainingPlayercount = quantityOfPlayersInGame - listOfroles.length 
        console.log(remainingPlayercount)
        let availableList = []
        let roletypingcast = []
        for (let i = 0; i < remainingPlayercount; i++){
            switch (i) {
                case 0:
                    roletypingcast.push('comunicação')
                    break
                case 1:
                    roletypingcast.push('proteção')
                    break
                case 2:
                    roletypingcast.push('investigação')
                    break
                case 3:
                    roletypingcast.push('utilidade')
                    break
                case 4:
                    roletypingcast.push('agressão')
                    break
                case 5:
                    roletypingcast.push('comunicação')
                    break
                case 6:
                    roletypingcast.push('utilidade')
                    break
                case 7:
                    roletypingcast.push('proteção')
                    break
                case 8:
                    roletypingcast.push('investigação')
                    break
                case 9:
                    roletypingcast.push('estranho')
                    break
                default:
                    roletypingcast.push('qualquer')
                    break
            }
        }
        for (let i = 0; i < townRole.length; i++){
            if (townRole[i].enabledRole && townRole[i].role !== 'vigilante') {
                availableList.push(townRole[i])
            } 
        }
        for (let i = 0; i < remainingPlayercount; i++){
            for (let i = 0; i < availableList.length; i++){
                if (listOfroles.includes(availableList[i].role) && !availableList[i].multiple) {
                    availableList.splice(i, 1)
                }
            }
            let availableCASTEDRole = []
            if (roletypingcast[i] === 'qualquer') {
                availableCASTEDRole = availableList                
            } else if(roletypingcast[i] === 'cidadao') {
                availableCASTEDRole = availableList.filter((role) => role.role === 'cidadao')
            } else if(roletypingcast[i] === 'estranho') {
                availableCASTEDRole = availableList.filter((role) => role.role === 'estranho')
            } else {
                availableCASTEDRole = availableList.filter((role) => role.roleType === roletypingcast[i])
            }
            // The 10th and 11th player need to be between comunicação and proteção
            const randomIndex = Math.floor(Math.random() * availableCASTEDRole.length);
            const randomItem = availableCASTEDRole[randomIndex];
            listOfroles.push(randomItem.role)

        }


        console.log(listOfroles)
        // now assign the roles to the players
        var randomizedPlayers = []
        const players = playerList.slice();
        const chosenRoles = []
        for (let i = 0; i < listOfroles.length; i++){
            const temp = allRoles.filter(role => role.role === listOfroles[i]) 
            chosenRoles.push(temp[0]);
        }
        for (let i = 0; players.length > 0; i++) {
            const roleIndex = Math.floor(Math.random() * chosenRoles.length)
            var selectedIndex = Math.floor(Math.random() * players.length);
            var selectedName = players.splice(selectedIndex, 1)[0];
            var selectedRole = chosenRoles.splice(roleIndex, 1)[0];
            randomizedPlayers.push({ selectedName, selectedRole })
            
        }
        console.log(randomizedPlayers)
        console.log(randomizedPlayers[0].selectedName.playerName)
        console.log(randomizedPlayers[0].selectedRole.role)
        for (let i = 0; i < randomizedPlayers.length; i++) {
            const currentId = randomizedPlayers[i].selectedName.id;
            const currentRole = randomizedPlayers[i].selectedRole.role;
            const currentType = randomizedPlayers[i].selectedRole.roleType;
            const wakeOrder = randomizedPlayers[i].selectedRole.wakeOrder;
            const currentFilliation = randomizedPlayers[i].selectedRole.filliation
            await updateDoc(doc(database, "playeradmin", "players", user.email, currentId), { role: currentRole, filliation: currentFilliation, life: "alive", action: "pending", roleType: currentType, wakeOrder: wakeOrder, willText: "none", actionforRoleCounter: randomizedPlayers[i].selectedRole.actionforRoleCounter? randomizedPlayers[i].selectedRole.actionforRoleCounter : null})
        }
    }
    return (
        <div className="playerRole">
            <h3 className="page-title">
            Seleciona a função de cada jogador
            </h3>
            <Popup className="randomizerModalRoles" open={isManualRandomizerOpen} modal closeOnDocumentClick={false}>
                    <div className="header">Randomizador de Funções</div>
                <div className="modalRole">
                    <div className="content modalRandomizerContent">
                    <div className="selectors">
                        <div className="selector-category">
                            <h4>Cidade</h4>
                                <hr />
                                {townRole.map(role => (
                                    role.enabledRole ? (
                                        
                                        <span className="eachRole townies" key={role.key}>
                                <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}

                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                            </span>
                                ) : (null)
                        ))}
                            </div>
                            <div>

                        <div className="selector-category">
                            <h4>A Familia</h4>
                            <hr />
                                {mafiaRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole mafiaies" key={role.id}>
                               <label >{role.role} 
                                </label>
                                            <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>) : (null)
                            ))}
                                </div>
                                <div className="selector-category">
                            <h4>Culto</h4>
                            <hr />
                                    {cultRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole cultisties" key={role.id}>
                               <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>):(null)
                            ))}
                                </div>
                                <div className="selector-category">
                                    
                            <h4>Coven - Desabilitadas</h4>
                            <hr />
                                    {covenRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole covenies" key={role.id}>
                               <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>):(null)
                            ))}
                                </div>
                        
                            </div>
                            <div>
                                
                        <div className="selector-category">
                            <h4>Cavaleiros</h4>
                            <hr />
                                    {horsemenRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole horsies" key={role.id}>
                               <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>):(null)
                            ))}
                        </div>
                        <div className="selector-category">
                            <h4>Neutros</h4>
                            <hr />
                                    {neutralRole.map(role => (
                                    role.enabledRole ? (
                                
                                <span className="eachRole neutraies" key={role.id}>
                               <label >{role.role}
                                </label>
                                <div className="buttonSection">
                                {role.multiple? 'M' : 'U'}
                                <button onClick={() => removeFunctionToRole(role.role)}>-</button>
                                <input type="number" readOnly value={randomizerChosenRoles.filter(x => x === role.role).length} />
                                <button onClick={ () => addFunctionToRole(role.role)}>+</button>
                                </div>
                                </span>) : (null)
                                ))}
                                </div>
                                </div>
                                
                        </div>
                        <div className="manualRandomizerLower">

                            <div>Funções Selecionadas: <span className="counterBox">
                            {randomizerChosenRoles.length}</span></div>
                            <div>Quantidade de Jogadores:
                                <span className="counterBox">{playerList.length}</span>
                            </div>
                            
                        </div>
                        <div className="manualRandomizerLower">

                    <button className="button" disabled={isManualDisabled()} onClick={handleManualRandomizer}>Randomizar Manualmente</button>
                    <button className="button" onClick={() => setIsManualRandomizerOpen(false)}>Fechar Randomizador</button>
                        </div>
                    </div>
                    </div>
            </Popup>
            <Popup className="randomizerModalRoles" open={isAutoRoleGiver} modal closeOnDocumentClick={false}>
                    <div className="header">Automatizador de Funções</div>
                <div className="modalRole">
                    <div className="content modalRandomizerContent">
                    <div className="selectors">
                            <div>
                    <button className="button"  onClick={() => handleAutoRandomizer('familia')}>VS Familia</button>
                    <button className="button"  onClick={() => handleAutoRandomizer('culto')}>VS Culto</button>
                    <button className="button"  onClick={() => handleAutoRandomizer('cavaleiros')}>VS Cavaleiros</button>
                    <button className="button"  onClick={() => handleAutoRandomizer('coven')}>VS Coven</button>

                                </div>
                                
                        </div>
                        <div className="manualRandomizerLower">

                    <button className="button" onClick={() => setAutoRoleGiver(false)}>Fechar Randomizador</button>
                        </div>
                    </div>
                    </div>
            </Popup>
            <div className="playerRole-main">
                <div className="playerRole-assign">
                    <form >
                        <label >
                            Jogador:
                            <select name="player" id="player" value={currentPlayer} onChange={(e) => setCurrentPlayer(e.target.value)}>
                                {playerList.map((player) => (
                                    <option key={player.key}>{player.playerName}
                                    </option>
                                ))}

                            </select>
                        </label>
                        <label >
                            Filiação:
                            <select name="affiliation" id="affiliation" value={currentFilliation} onChange={(e) => handleFilliationChange(e)} >
                                    <option value="town" id="town">Cidade</option>
                                    <option value="coven" id="coven" className="coven">Coven</option>
                                    <option value="the family" className="mafia">A Familia</option>
                                    <option value="cult" className="cult">Culto</option>
                                    <option value="horsemen" className="cavaleirosDoApocalipse">Cavaleiros do Apocalipse</option>
                                    <option value="neutral" className="neutral">Neutros</option>
                            </select>
                        </label>
                        <label >
                            Função:
                            <select name="role" id="role" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
                                <option value="?" id="town" disabled>Selecione</option>

                                {allRoles.filter(role => role.filliation.includes(currentFilliation)).map(filteredrole => (
                                    <option key={filteredrole.role}>{filteredrole.role}</option>
                                ))} ;
                                

                            </select>
                        </label>
                        <button type="submit" className="button" onClick={handleConfirm} disabled={currentRole === '?'}>Confirmar</button>
                        <button type="button" className="button" onClick={handleReset}>Resetar Todos</button>
                        <button type="button" className="button" onClick={() => setAutoRoleGiver(true)}>Gerador Automatico</button>
                        <button type="button" className="button" onClick={() => setIsManualRandomizerOpen(true)}>Gerador Aleatorio Manual</button>
                        <Link to='/statuses' target='_blank' rel='noopener noreferrer' />
                        <a className="button " target="_blank" href="/statuses">Status de Telão</a>
                        <button type="button" className="button" onClick={handleCardDelivery}>Entregar Cartas</button>
                    </form>
                </div>
                <div className="playerRole-roles">
                    <div className="town">
                        <h4>
                        Cidade
                        </h4>
                        <div className="playerRole-town card-border scrollable">
                            {playerList.filter(player => player.filliation.includes("town")).map(filteredPlayer => (
                                <p key={filteredPlayer.id}>{filteredPlayer.id}<button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        </div>
                    </div>
                    <div className="evil">
                        <h4>
                        A Familia/Cavaleiros/Culto
                        </h4>
                        <div className="playerRole-evil card-border scrollable">
                        {playerList.filter(player => player.filliation.includes("the family")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.id} <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        {playerList.filter(player => player.filliation.includes("coven")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.id}  <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        {playerList.filter(player => player.filliation.includes("horsemen")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.id}<button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        {playerList.filter(player => player.filliation.includes("cult")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.id} <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        </div>
                    </div>
                    <div className="neutral">
                        <h4>
                        Neutro
                        </h4>
                        <div className="playerRole-neutral card-border scrollable">
                        {playerList.filter(player => player.filliation.includes("neutral")).map(filteredPlayer => (
                            <p key={filteredPlayer.id}>{filteredPlayer.id} <button className="delete-button" onClick={() => handleEraseSpecificPlayer(filteredPlayer.id)}>x</button></p>
                                ))}
                        </div>
                    </div>
                    <div className="button-container button-area">
                <ButtonLink destination="/playerlist" buttonText="Voltar"/>
                <button onClick={startGame} className="button">Começar Jogo</button>
            </div>
                </div>
            </div>

        </div>
        
    )
}

export default PlayerRole;