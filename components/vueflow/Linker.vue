<script lang="ts" setup>
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <NuxtLink
    class="flex flex-col justify-center items-center border rounded px-8 py-2 bg-white text-black"
    :to="props.to"
  >
    <h1>{{ props.title }}</h1>
    <p>
      {{ props.label }}
    </p>
  </NuxtLink>
</template>
