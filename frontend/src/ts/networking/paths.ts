const host: string = window.location.hostname ;
export let isLocal: boolean;
export let frontendURL: string;
export let backendURL: string;
const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

console.log(host);

if (host === "localhost" || ipRegex.test(host)) {
    isLocal = true;
    frontendURL = "http://"+host+":8080/";
    backendURL = "http://"+host+":3000/"
}else{
    isLocal = false;
    frontendURL = "https://blubb.io/";
    backendURL = "https://blubb.io/blubbio-backend/"
}

export function getProfilePicURL(){
    return backendURL + "pb/";
}