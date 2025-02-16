<script setup lang="ts">
/* import the required styles */
import '@vue-flow/core/dist/style.css';

/* import the default theme (optional) */
import { ClientOnly } from '#components';
import type { ErcsCollectionItem } from '@nuxt/content';
import { Background } from '@vue-flow/background';
import {
  MarkerType,
  useVueFlow,
  VueFlow,
  type Edge,
  type Node,
} from '@vue-flow/core';
import '@vue-flow/core/dist/theme-default.css';
import { array as A, eq as EQ } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

const route = useRoute();
if (typeof route.params.id !== 'string') {
  throw new Error('Invaild route');
}
const { data: ercData } = await useErcData(route.params.id);

if (ercData.value) {
  defineOgImageComponent('EIP', { ...ercData.value }, {});
}
const queryRequiresEIPs = async (ercData: ErcsCollectionItem) => {
  const data = await queryCollection('ercs')
    .where(
      'eip',
      'IN',
      ercData.requires?.split(',').map((item) => item.trim()) ?? []
    )
    .all();
  return data;
};
const { data: requiresEIPs } = await useAsyncData('ercsRequires', async () => {
  if (!ercData.value) return;
  const data = await queryRequiresEIPs(ercData.value);
  let result = data;
  if (data && A.isNonEmpty(data.filter((item) => item.requires))) {
    for (const item of data) {
      if (item.requires) {
        const eips = await queryRequiresEIPs(item);
        result = pipe(
          result,
          A.union(
            EQ.fromEquals(
              (x: ErcsCollectionItem, y: ErcsCollectionItem) => x.eip === y.eip
            )
          )(eips)
        );
      }
    }
  }
  return result;
});
const nodes = ref<Node[]>(
  (requiresEIPs.value ?? []).map((item) => ({
    id: item.eip.toString(),
    position: { x: 0, y: 0 },
    data: { label: `ERC-${item.eip}` },
  }))
);
if (ercData.value) {
  nodes.value.push({
    id: ercData.value.eip.toString(),
    position: { x: 0, y: 0 },
    data: { label: `ERC-${ercData.value.eip}` },
  });
}
let edgeData: Edge[] =
  requiresEIPs.value
    ?.map((item) =>
      item.requires?.split(',').map((require) => ({
        id: `e${require}-${item.eip}`,
        target: item.eip.toString(),
        source: require.trim(),
      }))
    )
    .filter((item) => !!item)
    .flat() ?? [];
if (ercData.value && ercData.value.requires) {
  const rootEdges: Edge[] = ercData.value.requires
    .split(',')
    .map((require) => ({
      id: `e${require}-${ercData.value!.eip}`,
      target: ercData.value!.eip.toString(),
      source: require.trim(),
      markerEnd: MarkerType.ArrowClosed,
    }))
    .filter((item) => !!item);
  edgeData = [...edgeData, ...rootEdges];
}
const edges = ref<Edge[]>(edgeData);

const metadataItems =
  ercData.value &&
  [
    ercData.value.requires && {
      label: 'Requires',
      icon: 'i-material-symbols-warning',
      content: ercData.value.requires
        .split(',')
        .map((item) => `ERC-${item.trim()}`)
        .join(', '),
    },
  ].filter((item) => !!item);

const { layout } = useLayout();
const { fitView } = useVueFlow();
async function layoutGraph(direction: 'TB' | 'LR') {
  nodes.value = layout(nodes.value, edges.value, direction);

  nextTick(() => {
    fitView();
  });
}
</script>
<template>
  <Head>
    <Meta
      property="og:title"
      :content="`ERC-${ercData?.eip} - ${ercData?.title}`"
    />
    <Title>ERC-{{ ercData?.eip }}</Title>
  </Head>
  <div v-if="!ercData">Cannot find requested ERC</div>
  <div
    v-else
    class="w-full grid grid-cols-2 grid-rows-12 grid-flow-col-dense px-8 py-4 gap-4"
  >
    <div class="flex gap-y-4 flex-col row-span-12">
      <UCard class="">
        <template #header>
          <div class="flex justify-between">
            <h1>ERC-{{ ercData.eip }}</h1>
            <h3>{{ ercData.status }}</h3>
          </div>
          <div class="flex justify-between">
            <h4>{{ ercData.title }}</h4>
          </div>
          <p class="text-gray-400">{{ ercData.author }}</p>
        </template>
        <template #default v-if="metadataItems && A.isNonEmpty(metadataItems)">
          <UAccordion :items="metadataItems" />
        </template>
      </UCard>
      <UCard
        class="grow flex flex-col"
        :ui="{ body: { base: 'h-full', padding: '' } }"
      >
        <template #header>
          <h2>Hierarchy Graph of ERC-{{ ercData.eip }}</h2>
        </template>
        <ClientOnly>
          <VueFlow
            @nodes-initialized="layoutGraph('TB')"
            :nodes="nodes"
            :edges="edges"
            class="min-w-full min-h-full bg-[#1a192b]"
            ><Background />
            <!-- <MiniMap /> -->
          </VueFlow>
          <!-- </div> -->
        </ClientOnly>
      </UCard>
    </div>
    <UCard class="row-span-12" :ui="{ body: { base: 'h-dvh flex' } }">
      <template #header>
        <h2>Documentation</h2>
      </template>
      <template #default>
        <ContentRenderer
          class="md-style overflow-auto h-full"
          :value="ercData"
        />
      </template>
      <template #footer>
        <div class="flex justify-between">
          <a
            :href="`https://eips.ethereum.org/EIPS/eip-${ercData.eip}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on eips.ethereum.org
          </a>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style lang="css">
.md-style {
  h2 {
    @apply leading-10;
  }
  p {
    @apply my-2;
  }
  a {
    @apply underline text-wrap break-all;
  }
  li {
    @apply indent-8 my-2;
  }
  ol {
    @apply list-decimal list-inside;
  }
  ul {
    @apply list-disc list-inside;
  }
}
</style>
