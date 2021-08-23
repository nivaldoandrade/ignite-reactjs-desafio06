import { SimpleGrid, useDisclosure, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
	title: string;
	description: string;
	url: string;
	ts: number;
	id: string;
}

interface CardsProps {
	cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
	// TODO MODAL USEDISCLOSURE
	const { isOpen, onOpen, onClose } = useDisclosure();

	// TODO SELECTED IMAGE URL STATE
	const [currentImgUrl, setCurrentImgUrl] = useState('');
	const [currentImgTitle, setCurrentImgTitle] = useState('');

	// TODO FUNCTION HANDLE VIEW IMAGE
	function handleViewImage(url: string, title: string): void {
		setCurrentImgUrl(url);
		setCurrentImgTitle(title);
		onOpen();
	}

	return (
		<>
			{/* TODO CARD GRID */}
			<SimpleGrid columns={[1, 2, null, 3]} spacing="40px">
				{cards?.map(card => (
					<Card
						key={card.id} data={card}
						viewImage={() => handleViewImage(card.url, card.title)}
					/>
				))}
			</SimpleGrid>

			{/* TODO MODALVIEWIMAGE */}
			{isOpen && (
				<ModalViewImage
					isOpen={isOpen}
					onClose={onClose}
					imgUrl={currentImgUrl}
					title={currentImgTitle}
				/>
			)}
		</>
	);
}
