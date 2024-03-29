<script setup lang="ts">
import { ref, nextTick, onMounted, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { usePdfStore } from '@/store';
import SignIcon from '@/components/SignIcon.vue';
import SignStepBtn from '@/components/SignStepBtn.vue';
import SignatureSign from '@/components/signature/SignatureSign.vue';
import SignatureImage from '@/components/signature/SignatureImage.vue';
import SignatureLiteral from '@/components/signature/SignatureLiteral.vue';
import SignaturePage from '@/components/signature/SignaturePage.vue';
import SignatureMergePopup from '@/components/signature/SignatureMergePopup.vue';
import useResize from '@/hooks/useResize';
import useWarnPopup from '@/hooks/useWarnPopup';
import toast from '@/utils/toast';
import { sleep, isDesktop } from '@/utils/common';

const SignatureCanvasItem = defineAsyncComponent(() => import('@/components/signature/SignatureCanvasItem.vue'));
const isShowSign = ref(false);
const isShowImage = ref(false);
const isShowLiteral = ref(false);
const isShowPage = ref(false);
const isCancelMerge = ref(false);
const currentPage = ref(1);
const isShowNextWarnPopup = ref(false);
const isShowMergePopup = ref(false);
const signatureCanvasItems = ref<InstanceType<typeof SignatureCanvasItem>[] | null>(null);
const fileContainerRef = ref<HTMLDivElement | null>(null);
const fileContainerWidth = ref(0);
const { currentPDF } = storeToRefs(usePdfStore());
const { t } = useI18n();
const { isShowWarnPopup, SignPopup, goBack, goPage, toggleWarnPopup } = useWarnPopup();

useResize(updateFileContainerWidth);

async function mergeFile() {
  toggleNextWarnPopup(false);
  toggleMergePopup(true);

  try {
    if (!signatureCanvasItems.value) return;
    const { setCurrentPDFCanvas, addPDF } = usePdfStore();
    const canvas = signatureCanvasItems.value.map(({ canvasDom }) => {
      if (!canvasDom) return '';

      return canvasDom.toDataURL('image/png', 1.0);
    });

    await sleep(2000);
    if (isCancelMerge.value) {
      isCancelMerge.value = false;
      return;
    }
    //jefferson
    setCurrentPDFCanvas(canvas);
    addPDF({ ...currentPDF.value, PDFBase64: '', updateDate: Date.now() });
    toggleMergePopup(false);
    toast.showToast(t('prompt.file_created_success'), 'success');
    goPage('complete');
  } catch {
    toast.showToast(t('prompt.operation_timed_out'), 'error');
    toggleMergePopup(false);
  }
}

function addFabric(value: string, type?: string) {
  if (!signatureCanvasItems.value) return;
  const proxy = signatureCanvasItems.value.at(currentPage.value - 1);
  if (!proxy) return;

  type === 'text' ? proxy.addTextFabric(value) : proxy.addFabric(value);
}

function showSign() {
  usePage(1)
  closeAllPopup();
  isShowSign.value = true;
}

function showImage() {
  usePage(1)
  closeAllPopup();
  isShowImage.value = true;
}

function showLiteral() {
  usePage(1)
  closeAllPopup();
  isShowLiteral.value = true;
}

function showPage() {
  closeAllPopup();
  isShowPage.value = true;
}

function closeAllPopup() {
  isShowSign.value = false;
  isShowImage.value = false;
  isShowLiteral.value = false;
  isShowPage.value = false;
}

function usePage(page: number) {
  currentPage.value = page;
}

function toggleNextWarnPopup(isOpen: boolean) {
  signatureCanvasItems.value?.forEach(({ clearActive }) => clearActive());
  isShowNextWarnPopup.value = isOpen;
}

function toggleMergePopup(isOpen: boolean) {
  isShowMergePopup.value = isOpen;
}

async function updateFileContainerWidth() {
  await nextTick();
  fileContainerWidth.value = fileContainerRef.value?.clientWidth ?? 0;
}

function giveUpSignature() {
  usePdfStore().clearCurrentPDF();
  goBack();
}

function cancelMergeFile() {
  isCancelMerge.value = true;
  toggleMergePopup(false);
}

onMounted(() => {
  updateFileContainerWidth();
  if (!isDesktop()) return;
  isShowImage.value = true;
});
</script>

<template>
  <div class="signature_content content">
    <h5 class="title text-center">{{ $t('sign_file') }}</h5>

    <div class="flex flex-col h-[calc(100%-70px)] md:flex-row">
      <div class="md:border-r-2 md:border-primary md:py-4 md:px-7">
        <ul class="toolbar signature_content_toolbar">
          <li @click="showImage">
            <sign-icon
              name="pic"
              :class="['w-7 h-7', { 'text-primary': isShowImage }]"
            />
            <p>{{ $t('picture') }}</p>
          </li>
          <li @click="showSign">
            <sign-icon
              name="sign"
              :class="['w-7 h-7', { 'text-primary': isShowSign }]"
            />
            <p>{{ $t('sign') }}</p>
          </li>
          
          <!-- 
          <li @click="showLiteral">
            <sign-icon
              name="text"
              :class="['w-7 h-7', { 'text-primary': isShowLiteral }]"
            />
            <p>{{ $t('text') }}</p>
          </li>
          -->
          <li @click="showPage">
            <sign-icon
              name="page"
              :class="['w-7 h-7', { 'text-primary': isShowPage }]"
            />
            <p>{{ $t('pages') }}</p>
          </li>
        </ul>
       
        <signature-image
          v-model:isShowImage="isShowImage"
          @use-image="addFabric"
        />
        <signature-sign
          v-model:isShowSign="isShowSign"
          @use-signature="addFabric"
        />
        <signature-literal
          v-model:isShowLiteral="isShowLiteral"
          @use-literal="addFabric"
        />
        <signature-page
          ref="signaturePage"
          v-model:isShowPage="isShowPage"
          @use-page="usePage"
        />
      </div>

      <div
        ref="fileContainerRef"
        class="signature_content_file"
      >
        <div class="relative w-full h-full">
          <template
            v-for="page in currentPDF.pages"
            :key="page"
          >
            <suspense>
              <signature-canvas-item
                v-show="currentPage === page"
                ref="signatureCanvasItems"
                :file-container-width="fileContainerWidth"
                :file="currentPDF"
                :page="page"
              />
              <template
                v-if="currentPage === page"
                #fallback
              >
                <div class="w-full h-full flex items-center justify-center animate-pulse">
                  <img
                    src="@/assets/logo/logo_lightbg_horizontal.png"
                    class="animate-bounce w-2/3 max-w-[500px] image_logo"
                    alt="logo"
                  />
                </div>
              </template>
            </suspense>
          </template>
        </div>
      </div>
    </div>

    <sign-step-btn
      :is-next-disabled="false"
      @next-step="toggleNextWarnPopup(true)"
      @prev-step="toggleWarnPopup(true)"
    />
    <sign-popup
      v-if="isShowWarnPopup"
      :title="$t('warn')"
    >
      <p class="text-center">{{ $t('prompt.sure_discard_edited_content') }}</p>
      <div class="flex justify-between md:justify-evenly">
        <button
          class="btn btn_base"
          @click="toggleWarnPopup(false)"
        >
          {{ $t('not_yet') }}
        </button>
        <button
          class="btn btn_primary"
          @click="giveUpSignature"
        >
          {{ $t('give_up') }}
        </button>
      </div>
    </sign-popup>

    <sign-popup
      v-if="isShowNextWarnPopup"
      :title="$t('create_file')"
    >
      <p class="text-center">{{ $t('prompt.sure_completed_sign') }}</p>
      <div class="flex justify-between md:justify-evenly">
        <button
          class="btn btn_base"
          @click="toggleNextWarnPopup(false)"
        >
          {{ $t('wait') }}
        </button>
        <button
          class="btn btn_primary"
          @click="mergeFile"
        >
          {{ $t('confirm') }}
        </button>
      </div>
    </sign-popup>

    <signature-merge-popup
      :is-show-merge-popup="isShowMergePopup"
      :cancel-merge-file="cancelMergeFile"
    />
  </div>
</template>

<style lang="postcss" scoped>
.image_logo{
  opacity: 0.3
}
.signature_content {
  &_file {
    @apply mx-[10px]
    mb-7
    bg-gray-30
    border-2
    border-gray-30
    overflow-auto
    w-[calc(100%-20px)]
    h-full
    md:mt-6
    md:mx-[5%]
    md:mb-0
    md:h-[calc(100%-40px)];
  }
  &_toolbar {
    @apply gap-0 mx-2 md:my-0;
    li {
      @apply flex flex-col items-center min-w-[52px];
      &:hover > svg {
        @apply text-primary;
      }
    }
    p {
      @apply hidden text-sm whitespace-nowrap md:block;
    }
  }
}
</style>