export interface ICreateEvent {
    name: string;
    duration: number;
    date: string;
    description: string;
    image?: string;
    platoons: [
        {
            squads: [
                {
                    roles: [
                        {
                            name: string;
                            count: number;
                        }
                    ];
                }
            ];
        }
    ];
}

export interface IUpdateEvent {
    name?: string;
    duration?: number;
    date?: string;
    description?: string;
    image?: string;
}

export interface IRoleTypes {
    name: string;
    count: number;
}
