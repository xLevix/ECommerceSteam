import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, Col, SimpleGrid, Grid } from '@mantine/core';
import {ImageCard} from '../components/ImageCard';

function SearchPage() {
    const history = useHistory;
    const [searchTerm, setSearchTerm] = useState('');
    const [games, setGames] = useState([]);

    const handleSearch = async () => {
        //replace spaces with %20
        setSearchTerm(searchTerm.replace(' ', '%20'));
        const res = await fetch(`/api/games?name=${searchTerm}`);
        const data = await res.json();
        const games = data.data;
        const gamesWithDetails = await Promise.all(
            games.map(async (game) => {
                const steamRes = await fetch(`/api/games/${game.appid}`);
                const steamData = await steamRes.json();
                let price = '';
                if (steamData.price_overview && steamData.price_overview.final_formatted) {
                    price = steamData.price_overview.final_formatted;
                }
                return {
                    ...game,
                    header_image: steamData.header_image || '',
                    price,
                };
            })
        );

        setGames(gamesWithDetails);
    };


    const handleCardClick = (id) => {
        history.push(`/games/${id}`);
    };

    return (
        <div>
            <Input
                placeholder="Search games..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.currentTarget.value)}
    />
    <Button onClick={handleSearch}>Search</Button>

            <SimpleGrid cols={4} spacing="lg" style={{ marginTop: '20px' }}>
                {games.map((game) =>
                        game && (
                            <div key={game._id}>
                                <ImageCard
                                    link={`/games/${game.appid}`}
                                    image={game.header_image}
                                    title={game.name}
                                    price={game.price}  // Cena jest teraz stringiem
                                />
                            </div>
                        )
                )}
            </SimpleGrid>

    </div>
);
}

export default SearchPage;
