<script setup lang="ts">
import type { ErcsCollectionItem } from '@nuxt/content';
import MiniSearch from 'minisearch';
const { data } = await useAsyncData('ercsSearchQuery', () =>
  queryCollection('ercs').where('eip', 'IN', [20, 721, 1155]).all()
);

const query = ref<ErcsCollectionItem | undefined>(undefined);
const loading = ref(false);
const { data: searchData } = await useErcDataAll();

if (!searchData.value) {
  throw new Error('No search data found');
}
const miniSearch = new MiniSearch({
  fields: ['eip', 'title'],
  storeFields: ['title', 'eip'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
  },
});

// Add data to the MiniSearch instance
miniSearch.addAll(toValue(searchData.value));
async function search(query: string) {
  const result = miniSearch.search(toValue(query));
  return result;
}
</script>
<template>
  <div class="grow flex flex-col gap-4 justify-center m-8 justify-items-end">
    <!-- <div class="grow" /> -->
    <div class="flex flex-col justify-center w-full">
      <div class="flex w-full justify-center">
        <UCard class="min-w-64 w-[50%]">
          <UInputMenu
            v-model="query"
            :search="search"
            :loading="loading"
            placeholder="Search any ERC..."
            class="w-full justify-center"
            trailing
            @update:model-value="
              query && navigateTo(`/EIPS/eip-${query.eip}`, { replace: true })
            "
          >
            <template #option="{ option: result }">
              <ULink
                :to="`/EIPS/eip-${result.eip}`"
                class="w-full flex"
                target="_self"
              >
                <UButton variant="outline">
                  <h3>ERC-{{ result.eip }}</h3>
                  <h4>{{ result.title }}</h4>
                </UButton>
              </ULink>
            </template>
          </UInputMenu>
        </UCard>
      </div>
      <!-- <div class="flex w-full justify-center" v-if="result.length > 0">
        <UCard class="min-w-64 w-[50%] max-h-32 min-h-16 relative">
          <ul class="absolute h-full overflow-auto w-full">
            <li v-for="item in result" :key="item.id">
              <ULink :to="`/EIPS/eip-${item.eip}`">ERC-{{ item.eip }}</ULink>
              <p class="text-gray-500 text-xs">{{ item.title }}</p>
            </li>
          </ul>
        </UCard>
      </div> -->
    </div>
    <div class="grid grid-cols-3 gap-4">
      <UCard v-for="erc in data">
        <template #header>
          <div class="flex justify-between">
            <h1>ERC-{{ erc.eip }}</h1>
            <h3>{{ erc.status }}</h3>
          </div>
          <h4>{{ erc.title }}</h4>
        </template>
        <template #footer>
          <div class="flex justify-end">
            <ULink :to="`/EIPS/eip-${erc.eip}`">Go to EIP-{{ erc.eip }}</ULink>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
