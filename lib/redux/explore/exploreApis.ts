import { NEXT_SERVER } from 'config';
import fetcher from 'lib/common/fetcher';
import { Board } from 'types/profile/types';

export async function getAllBoard() {
  return await fetcher<Board[]>(`${NEXT_SERVER}/v1/board`);
}
