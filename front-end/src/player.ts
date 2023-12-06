import { User } from './Components/types.ts';

let player: User;

async function getUserInfo(): Promise<User> {
    const response = await fetch("http://localhost:3000/profile", {
        credentials: "include",
        method: "GET",
    });
    if (response.ok) {
        const res = await response.json();
        console.log("user: ", res);
        return res.user as User;
    } else {
        // alert("Failed to fetch user data");
        console.log("Failed to fetch user data");
        return {} as User;
        // console.log(response.message);
    }
}

export async function initializeUser() {
    player = await getUserInfo();
}

export function getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
        if (player) {
            resolve(player);
        } else {
            reject("User not found");
        }
    });
}