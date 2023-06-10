import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Text, Title, Button, SimpleGrid} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import {checkAuth} from "@/components/auth";
import {SteamProfile} from "@/lib/passport";

interface Screenshot {
    id: number;
    path_thumbnail: string;
    path_full: string;
}

interface Game {
    steam_appid: number;
    name: string;
    detailed_description: string;
    header_image: string;
    price_overview?: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        initial_formatted: string;
        final_formatted: string;
        final_formatted_usd: string;
    };
    about_the_game: string;
    screenshots: Screenshot[];
}


type GamePageProps = {
    user: SteamProfile | null;
}

function GamePage({user}: GamePageProps) {
    const router = useRouter();
    const { id } = router.query;
    const [game, setGame] = useState<Game | null>(null);

    useEffect(() => {
        if (id) {
            getGame();
        }
    }, [id]);

    async function getGame() {
        try {
            const response = await axios.get<Game>(`/api/games/${id}`);
            if (response.data.price_overview) {
                // Convert to PLN
                const currencyResPLN = await fetch('/api/convert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: response.data.price_overview.final / 100 }),
                });

                const { convertedAmount: convertedAmountPLN } = await currencyResPLN.json();
                response.data.price_overview.final_formatted = (convertedAmountPLN * 1.5).toFixed(2);

                const currencyResUSD = await fetch('/api/convertUSD', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: response.data.price_overview.final / 100 }),
                });

                const { convertedAmount: convertedAmountUSD } = await currencyResUSD.json();
                response.data.price_overview.final_formatted_usd = (convertedAmountUSD * 1.5).toFixed(2);
            }
            setGame(response.data);
        } catch (error) {
            console.error("Failed to load game data", error);
        }
    }


    if (!game) {
        return <p>Loading...</p>;
    }

    return (
        <SimpleGrid cols={1} spacing={"2%"}>
                <div>
                    <center>
                    <Carousel loop withIndicators speed={4}>
                        {game.screenshots.map((screenshot, index) => (
                            <Carousel.Slide key={index} size="100%">

                                <img
                                    src={screenshot.path_full}
                                    alt={game.name}
                                    style={{ width: '85%', height: 'auto'}}
                                />

                            </Carousel.Slide>
                        ))}
                    </Carousel>
                    </center>
                </div>

            <SimpleGrid cols={2} spacing="md">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:"160%"}}>
                        <Paper p="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%' }} shadow="md" radius="sm">
                            <div style={{ textAlign: 'center' }}>
                                <Title order={2}>About the Game</Title>
                                <div dangerouslySetInnerHTML={{ __html: game.detailed_description }} />
                            </div>
                        </Paper>
                    </div>

                    <div>
                        <Paper p="md" shadow="md" radius="sm" style={{height:"100%", width:"25%", float:"right", marginRight:"15%"}}>
                            <Title order={1}>{game.name}</Title>
                            <Text size="xl" style={{ marginBottom: '20px' }}>
                                {game.price_overview ? `Price: ${game.price_overview.final_formatted_usd + ' USD'}` : 'Price not available'}
                            </Text>
                            <Button className={"snipcart-add-item"}
                                    data-item-id={game.steam_appid}
                                    data-item-price={game.price_overview ? game.price_overview.final_formatted_usd : 'Price not available'}
                                    data-item-url={`https://ecommerce-steam.vercel.app/games/${game.steam_appid}`}
                                    data-item-description={game.detailed_description}
                                    data-item-image={game.header_image}
                                    data-item-name={game.name}
                                    color="blue" size={"lg"} fullWidth
                            >Add to Cart</Button>

                        </Paper>
                    </div>
            </SimpleGrid>
        </SimpleGrid>
    );

}

export const getServerSideProps = checkAuth;
export default GamePage;
