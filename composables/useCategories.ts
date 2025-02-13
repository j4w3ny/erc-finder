import { useState } from '#app';
export function useCategories() {
  return useState('categories', () => [
    {
      id: 'erc-20',
      name: 'ERC-20',
      rootEIP: 20,
      tags: ['erc-20', 'figuable token'],
    },
    {
      id: 'erc-721',
      name: 'ERC-721',
      rootEIP: 721,
      tags: ['erc-721', 'non-figuable token'],
    },
    // { id: 'miscellaneous', name: 'Miscellaneous', tags: [] },
  ]);
}
