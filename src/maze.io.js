
class SimpleCmd {
  constructor() {
    this.paused = false;
    this.keyQueue = [];
    this.queue = '';
    this._prompt = '';
  }
  hex2( v ) {
    return v.toString( 16 ).padStart( 2, '0' );
  }
  get prompt() {
    return this._prompt;
  }
  set prompt( s ) {
    this._prompt = s;
  }
  showPrompt() {
    this.write( this.prompt );
  }
  // Configure main callback class and listen
  start( m, message = 'Welcome to IO ...' ) {
    this.m = m;
    let io = this;
    io.line( message );
    io.line( '--- ctrl-d or "bye" to exit ---' );
    io.showPrompt();
    process.stdin.setRawMode( true );
    process.stdin.resume();
    process.stdin.setEncoding( 'utf8' );
    io.listen( io );
  }
  listen( io ) {
    process.stdin.on( 'data', function( key ) {
      if ( key === '\x04' ) {
        io.line();
        io.line( 'Key: ctrl-d ... exiting ...' );
        process.exit();
      }
      if ( io.paused ) {
        io.keyQueue.push( key );
      } else {
        io.key( io, key );
      }
    });
  }
  pause() {
    this.paused = true;
  }
  resume() {
    let io = this;
    io.queue = '';
    io.keyQueue = [];
    io.paused = false;
    for ( let k in io.keyQueue ) {
      let key = io.keyQueue.pop();
      io.key( io, key );
    }
    io.showPrompt();
  }
  write( s = '' ) {
    if ( ! this.paused ) {
      process.stdout.write( s );
    }
  }
  line( s = '' ) {
    let lf = '\n';
    this.write( s + lf );
  }
  key( io, key ) {
    let len = key.length;
    let hexstr = '';
    for ( let c in key ) {
      let ch = key[ c ];
      let cc = ch.charCodeAt( 0 );
      hexstr += this.hex2( cc );
    }
    this.show = false;
    if ( this.show ) {
      io.write( len + ' ' );
      io.line( hexstr );
    }
    this.doKey( io, key, len, hexstr );
  }
  doKey( io, key, len, hexstr ) {
    let ch;
    switch ( hexstr ) {
      case '0d': // Enter
        io.line();
        this.doCmd( io, this.queue );
        this.queue = '';
        break;
      case '7f': // Backspace
        if ( this.queue.length > 0 ) {
          this.queue = this.queue.slice( 0, -1 );
          //io.write( '\n' + this.queue );
          io.write( '\x1b[D\x1b[K' );
        }
        break;
      default:
        if ( len == 1 ) {
          ch = key.charAt( 0 );
          this.queue += ch;
          io.write( ch );
        } else {
          this.doCmd( io, hexstr );
        }
        break;
    }
  }
  doCmd( io, cmd ) {
    switch ( cmd ) {
      case 'bye':
        io.line( 'Command: bye ... existing ...' );
        process.exit();
        break;
      default:
        let res = 1;
        res = this.m.cmd( io, cmd );
        if ( res == 1 ) {
          io.line( 'Command not recognized: ' + cmd );
          io.line( 'Enter help for instructions ...' );
        }
        if ( res != 2 ) {
        }
        io.showPrompt();
        break;
    }
  }
}

module.exports = SimpleCmd;

