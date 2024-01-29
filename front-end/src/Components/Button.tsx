import '../styles/css/Login.css';


function Button(props : any){
    return (
    <div onClick={!props.disabled && props.onClick} className="bt">
    <a href={props.link}>
        <button  value={props.value} type="submit">  
            {props.msg}
        </button>
    </a>
    </div>
    )
}

export default Button;