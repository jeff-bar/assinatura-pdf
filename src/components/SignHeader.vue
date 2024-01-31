<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

function changeLocale(code: string) {
  locale.value = code;
  localStorage.setItem('pdf-signature-i18n', code);
}
</script>

<template>
  <header class="sign_header">

    <div class="flex items-center gap-2 md:gap-4">
      <button
        :class="['btn_small btn_primary', { active: locale === 'pt-BR' }]"
        @click="changeLocale('pt-BR')"
      >
        Portugues
      </button>
      <button
        :class="['btn_small btn_primary', { active: locale === 'en-US' }]"
        @click="changeLocale('en-US')"
      >
        English
      </button>
    </div>
  </header>
</template>

<style lang="postcss" scoped>
.sign_header {
  @apply fixed w-full flex justify-between items-center  p-2 md:p-4;
}
</style>
