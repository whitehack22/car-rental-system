import { IAuthData } from "./authData";

export function product(a: number, b: number): number {
    return a * b;
}

// This function simulates an authentication process
export function authenticateUser(username: string, password: string): IAuthData {
    // simulate an authentication process
    const authStatus = username === "deveLOPER" && password === "dev";
    return {
        usernameToLower: username.toLowerCase(),
        usernameCharacters: username.split(''),
        userDetails: {},
        isAuthenticated: authStatus,
    }
}

// Simulating a user name error
export class UserNameToLowerCase {
    public toLower(username: string): string {
        if (username === "") {
            throw new Error("Username cannot be empty");
        }
        return username.toLowerCase();
    }
}

