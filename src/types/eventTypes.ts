export interface IEvent {
    name: string;
    duration: number;
    date: string;
    description?: string;
    image?: string;
    platoons: [IPlatoon];
}

export interface IPlatoon {
    name: string;
    color: string;
    image?: string;
    squads: [ISquad];
}

export interface ISquad {
    name: string;
    roles: [IRole];
    busyRoles: [IUsedRoles];
    waitingList: [IUsedRoles];
    enlisted: [IUsedRoles];
}

export interface IUsedRoles {
    discordId: string;
    role: string;
    playerName: string
    roleDiscordId: number
}

export interface IRole {
    name: string;
    count: number;
}
