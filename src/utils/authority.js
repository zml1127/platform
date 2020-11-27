import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('authorizeList') : str; // authorityString could be admin, "admin", ["admin"]

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }
  // console.log("authority::",authority)

  return authority;
}
export function setAuthority(authority) {
  // const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('authorizeList', JSON.stringify(authority)); // auto reload

  reloadAuthorized();
}
