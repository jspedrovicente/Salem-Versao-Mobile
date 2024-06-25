


const ButtonMobile = (props) => {

    return (
        
            props.trigger ? (
                <button className="intButton" onClick={props.clickFunctionality}>
                <img src={props.svgChoice} alt="" />
                </button>
            ): (
                    
                
                <button className="intButton hideableButtons" onClick={props.clickFunctionality}>
                <img src={props.svgChoice} alt="" />
                </button>
                
            )
        )
}

export default ButtonMobile