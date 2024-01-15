import '../styles/css/Login.css';


function Button(props : any){
    return (
    <>
    <a href="http://localhost:3000/auth/42" className="">
        <button>  
            {props.msg}
        </button>
    </a>
    </>
    )
}

export default Button;