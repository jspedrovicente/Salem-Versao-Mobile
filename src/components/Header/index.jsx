import './header.css'
import logomarca from "../../assets/images/logomarca.png"

const Header = () => {
    return (
        
        <div className='header'>
            <img className='smallLogoStyling' src={logomarca} alt="" />
            <h2> O Vilarejo
            </h2>
        </div>
        )
}

export default Header;