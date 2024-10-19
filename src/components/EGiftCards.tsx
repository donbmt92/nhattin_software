import React from 'react';

const giftCards = [
    { id: 1, name: 'Razer Gold', image: 'https://gamikey.com/wp-content/uploads/2024/09/Razer.jpg' },
    { id: 2, name: 'Amazon', image: 'https://gamikey.com/wp-content/uploads/2024/09/Amazone.jpg' },
    { id: 3, name: 'iTunes', image: 'https://gamikey.com/wp-content/uploads/2024/09/Itune.jpg' },
    { id: 4, name: 'Tinder', image: 'https://gamikey.com/wp-content/uploads/2024/09/Tinder.jpg' },
    { id: 5, name: 'Spotify', image: 'https://gamikey.com/wp-content/uploads/2024/09/Spotify.jpg' },
    { id: 6, name: 'Netflix', image: 'https://gamikey.com/wp-content/uploads/2024/09/Netflix.jpg' },
    { id: 7, name: 'Google Play', image: 'https://gamikey.com/wp-content/uploads/2024/09/Google.jpg' },
];

export default function EGiftCards() {
    return (
        <div className="w-full bg-gray-100 py-8">
            <div className="mx-auto px-4 sm:px-6 lg:px-8"  style={{ maxWidth: '85rem' }}>
                <h2 className="text-2xl font-bold text-center mb-6">EGIFT CARDS SẮP RA MẮT</h2>
                <div className="flex overflow-x-auto pb-4 gap-4">
                    {giftCards.map((card) => (
                        <div key={card.id} className="flex-shrink-0 w-48">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={card.image} alt={card.name} className="w-full h-60 object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
