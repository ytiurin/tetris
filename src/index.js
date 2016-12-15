+function() {

  var
  controlIID,
  prevKeyCode

  function termKey()
  {
    clearInterval( controlIID )
    controlIID = 0
  }

  function readKey( e )
  {
    keyCode = e.which > 0 ? e.which : e.keyCode

    if ( controlIID && keyCode === prevKeyCode )
      return

    prevKeyCode = keyCode

    var pressKey = function() {
      TETRIS.pressKey( keyCode )
    }

    pressKey()
    termKey()

    var keySpeed = { 37: 100, 39: 100, 40: 50 }
    controlIID = setInterval( pressKey, keySpeed[ keyCode ] || 200 )
  }

  document.addEventListener( "click", function() {
    document.getElementById("score").style.display = "none"
    addEventListener( 'keydown', readKey )
  })

  addEventListener( 'keyup', termKey )
  addEventListener( 'keydown', readKey )

  TETRIS.on({
    finish: function( score ) {
      try {
        var time = (new Date).getTime()
        var userScore = JSON.parse( localStorage.getItem('tetrisScore')) || []
        userScore.push({ t: time, s: score })

        localStorage.setItem('tetrisScore', JSON.stringify( userScore ))
        userScore = userScore.sort( function( a, b ) { return b.s - a.s } )
          .map( function( o ) {
            if (!o.s)
              return

            var scr = o.s.toString().split("").reverse().join("")
              .match(/.{1,3}/g).join(" ").split("").reverse().join("")
            scr = "&nbsp;".repeat( 18 - scr.length ) + scr

            var id
            if ( time === o.t && score === o.s )
              id = "highlighted"

            return "<span" + ( id ? " id=\"" + id + "\"" : "" ) + ">" +
              (new Date( o.t )).toLocaleDateString() + scr + "</span>"
          }).join("<br>")

        // console.log(userScore)
        var el = document.getElementById("score")
        el.innerHTML = userScore
        el.style.display = "block"

        if ( el = document.getElementById("highlighted"))
          el.scrollIntoView();

        removeEventListener( 'keydown', readKey )
      }
      catch( e ) {}
    },

    nextFrame: function( frame ) {
      // replace HTML special chars
      frame = frame.replace( /[ <>]|\n\r/g, function( m ) { return {
        " ": "&nbsp;",
        "<" : "&lsaquo;",
        ">" : "&rsaquo;",
        "\n\r" : "<br>" }[ m ] })

      document.getElementById("container").innerHTML = frame
    }
  })
}()
