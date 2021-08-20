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


  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: true,
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: true,
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: true,
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (data: ImageCreateFormData) => {
      const response = await api.post('api/images', { ...data, url: imageUrl });
      console.log(response.data);
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
      // TODO EXECUTE ASYNC MUTATION
      await mutation.mutateAsync(data);
      // TODO SHOW SUCCESS TOAST
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      console.log('error');
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
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
        />

        <TextInput
          placeholder="Título da imagem..."
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...register('title', formValidations.title)}
        // TODO SEND TITLE ERRORS
        />

        <TextInput
          placeholder="Descrição da imagem..."
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description', formValidations.description)}
        // TODO SEND DESCRIPTION ERRORS
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
