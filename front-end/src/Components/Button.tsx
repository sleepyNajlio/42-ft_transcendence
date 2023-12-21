import '../styles/css/Login.css';


function Button(props : any){
    return (
    <>
    <a href={props.link} className="">
        <button value={props.value} type="submit" onClick={props.onClick}>  
            {props.msg}
        </button>
    </a>
    </>
    )
}

export default Button;