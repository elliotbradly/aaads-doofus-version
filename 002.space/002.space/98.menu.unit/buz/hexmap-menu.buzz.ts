import * as ActMnu from "../menu.action";

import * as ActSpc from "../../00.space.unit/space.action";
import * as ActFoc from "../../01.focus.unit/focus.action";
import * as ActMap from "../../03.hexmap.unit/hexmap.action";
import * as ActGeo from "../../02.geojson.unit/geojson.action";

import * as ActDsk from "../../act/disk.action";
import * as ActTrm from "../../act/terminal.action";

var bit, lst, dex, idx, dat, src, val;

export const hexmapMenu = async (cpy: MenuModel, bal: MenuBit, ste: State) => {

  var mapMod: HexmapModel = ste.value.hexmap;

  bit = await ste.bus(ActTrm.CLEAR_TERMINAL, { src: "-----------" })


  bit = await ste.bus(ActTrm.WRITE_TERMINAL, { src: "-----------" })
  bit = await ste.bus(ActTrm.WRITE_TERMINAL, { src: "Hexmap Menu" })
  bit = await ste.bus(ActTrm.WRITE_TERMINAL, { src: "-----------" })

  var select: MapBit = mapMod.select;

  var nowIdx = 'None'
  var nowW = 0
  var nowH = 0
  var nowForm = 'None'

  if (select != null) {

    nowIdx = select.idx;
    nowW = select.w;
    nowH = select.h;
    nowForm = select.frm

  }

  var nowIdx = 'None'

  if (select != null) { nowIdx = select.idx }

  bit = await ste.bus(ActTrm.WRITE_TERMINAL, { val: 3, src: "Now---" + cpy.mapNomNow })
  bit = await ste.bus(ActTrm.WRITE_TERMINAL, { val: 3, src: "Width---" + nowW })
  bit = await ste.bus(ActTrm.WRITE_TERMINAL, { val: 3, src: "Height---" + nowH })
  bit = await ste.bus(ActTrm.WRITE_TERMINAL, { val: 3, src: "Form---" + nowForm })

  bit = await ste.bus(ActTrm.WRITE_TERMINAL, { src: "GEOJSON:" + JSON.stringify(cpy.geoJsonNow) })

  var lst = [ActMap.OPEN_HEXMAP, ActMap.ADD_HEXMAP, ActMap.WRITE_HEXMAP, ActMap.FOCUSING_HEXMAP, ActMap.LOAD_HEXMAP, ActGeo.LOAD_GEOJSON, ActMnu.CREATE_HEXMAP_MENU, ActMnu.UPDATE_MENU]

  bit = await ste.bus(ActTrm.UPDATE_TERMINAL, { lst })

  bit = bit.trmBit;
  var idx = lst[bit.val];

  switch (idx) {

    case ActMap.OPEN_HEXMAP:

      bit = await ste.bus(ActDsk.INDEX_DISK, { src: './data/hexmap/' })
      lst = bit.dskBit.lst

      bit = await ste.bus(ActTrm.UPDATE_TERMINAL, { lst })
      bit = bit.trmBit;
      src = lst[bit.val];

      idx = src.replace('.json', '');
      
      bit = await ste.hunt(ActMap.OPEN_HEXMAP, { idx })
      mapMod.select = bit.mapBit.dat
      cpy.mapNomNow = mapMod.select.idx

      bit = await ste.hunt(ActMnu.UPDATE_MENU)
      break;


    case ActMap.ADD_HEXMAP:

      bit = await ste.bus(ActDsk.INDEX_DISK, { src: './data/hexmap/' })
      lst = bit.dskBit.lst

      bit = await ste.bus(ActTrm.UPDATE_TERMINAL, { lst })
      bit = bit.trmBit;
      src = lst[bit.val];

      idx = src.replace('.json', '');

      bit = await ste.bus(ActDsk.READ_DISK, { src: './data/hexmap/' + src, val: 1 })
      dat = bit.dskBit.dat

      bit = await ste.hunt(ActMap.ADD_HEXMAP, { idx, dat: { dat, gph: 'gph00' } })
      mapMod.select = bit.mapBit.dat
      cpy.mapNomNow = mapMod.select.idx

      bit = await ste.hunt(ActMnu.UPDATE_MENU)

      break;

    case ActMap.WRITE_HEXMAP:

      bit = await ste.bus(ActTrm.INPUT_TERMINAL, { lst: ["", "id hexmap..."] });
      idx = bit.trmBit.src

      bit = await ste.bus(ActTrm.INPUT_TERMINAL, { lst: ["", "width hexmap..."] });
      var w = Number(bit.trmBit.src)

      bit = await ste.bus(ActTrm.INPUT_TERMINAL, { lst: ["", "height hexmap..."] });
      var h = Number(bit.trmBit.src)

      var shapeList = []

      for (var key in SHAPE) {
        shapeList.push(SHAPE[key])
      }

      shapeList

      bit = await ste.bus(ActTrm.UPDATE_TERMINAL, { lst: shapeList })
      bit = bit.trmBit;
      src = shapeList[bit.val];

      var frm = src

      //now the type
      bit = await ste.hunt(ActMap.SHAPE_HEXMAP, { idx, dat: { frm, w, h } })
      mapMod.select = bit.mapBit.dat

      cpy.mapNomNow = mapMod.select.idx


      bit = await ste.bus(ActTrm.WRITE_TERMINAL, { src: JSON.stringify(bit) })

      bit = await ste.hunt(ActMap.SELECT_HEXMAP, { idx })

      bit = await ste.hunt(ActMnu.HEXMAP_MENU)
      break;


    case ActMap.FOCUSING_HEXMAP:

      bit = await ste.hunt(ActMap.LIST_HEXMAP, {})
      lst = bit.mapBit.lst;

      bit = await ste.bus(ActTrm.UPDATE_TERMINAL, { lst })
      bit = bit.trmBit;
      src = lst[bit.val];
      cpy.mapNomNow = src

      var hexmap = src;

      bit = await ste.hunt(ActFoc.LIST_FOCUS, {})
      lst = bit.focBit.lst;

      bit = await ste.bus(ActTrm.UPDATE_TERMINAL, { lst })
      bit = bit.trmBit;
      src = lst[bit.val];

      var focus = src;
      bit = await ste.hunt(ActMap.FOCUSING_HEXMAP, { idx: hexmap, src })
      bit = await ste.bus(ActTrm.WRITE_TERMINAL, { src: JSON.stringify(bit) })


      bit = await ste.hunt(ActMnu.HEXMAP_MENU)
      break;

    case ActMnu.UPDATE_MENU:
      bit = await ste.hunt(ActMnu.UPDATE_MENU)
      break;

    case ActMnu.CREATE_HEXMAP_MENU:
      bit = await ste.hunt(ActMnu.CREATE_HEXMAP_MENU)
      bit = await ste.hunt(ActMnu.HEXMAP_MENU)
      break;

    case ActGeo.LOAD_GEOJSON:

      bit = await ste.hunt(ActGeo.INDEX_GEOJSON, {})
      lst = bit.geoBit.lst
      bit = await ste.bus(ActTrm.UPDATE_TERMINAL, { lst })
      bit = bit.trmBit;
      src = lst[bit.val];

      bit = await ste.hunt(ActGeo.LOAD_GEOJSON, { src })
      dat = bit.geoBit.dat
      idx = bit.geoBit.src

      cpy.geoJsonNow = dat;
      cpy.mapNomNow = idx

      break

    case ActMap.LOAD_HEXMAP:
      bit = await ste.hunt(ActMap.LIST_HEXMAP, {})
      lst = bit.mapBit.lst
      bit = await ste.bus(ActTrm.UPDATE_TERMINAL, { lst })
      bit = bit.trmBit;
      src = lst[bit.val];
      cpy.mapNomNow = src

      bit = await ste.hunt(ActMap.LOAD_HEXMAP, { src })

      cpy.sizeNow = bit.mapBit.dat.length

      dat = bit.mapBit.dat
      bit = await ste.hunt(ActMap.REPLACE_HEXMAP, { dat })

      bit = await ste.hunt(ActMnu.HEXMAP_MENU)

      //bit = await ste.bus(ActTrm.INPUT_TERMINAL, { lst: ["", "", "Name Hexmap"] });
      // src = bit.trmBit.src;
      // val = mapMod.sizeNow;
      // bit = await ste.hunt(ActMap.SAVE_HEXMAP, { src, val })

      // bit = await ste.bus(ActTrm.WRITE_TERMINAL, { src: JSON.stringify(bit) })
      break;

    default:
      bit = await ste.bus(ActTrm.CLOSE_TERMINAL, {})
      break;
  }

  if (bal.slv != null) bal.slv({ mnuBit: { idx: "hexmap-menu" } });

  return cpy;
};



import { MenuModel } from "../menu.model";
import MenuBit from "../fce/menu.bit";
import State from "../../99.core/state";
import { HexmapModel } from "../../03.hexmap.unit/hexmap.model";
import * as SHAPE from '../../val/shape'
import MapBit from "../../03.hexmap.unit/fce/map.bit";

import * as SPACE from '../../val/space'