import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, Col, ImageCard, SimpleGrid } from '@mantine/core';

function SearchPage() {
    const history = useHistory;
    const [searchTerm, setSearchTerm] = useState('');
    const [games, setGames] = useState([]);

    const handleSearch = async () => {
        const res = await fetch(`/api/games?name=${searchTerm}`);
        const data = await res.json();
        const games = data.data;

        // Dla każdej gry wykonaj zapytanie do Steam API, aby uzyskać szczegóły gry
        const gamesWithDetails = await Promise.all(games.map(async game => {
            const steamRes = await fetch(`/api/games/${game.appid}`);
            if (steamRes.status === 200) {
                const steamData = await steamRes.json();
                return {
                    ...game,
                    header_image: steamData[game.appid].data.header_image
                };
            }

        }));

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
    {games.map((game) => (
        <Col key={game._id} span={3}>
    <ImageCard
        radius="md"
        image={game.header_image}
        title={game.name}
        onClick={() => handleCardClick(game.appid)}
        />
        </Col>
    ))}
    </SimpleGrid>
    </div>
);
}

export default SearchPage;
