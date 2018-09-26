let { countWindows, displaySize, getWindowBounds, getWindowSize, repositionWindow } = require('../helpers');

let configuration = {
  columns: 4,
  rows: 4,
  bounds: null,
  size: null
};

let test = async () => {
  let count = await countWindows();
  console.log(count)
  // let array = [1,2,3,4]
  // array.splice(array.indexOf(3), 1);
  // console.log(array);
  // let count = await countWindows();
  // let positionIndex = 0;
  // for (let i = 1; i <= count; i++) {
  //   let position = positions[positionIndex];
  //   positionIndex++;
  //   if (positionIndex > 5) positionIndex = 0;
  //   await repositionWindow(i, position.x, position.y, 1440/3, ((878)/2));
  // };

  // let winSize = await windowSize();
  // console.log(winSize)
  // console.log()


  // let fullscreen = await getFullscreen();
  // fullscreen = (fullscreen.trim() == 'true');
  // if (!fullscreen) await enterFullscreen();
  // let fullBounds = await getWindowBounds(1);
  // console.log(fullBounds);
  // if (!fullscreen) await exitFullscreen();
  // let dock = await getDockSize();
  // dock = dock[1];
  // console.log(dock)
  // await repositionWindow(1, 0, 0, 100000, 100000);
  // let bounds = await getWindowBounds(1);
  // let [ width, height ] = await getWindowSize(1);
  // console.log(bounds, width, height);


  // await repositionWindow(1, 0, 0, 400, 400);
  // await repositionWindow(2, 400, 0, 400, 400);
  // let winSize = await windowSize();
  // console.log(winSize)
  // let winSize2 = await windowSize(2);
  // console.log(winSize2)

  // await repositionWindow(1, 0, 0, 100000, 100000);
  // let winSize = await windowSize();
  // console.log(winSize)
  // await setup();
  // await move();
  // let bounds = await getWindowBounds();
  // console.log(bounds);
};

let setup = async (columns, rows) => {
  configuration.bounds = await getWindowBounds();
  configuration.size = await getWindowSize();
  console.log(configuration)
};

let move = async (columns, rows) => {
  let count = await countWindows();
  let currentColumn = 1, currentRow = 1;
  for (let i = 1; i <= count; i++) {
    let x = configuration.bounds[0] + configuration.size[0] * (currentColumn - 1) / configuration.columns;
    let y = configuration.bounds[1] + configuration.size[1] * (currentRow - 1) / configuration.rows;
    let width = configuration.size[0] / configuration.columns;
    let height = configuration.size[1] / configuration.rows;
    // console.log(x, y)
    await repositionWindow(i, x, y, width, height);
    currentColumn++;
    if (currentColumn > configuration.columns) {
      currentColumn = 1;
      currentRow++;
      if (currentRow > configuration.rows) currentRow = 1;
    };
  };
};

// test().catch((err) => {
//   console.log(err);
// });

// -1734, -1006, -294, -106
// topleft, bottomright
// actual topleft -1734, -984

// width 1440
// height 974

// real height 900, top bar height 26
