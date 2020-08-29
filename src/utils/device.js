

function isMobile() {
	const MOBILES = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
	const ua = navigator.userAgent;
	return MOBILES.some(m => ua.indexOf(m) >= 0);
}


export {
    isMobile,
}