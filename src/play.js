+function() {

  var nl = "&nbsp;",

  publPath = "./public/"

  function scorize( score )
  {
    return score.toString().split("").reverse().join("").match(/.{1,3}/g)
      .join(" ").split("").reverse().join("")
  }

  function columnize( c1, c2, w )
  {
    var rp = w - c1.length - c2.length
    return c1 + nl.repeat( rp > 0 ? rp : 0 ) + c2
  }

  function byId( id )
  {
    return document.getElementById( id )
  }

  function mountLoader( el, rp )
  {
    function mount()
    {
      el.innerHTML = "|/-\\".charAt( m ) + nl.repeat(rp)
      m = ++m > 3 ? 0 : m
    }

    var elShit = el.innerHTML, m = 0

    rp = ( rp || 0 ) > 0 ? rp - 1 : 0

    var loaderTimeout = setInterval( mount, 50 )

    mount()

    return function() {
      clearInterval( loaderTimeout )
      el.innerHTML = elShit
    }
  }

  function onKey( el, next, uKeyCode )
  {
    function onKeyDown( e )
    {
      if (( e.which || e.keyCode ) === uKeyCode )
        next()
    }

    el.addEventListener( "keydown", onKeyDown )

    return function() {
      el.removeEventListener( "keydown", onKeyDown )
    }
  }

  function onEnter( el, next )
  {
    return onKey( el, next, 13 )
  }

  function onEsc( el, next )
  {
    return onKey( el, next, 27 )
  }

  function popUserBoard( userData, next, cancelNext )
  {
    function hide()
    {
      byId("userboard-send").removeEventListener("click", sendScore)
      byId("userboard-close").removeEventListener( "click", cancel )
      byId("userboard").style.display = "none";
      unsubEnter()
      unsubEsc()
    }

    function cancel()
    {
      hide()
      cancelNext()
    }

    function sendScore()
    {
      var name = byId("name-input").value.toLocaleUpperCase()

      if ( !name || name.length > 10 )
        return

      // console.log("SEND SCORE")
      byId("userboard-send").removeEventListener("click", sendScore)
      unsubEnter()

      userData.name = name

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://tetris-tiurin.rhcloud.com/api/scores", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      //Call a function when the state changes.
      xhr.onreadystatechange = function() {
          if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
              // Request finished. Do processing here.
              umountLoader()
              hide()
              next()
          }
      }
      xhr.send( Object.keys( userData ).map( function( key ) { return key + "=" + userData[ key ] } ).join( "&" ) );

      var umountLoader = mountLoader( byId("userboard-send") )

      try {
        localStorage.setItem('tetrisName', name )
      }
      catch( e ) {}
    }

    byId("userboard").style.display = "block";
    byId("your-score").innerHTML =
      columnize( "YOUR SCORE:", scorize( userData.score ), 32 )

    try {
      var time = (new Date).getTime()
      var userScore = JSON.parse( localStorage.getItem('tetrisScore')) || []
      userScore.push({ t: time, s: userData.score })

      localStorage.setItem('tetrisScore', JSON.stringify( userScore ))
      var bestScore = userScore.sort( function( a, b ) { return b.s - a.s } )[0]["s"]

      byId("your-best-score").innerHTML =
        columnize( "YOUR BEST SCORE:", scorize( bestScore ), 32 )
    }
    catch( e ) {}

    try {
      byId("name-input").value = localStorage.getItem('tetrisName')
    }
    catch( e ) {}

    byId("name-input").focus()
    byId("userboard-send").addEventListener( "click", sendScore )
    byId("userboard-close").addEventListener( "click", cancel )

    var unsubEnter = onEnter( byId("name-input"), sendScore )
    var unsubEsc = onEsc( document, cancel )
  }

  function popLeaderboard( next )
  {
    function hide()
    {
      elBoard.style.display = "none";
      elClose.removeEventListener( "click", hide )
      unsubEsc()
      next()
    }

    var elBoard = byId("leaderboard")
    if ( elBoard.style.display === "block" )
      return

    elBoard.style.display = "block"
    var umountLoader = mountLoader( byId("score-leaders"), 32 )

    var elClose = byId("leaderboard-close")
    elClose.addEventListener( "click", hide )
    elClose.focus()

    var unsubEsc = onEsc( document, hide )

    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://tetris-tiurin.rhcloud.com/api/scores", true);

    xhr.onload = function (e) {
      var resp = JSON.parse(e.target.response)

      if ( resp.status === "ok" ) {
        umountLoader()

        byId("score-leaders").innerHTML = resp.scores
          .map( function( o ) {
            return columnize( o.name, scorize( o.score ), 32 )
          }).join("<br>")
      }
    };

    xhr.send();
  }

  function clickScreenButton( e )
  {
    if ( e.target.dataset && e.target.dataset.key ) {
      var keyCode = parseInt( e.target.dataset.key )
      TETRIS.pressKey( keyCode )
      playAudioKey( keyCode )
      e.target.blur()
    }
  }

  function bindGameKeys()
  {
    var controlIID, prevKeyCode

    function termKey()
    {
      clearInterval( controlIID )
      controlIID = 0
    }

    function readKey( e )
    {
      if ( e.altKey || e.ctrlKey || e.metaKey || e.shiftKey )
        return

      keyCode = e.which > 0 ? e.which : e.keyCode

      if ( controlIID && keyCode === prevKeyCode )
        return

      prevKeyCode = keyCode

      var pressKey = function() {
        TETRIS.pressKey( keyCode )
      }

      pressKey()
      termKey()
      playAudioKey( keyCode )

      var keySpeed = { 37: 100, 39: 100, 40: 50 }
      controlIID = setInterval( pressKey, keySpeed[ keyCode ] || 200 )
    }

    TETRIS.upause()

    setTimeout(function(){
      addEventListener( 'keyup', termKey )
      addEventListener( 'keydown', readKey )
      addEventListener( 'click', clickScreenButton )
    })

    return function() {
      clearInterval( controlIID )
      removeEventListener( 'keyup', termKey )
      removeEventListener( 'keydown', readKey )
      removeEventListener( 'click', clickScreenButton )
      TETRIS.pause()
    }
  }

  var ubindGameKeys = bindGameKeys()

  TETRIS.on({
    finish: function( score, level, rowsHit, time ) {
      ubindGameKeys()

      popUserBoard({
          score: score,
          level: level,
          rowsHit: rowsHit,
          time: time
        },
        function() {
          popLeaderboard( function() {
            TETRIS.start()
            ubindGameKeys = bindGameKeys()
          })
        },
        function() {
          TETRIS.start()
          ubindGameKeys = bindGameKeys()
        })
    },

    nextFrame: function( frame ) {
      // replace HTML special chars
      frame = frame.replace( /[ <>]|\n\r/g, function( m ) { return {
        " ": "&nbsp;",
        "<" : "&lsaquo;",
        ">" : "&rsaquo;",
        "\n\r" : "<br>" }[ m ] })

      byId("game").innerHTML = frame
    }
  })

  byId("leaderboard-link").addEventListener( "click", function() {
    ubindGameKeys()

    popLeaderboard( function() {
      ubindGameKeys = bindGameKeys()
    })
  })
}()
