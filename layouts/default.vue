<template>
  <div class="max-w-screen flex flex-col min-h-dvh">
    <div class="flex justify-stretch m-4">
      <h1 class="text-3xl">EIP Finder</h1>
      <div class="grow" />
      <div class="flex text-lg my-auto gap-x-8">
        <NuxtLink href="/">Homepage</NuxtLink>
        <NuxtLink href="/categories">Categories</NuxtLink>
        <NuxtLink href="/about">About</NuxtLink>
        <NuxtLink
          ><UIcon name="i-grommet-icons-github" class="size-6"
        /></NuxtLink>
      </div>
    </div>
    <UDivider />
    <slot />
  </div>
</template>
