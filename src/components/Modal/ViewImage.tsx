import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	ModalBody,
	Image,
	Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
	isOpen: boolean;
	onClose: () => void;
	imgUrl: string;
	title?: string;
}

export function ModalViewImage({
	isOpen,
	onClose,
	imgUrl,
	title
}: ModalViewImageProps): JSX.Element {
	// TODO MODAL WITH IMAGE AND EXTERNAL LINK
	return (
		<Modal onClose={onClose} isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent maxWidth="56rem" w="auto" borderBottomRadius={8}>
				<ModalBody p={0} >
					<Image
						src={imgUrl}
						alt={title}
						maxHeight="37.5rem"
						objectFit="contain"
					/>
				</ModalBody>
				<ModalFooter
					background="pGray.800"
					justifyContent="flex-start"
					padding="0.5rem 0.625rem"
					borderBottomRadius={8}
				>
					<Link href={imgUrl} isExternal>
						Abrir original
					</Link>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
