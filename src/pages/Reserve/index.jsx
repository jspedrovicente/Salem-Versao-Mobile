import { setDoc, doc, addDoc, collection, onSnapshot, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConnection";
import "./index.css"
const Reserve = () => {
    const [reserve, setReserve] = useState([]);
    const [dados, setDados] = useState([]);
    const [chosenReserve, setChosenReserve] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        whatsapp: ''
    })
    useEffect(() => {

        const a = onSnapshot(collection(database, `reserve/jspedrogarcia@gmail.com/reserve`), (snapshot) => {
            let reservas = []
            let dados = []
                snapshot.forEach((doc) => {
                    dados.push({
                        id: doc.id,
                        date: doc.data().date,
                        time: doc.data().time,
                        local: doc.data().local,
                        tier: doc.data().tier,
                        host: doc.data().host,
                        hostName: doc.data().hostName,
                        playerLimit: doc.data().playerLimit,
                        guests: [{}]
                    })
                })
                setDados(dados);
            for (let i = 0; i < dados.length; i++){
                const a = onSnapshot(collection(database, `reserve/jspedrogarcia@gmail.com/reserve/${dados[i].id}/guests`), (snapshot) => {
                        snapshot.forEach((doc) => {
                            dados[i].guests.push({
                                id: doc.id,
                                fullName: doc.data().fullName,
                                email: doc.data().email,
                                whatsapp: doc.data().whatsapp,
                            })
                        })
                        setDados(dados);
                }) 
            }
        }) 
    }, [])

    const reservarVaga = (idDaReserva) => {
        
    }
    return (

        <div>
            <div className="header">
                <h3>Reservar Vagas</h3>
            </div>
            {
            chosenReserve === '' ? (
                <div className="mainReserva">
                <h4>Selecione a Reserva</h4>
                <div className="reservaBoxes">
                    {dados.map((reserva, index) => (
                        <a className="reservaCard" key={reserva.id} onClick={() => setChosenReserve(reserva.id)} >
                            <div>
                            Data: {reserva.date}
                            </div>
                            <div>
                            Horário: {reserva.time}
                            </div>
                            <div>
                            Local: {reserva.local}
                            </div>
                            <div>
                            Nível: {reserva.tier}
                            </div>
                            <div>
                                Host: {reserva.hostName}
                            </div>
                            <div>
                                Quantidade de jogadores: {reserva.playerLimit}
                            </div>

                        </a>
                    ))}
                </div>
            </div>
                ) : (
                        <div className="mainReserva">
                            <h4>
                            Preencha seus dados para Reservar
                            </h4>
                            <div className="reservaBoxes">
                                <h5>Seus Dados</h5>
                                <div>
                                        <div className="inputBox">
                                        <label htmlFor="name">Nome</label>
                                        <input autoComplete="true" type="text" className="reserveInfoInput" onChange={(e) => setForm({...form, fullName: e.target.value})} value={form.fullName} id="name" name="name"/>
                                        </div>
                                        <div className="inputBox">
                                        <label htmlFor="email">E-Mail</label>
                                        <input autoComplete="true" type="text" className="reserveInfoInput"onChange={(e) => setForm({...form, email: e.target.value})} value={form.email} id="email" name="email"/>
                                        </div>
                                        <div className="inputBox">
                                        <label htmlFor="phone">Whatsapp</label>
                                        <input autoComplete="true" type="text" className="reserveInfoInput" onChange={(e) => setForm({...form, whatsapp: e.target.value})} value={form.whatsapp} id="phone" name="whatsapp"/>
                                        </div>
                                    </div>
                            </div>
                <div className="reservaBoxes">
                            <h5>Dados da Reserva</h5>
                            {dados.filter((dado) => dado.id === chosenReserve).map(reserva => (
                                <div className="" key={reserva.id} >
                                    <div>
                                        <div className="inputBox">
                                        <label htmlFor="data">Data</label>
                                        <input readOnly type="text" className="reserveInfoInput disabledReserveInfoInput" value={reserva.date} id="data" name="data"/>
                                        </div>
                                        <div className="inputBox">
                                        <label htmlFor="time">Horario</label>
                                        <input readOnly type="text" className="reserveInfoInput disabledReserveInfoInput" value={reserva.time} id="time" name="time"/>
                                        </div>
                                        <div className="inputBox">
                                        <label htmlFor="local">Local</label>
                                        <input readOnly type="text" className="reserveInfoInput disabledReserveInfoInput" value={reserva.local} id="local" name="local"/>
                                        </div>
                                        <div className="inputBox">
                                        <label htmlFor="tier">Nível</label>
                                        <input readOnly type="text" className="reserveInfoInput disabledReserveInfoInput" value={reserva.tier} id="tier" name="tier"/>
                                        </div>
                                        <div className="inputBox">
                                        <label htmlFor="hostName">Mestre</label>
                                        <input readOnly type="text" className="reserveInfoInput disabledReserveInfoInput" value={reserva.hostName} id="hostName" name="hostName"/>
                                        </div>
                                        <div className="inputBox">
                                        <label htmlFor="Jogadores">Jogadores</label>
                                        <input readOnly type="text" className="reserveInfoInput disabledReserveInfoInput" value={reserva.playerLimit} id="Jogadores" name="Jogadores"/>
                                        </div>
                                    </div>
    
                            </div>
                            ))}
                                </div>
                            <button className="button" onClick={() => setChosenReserve('')}>Reservar</button>
                            <button className="button" onClick={() => setChosenReserve('')}>Voltar</button>
                    </div>
        )}

        </div>
    )
} 

export default Reserve;