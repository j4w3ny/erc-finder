<script lang="ts" setup>
import { useVueFlow, type Edge, type Node } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
const { data } = await useErcDataAll();
const { layout } = useLayout();
const { fitView } = useVueFlow();

interface Category {
  id: string;
  name: string;
  rootEIP?: number;
  tags: string[];
}

const categories = ref<Category[]>([
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
  { id: 'miscellaneous', name: 'Miscellaneous', tags: [] },
]);

const nodes = ref<Node[]>(
  (data.value ?? []).map((item) => ({
    id: item.eip.toString(),
    position: { x: 0, y: 0 },
    data: { label: `ERC-${item.eip}` },
  }))
);
const edges = ref<Edge[]>(
  data.value
    ?.filter((item) => item.requires)
    .map((item) => {
      const requiresEIP = item
        .requires!.split(',')
        .map((eip) => Number(eip.trim()));
      const targetEIP = item.eip;
      return requiresEIP.map((eip) => ({
        id: `e${eip}-${targetEIP}`,
        target: targetEIP.toString(),
        source: eip.toString(),
      }));
    })
    .flat() ?? []
);

async function layoutGraph(direction: 'TB' | 'LR') {
  nodes.value = layout(nodes.value, edges.value, direction);

  nextTick(() => {
    fitView();
  });
}
</script>
<template>
  <div class="grow py-4 px-8 flex">
    <UCard class="w-full flex flex-col grow" :ui="{ body: { base: '' } }">
      <template #header>
        <div>
          <h1>Categories</h1>
        </div>
      </template>
      <!-- <div class="w-full h-full grid grid-cols-4 grid-rows-4"> -->
      <div class="grid grid-cols-3 gap-6 grid-flow-row">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.id}`"
          class="shadow-lg"
        >
          <UCard>
            <template #header>
              <div class="flex justify-between">
                <h2>{{ category.name }}</h2>
                <div class="items-center block h-full">
                  <UBadge v-for="tag in category.tags" class="ml-2 my-auto">{{
                    tag
                  }}</UBadge>
                </div>
              </div>
            </template>
            <div class="flex flex-row gap-1 max-w-full overflow-auto">
              <template v-for="edge in edges">
                <UBadge v-if="edge.source === category.rootEIP?.toString()">
                  {{ edge.target }}
                </UBadge>
              </template>
            </div>
          </UCard>
        </NuxtLink>
      </div>
      <!-- </div> -->
      <!-- <div class="w-full h-full grid grid-cols-1 grid-rows-1">
        <ClientOnly>
          <VueFlow
            @nodes-initialized="layoutGraph('TB')"
            :nodes="nodes"
            :edges="edges"
            :nodes-connectable="false"
            class="min-w-full min-h-full bg-[#1a192b]"
            ><Background />
          </VueFlow>
        </ClientOnly>
      </div> -->
    </UCard>
  </div>
  <NuxtPage />
</template>
