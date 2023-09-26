export function isTokenExpired(accessTokenExpiredDate: string): boolean {
  const currentDate = new Date();
  const expirationDate = new Date(accessTokenExpiredDate);

  return currentDate >= expirationDate;
}
