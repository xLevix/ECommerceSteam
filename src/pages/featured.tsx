import React, { useEffect, useState } from 'react';
import { ImageCard } from '@/components/ImageCard';
import { Grid } from '@mantine/core';
import axios from 'axios';
import { SteamProfile } from '@/lib/passport';
import {checkAuth} from "@/components/auth";

type GameData = {
    id: number;
    name: string;
    final_price: number;
    currency: string;
    large_capsule_image: string;
};

type MainPageProps = {
    user: SteamProfile | null;
}

function MainPage({ user }: MainPageProps) {
    const [data, setData] = useState<GameData[] | null>(null);

    useEffect(() => {
        axios.get('/api/steam')
            .then((response) => {
                setData(response.data.featured_win);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    return (
        <Grid gutter="lg">
            {data && data.map((game: GameData, index: number) => (
                <Grid.Col key={index} span={4} md={6} sm={12} lg={4}>
                    <ImageCard
                        image={game.large_capsule_image}
                        title={game.name}
                        price={`Click to see price`}
                        link={`/games/${game.id}`}
                    />
                </Grid.Col>
            ))}
        </Grid>
    );
}

export const getServerSideProps = checkAuth;
export default MainPage;
