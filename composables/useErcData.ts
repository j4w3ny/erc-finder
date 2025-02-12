import { useAsyncData } from '#app';
import { queryCollection } from '#imports';
export async function useErcDataAll() {
  return await useAsyncData('ercs', () => queryCollection('ercs').all());
}

export async function useErcData(eip: string) {
  return await useAsyncData('ercsData', () =>
    queryCollection('ercs').where('eip', '=', eip).first()
  );
}
