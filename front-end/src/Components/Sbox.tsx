import '../styles/css/main.css'
import LoadingComponent from './LoadingComponent'; // Import the loading component

export default function Sbox(props: any) {
    return (
        <>
            <main className="wrapper">
                {props.isLoading && <LoadingComponent />} {/* Render the loading component when isLoading is true */}
                {!props.isLoading && (
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
                )}
            </main>
        </>
    );
}