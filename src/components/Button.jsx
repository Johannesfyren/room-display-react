export default function Button({text, clickHandler, btnType, isLoading = false}){
    let btnClass = btnType == 'primary' ? 'primary-btn' : btnType == 'secondary' ? 'secondary-btn' : '';
    if (btnType == 'primary') {
        btnClass = 'primary-btn';
    } else if (btnType == 'secondary') {
        btnClass = 'secondary-btn';
    } else if (btnType == 'disabled') {
        btnClass = 'disabled-btn';
    }
    return (
        <>
        {isLoading && <button onClick={clickHandler} className={btnClass}><span className="spinner"></span></button>}
        {!isLoading && <button onClick={clickHandler} className={btnClass}>{text}</button>}
        </>
    )
}
