+function() {

  var audioCtx, keyAudioBuffers = [], spaceAudioBuffer, ambienceBuffer,
    ambienceAudioSource, muteSound,

  publPath = "./public/"

  function playAudioKey( keyCode )
  {
    if ( keyCode === 32 ) {
      playAudio( spaceAudioBuffer )
      return
    }

    var i = Math.random() * keyAudioBuffers.length << 0
    playAudio( keyAudioBuffers[ i ] )
  }

  function playAudio( buffer, loop )
  {
    if ( !buffer || muteSound )
      return

    var source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);

    if ( loop )
      source.loop = true;

    source.start(0);

    return source
  }

  function loadAudioBuffer( filename, next )
  {
    function performReq( filename )
    {
      var request = new XMLHttpRequest();

      request.open('GET', publPath + filename, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        audioCtx.decodeAudioData( request.response, next,
          function(e){"Error with decoding audio data" + e.err});
      }
      request.send();
    }

    ( filename.map && filename.map( performReq )) || performReq( filename )
  }

  // try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    loadAudioBuffer( [ 'key1.ogg', 'key2.ogg', 'key3.ogg', 'key4.ogg' ],
      function( buffer ) {
        keyAudioBuffers.push( buffer )
      })

    loadAudioBuffer( "space.ogg", function( buffer ) {
      spaceAudioBuffer = buffer
    })

    loadAudioBuffer( 'ambience.ogg', function( buffer ) {
      ambienceAudioSource = playAudio( ambienceBuffer = buffer, true )
    })

    loadAudioBuffer( 'beep.ogg', playAudio )

    document.getElementById("mute-sound").addEventListener( "click", function( e ) {
      muteSound = !muteSound

      if ( muteSound )
        ambienceAudioSource && ambienceAudioSource.stop(0)
      else
        ambienceAudioSource = playAudio( ambienceBuffer, true )

      e.target.innerHTML = muteSound ? "UNMUTE SOUND" : "MUTE SOUND"
      e.target.blur()
    })

    window.playAudioKey = playAudioKey

  // } catch( e ) {}
}()
