export default function Button({text, clickHandler, btnType}){
    let btnClass = btnType == 'primary' ? 'primary-btn' : btnType == 'secondary' ? 'secondary-btn' : '';
    if (btnType == 'primary') {
        btnClass = 'primary-btn';
    } else if (btnType == 'secondary') {
        btnClass = 'secondary-btn';
    } else if (btnType == 'disabled') {
        btnClass = 'disabled-btn';
    }
    return(
        <button onClick={clickHandler} className={btnClass}>{text}</button>
    )
}
