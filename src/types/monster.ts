export interface Monster {
    id: number;
    name: string;
    types: string[];
    stats: number[];
    image: string;
}

export interface MonsterListProps {
    monsters: Monster[];
}
