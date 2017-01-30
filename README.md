  ![Demo GIF](https://ytiurin.github.io/tetris/public/demo.gif)

# [Play :video_game: TETRIS](https://ytiurin.github.io/tetris/)

I made this small project to simulate the original 1984 version of TETRIS game. I saw a [Youtube video](https://www.youtube.com/watch?v=O0gAgQQHFcQ) showing the gameplay of this classic run on [DVK-2](https://en.wikipedia.org/wiki/DVK) computer and thought I could implement it in browser and have some fun in the process.

To make it look similar to the old game, I made it entirely text based, meaning that every frame of the game animation is rendered into a string of text with 25 rows of 80 chars and looks like this:

```

ROWS HIT:             11    ‹! . . . . . . . . . .!›                            
SCORE:               980    ‹! . . . . . . . . . .!›      UP ARROW: ROTATE      
LEVEL:                 2    ‹! . . . . . . . . . .!›    DOWN ARROW: SOFT DROP   
                            ‹! . . . .▮▮ . . . . .!›      SPACEBAR: HARD DROP   
                            ‹! . . . .▮▮▮▮ . . . .!›        ESC, P: PAUSE       
                            ‹! . . . .▮▮ . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                    ▮▮▮▮▮▮▮▮‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . . . . .!›                            
                            ‹! . . . . . . .▮▮▮▮▮▮!›                            
                            ‹!▮▮▮▮ . . .▮▮ .▮▮▮▮▮▮!›                            
                            ‹!▮▮▮▮ .▮▮▮▮▮▮▮▮▮▮▮▮▮▮!›                            
                            ‹!====================!›                            
                              \/\/\/\/\/\/\/\/\/\/                              

```

Basic setup code:

```javascript

TETRIS.on({
  nextFrame: function( frame ) {
    // replace HTML special chars
    frame = frame.replace( /[ <>]|\n\r/g, function( m ) { return {
      " ": "&nbsp;",
      "<" : "&lsaquo;",
      ">" : "&rsaquo;",
      "\n\r" : "<br>" }[ m ] })

    document.body.innerHTML = frame
  }
})

addEventListener( "keydown", function( e ) {
  TETRIS.pressKey( e.keyCode )
})

```

Check the [play.js](https://github.com/ytiurin/tetris/blob/master/src/play.js) for more advanced code.

## Audio

I extracted some audio effects from the original video and integrated them into the demo using [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

## Progressive Web App

The [play page](https://ytiurin.github.io/tetris/) is served as a [PWA](https://developers.google.com/web/progressive-web-apps/), so you can play the game offline.

## Leaderboard

I also made a simple microservice to store best scores of the [play page](https://ytiurin.github.io/tetris/).
