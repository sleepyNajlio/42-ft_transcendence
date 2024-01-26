import axios from 'axios';
import { Player, User, user,  user_stats, History } from './Components/types.ts';
import { getSocket } from './socket.ts'

let player: user | null;
let history: History[] | null;
let stats: user_stats | null;

export async function getUserInfo(id?: number): Promise<user | null> {
    let response;
    console.log("id: ", id);
    if (!id) {
        response = await fetch("http://localhost:3000/profile", {
            credentials: "include",
            method: "GET",
        });
    }
    else
    {
        response = await fetch(`http://localhost:3000/profile/friend/${id}`, {
            credentials: "include",
            method: "GET",
        });
    }
    if (response.ok) {
        const res = await response.json();
        const stats: user_stats = {
            winsRat: Number(res.user.wins) ? Number(res.user.wins) / (Number(res.user.wins) + Number(res.user.loses)): 0,
            wins: Number(res.user.wins),
            achievement:Number(0),
            total_matches: Number(res.user.wins) + Number(res.user.loses),
        };
        if(stats.total_matches >= 1)
            stats.achievement += 1;
        if(stats.total_matches >= 3)
            stats.achievement += 1;
        if(res.user.wins >= 3)
            stats.achievement += 1;
        if(stats.winsRat === 1 && stats.total_matches >= 5)
            stats.achievement += 1;
        const achievement : number = stats.achievement;
        const rank: number = (await axios.get(`http://localhost:3000/profile/rank/${res.user.id_player}`, { withCredentials: true })).data;
        console.log("rank: ", rank);
        // console.log("achie: ", achievement);
        const user: user = {
            id: res.user.id_player,
            username: res.user.username,
            rank: rank,
            avatar: res.user.avatar,
            achievement: achievement,
            user_stats: stats,
            friend: res.state,
            status: res.user.status,
        };
        return user;
    } else {
        // alert("Failed to fetch user data");
        console.log("Failed to fetch user data");
        return null;
        // console.log(response.message);
    }
}

export async function getRank(): Promise<number> {
    if (player){
        const rank: number = (await axios.get(`http://localhost:3000/profile/rank/${player?.id}`, { withCredentials: true })).data;
        player.rank = rank;
    }
    return player?.rank || 0;
}  

export async function getAchievement(): Promise<number> 
{
    if (player){
        const achievement: number = (await axios.get(`http://localhost:3000/profile/achievement/${player?.id}`, { withCredentials: true })).data;
        player.user_stats.achievement = achievement;
    }
    return player?.user_stats.achievement || 0;
}

export async function getMatchHistory(id: number): Promise<History[] | null> {

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
        player = res;
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function addFriend (id: number) {
    const socket = getSocket();
    if(socket)
    {
      socket.emit('addFriend', {id: Number(player?.id), frId: id, username: player?.username, avatar: player?.avatar});
    }
    try {
      const response = await axios.post('http://localhost:3000/profile/friend', {
        id, // replace this with the friend's id
      }, { withCredentials: true });
      console.log(response.data.message);
    } catch (error : any) {
      console.error(error.response.data);
    }
}

export async function blockFriend (id: number) {
    const socket = getSocket();
    if(socket)
    {
    socket.emit('block', {id: Number(player?.id), frId: id, username: player?.username, avatar: player?.avatar});
    }
    try {
    const response = await axios.post('http://localhost:3000/profile/update/friend', {
        id, // replace this with the friend's id
        status: "BLOCKED"
    }, { withCredentials: true });
    console.log(response.data.message);
    } catch (error : any) {
    console.error(error.response.data);
    }
}

export async function acceptFriend (id: number) {
    const socket = getSocket();
    if(socket)
    {
        socket.emit('acceptFriend', {id: Number(player?.id), frId: id, username: player?.username, avatar: player?.avatar});
    }
    try {
      const response = await axios.post('http://localhost:3000/profile/update/friend', {
        id,
        status: "ACCEPTED" // replace this with the friend's id
      }, { withCredentials: true });
      console.log(response.data.message);
    } catch (error : any) {
      console.error(error.response.data);
    }
}

export async function rejectFriend (id: number) {
    const socket = getSocket();
    if(socket)
    {
        socket.emit('rejectedFriend', {id: Number(player?.id), frId: id, username: player?.username, avatar: player?.avatar});
    }
    try {
      const response = await axios.post('http://localhost:3000/profile/update/friend', {
        id, // replace this with the friend's id
        status: "REJECTED"
      }, { withCredentials: true });
      console.log(response.data.message);
      // props.setFriend(null);
    } catch (error : any) {
      console.error(error.response.data);
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

export async function getRanks() : Promise<user[]> {
    const res = await axios.get("http://localhost:3000/profile/ranks", { withCredentials: true });
    console.log("ranks: ", res.data);
    const ranks: user[] = [];
    let achi: number = 0;
    res.data.forEach((rank: any) => {
        const stats: user_stats = {
            winsRat: Number(rank.wins) ? Number(rank.wins) / (Number(rank.wins) + Number(rank.loses)): 0,
            wins: Number(rank.wins),
            achievement: 0,
            total_matches: Number(rank.wins) + Number(rank.loses),
        };
        if(stats.total_matches >= 1)
            stats.achievement += 1;
        if(stats.total_matches >= 3)
            stats.achievement += 1;
        if(stats.wins >= 3)
            stats.achievement += 1;
        if(stats.winsRat === 1 && rank.total_matches >= 5)
            stats.achievement += 1;
        const user: user = {
            id: rank.id_player,
            username: rank.username,
            rank: rank.rank,
            avatar: rank.avatar,
            achievement: achi,
            user_stats: stats,
            status: "",
        };
        ranks.push(user);
    });
    console.log("ranks: ", ranks);
    return ranks;
}