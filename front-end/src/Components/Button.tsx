import '../styles/css/Login.css';


function Button(props : any){
    return (
    <>
    <a href="http://192.168.3.169:3000/auth/42" className="">
        <button>  
            {props.msg}
        </button>
    </a>
    </>
    )
}

export default Button;