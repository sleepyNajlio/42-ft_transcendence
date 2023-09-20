import '../styles/css/Login.css';


function Button(props : any){
    return (
    <>
    <a href="https://auth.42.fr/" className="">
        <button>  
            {props.msg}
        </button>
    </a>
    </>
    )
}

export default Button;