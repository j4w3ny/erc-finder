<script setup lang="ts">
defineProps<{
  eip: number;
  title: string;
  status:
    | 'Living'
    | 'Final'
    | 'Last Call'
    | 'Review'
    | 'Draft'
    | 'Stagnant'
    | 'Withdrawn';
  author: string;
}>();
</script>
<template>
  <div class="size-full flex flex-col text-white bg-[#171717]">
    <div class="flex flex-col size-full p-20">
      <div class="flex flex-row justify-between">
        <h1 class="text-8xl">ERC-{{ eip }}</h1>
        <h2 class="text-4xl my-auto">{{ status }}</h2>
      </div>
      <div>
        <h3 class="text-4xl font-light">{{ title }}</h3>
      </div>
    </div>
  </div>
</template>
