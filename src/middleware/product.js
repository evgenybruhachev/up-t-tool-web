import DrawTool from '../draw-tool/drawtool';
import escapeJSON from '../utils/escapeJSON';
import { uploadByString } from '../api/extras';
import { saveTemplate } from '../api/products';

export default store => next => (action) => {
  const { colors, colorSelected, sideSelected } = store.getState().product;

  switch (action.type) {
    case 'UPDATE_FONTS':
      action.payload.map(font => DrawTool.fontLoader(font.DrawerFont.title, font.DrawerFont.urls));
      break;
    case 'SELECT_COLOR': {
      DrawTool.sides.empty();
      colors.find(color => color.ProductColor.id === action.payload).sides.map((side) => {
        const sideProps = JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
        const fSide = DrawTool.sides.addSide(sideProps.id);
        return fSide.setImage(`${sideProps.imageUrl}?_`, sideProps.size)
          .then(() => {
            fSide.setBorder(sideProps.border);
            fSide.FabricCanvas.renderAll.bind(fSide.FabricCanvas);
          });
      });
      DrawTool.sides.select(sideSelected.title.toLowerCase());
      break;
    }
    case 'SELECT_SIDE': {
      const sideObj = colors.find(color => color.ProductColor.id === colorSelected.id).sides
        .find(side => side.ProductColorSide.id === action.payload).ProductColorSide;
      DrawTool.sides.select(sideObj.title.toLowerCase());
      break;
    }
    case 'LOAD_PRODUCT': {
      if (action.payload.colors.length) {
        action.payload.colors[0].sides.map((side) => {
          const sideProps = JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
          const fSide = DrawTool.sides.addSide(sideProps.id);
          return fSide.setImage(`${sideProps.imageUrl}?_`, sideProps.size)
            .then(() => {
              fSide.setBorder(sideProps.border);
              fSide.FabricCanvas.renderAll.bind(fSide.FabricCanvas);
            });
        });

        DrawTool.sides.select(
          action.payload.colors[0].sides[0].ProductColorSide.title.toLowerCase()
        );
      }
      break;
    }
    case 'SAVE_TEMPLATE': {
      DrawTool.sides.selected.items.finalizeBrush();
      const imgB64 = DrawTool.sides.selected.getImagePreview();
      DrawTool.sides.selected.toSVG((svg) => {
        Promise.all([uploadByString('image/png', imgB64, 'png'), uploadByString('image/svg+xml', svg, 'svg')]).then((values) => {
          saveTemplate(values[0], values[1]);
        });
      });
      break;
    }

    case 'APPLY_TEMPLATE': {
      DrawTool.sides.selected.items.addImage(`${action.payload}?_`);
      break;
    }
    default:
      break;
  }
  return next(action);
};
