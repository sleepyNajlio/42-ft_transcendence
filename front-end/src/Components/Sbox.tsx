import '../styles/css/main.css'

export default function Sbox(props: any) {
    return (
        <>
            <main className="wrapper">
                <div className="sbox">
                    <div className="sbox__title">
                        <h1 className="btitle">{props.btitle}</h1>
                        <h3 className="stitle">{props.stitle}</h3>
                    </div>
                    <div className="sbox__btn">
                        <button className="trans bt" onClick={()=> props.onClick()}>
                            {props.lb}
                        </button>
                        <button className="filled bt">{props.rb}</button>
                    </div>
                </div>
            </main>
        </>
    );
}