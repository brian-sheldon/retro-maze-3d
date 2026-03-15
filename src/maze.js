
//
// maze.js
//
// Copyright (C) 2025 by Brian Sheldon
//
// Main hub and command line interface for configuring
// maze and executing various 2d and 3d maze functions.
// This maze is drawn using only text characters typically
// available in a Linux terminal.  This version is run using
// nodeJS.
//
// Getting Started
//
// In a linux terminal run the following command.
// 
// $ node maze.js
//
// Once at the maze command line, do this.
//
// gen ( generates a maze, displaying it in 2d )
//
// Move with the maze using the arrow keys
//
// The view can be switched between 2d and 3d using
// the Page Up and Page Down keys.
//
// Type "help" for additional instructions.
//

let Maze2d = require( './maze.2d.js' );
let Maze3d = require( './maze.3d.js' );
let MazeIo = require( './maze.io.js' );

class MazeCmd {
  constructor() {
    this.log = true;
    this.defcmd = '';
    this.dis2d = true;
    this.downKey = 0;
  }
  init() {
    process.stdout.write( '\x1b[2J\x1b[1;1H' );
    this._m2d = new Maze2d();
    this._m3d = new Maze3d();
    this._io = new MazeIo();
    this.color( this.io, 1, 1 );
    this.io.prompt = '\x1b[1;32m>>> ' + this.colorstr;
    let message = this.colorstr + 'Welcome to the Maze ...';
    this.io.start( this, message );
    //this.colorstr = '\x1b[1;31m';
  }
  get m2d() {
    return this._m2d;
  }
  get m3d() {
    return this._m3d;
  }
  get io() {
    return this._io;
  }
  callback( io ) {
    io.resume();
    io.line( 'Callback called ...' );
    io.showPrompt();
    //setTimeout( function() {
    //console.log( '\x1b[1;20HCallback ...' );
    //}, 1000 );
  }
  cmd( io, cmd ) {
    let res = 0;
    let args = cmd.trim().split( /\s+/ );
    let plen = args.length;
    let p0 = args[ 0 ];
    let p1 = args[ 1 ];
    let p2 = args[ 2 ];
    let p3 = args[ 3 ];
    if ( cmd == '' ) {
      p0 = this.defcmd;
    }
    switch ( p0 ) {
      //
      // Help
      //
      case 'help':
        io.line( 'style s      Set style of maze map, 0, 1, 2' );
        io.line( 'size x y     Set size of maze, params: x y' );
        io.line( 'ms t         Gen speed in millisecs def 10' );
        io.line( 'color c b    Color 0 - 7, bright 0 - 1' );
        io.line( 'colors       Show all available colors' );
        io.line( 'gen          Gen maze using my algorithm' );
        io.line( 'gen2         Gen maze using other algorithm' );
        io.line( 'Up Arrow     Move forward, also u or f enter' );
        io.line( 'Down Arrow   Rotate 180 or backup, also d or b enter' );
        io.line( 'Left Arrow   Rotate left, also l enter' );
        io.line( 'Right Arrow  Rotatae right, also r enter' );
        io.line( 'Page Up      Show 3d maze view, also 3d enter' );
        io.line( 'Page Down    Show 2d maze map, also 2d enter' );
        io.line( 'dt           Toggle the Down Arrow between rot or backup' );
        io.line( 'clrcmd cmd   Clear auto repeat command' );
        io.line( '' );
        io.line( 'Ctrl-D or Bye  Exit' );
        break;
      //
      // Clear the auto repeat last command if set
      // Only some commands set auto repeat
      //
      case 'clrcmd':
        io.line( 'Default Command was: ' + this.defcmd );
        this.defcmd = '';
        break;
      //
      // Set the style
      // 0 - small squares
      // 1 - big squares using border chars
      // 2 - big squares using + - | chars
      //
      case 'style':
        if ( plen > 1 ) {
          var style = parseInt( p1 );
          this.m2d.setStyle( style );
        }
        io.line( 'Style: ' + this.m2d.style );
        break;
      //
      // Set the maze gen speed using delay milliseconds
      // between each new cell.  Higher is slower.
      //
      case 'ms':
        if ( plen > 1 ) {
          var ms = parseInt( p1 );
          this.m2d.setMs( ms );
        } else {
          this.m2d.setMs( 10 );
        }
        break;
      //
      // Set the maze dimensions
      //
      case 'size':
        if ( plen > 2 ) {
          var x = parseInt( p1 );
          var y = parseInt( p2 );
          this.m2d.setSize( x, y );
        }
        break;
      //
      // Set the display color, prompt color not changed
      //
      case 'color':
        var color = 1;
        var bright = 1;
        if ( plen > 1 ) {
          color = parseInt( p1 );
        }
        if ( plen > 2 ) {
          bright = parseInt( p2 );
        }
        this.color( io, color, bright );
        break;
      //
      // Display the available colors
      //
      case 'colors':
        for ( var bright = 0; bright < 2; bright++ ) {
          for ( var color = 0; color < 8; color++ ) {
            var colorstr = '\x1b[' + bright + ';' + ( 30 + color ) + 'm';
            io.write( colorstr );
            io.line( 'Color: ' + color + ' Bright: ' + bright );
          }
        }
        break;
      case 'iotest':
        this.m2d.iotest( io );
        break;
      //
      // Generate a maze using algorithm 1
      // - the one I created in 1981
      // - I think it generates better mazes
      //
      case 'gen':
        this.dis2d = true;
        this.m2d.gen( io );
        this.defcmd = p0;
        break;
      //
      // Generate a maze using algorithm 2
      // - has a more interesting visualization
      // - but I feel the mazes are not as random
      //
      case 'gen2':
        this.dis2d = true;
        this.m2d.gen2( io );
        this.defcmd = p0;
        break;
      //
      // Display maze in 2d
      // - 2d or Page Down key
      //
      case '2d':
      case '1b5b367e':
        this.dis2d = true;
        this.draw2d( io );
        break;
      //
      // Display maze in 3d
      // - 3d or Page Up key
      //
      case '3d':
      case '1b5b357e':
        this.dis2d = false;
        this.draw3d( io );
        break;
      //
      // Display Direction and Location
      //
      case 'loc':
        this.loc( io );
        break;
      //
      // Up Arrow: Move Forward
      //
      case 'f':
      case 'u':
      case 'up':
      case '1b5b41':
        this.m2d.forward();
        this.draw( io );
        this.defcmd = '3d';
        res = 2;
        break;
      //
      // Down Arrow: Rotate 180 Degrees
      //
      // Chnage the operatioin of the Down Key
      //
      case 'dt':
        let dt = [ 'Back Up', 'Rotate 180' ];
        this.downKey = this.downKey ^ 1;
        io.line( 'Down Key is now: ' + dt[ this.downKey ] );
        break;
      // Do the Down Key
      case 'b':
      case 'd':
      case 'down':
      case '1b5b42':
        if ( this.downKey ) {
          this.m2d.rotleft();
          this.m2d.rotleft();
        } else {
          this.m2d.backward();
        }
        this.draw( io );
        this.defcmd = '3d';
        res = 2;
        break;
      //
      // Left Arrow: Rotate Left 90 Degrees
      // 
      case 'l':
      case 'left':
      case '1b5b44':
        this.m2d.rotleft();
        this.draw( io );
        this.defcmd = '3d';
        res = 2;
        break;
      //
      // Right Arrow: Rotate Right 90 Degrees
      //
      case 'r':
      case 'right':
      case '1b5b43':
        this.m2d.rotright();
        this.draw( io );
        this.defcmd = '3d';
        res = 2;
        break;
      case 'convert':
        this.convert();
        break;
      //
      // Unrecognized commands
      // 
      default:
        if ( cmd != '' ) {
          res = 1;
        }
        break;
    }
    if ( res == 0 ) {
      //io.line( 'Test recognized command: ' + cmd );
    }
    return res;
  }
  //
  // functions used by commands
  //
  color( io, color = 1, bright = 1 ) {
    color += 30;
    this.colorstr = '\x1b[' + bright + ';' + color + 'm';
    this.m2d.setResetColor( this.colorstr );
    io.prompt = '\x1b[1;33m>>> ' + this.colorstr;
  }
  loc( io ) {
    var dirs = [ 'West', 'North', 'East', 'South' ];
    var dir, posx, posy;
    dir = this.m2d.dir;
    posx = this.m2d.posx;
    posy = this.m2d.posy;
    io.line( 'Facing: ' + dirs[ dir ] );
    io.line( 'X: ' + posx );
    io.line( 'Y: ' + posy );
  }
  draw( io ) {
    if ( this.dis2d ) {
      this.draw2d( io );
    } else {
      this.draw3d( io );
    }
  }
  draw2d( io ) {
    io.write( this.colorstr );
    this.m2d.drawMaze();
    if ( this.m2d.style == 0 ) {
      this.loc( io );
    }
  }
  draw3d( io ) {
    io.write( this.colorstr );
    var depth, left, right;
    [ depth, left, right ] = this.m2d.getView();
    this.m3d.draw( depth, left, right );
  }
  convert() {
    this.walls2bas();
  }
  walls2bas() {
    let walls = this.m3d.getWalls();
    let left = walls.left;
    for ( let d = 0; d <= 6; d++ ) {
      console.log( left.wall[ 0 ][ d ] );
    }
  }
}

global.Maze = new MazeCmd();
Maze.init();

