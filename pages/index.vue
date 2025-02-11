<script setup lang="ts">
const { data } = await useAsyncData('ercs', () =>
  queryCollection('ercs').where('eip', 'IN', [20, 721, 1155]).all()
);
</script>
<template>
  <div class="grow flex flex-col gap-4 justify-center m-8 justify-items-end">
    <!-- <div class="grow" /> -->
    <UCard>
      <InputMenu class="h-20"></InputMenu>
    </UCard>
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
