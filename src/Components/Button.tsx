import '../styles/css/Login.css';


function Button(props : any){
    return (
    <>
    <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0b2bcc58478eb63964ec2151b650aff6bd22a16a91ce85a83a878c022cc63850&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2FConfig&response_type=code" className="">
        <button>  
            {props.msg}
        </button>
    </a>
    </>
    )
}

export default Button;