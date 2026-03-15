# retro-maze-3d

A 2d maze generator with 3d walk thru

The initial version of this app, is written using javascript, yes, not exactly a retro language.  However, the technics used to draw both the 2d and 3d views, use methods commonly used in retro systems.  Back in 1981, a month after buying my first computer, a TRS-80 Model 1, I created a 2d grid style maze generator, followed shortly by a 3d view.  This was all done in the level 2 basic.  I was inspired by a magazine article with a listing of a maze generator for a maze using hexagonal cells.  Once familiar with the algorithm, I built my own version using a grid style.

The code could use a bit of cleanup and restructuring, but it works, so may get to this one day.

## Example Session
Note: Has color and looks better in terminal.
```
$ node maze.js

Welcome to the Maze ...
--- ctrl-d or "bye" to exit ---
>>> help
style s      Set style of maze map, 0, 1, 2
size x y     Set size of maze, params: x y
ms t         Gen speed in millisecs def 10
color c b    Color 0 - 7, bright 0 - 1
colors       Show all available colors
gen          Gen maze using my algorithm
gen2         Gen maze using other algorithm
Up Arrow     Move forward, also u or f enter
Down Arrow   Rotate 180 or backup, also d or b enter
Left Arrow   Rotate left, also l enter
Right Arrow  Rotatae right, also r enter
Page Up      Show 3d maze view, also 3d enter
Page Down    Show 2d maze map, also 2d enter
dt           Toggle the Down Arrow between rot or backup
clrcmd cmd   Clear auto repeat command

Ctrl-D or Bye  Exit
>>> gen

 ┏━━━━━━━┳━━━━━━━┳━━━━━━━┳━━━━━━━┳━━━━━━━┓
 ┃ >     ┃       ┃       ┃       ┃       ┃  <
 ┃   ╻   ┃   ╻   ╹   ╺━━━┫   ╻   ┃   ╻   ┃
 ┃   ┃   ┃   ┃           ┃   ┃   ┃   ┃   ┃  2
 ┃   ┃   ┗━━━╋━━━┳━━━╸   ┃   ┃   ┣━━━┛   ┃
 ┃   ┃       ┃   ┃       ┃   ┃   ┃       ┃  3
 ┃   ┗━━━┓   ╹   ┃   ╺━━━┻━━━┫   ╹   ╺━━━┫
 ┃       ┃       ┃           ┃           ┃  4
 ┃   ┏━━━┻━━━╸   ┃   ┏━━━╸   ┗━━━━━━━┓   ┃
 ┃   ┃           ┃   ┃               ┃   ┃  5
 ┣━━━┛   ╻   ╻   ┗━━━┛   ┏━━━━━━━╸   ┃   ┃
 ┃       ┃   ┃           ┃           ┃   ┃  6
 ┃   ┏━━━┻━━━┻━━━┳━━━━━━━┻━━━┓   ╻   ┃   ┃
 ┃   ┃           ┃           ┃   ┃   ┃   ┃  7
 ┃   ╹   ╺━━━┳━━━┫   ╺━━━┓   ┃   ┃   ╹   ┃
 ┃           ┃   ┃       ┃   ┃   ┃       ┃  8
 ┃   ╺━━━┓   ╹   ┃   ╻   ┗━━━┫   ┣━━━━━━━┫
 ┃       ┃       ┃   ┃       ┃   ┃       ┃  9
 ┣━━━╸   ┗━━━━━━━┻━━━┻━━━╸   ┃   ╹   ╻   ┃
 ┃                           ┃       ┃   ┃ 10
 ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━┻━━━┛
   ^   2   3   4   5   6   7   8   9  10
>>> 3d

▀▄                                             █
  ▀▄                                           █
    ▀▄                                         █
      ▀▄                                       █
        ▀▄                            ▄▄▄▄▄▄▄▄▄█
          ▀▄                          █        █
            ▀▄                        █        █
              ▀▄                ▄▄▄▄▄▄█        █
                ▀▄            ▄▀█     █        █
                  ▀▄        ▄▀  █     █        █
                    ▀▄    ▄▀    █     █        █
                      █▀▀█      █     █        █
                      █▄▄█      █     █        █
                    ▄▀    ▀▄    █     █        █
                  ▄▀        ▀▄  █     █        █
                ▄▀            ▀▄█     █        █
              ▄▀                ▀▀▀▀▀▀█        █
            ▄▀                        █        █
          ▄▀                          █        █
        ▄▀                            ▀▀▀▀▀▀▀▀▀█
      ▄▀                                       █
    ▄▀                                         █
  ▄▀                                           █
▄▀                                             █
>>> bye
Command: bye ... existing ...
$
```
to be continued
