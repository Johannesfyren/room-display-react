export default function Icon({url, iconWidth, iconHeight}){
    return(
        <div style={{width: iconWidth, height: iconHeight}}>
            <img src={url} alt="" style={{height: "100%", width: "100%"}}/>
        </div>
    )
}