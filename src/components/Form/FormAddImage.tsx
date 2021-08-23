/* eslint-disable prettier/prettier */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
	closeModal: () => void;
}

interface ImageCreateFormData {
	title: string;
	description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
	const [imageUrl, setImageUrl] = useState('');
	const [localImageUrl, setLocalImageUrl] = useState('');
	const toast = useToast();

	console.log(localImageUrl);

	const formValidations = {
		image: {
			// TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
			required: true && 'Arquivo obrigatório',
			validate: {
				lessThan10MB: files => files[0]?.size < 10000000 ||
					'O arquivo deve ser menor que 10MB',
				acceptedFormats: files =>
					['image/jpeg', 'image/png', 'image/gif'].includes(
						files[0]?.type
					) || 'Somente são aceitos arquivos PNG, JPEG e GIF',
			}
		},
		title: {
			// TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
			required: true && 'Título obrigatório',
			minLength: 2 && 'Mínimo de 2 caracteres',
			maxLength: 20 && 'Máximo de 20 caracteres',
		},
		description: {
			// TODO REQUIRED, MAX LENGTH VALIDATIONS
			required: true && 'Descrição obrigatória',
			maxLength: 65 && 'Máximo de 65 caracteres',
		},
	};

	const queryClient = useQueryClient();
	const mutation = useMutation(
		// TODO MUTATION API POST REQUEST,
		async (data: ImageCreateFormData) => {
			await api.post('api/images', { ...data, url: imageUrl });
		},
		{
			// TODO ONSUCCESS MUTATION
			onSuccess: () => {
				queryClient.invalidateQueries('images');
			},
		}
	);

	const { register, handleSubmit, reset, formState, setError, trigger } =
		useForm();
	const { errors } = formState;


	const onSubmit: SubmitHandler<ImageCreateFormData> = async (
		data
	): Promise<void> => {
		try {
			// TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
			if (!imageUrl) {
				toast({
					title: "Imagem não adicionada",
					description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
					status: "error",
					duration: 9000,
					isClosable: true,
				})
			}
			// TODO EXECUTE ASYNC MUTATION
			await mutation.mutateAsync(data);
			// TODO SHOW SUCCESS TOAST
			toast({
				title: "Imagem cadastrada",
				description: "Sua imagem foi cadastrada com sucesso.",
				status: "success",
				duration: 9000,
				isClosable: true,
			})
		} catch {
			// TODO SHOW ERROR TOAST IF SUBMIT FAILED
			toast({
				title: "Falha no cadastro",
				description: "Ocorreu um erro ao tentar cadastrar a sua imagem.",
				status: "error",
				duration: 9000,
				isClosable: true,
			})
		} finally {
			// TODO CLEAN FORM, STATES AND CLOSE MODAL
			reset({ image: '', title: '', description: '' });
			closeModal();
		}
	};

	return (
		<Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={4}>
				<FileInput
					setImageUrl={setImageUrl}
					localImageUrl={localImageUrl}
					setLocalImageUrl={setLocalImageUrl}
					setError={setError}
					trigger={trigger}
					// TODO REGISTER IMAGE INPUT WITH VALIDATIONS
					{...register('image', formValidations.image)}
					// TODO SEND IMAGE ERRORS
					error={
						(
							formValidations.image.validate[errors.image?.type] ||
							errors.image?.type === 'required'
						)
						&& errors.image
					}
				/>

				<TextInput
					placeholder="Título da imagem..."
					// TODO REGISTER TITLE INPUT WITH VALIDATIONS
					{...register('title', formValidations.title)}
					// TODO SEND TITLE ERRORS
					error={errors.title?.type === 'required' && errors.title}
				/>

				<TextInput
					placeholder="Descrição da imagem..."
					// TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
					{...register('description', formValidations.description)}
					// TODO SEND DESCRIPTION ERRORS
					error={errors.description?.type === 'required' && errors.title}
				/>
			</Stack>

			<Button
				my={6}
				isLoading={formState.isSubmitting}
				isDisabled={formState.isSubmitting}
				type="submit"
				w="100%"
				py={6}
			>
				Enviar
			</Button>
		</Box>
	);
}
