import '../styles/css/Login.css';


function Button(props : any){
    return (
    <>
    <a href={props.auth} className="">
        <button>  
            {props.msg}
        </button>
    </a>
    </>
    )
}

export default Button;