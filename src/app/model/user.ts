export class User {

  private isLoggedIn: boolean = false;
  private username: string = "";
  public authToken: string = "";
  private refreshToken: string = "";
  private roles: string[] = [];
  private isAdmin: boolean = false;

  public isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  public setAuthToken(token: string) {
    this.authToken = token;
  }

  public setRefreshToken(token: string) {
    this.refreshToken = token;
  }

  public getAuthToken():string {
    return this.authToken;
  }

  public getRefreshToken():string {
    return this.refreshToken;
  }

  public setUserLoginStatus(status: boolean) {
    this.isLoggedIn = status;
  }

  public setUserRoles(roles: string[]) {
    this.roles = roles;
  }

  public getUserRoles() {
    return this.roles;
  }

  public setUsername(username: string) {
    this.username = username;
  }

  public getUsername():string {
    return this.username;
  }

  public setIsUserAdmin(value: boolean) {
    this.isAdmin = value;
  }

  public checkIfUserIsAdmin():boolean {
    return this.isAdmin;
  }
}
