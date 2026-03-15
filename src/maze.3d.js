
/*
 1  1 ** 1
      **** 2
    2 **  ** 3
 2    **    ** 4
    3 **      ** 5
      **        ** 6
 3  4 **          ** 7
      **            ** 8
    5 **              **
 4    ******************** 1
    6 **                **** 2
      **                **  ** 3
 5  7 **                **    ** 4
      **                **      ** 5
    8 **                **        **
 6    **                ************** 1
    9 **                **            **
*/

class Maze3d {
  constructor() {
    this.base();
  }
  base( x = 1, y = 1 ) {
    this.baseX = x - 1;
    this.baseY = y - 1;
    this.initWalls();
  }
  pos( y, x ) {
    x = this.baseX + x;
    y = this.baseY + y;
    return '\x1b[' + y + ';' + x + 'H';
  }
  initWalls() {
    //
    let left = '\x1b[D';
    let right = '\x1b[C';
    let down = '\x1b[B';
    let up = '\x1b[A';
    //
    let th = '\u2580'; // top half
    let bh = '\u2584'; // bot half
    let fb = '\u2588'; // full block
    let sp = ' ';      // none
    //
    this.walls = {
      end : [
        // 0
        this.pos( 1, 2 ) + th.repeat( 46 ) +
        this.pos( 24, 2 ) + bh.repeat( 46 ),
        // 1
        this.pos( 5, 11 ) + bh.repeat( 28 ) +
        this.pos( 20, 11 ) + th.repeat( 28 ),
        // 2
        this.pos( 8, 17 ) + bh.repeat( 16 ) +
        this.pos( 17, 17 ) + th.repeat( 16 ),
        // 3
        this.pos( 10, 21 ) + bh.repeat( 8 ) +
        this.pos( 15, 21 ) + th.repeat( 8 ),
        // 4
        this.pos( 12, 24 ) + th.repeat( 2 ) +
        this.pos( 13, 24 ) + bh.repeat( 2 ),
        // 5
        this.pos( 12, 24 ) + bh.repeat( 2 ) +
        this.pos( 13, 24 ) + th.repeat( 2 ),
        //
        ''
      ],
      left : {
        wall : [
          // open
          [
            // 0
            '',
            // 1
            this.pos( 5, 2 ) + bh.repeat( 8 ) +
            this.pos( 20, 2 ) + th.repeat( 8 ),
            // 2
            this.pos( 8, 11 ) + bh.repeat( 5 ) +
            this.pos( 17, 11 ) + th.repeat( 5 ),
            // 3
            this.pos( 10, 17 ) + bh.repeat( 3 ) +
            this.pos( 15, 17 ) + th.repeat( 3 ),
            // 4
            this.pos( 12, 21 ) + th.repeat( 2 ) +
            this.pos( 13, 21 ) + bh.repeat( 2 ),
            // 5
            this.pos( 13, 24 ) + th +
            this.pos( 12, 24 ) + bh,
            //
            ''
          ],
          // closed
          [
            // 0
            '',
            // 1
            this.pos( 1, 2 ) + ( bh + down + th ).repeat( 4 ) +
            this.pos( 24, 2 ) + ( th + up + bh ).repeat( 4 ),
            // 2
            this.pos( 6, 11 ) + ( th + bh + down ).repeat( 2 ) + th +
            this.pos( 19, 11 ) + ( bh + th + up ).repeat( 2 ) + bh,
            // 3
            this.pos( 9, 17 ) + th + bh + down + th +
            this.pos( 16, 17 ) + bh + th + up + bh,
            // 4
            this.pos( 11, 21 ) + th + bh +
            this.pos( 14, 21 ) + bh + th,
            // 5
            this.pos( 12, 24 ) +  bh +
            this.pos( 13, 24 ) + th,
            // 6
            this.pos( 1, 23 ) + ( bh + down + th ).repeat( 4 ) +
            this.pos( 27, 23 ) + ( th + up + bh ).repeat( 4 ),
            //
            ''
          ]
        ],
        corner : [
          // open
          [
            // 0
            '',
            // 1
            this.pos( 1, 1 ) + fb + left + down + ( fb + left + down ).repeat( 22 ) + fb,
            // 2
            this.pos( 5, 10 ) + bh + left + down + ( fb + left + down ).repeat( 14 ) + th,
            // 3
            this.pos( 8, 16 ) + bh + left + down + ( fb + left + down ).repeat( 8 ) + th,
            // 4
            this.pos( 10, 20 ) + bh + left + down + ( fb + left + down ).repeat( 4 ) + th,
            // 5
            this.pos( 12, 23 ) + fb + left + down + ( fb + left + down ).repeat( 0 ) + fb,
            //
            ''
          ],
          // closed
          [
            // 0
            '',
            // 1
            this.pos( 1, 1 ) + th + left + down + ( sp + left + down ).repeat( 22 ) + bh,
            // 2
            this.pos( 5, 10 ) + bh + left + down + ( sp + left + down ).repeat( 14 ) + th,
            // 3
            this.pos( 8, 16 ) + bh + left + down + ( sp + left + down ).repeat( 8 ) + th,
            // 4
            this.pos( 10, 20 ) + bh + left + down + ( sp + left + down ).repeat( 4 ) + th,
            // 5
            this.pos( 12, 23 ) + th + left + down + ( sp + left + down ).repeat( 0 ) + bh,
            //
            ''
          ]
        ]
      },
      right : {
        wall : [
          // open
          [
            // 0
            '',
            // 1
            this.pos( 5, 40 ) + bh.repeat( 8 ) +
            this.pos( 20, 40 ) + th.repeat( 8 ),
            // 2
            this.pos( 8, 34 ) + bh.repeat( 5 ) +
            this.pos( 17, 34 ) + th.repeat( 5 ),
            // 3
            this.pos( 10, 30 ) + bh.repeat( 3 ) +
            this.pos( 15, 30 ) + th.repeat( 3 ),
            // 4
            this.pos( 12, 27 ) + th.repeat( 2 ) +
            this.pos( 13, 27 ) + bh.repeat( 2 ),
            // 5
            this.pos( 13, 25 ) + th +
            this.pos( 12, 25 ) + bh,
            //
            ''
          ],
          // closed
          [
            // 0
            '',
            // 1
            this.pos( 5, 40 ) + ( th + up + bh ).repeat( 4 ) +
            this.pos( 20, 40 ) + ( bh + down + th ).repeat( 4 ),
            // 2
            this.pos( 8, 34 ) + ( th + up + bh ).repeat( 2 ) + th +
            this.pos( 17, 34 ) + ( bh + down + th ).repeat( 2 ) + bh,
            // 3
            this.pos( 10, 30 ) + th + up +  bh + th +
            this.pos( 15, 30 ) + bh + down + th + bh,
            // 4
            this.pos( 11, 27 ) + bh + th +
            this.pos( 14, 27 ) + th + bh,
            // 5
            this.pos( 12, 25 ) + bh +
            this.pos( 12, 25 ) + th,
            //
            ''
          ]
        ],
        corner : [
          // open
          [
            // 0
            '',
            // 1
            this.pos( 1, 48 ) + fb + left + down + ( fb + left + down ).repeat( 22 ) + fb,
            // 2
            this.pos( 5, 39 ) + bh + left + down + ( fb + left + down ).repeat( 14 ) + th,
            // 3
            this.pos( 8, 33 ) + bh + left + down + ( fb + left + down ).repeat( 8 ) + th,
            // 4
            this.pos( 10, 29 ) + bh + left + down + ( fb + left + down ).repeat( 4 ) + th,
            // 5
            this.pos( 12, 26 ) + fb + left + down + ( fb + left + down ).repeat( 0 ) + fb,
            //
            ''
          ],
          // closed
          [
            // 0
            '',
            // 1
            this.pos( 1, 48 ) + th + left + down + ( sp + left + down ).repeat( 22 ) + bh,
            // 2
            this.pos( 5, 39 ) + bh + left + down + ( sp + left + down ).repeat( 14 ) + th,
            // 3
            this.pos( 8, 33 ) + bh + left + down + ( sp + left + down ).repeat( 8 ) + th,
            // 4
            this.pos( 10, 29 ) + bh + left + down + ( sp + left + down ).repeat( 4 ) + th,
            // 5
            this.pos( 12, 26 ) + th + left + down + ( sp + left + down ).repeat( 0 ) + bh,
            // 6
            ''
          ]
        ]
      },
    };
  }
  getWalls() {
    return this.walls;
  }
  cornerLogic( prevwall, wall ) {
    // prevwall wall corner
    //     0     0     0
    //     0     1     0
    //     1     0     0
    //     1     1     1
    let corner = ( prevwall & wall );
    return corner;
  }
  draw( depth, left, right ) {
    if ( depth > 6 ) {
      depth = 6;
    }
    process.stdout.write( '\x1b[2J' );
    let d;
    for ( d = 1; d < depth; d++ ) {
      let cornerleft = this.cornerLogic( left[ d - 1 ], left[ d ] );
      let cornerright = this.cornerLogic( right[ d - 1 ], right[ d ] );
      process.stdout.write( this.walls.left.corner[ cornerleft ][ d ] );
      process.stdout.write( this.walls.right.corner[ cornerright ][ d ] );
      process.stdout.write( this.walls.left.wall[ left[ d ] ][ d ] );
      process.stdout.write( this.walls.right.wall[ right[ d ] ][ d ] );
    }
    process.stdout.write( this.walls.end[ d - 1 ] );
    process.stdout.write( this.walls.left.corner[ left[ d - 1 ] ^ 1 ][ d ] );
    process.stdout.write( this.walls.right.corner[ right[ d - 1 ] ^ 1 ][ d ] );
    process.stdout.write( '\x1b[25;1H' );
  }
  randtest() {
    process.stdout.write( '\x1b[2J' );
    let depth = Math.floor( Math.random() * 5 ) + 1;
    let left = [];
    let right = [];
    let d;
    for ( d = 0; d < depth; d++ ) {
      left[ d ] = Math.floor( Math.random() * 2 );
      right[ d ] = Math.floor( Math.random() * 2 );
    }
    left[ d ] = 0;
    right[ d ] = 0;
    this.draw( depth, left, right );
    process.stdout.write( '\x1b[25;1H' );
  }
  test() {
    let walls = this.walls;
    process.stdout.write( '\x1b[2J' );
    // all closed
    process.stdout.write( walls.left.wall[ 1 ][ 0 ] );
    process.stdout.write( walls.left.wall[ 1 ][ 1 ] );
    process.stdout.write( walls.left.wall[ 1 ][ 2 ] );
    process.stdout.write( walls.left.wall[ 1 ][ 3 ] );
    process.stdout.write( walls.left.wall[ 1 ][ 4 ] );
    process.stdout.write( walls.left.wall[ 1 ][ 5 ] );
    //
    process.stdout.write( walls.right.wall[ 1 ][ 0 ] );
    process.stdout.write( walls.right.wall[ 1 ][ 1 ] );
    process.stdout.write( walls.right.wall[ 1 ][ 2 ] );
    process.stdout.write( walls.right.wall[ 1 ][ 3 ] );
    process.stdout.write( walls.right.wall[ 1 ][ 4 ] );
    process.stdout.write( walls.right.wall[ 1 ][ 5 ] );
    // all open
    process.stdout.write( walls.left.wall[ 0 ][ 0 ] );
    process.stdout.write( walls.left.wall[ 0 ][ 1 ] );
    process.stdout.write( walls.left.wall[ 0 ][ 2 ] );
    process.stdout.write( walls.left.wall[ 0 ][ 3 ] );
    process.stdout.write( walls.left.wall[ 0 ][ 4 ] );
    process.stdout.write( walls.left.wall[ 0 ][ 5 ] );
    //
    process.stdout.write( walls.right.wall[ 0 ][ 0 ] );
    process.stdout.write( walls.right.wall[ 0 ][ 1 ] );
    process.stdout.write( walls.right.wall[ 0 ][ 2 ] );
    process.stdout.write( walls.right.wall[ 0 ][ 3 ] );
    process.stdout.write( walls.right.wall[ 0 ][ 4 ] );
    process.stdout.write( walls.right.wall[ 0 ][ 5 ] );
    //
    process.stdout.write( walls.left.corner[ 0 ][ 0 ] );
    process.stdout.write( walls.left.corner[ 0 ][ 1 ] );
    process.stdout.write( walls.left.corner[ 0 ][ 2 ] );
    process.stdout.write( walls.left.corner[ 0 ][ 3 ] );
    process.stdout.write( walls.left.corner[ 0 ][ 4 ] );
    process.stdout.write( walls.left.corner[ 0 ][ 5 ] );
    //
    process.stdout.write( walls.right.corner[ 0 ][ 0 ] );
    process.stdout.write( walls.right.corner[ 0 ][ 1 ] );
    process.stdout.write( walls.right.corner[ 0 ][ 2 ] );
    process.stdout.write( walls.right.corner[ 0 ][ 3 ] );
    process.stdout.write( walls.right.corner[ 0 ][ 4 ] );
    process.stdout.write( walls.right.corner[ 0 ][ 5 ] );
    //
    process.stdout.write( walls.end[ 0 ] );
    process.stdout.write( walls.end[ 1 ] );
    process.stdout.write( walls.end[ 2 ] );
    process.stdout.write( walls.end[ 3 ] );
    process.stdout.write( walls.end[ 4 ] );
    process.stdout.write( walls.end[ 5 ] );
    //
    process.stdout.write( '\x1b[25;1H' );
  }
}

module.exports = Maze3d;

