import './home.css'
import ButtonLink from '../../components/ButtonLink';
import logomarca from '../../assets/images/logomarca.png'
const Home = () => {
    return (
        <div className="home">
            <img src={logomarca} className='logoSizing' />
            <div className='button-container'>
                <ButtonLink destination="/login" buttonText="Administrativo"/>
                {/* <ButtonLink destination="/signup" buttonText="Cadastrar"/> */}
                <ButtonLink destination="/playerMobile" buttonText="Jogar!"/>
                 <ButtonLink destination="/tutorial" buttonText="Conheça o Jogo"/>
                {/* <ButtonLink destination="/Reserve" buttonText="Reservar Data"/>  */}
            </div>
        </div>
    )
}

export default Home;