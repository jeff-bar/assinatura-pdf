import { createI18n } from 'vue-i18n';
import enUS from '@/locales/en-US.json';
import ptBR from '@/locales/pt-BR.json';

const i18n = createI18n({
  legacy: import.meta.env.MODE === 'test',
  locale: localStorage.getItem('pdf-signature-i18n') ?? navigator.language,
  fallbackLocale: 'pt-BR',
  allowComposition: true,
  messages: {
    'en-US': enUS,
    'pt-BR': ptBR,
  },
});

export default i18n;
