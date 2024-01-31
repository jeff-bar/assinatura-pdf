// vite.config.ts
import { defineConfig } from "file:///home/jefferson/Documentos/trabalho/juridico/codigo/PDF-signature/node_modules/vite/dist/node/index.js";
import vue from "file:///home/jefferson/Documentos/trabalho/juridico/codigo/PDF-signature/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
import { dirname, resolve } from "node:path";
import { createSvgIconsPlugin } from "file:///home/jefferson/Documentos/trabalho/juridico/codigo/PDF-signature/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import vueI18nPlugin from "file:///home/jefferson/Documentos/trabalho/juridico/codigo/PDF-signature/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import topLevelAwait from "file:///home/jefferson/Documentos/trabalho/juridico/codigo/PDF-signature/node_modules/vite-plugin-top-level-await/exports/import.mjs";
import { VitePWA } from "file:///home/jefferson/Documentos/trabalho/juridico/codigo/PDF-signature/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///home/jefferson/Documentos/trabalho/juridico/codigo/PDF-signature/vite.config.ts";
var vite_config_default = defineConfig({
  base: "./",
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icon")]
    }),
    vueI18nPlugin({
      include: resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "src/locales/**")
    }),
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: (i) => `__tla_${i}`
    }),
    VitePWA({ registerType: "autoUpdate" })
  ],
  server: {
    port: 8080
  },
  esbuild: {
    pure: ["console.log"],
    drop: ["debugger"]
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9qZWZmZXJzb24vRG9jdW1lbnRvcy90cmFiYWxoby9qdXJpZGljby9jb2RpZ28vUERGLXNpZ25hdHVyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvamVmZmVyc29uL0RvY3VtZW50b3MvdHJhYmFsaG8vanVyaWRpY28vY29kaWdvL1BERi1zaWduYXR1cmUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvamVmZmVyc29uL0RvY3VtZW50b3MvdHJhYmFsaG8vanVyaWRpY28vY29kaWdvL1BERi1zaWduYXR1cmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCB7IGRpcm5hbWUsIHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnO1xuaW1wb3J0IHZ1ZUkxOG5QbHVnaW4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSc7XG5pbXBvcnQgdG9wTGV2ZWxBd2FpdCBmcm9tICd2aXRlLXBsdWdpbi10b3AtbGV2ZWwtYXdhaXQnO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6ICcuLycsXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICBpY29uRGlyczogW3Jlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbicpXSxcbiAgICB9KSxcbiAgICB2dWVJMThuUGx1Z2luKHtcbiAgICAgIGluY2x1ZGU6IHJlc29sdmUoZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpLCAnc3JjL2xvY2FsZXMvKionKSxcbiAgICB9KSxcbiAgICB0b3BMZXZlbEF3YWl0KHtcbiAgICAgIHByb21pc2VFeHBvcnROYW1lOiAnX190bGEnLFxuICAgICAgcHJvbWlzZUltcG9ydE5hbWU6IGkgPT4gYF9fdGxhXyR7aX1gLFxuICAgIH0pLFxuICAgIFZpdGVQV0EoeyByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyB9KSxcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgZXNidWlsZDoge1xuICAgIHB1cmU6IFsnY29uc29sZS5sb2cnXSxcbiAgICBkcm9wOiBbJ2RlYnVnZ2VyJ10sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJ3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVgsU0FBUyxvQkFBb0I7QUFDbFosT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLFNBQVMsU0FBUyxlQUFlO0FBQ2pDLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsZUFBZTtBQVBrTixJQUFNLDJDQUEyQztBQVMzUixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixxQkFBcUI7QUFBQSxNQUNuQixVQUFVLENBQUMsUUFBUSxRQUFRLElBQUksR0FBRyxpQkFBaUIsQ0FBQztBQUFBLElBQ3RELENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxNQUNaLFNBQVMsUUFBUSxRQUFRLGNBQWMsd0NBQWUsQ0FBQyxHQUFHLGdCQUFnQjtBQUFBLElBQzVFLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxNQUNaLG1CQUFtQjtBQUFBLE1BQ25CLG1CQUFtQixPQUFLLFNBQVMsQ0FBQztBQUFBLElBQ3BDLENBQUM7QUFBQSxJQUNELFFBQVEsRUFBRSxjQUFjLGFBQWEsQ0FBQztBQUFBLEVBQ3hDO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTSxDQUFDLGFBQWE7QUFBQSxJQUNwQixNQUFNLENBQUMsVUFBVTtBQUFBLEVBQ25CO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLE9BQU8sd0NBQWUsQ0FBQztBQUFBLElBQ3BEO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
