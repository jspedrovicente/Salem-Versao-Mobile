import './header.css'
import logomarca from "../../assets/images/logomarca.png"

const Header = () => {
    return (
        
        <div className='header'>
            <img className='smallLogoStyling' src={logomarca} alt="" />
            <h3> A Aquisição de Salem
            </h3>
        </div>
        )
}

export default Header;