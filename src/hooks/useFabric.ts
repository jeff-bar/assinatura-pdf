import { ref, toRaw } from 'vue';
import { fabric } from 'fabric';
import { usePdfStore } from '@/store';
import { printPDF, getPDFDocument } from '@/utils/pdfJs';
import { createImageSrc, convertToBase64 } from '@/utils/image';
import { isDesktop } from '@/utils/common';
import type { TOCoord, SpecifyPageArgs, RenderImageArgs, CreateCloseSvgArgs } from '@/types/fabric';
import toast from '@/utils/toast';
import { useI18n } from 'vue-i18n';



const fabricMap = new Map<string, fabric.Canvas>();
const assignedImage = new Map<string, fabric.Image>();

export default function useFabric(id: string) {

  const { t } = useI18n();

  const countPage = ref(0);
  const pages = ref(1);


  let closeSvg: fabric.Object | fabric.Group | null = null;


  function createCanvas() {
    console.log('createCanvas')

    if (fabricMap.has(id)) return;
    const canvas = new fabric.Canvas(id)

    fabricMap.set(id, canvas);
    canvas.on('selection:cleared', () => deleteCloseSvg(canvas));
    return canvas;
  }

  async function drawPDF(file: File) {
    console.log('drawPDF')

    const canvas = fabricMap.get(id);
    if (!canvas) return;
    canvas.requestRenderAll();
    const PDFBase64 = await printPDF(file);
    if (!PDFBase64) return;
    const { setCurrentPDF } = usePdfStore();
    const now = Date.now();
    const PDFId = `${file.name}${now}`;
    const PDF = {
      PDFId,
      name: file.name.replace(/.pdf/, ''),
      updateDate: now,
      PDFBase64,
    };

    await specifyPage({ page: 1, PDF, scale: 1 });
    setCurrentPDF({ ...PDF, pages: pages.value });
  }

  async function specifyPage({ page, PDF, scale }: SpecifyPageArgs) {
    console.log('specifyPage')

    const pdfDoc = await getPDFDocument(PDF.PDFBase64);
    const pdfPage = await toRaw(pdfDoc).getPage(page);
    const viewport = pdfPage.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const renderContext = {
      canvasContext: context!,
      viewport,
    };
    const renderTask = pdfPage.render(renderContext);

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    pages.value = pdfDoc.numPages;
    countPage.value =  pdfDoc.numPages;
    return renderTask.promise.then(() => renderCanvas(canvas));
  }

  function renderCanvas(canvasTemp: HTMLCanvasElement) {
    console.log("renderCanvas")
    
    const canvas = fabricMap.get(id);
    if (!canvas) return;
    const image = canvasToImage(canvasTemp);

    if (!image.width || !image.height) return;
    canvas.setWidth(image.width / 3);
    canvas.setHeight(image.height / 3);
    canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas));
  }

  function canvasToImage(canvasTemp: HTMLCanvasElement) {

    const scale = 1 / 3;

    return new fabric.Image(canvasTemp, {
      scaleX: scale,
      scaleY: scale,
    });
  }

  async function drawImage(file: File) {
    console.log('drawImage')

    const base64 = await convertToBase64(file);
    const { setCurrentPDF } = usePdfStore();
    
    const now = Date.now();
    const PDFId = `${file.name}${now}`;
    const PDF = {
      PDFId,
      name: file.name.replace(/.png|.jpg|.jpeg/, ''),
      updateDate: now,
      PDFBase64: base64,
    };

    renderImage({ url: base64 });
    setCurrentPDF({ ...PDF, pages: pages.value });
  }

  function renderImage({ url, scale = isDesktop() ? 0.5 : 0.3 }: RenderImageArgs) {
    console.log('renderImage')

    for( let id = 0; id < countPage.value; id++ ){

        fabric.Image.fromURL(url, image => {
         
          image.scale(scale);
          let _id = `canvas${id}`
          const _canvas = fabricMap.get( _id );

          if (_canvas){
            _canvas.setWidth(image.width! * scale);
            _canvas.setHeight(image.height! * scale);
            _canvas.setBackgroundImage(image, _canvas.renderAll.bind(_canvas));
          }
      });

    }
  }

  function addFabric(src: string, position = { x: 100, y: 50 }) {

    for( let id = 0; id < countPage.value; id++ ){

      let _id = `canvas${id}`
      const canvas = fabricMap.get( _id );

      if (!canvas) continue;

      if( !canvas.isEmpty() ){
        toast.showToast(t('prompt.can_one_subscription'), 'error');
        return;
      }
    
      fabric.Image.fromURL(src, image => {
        image.top = position.y;
        image.left = position.x;
        image.scaleX = 0.5;
        image.scaleY = 0.5;
        image.angle = 0;
        image.borderColor = 'black';
        image.cornerStrokeColor = 'black';
        image.cornerSize = 8;
        image.backgroundColor = 'transparent';
        image.selectionBackgroundColor = 'transparent';
        canvas.add(image);
        assignedImage.set(_id, image);
        setFabric(canvas, image, id);
      });

    }
    
  }

  function addTextFabric(text: string, position = { x: 100, y: 50 }) {

    for( let id = 0; id < countPage.value; id++ ){

      let _id = `canvas${id}`
      const canvas = fabricMap.get( _id );

      if (!canvas) continue;
      const textFabric = new fabric.Text(text, {
        top: position.y,
        left: position.x,
        fontFamily: 'helvetica',
        borderColor: 'black',
        cornerStrokeColor: 'black',
        scaleX: 0.7,
        scaleY: 0.7,
        cornerSize: 8,
        selectionBackgroundColor: 'rgba(245, 245, 245, 0.8)',
      });
      canvas.add(textFabric);
      setFabric(canvas, textFabric, id);
    }
  }

  function setFabric(canvas: fabric.Canvas, fab: fabric.Image | fabric.Text, id:number) {
    console.log('setFabric')
   
    if( id == 0 ){
      fab.on('selected', event => createCloseSvg({ canvas, event, fab }));
    }else{
      canvas?.removeListeners()
    }
    fab.on('modified', event => moveCloseSvg(event, id));
    fab.on('scaling', event => moveCloseSvg(event, id));
    fab.on('moving', event => moveCloseSvg(event, id));
    fab.on('rotating', event => moveCloseSvg(event, id));

  }

  async function createCloseSvg({ canvas, event, fab, stroke = '#000', uuid = Date.now() }: CreateCloseSvgArgs) {

    console.log('createCloseSvg')

    if (closeSvg?.stroke === `${stroke}-${uuid}`) return;
    const src = createImageSrc('icon/ic_close_s.svg');

    fabric.loadSVGFromURL(src, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);

      objects.forEach(object => {
        object.stroke = stroke;
      });
      svg.hoverCursor = 'pointer';
      svg.stroke = `${stroke}`;

      deleteCloseSvg(canvas);
      closeSvg = svg;
      onCloseSvg(canvas, fab, event, uuid);
      moveCloseSvg(event, 0);
      canvas.add(svg);
    });
  }

  function onCloseSvg(
    canvas: fabric.Canvas,
    fab: fabric.Image | fabric.Text,
    event: fabric.IEvent<Event>,
    uuid: number,
  ) {

    console.log('onCloseSvg')
    
    closeSvg?.on('selected', () => {
      
      //canvas.remove(fab);
      //deleteCloseSvg(canvas);

      
      for( let id = 0; id < countPage.value; id++ ){

        let _id = `canvas${id}`
        const _canvas = fabricMap.get( _id );
        let _image = assignedImage.get( _id );
        
        if(!_canvas) continue;
        if(_image){ 
          _canvas.remove( _image ) 
        }
        deleteCloseSvg(_canvas);
      }
      
    });

    closeSvg?.on('mouseover', () => {
      createCloseSvg({ canvas, event, fab, stroke: '#660099', uuid });
    });
    closeSvg?.on('mouseout', () => {
      createCloseSvg({ canvas, event, fab, stroke: '#000', uuid });
    });
    
  }

  function moveCloseSvg(event: fabric.IEvent<Event>, id: number) {
    console.log('moveCloseSvg')

    if( id == 0 ){

      moveImage()

      const target = event.transform?.target ?? event.target;

      if (!closeSvg || !target) return;
      const { oCoords, cornerSize = 1 } = target;
      if (!oCoords) return;
      const { x, y } = (oCoords.tl as TOCoord).touchCorner.tl;

      closeSvg.top = y - cornerSize * 3;
      closeSvg.left = x - cornerSize * 3;
      closeSvg.setCoords();
    }
  }

  function moveImage(){

    let top:number | undefined = 50 ;
    let left:number | undefined  = 100;
    let scaleX:number | undefined  = 0.5;
    let scaleY:number | undefined  = 0.5;
    let cornerSize:number | undefined  = 8;
    let angle:number | undefined  = 0;

    for( let id = 0; id < countPage.value; id++ ){

      let _id = `canvas${id}`
      const _image = assignedImage.get( _id );
      const _canvas = fabricMap.get( _id );

      if(!_image ) continue;

      if(id == 0){
        angle = _image.angle
        top = _image.top;
        left = _image.left;
        scaleX = _image.scaleX;
        scaleY = _image.scaleY;
        cornerSize = _image.cornerSize;
      }else{

        _canvas?.remove( _image ) 

        _image.angle = angle;
        _image.top = top;
        _image.left = left;
        _image.scaleX = scaleX;
        _image.scaleY = scaleY;
        _image.cornerSize = cornerSize;

        _canvas?.add( _image ) 
      }
    
    }
  }


  function deleteCloseSvg(canvas: fabric.Canvas) {
    console.log('deleteCloseSvg')

    if (!closeSvg) return;
    canvas.remove(closeSvg);
    closeSvg = null;
  }

  function clearActive() {
    console.log('clearActive')
    for( let id = 0; id < countPage.value; id++ ){

      let _id = `canvas${id}`
      const _canvas = fabricMap.get( _id );
      
      if (!_canvas) continue;
      _canvas.discardActiveObject().renderAll();

    }
  }

  function deleteCanvas() {
    console.log('deleteCanvas')
    for( let id = 0; id < countPage.value; id++ ){

      let _id = `canvas${id}`
      const _canvas = fabricMap.get( _id );

      if (!_canvas) continue;
      _canvas.clear();
      fabricMap.delete(_id);

    }
  }

  return {
    createCanvas,
    drawPDF,
    drawImage,
    specifyPage,
    renderImage,
    addFabric,
    addTextFabric,
    clearActive,
    deleteCanvas,
    pages,
  };
}
