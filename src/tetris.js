/*
                ▊▊▊▊▊▊    ▊▊▊▊  ▊▊▊▊▊▊  ▊▊▊▊▊   ▊▊   ▊▊▊▊▊
                  ▊▊    ▊▊        ▊▊    ▊▊  ▊▊  ▊▊  ▊▊
                  ▊▊    ▊▊ ▊▊     ▊▊    ▊▊ ▊▊▊  ▊▊   ▊▊▊▊
                  ▊▊    ▊▊        ▊▊    ▊▊  ▊   ▊▊      ▊▊
                  ▊▊     ▊▊▊▊▊    ▊▊    ▊▊  ▊▊  ▊▊  ▊▊▊▊▊
*/

+function( parseFloat, setTimeout, clearTimeout, Math ) {
+function( field, shapes, rotates, widths, shifts0, shifts ) {
  var

  frame,
  nextFigure = newFigure(),
  figure = nextFigure,
  emptyField = field.slice(),
  drawField,
  toID,
  emptyFunction = function(){},
  userNextFrame = emptyFunction,
  userFinish = emptyFunction,

  // achievements
  level,
  score,
  rowsHit,
  time,

  // states
  finished = 0,
  paused = 0,
  splash = 1

  function fieldIndex( i, x, y )
  {
    return 10 * ( y + i / 4 << 0 ) + x + i % 4
  }

  function repeat( s, n )
  {
    return s.repeat( n )
  }

  function frameSubStr( from, len )
  {
    return frame.substr( from, len )
  }

  function pause()
  {
    paused = 1
    clearTimeout( toID )
    drawFrame()
  }

  function upause()
  {
    paused = 0
    drawFrame()
    nextTick()
  }

  function pressKey( keyCode )
  {
    if ( splash ) {
      splash = 0
      start()
      return
    }

    // TRY AGAIN? Y/N
    if ( finished && keyCode in {89:1,78:1} ) {
      finished = 0

      switch ( keyCode ) {
        // Y
        case 89:
          start()
          break

        // N
        case 78:
          splash = 1
          drawFrame()
      }
    }

    if ( finished )
      return

    if ( paused ) {
      upause()
      return
    }

    // ESC, P
    if ( keyCode in {27:1,80:1} )
      pause()

    if ( keyCode in {37:1,38:1,39:1} ) {
      var tryFigure = newFigure( figure )

      switch ( keyCode ) {
        // LEFT
        case 37:
          tryFigure.x = tryFigure.x === 0 ? 0 : tryFigure.x - 1
          break

        // RIGHT
        case 39:
          var w = 10 - widths[ tryFigure.i ]
          tryFigure.x = tryFigure.x === w ? w : tryFigure.x + 1
          break

        // UP
        case 38:
          var figureInd = rotates[ figure.i ], shiftX = 0, shiftY = 0

          if ( shifts[ figureInd ] ) {
            shiftX = shifts[ figureInd ][0]
            shiftY = shifts[ figureInd ][1]
          }

          tryFigure = newFigure( figure, {
            x: figure.x + shiftX,
            y: figure.y + shiftY,
            i: figureInd
          })

          tryFigure.x = Math.min( tryFigure.x, 10 - widths[ tryFigure.i ] )
          tryFigure.x = Math.max( tryFigure.x, 0 )
      }

      figure = testCollision( tryFigure ) || figure
      updateDrawField()
      drawFrame()
    }

    if ( keyCode in {40:1,32:1} ) {
      switch ( keyCode ) {
        // DOWN
        case 40:
          dropFigure()
          break

        // SPACE
        case 32:
          while (dropFigure());
      }
      drawFrame()
      nextTick()
    }
  }

  function newFigure( fig1, fig2 )
  {
    var figureInd = Math.random() * 19 << 0

    return Object.assign({
        x: 4 + ( shifts0[ figureInd ] ? shifts0[ figureInd ] : 0 ),
        y: 0,
        c: 0,
        i: figureInd
      },
        fig1, fig2 )
  }

  function testCollision( figure )
  {
    if ( !shapes[ figure.i ]
      .some( function( v, i ) {
        i = fieldIndex( i, figure.x, figure.y )

        if ( v && ( i >= 200 || field[ i ] ))
          return 1
      }))

      return figure
  }

  function updateDrawField()
  {
    drawField = field.slice()

    shapes[ figure.i ].map( function( v, i ) {
      i = fieldIndex( i, figure.x, figure.y )

      if ( drawField[ i ] !== undefined )
        drawField[ i ] = drawField[ i ] || v
    })
  }

  function dropFigure()
  {
    var tryFigure = newFigure( figure, { y: figure.y + 1, c: figure.c + 1 } )
    figure = testCollision( tryFigure ) || figure

    updateDrawField()

    if ( figure === tryFigure )
      return 1

    if ( !figure.c ) {
      finished = 1
      time = (( new Date ) - time ) / 1000 << 0
      setTimeout( function() {
        userFinish( score, level, rowsHit, time )
      })
      return
    }

    score += 10 * level
    figure = nextFigure
    nextFigure = newFigure()
    field = drawField

    // CLEAN FULL ROWS
    var i = 200, l = 10, k = 0, j = 0

    while ( i -= l )
      if ( field.slice( i, i + l ).every( parseFloat )) {
        field.splice( i, l )
        j += l
        k < 4 && k++

        // up level every 10 rows hit
        if (( ++rowsHit % 10 ) === 0 )
          level = level < 9 ? level + 1 : 1
      }

    while ( j-- )
      field.unshift(0)

    score += [0, 50,150,350,1000][k] * level

    // field is cleared
    if ( !field.some( parseFloat ))
      score += 2000 * level

    drawField = field
    updateDrawField()
  }

  function drawFrame()
  {
    var nl = "\n\r", spp = repeat( " ", 28 ), ls = spp + "<!", rs = "!>" + spp,
      j = rs + ls, bl = String.fromCharCode(9646), block = repeat( bl, 2 ),
      el = repeat( " ", 80 ) + nl

    if ( splash ) {
      spp = repeat( " ", 19 )
      frame = [-58917640, -942919668, 858981133, -2096247688, -1023360221, 53509168, -858816512].map(function(v){
          return ( repeat( "0", 10 ) + ( v >>> 0 ).toString( 2 )).substr( -32 ) })
        .join("").substr(0,210).split("").map(function(v){ return [ " ", bl ][ v ]}).join("")
        .match(/.{1,42}/g).join( spp + nl + spp )
      frame = repeat( el, 8 ) + spp + frame + spp + nl + repeat( el, 4 ) +
        repeat( " ", 33 ) + "PRESS ANY KEY" + repeat( " ", 34 ) + nl +
        repeat( el, 7 )
      return
    }

    // render field
    frame = drawField.map( function( v ) {
        return [ ' .', block ][ v ]})
      .join('').match(/.{20}/g).join( j )

    frame = ls + frame + j + repeat( "=", 20 ) + rs + spp + "  "
      + repeat( "\\/", 10 ) + "  " + spp

    // append rows hit
    var rows = rowsHit.toString()
    rows = "ROWS HIT:" + repeat( " ", 15 - rows.length ) + rows
    frame = rows + frameSubStr( 24 )

    // append score
    var scr = score.toString().reverse().match(/.{1,3}/g).join(" ").reverse()
    scr = "SCORE:" + repeat( " ", 18 - scr.length ) + scr
    frame = frameSubStr( 0, 80 ) + scr + frameSubStr( 104 )

    // append level
    frame = frameSubStr( 0, 160 ) + "LEVEL:" + repeat( " ", 17 ) + level + frameSubStr( 184 )

    // append next figure
    shapes[ nextFigure.i ].map( function( v, i ) {
      // i = i*2
      i = 80 * ( 10 + i*2 / 8 << 0 ) + 20 + i*2 % 8

      if ( v )
        frame = frameSubStr( 0, i ) + block + frameSubStr( i + 2 )
    })

    // append info
    frame = frameSubStr( 0, 138 ) + "UP ARROW: ROTATE" + frameSubStr( 154 )
    frame = frameSubStr( 0, 216 ) + "DOWN ARROW: SOFT DROP" + frameSubStr( 237 )
    frame = frameSubStr( 0, 298 ) + "SPACEBAR: HARD DROP" + frameSubStr( 317 )
    frame = frameSubStr( 0, 380 ) + "ESC, P: PAUSE" + frameSubStr( 393 )

    if ( paused )
      frame = frameSubStr( 0, 757 ) + "PAUSED" + frameSubStr( 763 )

    if ( finished ) {
      frame = frameSubStr( 0, 756 ) + "TRY AGAIN?" + frameSubStr( 766 )
      frame = frameSubStr( 0, 836 ) + "   Y/N    " + frameSubStr( 846 )
    }

    // add new lines
    frame = frame.match(/.{1,80}/g).join( nl )
    frame = el + frame + nl + repeat( el, 2 )

    userNextFrame( frame )
  }

  function on( userHandlers )
  {
    userFinish = userHandlers.finish || emptyFunction
    userNextFrame = userHandlers.nextFrame || emptyFunction
    userNextFrame( frame )
  }

  function nextTick()
  {
    clearTimeout( toID )

    if ( finished || splash )
      return

    toID = setTimeout( function() {
      dropFigure()
      drawFrame()
      nextTick()
    },
      ( 10 - level ) * 100 )
  }

  function start()
  {
    nextFigure = newFigure()
    figure = nextFigure
    field = emptyField
    level = 1
    score = 0
    rowsHit = 0
    time = new Date
    finished = 0

    updateDrawField()
    drawFrame()
    nextTick()
  }

  start()

  // INTERFACE
  window.TETRIS = {
    on: on,
    pause: pause,
    pressKey: pressKey,
    start: start,
    upause: upause,
  }
}(
  // field
  "0".repeat(200).split("").map(parseFloat),

  // shapes
  [785,23,547,116,51,114,305,39,562,15,4369,99,306,54,561,802,113,275,71]
    .map(function(v){
      return (v>>>0).toString(2).split("").reverse().map(parseFloat)
    }),

  // rotates
  [1,2,3,0,4,6,7,8,5,10,9,12,11,14,13,16,17,18,15],

  // widths
  [2,3,2,3,2,3,2,3,2,4,1,3,2,3,2,2,3,2,3],

  // shifts 0
  { 9: -1, 10: 1 },

  // rotate shifts
  { "5": [0,0], "6": [1,0], "7": [-1,1], "8": [0,0], "9": [-2,2], "10": [2,-1], "11": [-1,1], "12": [1,0], "13": [-1,1], "14": [1,0] }
)
}( parseFloat, setTimeout, clearTimeout, Math );

String.prototype.reverse = function() {
  var result = "", i = this.length

  while ( i-- )
    result += this.charAt( i )

  return result
};

/*
SHAPES
Sprite is 4x4 points size

0
▊▊
▊▊
▊▊▊▊
1000100011

1
▊▊▊▊▊▊
▊▊
11101

2
▊▊▊▊
  ▊▊
  ▊▊
1100010001

3
    ▊▊
▊▊▊▊▊▊
0010111

4
▊▊▊▊
▊▊▊▊
110011

5
  ▊▊
▊▊▊▊▊▊
0100111

6
▊▊
▊▊▊▊
▊▊
100011001

7
▊▊▊▊▊▊
  ▊▊
111001

8
  ▊▊
▊▊▊▊
  ▊▊
0100110001

9
▊▊▊▊▊▊▊▊
1111

10
▊▊
▊▊
▊▊
▊▊
01000100010001

11
▊▊▊▊
  ▊▊▊▊
1100011

12
  ▊▊
▊▊▊▊
▊▊
010011001

13
  ▊▊▊▊
▊▊▊▊
011011

14
▊▊
▊▊▊▊
  ▊▊
1000110001

15
  ▊▊
  ▊▊
▊▊▊▊
0100010011

16
▊▊
▊▊▊▊▊▊
1000111

17
▊▊▊▊
▊▊
▊▊
110010001

18
▊▊▊▊▊▊
    ▊▊
1110001
*/
