<template>
  <div class="max-w-screen flex flex-col min-h-dvh">
    <div class="flex justify-stretch m-4">
      <NuxtLink href="/">
        <h1 class="text-3xl">EIP Finder</h1>
      </NuxtLink>
      <div class="grow" />
      <div class="flex text-lg my-auto gap-x-8">
        <NuxtLink href="/">Search</NuxtLink>
        <NuxtLink href="/categories">Categories</NuxtLink>
        <!-- <NuxtLink href="/about">About</NuxtLink> -->
        <NuxtLink href="https://github.com/j4w3ny/eip-finder"
          ><UIcon name="i-grommet-icons-github" class="size-6"
        /></NuxtLink>
      </div>
    </div>
    <UDivider />
    <slot />
    <UDivider />
    <div class="flex items-center justify-center m-2" id="footer">
      <p class="text-gray-400">©2025-present moumantai</p>
    </div>
  </div>
</template>
