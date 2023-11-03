import { database } from "../../firebaseConnection";
import { collection, doc , deleteDoc, updateDoc } from "firebase/firestore";
import "./playerListing.css"
function playerListing(props){
    const userDetail = localStorage.getItem("UserLogin");
    const data = JSON.parse(userDetail);
    const email = data.email
    async function handleDelete(id) {
        const docRef = doc(database, `playeradmin/players/${data.email}`, id)
        await deleteDoc(docRef);
    }
    async function handleStateChange(id, state) {
        const docRef = doc(database, `playeradmin/players/${data.email}`, id)
        await updateDoc(docRef, {activePlayer: state})
    }
    return (
        <div className="playerlisting-name" key={props.id}>
            <p>{props.playerName}</p>
            <div className="playerListButtons">

                <button className="delete-button" onClick={() => handleStateChange(props.id, props.stateGoTo)}>{props.stateGoTo === true ? 'Ativar' : 'Desativar' }</button>
            <button className="delete-button" onClick={() => handleDelete(props.id)}>excluir</button>
            </div>
        </div>
        
    )
}

export default playerListing;