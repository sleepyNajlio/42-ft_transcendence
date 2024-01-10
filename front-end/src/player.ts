import axios from 'axios';
import { Player, User, user,  user_stats, History } from './Components/types.ts';

let player: user | null;
let history: History[] | null;
let stats: user_stats | null;

async function getUserInfo(): Promise<user | null> {
    const response = await fetch("http://localhost:3000/profile", {
        credentials: "include",
        method: "GET",
    });
    if (response.ok) {
        const res = await response.json();
        // console.log("user: ", res);
        const stats: user_stats = {
            winsRat: Number(res.user.wins) ? Number(res.user.wins) / (Number(res.user.wins) + Number(res.user.loses)): 0,
            wins: Number(res.user.wins),
            achievement: 0,
            total_matches: Number(res.user.wins) + Number(res.user.loses),
        };
        const user: user = {
            id: res.user.id_player,
            username: res.user.username,
            rank: 0,
            avatar: res.user.avatar,
            achievement: [],
            user_stats: stats,
        };
        return user;
    } else {
        // alert("Failed to fetch user data");
        console.log("Failed to fetch user data");
        return null;
        // console.log(response.message);
    }
}

async function getMatchHistory(id: number): Promise<History[] | null> {

    return new Promise<History[] | null>((resolve, reject) => {
        axios.get(`http://localhost:3000/profile/history/${id}`, { withCredentials: true })
            .then((res) => {
                const matches: History[] = [];
                res.data.forEach((match: any) => {
                    matches.push({
                        score1: match.score1,
                        user2: match.user2,
                        score2: match.score2,
                    });
                });
                resolve(matches);
            })
            .catch((err) => {
                console.log('err: ', err);
                reject(null);
            });
    });
}


export async function initializeUser() : Promise<Boolean>  {
    try {
        const res = await getUserInfo();
        const res2 = await getMatchHistory(Number(res?.id));
        history = res2;
        // console.log("got user : ", res);
        player = res;
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function getUser() : Promise<user> {
    if (player) {
        return player;
    }
    else
        throw new Error("User not initialized");
}

export async function getHistory() : Promise<History[]> {
    if (history) {
        return history;
    }
    else
        throw new Error("history not initialized");
}
