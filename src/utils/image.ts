export function createImageSrc(url: string) {
  return new URL(`/src/assets/${url}`, import.meta.url).href;
}


export function convertToBase64Png(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const blobURL = window.URL.createObjectURL(file);
    const image = new Image();

    image.src = blobURL;
    image.onload = async () => {
      window.URL.revokeObjectURL(blobURL);
      resolve( await removerFundoBranco(image));
      //resolve(await compressImagePng(image));
    };

    image.onerror = error => {
      window.URL.revokeObjectURL(blobURL);
      reject(error);
    };
  });
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const blobURL = window.URL.createObjectURL(file);
    const image = new Image();

    image.src = blobURL;
    image.onload = async () => {
      window.URL.revokeObjectURL(blobURL);
      resolve(await compressImage(image));
    };
    
    image.onerror = error => {
      window.URL.revokeObjectURL(blobURL);
      reject(error);
    };
  });
}

function compressImage(image: HTMLImageElement): Promise<string> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const { naturalWidth, naturalHeight } = image;

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    context?.drawImage(image, 0, 0, naturalWidth, naturalHeight);
    resolve(canvas.toDataURL('image/jpeg', 0.8));
  });
}

function compressImagePng(image: HTMLImageElement): Promise<string> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const { naturalWidth, naturalHeight } = image;

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    context?.drawImage(image, 0, 0, naturalWidth, naturalHeight);
    resolve(canvas.toDataURL('image/png', 0.8));
  });
}


function removerFundoBranco(image: HTMLImageElement): Promise<string> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const { naturalWidth, naturalHeight } = image;

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    
    context?.drawImage(image, 0, 0, naturalWidth, naturalHeight);

    const imageData = context?.getImageData(0, 0, naturalWidth, naturalHeight);

    if(!imageData) return resolve(canvas.toDataURL('image/png', 0.8));

    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Definir cor branca como fundo
        if (r === 255 && g === 255 && b === 255) {
            pixels[i + 3] = 0;  // Configurar o canal alfa para 0 (transparência)
        }
    }

    context?.putImageData(imageData, 0, 0);

    resolve(canvas.toDataURL('image/png'));
  });
  
}