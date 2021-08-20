import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ImageData {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface FetchPageResponse {
  data: ImageData[];
  after?: string;
}

export default function Home(): JSX.Element {
  const fetchPage = async ({ pageParam }): Promise<FetchPageResponse> => {
    const response = await api.get<FetchPageResponse>(`api/images`, {
      params: {
        pageParam,
      },
    });
    console.log(response.data);

    return {
      data: response.data.data,
      after: response.data.after,
    };
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    ({ pageParam = 0 }) => fetchPage(pageParam),
    // TODO GET AND RETURN NEXT PAGE PARAM
    {
      getNextPageParam: lastPage => lastPage.after,
    }
  );

  const formattedData: Array<ImageData> = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    return data?.pages.map(page => page.data).flat();
  }, [data]);

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
