
// **********************************************
//
//
//
// **********************************************

class Maze2d {
  constructor( cols = 10, rows = 10, ms = 20, style = 1, color = 2 ) {
    this.setStyle( style );
    this.color = '\x1b[1;' + ( 30 + color ) + 'm';
    this.reset = '\x1b[1;32m';
    this.showBytes = false;
    this.ms = ms;
    this.wait = true;
    if ( ms == 0 ) {
      this.wait = false;
    }
    this.initBlocks();
    this.initTables();
    this.init( cols, rows );
    this.initPlayer();
  }
  setStyle( style ) {
    this.style = style;
  }
  setMs( ms ) {
    this.ms = ms;
  }
  setSize( x, y ) {
    this.init( x, y );
  }
  setResetColor( rc ) {
    this.reset = rc;
  }
  initTables() {
    this.offsetX = [ -1,  0,  1,  0 ];
    this.offsetY = [  0, -1,  0,  1 ];
  }
  getWall( x, y, dir ) {
    return ( this.m[ x ][ y ] & ( 1 << dir ) ) >> dir;
  }
  setWall( x, y, dir, v ) {
    let ox = x + this.offsetX[ dir ];
    let oy = y + this.offsetY[ dir ];
    let odir = ( dir + 2 ) & 0x03;
    if ( v == 0 ) {
      this.m[ x ][ y ] &= ( ( 1 << dir ) ^ 0xff );
      this.m[ ox ][ oy ] &= ( ( 1 << odir ) ^ 0xff );
    } else {
      this.m[ x ][ y ] |= ( 1 << dir );
      this.m[ ox ][ oy ] |= ( 1 << odir );
    }
    this.drawWall( x, y, dir, v );
  }
  drawWall( x, y, dir, v ) {
    switch ( dir ) {
      case 0:
        this.drawWestWall( x, y, v );
        break;
      case 1:
        this.drawNorthWall( x, y, v );
        break;
      case 2:
        this.drawEastWall( x, y, v );
        break;
      case 3:
        this.drawSouthWall( x, y, v );
        break;
    }
  }
  //
  // Sets current maze x, y and returns this
  // allowing chaining of commands.  For example,
  // to check if cell( 2, 3 ) is open to the north,
  // use "this.cell( 2, 3 ).n".
  //
  cell( x, y ) {
    this.x = x;
    this.y = y;
    return this;
  }
  //
  // These are for accessing/modifying cell data
  // without changing the current x, y.
  //
  getCell( x, y ) {
    return this.m[ x ][ y ];
  }
  setCell( x, y, v ) {
    this.m[ x ][ y ] = v;
  }
  //
  initPlayer() {
    this._dir = 0;
    this._posx = 1;
    this._posy = 1;
  }
  get dir() {
    return this._dir;
  }
  set dir( dir ) {
    this._dir = dir;
  }
  get posx() {
    return this._posx;
  }
  set posx( x ) {
    this._posx = x;
  }
  //
  get posy() {
    return this._posy;
  }
  set posy( y ) {
    this._posy = y;
  }
  backward() {
    let dir = ( this.dir ) + 2 & 0x03;
    this.forward( dir );
  }
  forward( dir = -1 ) {
    if ( dir < 0 ) {
      dir = this.dir;
    }
    switch ( dir ) {
      case 0:
        if ( this.posx > 1 ) {
          if ( ! this.wallForward( dir, this.posx, this.posy ) ) {
            this.posx--;
          }
        }
        break;
      case 1:
        if ( this.posy > 1 ) {
          if ( ! this.wallForward( dir, this.posx, this.posy ) ) {
            this.posy--;
          }
        }
        break;
      case 2:
        if ( this.posx < this.cols ) {
          if ( ! this.wallForward( dir, this.posx, this.posy ) ) {
            this.posx++;
          }
        }
        break;
      case 3:
        if ( this.posy < this.rows ) {
          if ( ! this.wallForward( dir, this.posx, this.posy ) ) {
            this.posy++;
          }
        }
        break;
    }
  }
  rotleft() {
    this.dir = ( this.dir + 3 ) & 0x03;
  }
  rotright() {
    this.dir = ( this.dir + 1 ) & 0x03;
  }
  //
  getInc( dir ) {
    let incs = [
      [ -1, 0 ], [ 0, -1 ],
      [  1, 0 ], [ 0,  1 ]
    ];
    return incs[ dir ];
  }
  //
  // Generic Wall Check
  // - Can be used for all directions by
  //   first adding to the direction ie
  //   add 1 to check right wall
  // - Use and & 0x03 to ensure dir in bounds
  //
  wallCheck( dir, x, y ) {
    dir = dir & 0x03;
    return ( this.getCell( x, y ) & ( 1 << dir ) ) >> dir;
  }
  wallForward( dir, x, y ) {
    return this.wallCheck( dir, x, y );
  }
  wallBackward( dir, x, y ) {
    dir += 2;
    return this.wallCheck( dir, x, y );
  }
  wallLeft( dir, x, y ) {
    dir += 3;
    return this.wallCheck( dir, x, y );
  }
  wallRight( dir, x, y ) {
    dir += 1;
    return this.wallCheck( dir, x, y );
  }
  //
  // Get view data for the given direction
  // - depth is the number of steps forward
  // - left arr has a 1 for each left wall forward
  // - right arr has a 1 for each right wall forward
  // - a 0 indicates no wall, a route is open in that
  //   direction
  // - this data is used to generate the 3d maze view
  //
  getView() {
    let dir = this.dir;
    let x = this.posx;
    let y = this.posy;
    let incx, incy;
    [ incx, incy ] = this.getInc( dir );
    //console.log( dir, x, y );
    let i = 0;
    let left = [];
    let right = [];
    let deadend = false;
    while ( ! deadend && i < 20 ) {
      left[ i ] = this.wallLeft( dir, x, y );
      right[ i ] = this.wallRight( dir, x, y );
      deadend = this.wallForward( dir, x, y );
      //console.log( '\r' + deadend );
      x += incx;
      y += incy;
      i++;
    }
    return [ i, left, right ];
  }
  //
  //
  //
  //
  //
  init( cols, rows ) {
    this.rows = rows;
    this.cols = cols;
    this.m = [];
    for ( let x = 0; x < cols + 2; x++ ) {
      let row = [];
      for ( let y = 0; y < rows + 2; y++ ) {
        // c = x, r = y
        let cell = 0;
        cell |= 0x01;
        cell |= 0x02;
        cell |= 0x04;
        cell |= 0x08;
        if ( x == 0 ) cell = 0x04;
        if ( y == 0 ) cell = 0x08;
        if ( x == cols + 1 ) cell = 0x01;
        if ( y == rows + 1 ) cell = 0x02;
        row.push( cell );
      }
      this.m.push( row );
    }
    this.m[ 0 ][ 0 ] = 0;
    this.m[ 0 ][ rows + 1 ] = 0;
    this.m[ cols + 1 ][ 0 ] = 0;
    this.m[ cols + 1 ][ rows + 1 ] = 0;
  }
  //
  //
  //
  //
  //
  mazeBytes() {
    let s = '';
    for ( let y = 0; y < this.rows + 2; y++ ) {
      for ( let x = 0; x < this.cols + 2; x++ ) {
        let byt = this.m[ x ][ y ];
        s += byt.toString( 16 ).padStart( 2, '0' );
        if ( ( ( x + 1 ) % 2 ) == 0 ) {
          s += ' ';
        }
      }
      s += '\n';
    }
    console.log( s );
  }
  //
  //
  //
  showBytesOn() {
    this.showBytes = true;
  }
  //
  get v() {
    return this.m[ this.x ][ this.y ];
  }
  set v ( v ) {
    this.m[ this.x ][ this.y ] = v;
  }
  //
  get wv() {
    return this.m[ this.x - 1 ][ this.y ];
  }
  set wv( v ) {
    this.m[ this.x - 1 ][ this.y ] = v;
  }
  get nv() {
    return this.m[ this.x ][ this.y - 1 ];
  }
  set nv( v ) {
    this.m[ this.x ][ this.y - 1 ] = v;
  }
  get ev() {
    return this.m[ this.x + 1 ][ this.y ];
  }
  set ev( v ) {
    this.m[ this.x + 1 ][ this.y ] = v;
  }
  get sv() {
    return this.m[ this.x ][ this.y + 1 ];
  }
  set sv( v ) {
    this.m[ this.x ][ this.y + 1 ] = v;
  }
  //
  //
  //
  bit( v, bit, bv ) {
    let mask = 1 << bit;
    if ( bv ) {
      v |= mask;
    } else {
      v &= ~mask;
    }
    return v;
  }
  //
  get w() {
    return ( this.v & 0x01 ) >> 0;
  }
  set w( w ) {
    if ( this.x > 1 ) {
      let v = 0;
      if ( w != 0 ) {
        v = 1;
      }
      this.v = this.bit( this.v, 0, v );
      this.wv = this.bit( this.wv, 2, v );
      this.drawWestWall( this.x, this.y, v );
    }
  }
  get n() {
    return ( this.v & 0x02 ) >> 1;
  }
  set n( n ) {
    if ( this.y > 1 ) {
      let v = 0;
      if ( n != 0 ) {
        v = 1;
      }
      this.v = this.bit( this.v, 1, v );
      this.nv = this.bit( this.nv, 3, v );
      this.drawNorthWall( this.x, this.y, v );
    }
  }
  get e() {
    return ( this.v & 0x04 ) >> 2;
  }
  set e( e ) {
    if ( this.x < this.cols ) {
      let v = 0;
      if ( e != 0 ) {
        v = 1;
      }
      this.v = this.bit( this.v, 2, v );
      this.ev = this.bit( this.ev, 0, v );
      this.drawEastWall( this.x, this.y, v );
    }
  }
  get s() {
    return ( this.v & 0x08 ) >> 3;
  }
  set s( s ) {
    if ( this.y < this.rows ) {
      let v = 0;
      if ( s != 0 ) {
        v = 1;
      }
      this.v = this.bit( this.v, 3, v );
      this.sv = this.bit( this.sv, 1, v );
      this.drawSouthWall( this.x, this.y, v );
    }
  }
  //
  // Can Go
  //
  get canGoWest() {
    if ( this.w ) {
      if ( this.wv == 0x0f ) {
        return true;
      }
    }
    return false;
  }
  get canGoNorth() {
    if ( this.n ) {
      if ( this.nv == 0x0f ) {
        return true;
      }
    }
    return false;
  }
  get canGoEast() {
    if ( this.e ) {
      if ( this.ev == 0x0f ) {
        return true;
      }
    }
    return false;
  }
  get canGoSouth() {
    if ( this.s ) {
      if ( this.sv == 0x0f ) {
        return true;
      }
    }
    return false;
  }
  get canGo() {
    return this.canGoWest | this.canGoNorth | this.canGoEast | this.canGoSouth;;
  }
  //
  // Graphics Support
  // - Corner Pieces
  // 
  get tl() {
    let x = this.x;
    let y = this.y;
    let v = 0;
    v |= this.cell( x - 1, y ).n << 0;
    v |= this.cell( x, y - 1 ).w << 1;
    v |= this.cell( x, y ).n << 2;
    v |= this.cell( x, y ).w << 3;
    return v;
  }
  get tr() {
    let x = this.x;
    let y = this.y;
    let v = 0;
    v |= this.cell( x + 1, y ).n << 2;
    v |= this.cell( x, y - 1 ).e << 1;
    v |= this.cell( x, y ).n << 0;
    v |= this.cell( x, y ).e << 3;
    return v;
  }
  get bl() {
    let x = this.x;
    let y = this.y;
    let v = 0;
    v |= this.cell( x - 1, y ).s << 0;
    v |= this.cell( x, y + 1 ).w << 3;
    v |= this.cell( x, y ).s << 2;
    v |= this.cell( x, y ).w << 1;
    return v;
  }
  get br() {
    let x = this.x;
    let y = this.y;
    let v = 0;
    v |= this.cell( x + 1, y ).s << 2;
    v |= this.cell( x, y - 1 ).e << 3;
    v |= this.cell( x, y ).s << 0;
    v |= this.cell( x, y ).e << 1;
    return v;
  }
  get tlb() {
    return this.blocks[ this.tl ];
  }
  get trb() {
    return this.blocks[ this.tr ];
  }
  get blb() {
    return this.blocks[ this.bl ];
  }
  get brb() {
    return this.blocks[ this.br ];
  }
  //
  //
  //
  test() {
    //this.cell( 2, 2 ).w = 0;
    //this.cell( 2, 2 ).n = 0;
    //this.cell( 2, 2 ).e = 0;
    //this.cell( 2, 2 ).s = 0;
    //console.log( this.cell( 2, 2 ).n );
    //console.log( this.cell( 2, 2 ).v );
    //console.log( this.cell( 2, 2 ).v );
    //console.log( this.tlb + this.trb + this.blb + this.brb );
  }
  //
  // Used to slow down maze generation
  //
  sleep( ms ) {
    return new Promise( ( resolve ) => {
      setTimeout( resolve, ms );
    });
  }
  //
  // This was the original maze generation method
  // I used when I created my first maze program in
  // basic in 1981 on a TRS-80 Model 1.  I was inspired
  // by an article in some magazing with source code
  // for a program called Bee Maze, which used hexagonal
  // maze cells.  I adapted it to a grid style maze, but I
  // noticed the maze had a very distinct pattern and lacked
  // a single 4 way intersection.  After some experimentation,
  // I came up with this algorithm, which seemed much more
  // random in nature. I finally decided to rewrite this old
  // program in a modern language.
  //
  // I have also recreated the 3d portion of this program, which
  // used packed strings in basic to improve performance.  Both
  // the 2d maze and the 3d maze were drawn using the 2x3 pixel
  // per character in the standard font on the TRS-80.  As the
  // 2x3 font is not readily available on some systems, I choose
  // to use 2x2 blocks for the 3d maze.  The 2d map of the maze is
  // drawn using characters typically used for borders.  These
  // characters are particularly difficult to use for this purpose,
  // but the results are much better than using the block characters.
  //
  // Note: I recreated this program from memory as I have long ago
  // lost my original Basic source code.
  //
  notVisited( x, y, dir ) {
    let tx = x + this.offsetX[ dir ];
    let ty = y + this.offsetY[ dir ];
    return ( this.m[ tx ][ ty ] & 0x0f ) == 0x0f;
  }
  genCanGo( x, y, dir ) {
    // first check for wall
    if ( this.getWall( x, y, dir ) ) {
      // next check if neighbor is avail
      return this.notVisited( x, y, dir );
    }
  }
  async gen( io = null, callback = null ) {
    if ( io != null ) {
      io.pause();
    }
    this.init( this.cols, this.rows );
    this.drawMaze();
    this.log = '';
    let cells = this.rows * this.cols;
    let visited = [];
    let dirs = new Array( 4 );
    let x = Math.floor( Math.random() * this.cols ) + 1;
    let y = Math.floor( Math.random() * this.rows ) + 1;
    visited.push( [ x, y ] );
    this.drawCenter( x, y, 1 );
    this.log += 'push x: ' + x + ' y: ' + y + '\n';
    //console.log( x + ':' + y );
    while ( visited.length < cells ) {
      let len = visited.length;
      let i = Math.floor( Math.random() * len );
      [ x, y ] = visited[ i ];
      let deadend = false;
      let maxgo = Math.floor( Math.random() * 12 ) + 5;
      while ( ! deadend && maxgo > 0 ) {
        this.cell( x, y );
        let ndirs = 0;
        if ( this.genCanGo( x, y, 0 ) ) dirs[ ndirs++ ] = 0;
        if ( this.genCanGo( x, y, 1 ) ) dirs[ ndirs++ ] = 1;
        if ( this.genCanGo( x, y, 2 ) ) dirs[ ndirs++ ] = 2;
        if ( this.genCanGo( x, y, 3 ) ) dirs[ ndirs++ ] = 3;
        if ( ndirs > 0 ) {
          let dir = dirs[ Math.floor( Math.random() * ndirs ) ];
          this.setWall( x, y, dir, 0 );
          x += this.offsetX[ dir ];
          y += this.offsetY[ dir ];
          visited.push( [ x, y ] );
          //this.drawCenter( x, y );
          this.log += 'push x: ' + x + ' y: ' + y + '\n';
          maxgo--;
          await this.sleep( this.ms );
        /*
        if ( this.canGo ) {
          let dir = Math.floor( Math.random() * 4 );
          let advance = false;
          switch ( dir ) {
            case 0:
              if ( this.canGoWest ) {
                this.w = 0;
                x--;
                advance = true;
              }
              break;
            case 1:
              if ( this.canGoNorth ) {
                this.n = 0;
                y--;
                advance = true;
              }
              break;
            case 2:
              if ( this.canGoEast ) {
                this.e = 0;
                x++;
                advance = true;
              }
              break;
            case 3:
              if ( this.canGoSouth ) {
                this.s = 0;
                y++;
                advance = true;
              }
              break;
          }
          if ( advance ) {
            visited.push( [ x, y ] );
            //this.drawCenter( x, y );
            this.log += 'push x: ' + x + ' y: ' + y + '\n';
            maxgo--;
            await this.sleep( this.ms );
          }
          */
        } else {
          deadend = true;
        }
      }
    }
    if ( this.showBytes ) {
      this.mazeBytes();
    }
    //console.log( this.log );
    let mult = 1;
    if ( this.style > 0 ) {
      mult = 2;
    }
    let rows = this.rows * mult + 2;
    process.stdout.write( this.reset );
    //process.stdout.write( '\x1b[' + rows + ';1H' );
    if ( io != null ) {
      io.resume();
    }
  }
  async iotest( io ) {
    io.pause();
    await this.sleep( 3000 );
    io.resume( io );
  }
  //
  // Another maze generation algorithm I recently
  // learned about.  It does a reasonable job of
  // generating mazes, but it appears to create a
  // lot of long hallways and I am not yet sure it
  // is capable of generating a 4 way intersection.
  // But, it does have the advantage of being great
  // for visualizing the maze creation.
  //
  async gen2( io = null ) {
    if ( io != null ) {
      io.pause();
    }
    this.init( this.cols, this.rows );
    this.drawMaze();
    this.log = '';
    let cells = this.rows * this.cols;
    let visited = [];
    let x = Math.floor( Math.random() * this.cols ) + 1;
    let y = Math.floor( Math.random() * this.rows ) + 1;
    visited.push( [ x, y ] );
    this.drawCenter( x, y, 1 );
    this.log += 'push x: ' + x + ' y: ' + y + '\n';
    //console.log( x + ':' + y );
    let i = 0;
    let deadend = ! this.cell( x, y ).canGo;
    while ( i >= 0 ) {
      let len = visited.length;
      [ x, y ] = visited[ i ];
      deadend = false;
      while ( ! deadend ) {
        this.cell( x, y );
        if ( this.canGo ) {
          let dir = Math.floor( Math.random() * 4 );
          let advance = false;
          switch ( dir ) {
            case 0:
              if ( this.canGoWest ) {
                this.w = 0;
                x--;
                advance = true;
              }
              break;
            case 1:
              if ( this.canGoNorth ) {
                this.n = 0;
                y--;
                advance = true;
              }
              break;
            case 2:
              if ( this.canGoEast ) {
                this.e = 0;
                x++;
                advance = true;
              }
              break;
            case 3:
              if ( this.canGoSouth ) {
                this.s = 0;
                y++;
                advance = true;
              }
              break;
          }
          if ( advance ) {
            visited.push( [ x, y ] );
            i++;
            this.drawCenter( x, y, 1 );
            this.log += 'push x: ' + x + ' y: ' + y + '\n';
            await this.sleep( this.ms );
          }
        } else {
          if ( visited.length > 1 ) {
            visited.pop();
            this.drawCenter( x, y, 0 );
          }
          i--;
          await this.sleep( this.ms );
          //[ x, y ] = visited[ visited.length - 1 ];
          //deadend = ! this.cell( x, y ).canGo;
          deadend = true;
        }
      }
    }
    if ( this.showBytes ) {
      this.mazeBytes();
    }
    //console.log( this.log );
    let mult = 1;
    if ( this.style > 0 ) {
      mult = 2;
    }
    let rows = this.rows * mult + 2;
    process.stdout.write( this.reset );
    //process.stdout.write( '\x1b[' + rows + ';4H' );
    if ( io != null ) {
      io.resume();
    }
  }
  initBlocks() {
    this.blocks = [
      // 0000      0001      0010      0011
      '\u25aa', '\u2578', '\u2579', '\u251b',
      // 0100      0101      0110      0111
      '\u257a', '\u2501', '\u2517', '\u253b',
      // 1000      1001      1010      1011
      '\u257b', '\u2513', '\u2503', '\u252b',
      // 1100      1101      1110      1111
      '\u250f', '\u2533', '\u2523', '\u254b',
      // horizontal, vertical lines
      '\u2501', '\u2503'
    ];
  }
  colrow( x, y ) {
    let col, row;
    switch ( this.style ) {
      case 0:
        col = x * 2 - 1;
        row = y;
        return [ col, row ];
        break;
      case 1:
      case 2:
        col = x * 4 - 2;
        row = y * 2 - 1;
        return [ col, row ];
        break;
    }
  }
  drawCenter( x, y, v, color = 5 ) {
    if ( this.style != 0 ) {
      color = '\x1b[1;' + ( 30 + color ) + 'm';
      let col, row;
      [ col, row ] = this.colrow( x, y );
      col += 2;
      row += 1;
      let s = this.blocks[ 0 ];
      s = v != 0 ? '\u263b' : ' ';
      process.stdout.write( '\x1b[s' + color );
      process.stdout.write( '\x1b[' + row + ';' + col + 'H' + s ); // or is it f
      process.stdout.write( '\x1b[u' + this.reset );
    }
  }
  drawWestWall( x, y ) {
    let col, row, vb, s;
    let leftdown = '\x1b[B\x1b[D';
    let tlb = this.cell( x, y ).tlb;
    let cb = this.cell( x, y ).w ? this.blocks[ 10 ] : ' ';
    let cb2 = this.cell( x, y ).w ? '|' : ' ';
    let blb = leftdown + this.cell( x, y ).blb;
    [ col, row ] = this.colrow( x, y );
    switch ( this.style ) {
      case 0:
        vb = '';
        s = tlb + vb + blb;
        break;
      case 1:
        vb = leftdown + cb;
        s = tlb + vb + blb;
        break;
      case 2:
        s = '+' + leftdown + cb2 + leftdown + '+';
        break;
    }
    process.stdout.write( '\x1b[s' );
    process.stdout.write( '\x1b[' + row + ';' + col + 'H' + s ); // or is it f
    process.stdout.write( '\x1b[u' );
  }
  drawNorthWall( x, y ) {
    let col, row, hb, s;
    let tlb = this.cell( x, y ).tlb;
    let cb = this.cell( x, y ).n ? this.blocks[ 5 ] : ' ' ;
    let cb2 = this.cell( x, y ).n ? '-' : ' ' ;
    let trb = this.cell( x, y ).trb;
    [ col, row ] = this.colrow( x, y );
    switch ( this.style ) {
      case 0:
        hb = cb;
        s = tlb + hb + trb;
        break;
      case 1:
        hb = cb + cb + cb;
        s = tlb + hb + trb;
        break;
      case 2:
        s = '+' + cb2 + cb2 + cb2 + '+';
        break;
    }
    process.stdout.write( '\x1b[s' );
    process.stdout.write( '\x1b[' + row + ';' + col + 'H' + s ); // or is it f
    process.stdout.write( '\x1b[u' );
  }
  drawSouthWall( x, y ) {
    this.drawNorthWall( x, y + 1 );
    this.cell( x, y );
  }
  drawEastWall( x, y ) {
    this.drawWestWall( x + 1, y );
    this.cell( x, y );
  }
  drawMaze() {
    process.stdout.write( '\x1b[2J\x1b[H\n' );
    let xi = this.cols * 4 + 4;
    let yi;
    for ( let y = 1; y <= this.rows; y++ ) {
      if ( this.style > 0 ) {
        yi = y * 2;
        let ys = y.toString().padStart( 2, ' ' );;
        if ( this.posy == y ) {
          ys = ' <';
        }
        process.stdout.write( '\x1b[' + yi + ';' + xi + 'H' );
        process.stdout.write( ys );
      }
      for ( let x = 1; x <= this.cols; x++ ) {
        this.cell( x, y ).drawWestWall( x, y );
        //await this.sleep( 1000 );
        this.cell( x, y ).drawNorthWall( x, y );
        //await this.sleep( 1000 );
        if ( x == this.cols ) {
          this.cell( x, y ).drawEastWall( x, y );
        }
        if ( y == this.rows ) {
          this.cell( x, y ).drawSouthWall( x, y );
        }
      }
    }
    yi = this.rows * 2 + 2;
    for ( let x = 1; x <= this.cols; x++ ) {
      if ( this.style > 0 ) {
        xi = x * 4 - 1;
        let xs = x.toString().padStart( 2, ' ' );
        if ( x == this.posx ) {
          xs = ' ^';
        }
        process.stdout.write( '\x1b[' + yi + ';' + xi + 'H' );
        process.stdout.write( xs.padStart( 2, ' ' ) );
      }
    }
    if ( this.style > 0 ) {
      let dirs = [ '<', '^', '>', 'v' ];
      let dirstr = dirs[ this.dir ];
      xi = this.posx * 4;
      yi = this.posy * 2;
      process.stdout.write( '\x1b[' + yi + ';' + xi + 'H' );
      //process.stdout.write( '\u263b' );
      process.stdout.write( dirstr );
    }
    let x, y;
    [ x, y ] = this.colrow( 0, this.rows + 1 );
    y++;
    let mult = 1;
    if ( this.style != 0 ) {
      mult = 2;
    }
    let rows = this.rows * mult + 2;
    if ( this.style > 0 ) {
      rows++;
    }
    process.stdout.write( '\x1b[' + rows + ';1H' );
  }
  importDm( level ) {
    let dms = [
      [ // 11010101 01111101
        0xd5, 0x7d, 0x57, 0xa6, 0x95, 0xd3,
        0xb6, 0x56, 0x9c, 0xa5, 0xda, 0x48,
        0x96, 0x13, 0x6f, 0xcb, 0x94, 0xaf,
        0xb8, 0x57, 0x2f, 0xa9, 0xda, 0x6f,
        0xa3, 0x49, 0x2f, 0x94, 0x95, 0x0f,
        0xff, 0xff, 0xff
      ],
      [
        0xdf, 0x77, 0x5f, 0xc8, 0xaa, 0xcf,
        0x9d, 0x1a, 0xdf, 0xcd, 0x4a, 0x6f,
        0x9b, 0x68, 0x8f, 0xa2, 0xa4, 0xdf,
        0x96, 0x96, 0xaf, 0xd8, 0x4e, 0xcf,
        0xb7, 0x76, 0x9f, 0x88, 0x88, 0x4f,
        0xff, 0xff, 0xff
      ],
      [
        0xd5, 0xd5, 0x7f, 0x9c, 0xbd, 0xaf,
        0xcb, 0xa2, 0x9f, 0x99, 0xb6, 0x2f,
        0xcd, 0x99, 0x2f, 0xa2, 0x55, 0xaf,
        0xb5, 0x5a, 0xbf, 0x8d, 0xe2, 0x6f,
        0xa2, 0x37, 0x2f, 0x95, 0x54, 0x4f,
        0xff, 0xff, 0xff
      ],
      [
        0xd7, 0xf7, 0x7f, 0xb2, 0x66, 0xaf,
        0xa5, 0x28, 0xaf, 0x97, 0x0c, 0x8f,
        0xc8, 0xbb, 0xdf, 0x9b, 0x22, 0x2f,
        0xea, 0xd9, 0x6f, 0x92, 0x2d, 0xaf,
        0xd3, 0x22, 0x2f, 0x94, 0x55, 0x4f,
        0xff, 0xff, 0xff
      ],
      [
        0xd7, 0x55, 0xdf, 0x9a, 0xcc, 0x4f,
        0xda, 0xb9, 0x5f, 0xa0, 0xf6, 0x6f,
        0xb1, 0x9b, 0x2f, 0xac, 0xe0, 0x6f,
        0xbd, 0x9d, 0xaf, 0xaa, 0x4a, 0xaf,
        0xa2, 0x52, 0x2f, 0x9c, 0x9d, 0x07,
        0xff, 0xff, 0xff
      ]
    ];
    this.init( 11, 12 );
    this.drawMaze();
    let dm = dms[ level - 1 ];
    let i = 0;
    for ( let x = 0; x < 11; x++ ) {
      let y = 12;
      for ( let p = 0; p < 3; p++ ) {
        let byt = dm[ i++ ];
        for ( let b = 0; b < 4; b++ ) {
          let s = byt & 0x80;
          byt = byt << 1;
          let w = byt & 0x80;
          byt = byt << 1;
          this.cell( x + 1, y ).s = s;
          this.cell( x + 1, y ).w = w;
          y--;
        }
      }
    }
  }
}

module.exports = Maze2d;


