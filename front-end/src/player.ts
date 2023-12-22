import { User } from './Components/types.ts';

let player: User | null;

async function getUserInfo(): Promise<User | null> {
    const response = await fetch("http://localhost:3000/profile", {
        credentials: "include",
        method: "GET",
    });
    if (response.ok) {
        const res = await response.json();
        // console.log("user: ", res);
        return res.user as User;
    } else {
        // alert("Failed to fetch user data");
        console.log("Failed to fetch user data");
        return null;
        // console.log(response.message);
    }
}

export async function initializeUser() : Promise<Boolean>  {
    try {
        const res = await getUserInfo();
        // console.log("got user : ", res);
        player = res;
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function getUser() : Promise<User> {
    if (player) {
        return player;
    }
    else
        throw new Error("User not initialized");
}
