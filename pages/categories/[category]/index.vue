<script lang="ts" setup>
import type { ErcsCollectionItem } from '@nuxt/content';
import { Background } from '@vue-flow/background';
import {
  MarkerType,
  Position,
  useVueFlow,
  VueFlow,
  type Edge,
  type Node,
} from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import { MiniMap } from '@vue-flow/minimap';
import Linker from '~/components/vueflow/Linker.vue';
const route = useRoute();
const category = route.params.category;
const categories = useCategories();
const categoryData = categories.value.find((c) => c.id === category);
if (!categoryData) {
  throw new Error('Category not found');
}
const { data } = await useErcDataAll();
const { layout } = useLayout();
const { fitView, onInit, findNode, setViewport } = useVueFlow();

const nodeTypes = {
  linker: markRaw(Linker),
};

function getRootEIPDependent(data: ErcsCollectionItem[], rootEIP: number) {
  const requires = new Set<number>();
  const checker = (data: ErcsCollectionItem[]) => {
    for (const item of data) {
      if (item.requires) {
        const requiresEIPs = item.requires
          .split(',')
          .map((eip) => eip.trim())
          .filter((eip) => eip !== '')
          .map(Number);
        if (requiresEIPs.includes(rootEIP)) {
          requires.add(item.eip);
          continue;
        }
        checker(
          requiresEIPs
            .map((eip) => data.find((item) => item.eip === eip))
            .filter((item) => !!item)
        );
      }
    }
  };
  checker(data);
  return [...requires];
}
const dependent = getRootEIPDependent(data.value ?? [], categoryData.rootEIP!);
const eips = (data.value ?? [])
  .map((item) => ({
    eip: item.eip,
    description: item.title,
    requires: (item.requires ?? '')
      .split(',')
      .map((eip) => eip.trim())
      .filter((eip) => eip !== ''),
  }))
  .flat();
const edges = ref<Edge[]>(
  categoryData.id === 'miscellaneous'
    ? []
    : eips
        .map((item) =>
          item.requires.map(
            (eip) =>
              ({
                id: `e${eip}-${item.eip}`,
                // type: 'smoothstep',
                target: item.eip.toString(),
                source: eip.toString(),
                markerEnd: MarkerType.ArrowClosed,
              } satisfies Edge)
          )
        )
        .flat()
);

const nodes = ref<Node[]>(
  eips
    .filter(
      (item) =>
        (!(categoryData.id === 'miscellaneous' && item.requires.length === 0) &&
          categoryData.id !== 'miscellaneous' &&
          dependent.includes(item.eip)) ||
        item.eip === categoryData.rootEIP
    )
    .map<Node>(
      (item) =>
        ({
          id: item.eip.toString(),
          position: { x: 0, y: 0 },
          data: {
            label: item.description,
            title: `ERC-${item.eip}`,
            to: `/EIPS/eip-${item.eip}`,
          },
          type: 'linker',
          sourcePosition:
            item.eip === categoryData.rootEIP ? Position.Bottom : Position.Top,
          targetPosition:
            item.eip === categoryData.rootEIP ? Position.Top : Position.Bottom,
        } satisfies Node)
    )
);
async function layoutGraph(direction: 'TB' | 'LR') {
  nodes.value = layout(nodes.value, edges.value, direction);

  nextTick(async () => {
    fitView();
    if (categoryData && categoryData.rootEIP) {
      const centerNode = findNode(categoryData.rootEIP.toString());

      if (centerNode) {
        console.log(centerNode);
        await setViewport({
          x: centerNode.position.x,
          y: centerNode.position.y,
          zoom: 1,
        });
      }
    }
  });
}
</script>
<template>
  <div class="w-full flex flex-col grow px-6 py-8">
    <UCard
      v-if="categoryData"
      class="grow flex flex-col"
      :ui="{
        body: { base: 'h-full grow grid grid-cols-1 grid-rows-1', padding: '' },
      }"
    >
      <template #header>
        <div class="flex justify-between">
          <h1>{{ categoryData.name }}</h1>
          <div>
            <UBadge class="ml-1" v-for="item in categoryData.tags">{{
              item
            }}</UBadge>
          </div>
        </div>
      </template>
      <div class="w-full h-full">
        <ClientOnly>
          <VueFlow
            @nodes-initialized="layoutGraph('TB')"
            :nodes="nodes"
            :edges="edges"
            :nodes-connectable="false"
            fit-view-on-init
            class="min-w-full min-h-full bg-[#1a192b]"
          >
            <template #node-linker="props">
              <Linker
                :to="props.data.to"
                :label="props.data.label"
                :title="props.data.title"
              />
            </template>
            <Background />
            <MiniMap />
          </VueFlow>
        </ClientOnly>
      </div>
    </UCard>
  </div>
</template>
