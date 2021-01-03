# LAIG 2020/2021

## Group T01G04
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Diogo Fernandes  | 201806250 | 201806250@fe.up.pt |
| Paulo Ribeiro    | 201806505 | 201806505@fe.up.pt |

----

## Projects

### [TP1 - Scene Graph](TP1)

Our scene is inspired by the Iron Throne Room, from the Game of Thrones. It has the main wall containing two doors and torches to light them and a decorated window. The throne is located in the center of the room. Both pillars have a Targaryen family flag.

We added an extra primitive named HalfTorus to create better door. You can see the XML with this primitive [here](scenes/full-scene.xml).

#### Strong points of our project
- We have another primitive, one half torus.
- Code Documentation
- We made an effort to make modular code. We tried to divide the code in separate functions to make it more readable.
- We followed the week plan strictly 

#### Scene
- Iron throne
- Stairs to the iron throne
- Two torchs, each one with one light source
- One window, with one light source and some decoration around it
- Flags of the House Targaryen, representing the current ruling house
- You can see our scene [without half torus](./TP1/scenes/LAIG_TP1_XML_T1_G04_v02.xml) or [with half torus](./TP1/scenes/full-scene.xml).

-----

### [TP2 - Graphic Techniques](TP2)

Our scene is inspired by the Iron Throne Room, from the Game of Thrones. It has the main wall containing two doors and torches to light them and a decorated window. The throne is located in the center of the room. Both pillars have a Targaryen family flag, its name, and a firepit.

We added an extra primitive named HalfTorus to create better door. You can see the XML with this primitive [here](scenes/full-scene.xml).

For this second submission, we made the scene more complex, by adding some animations, spriteText and spriteAnims to it. The animations can be visible in firepit, the window decoration and the Daenerys model, who walks through the palace. The spriteText are present in the pillars and in the characters board above the throne, and the spriteAnims are present in that same board, showing the most important characters of the show, and in the torches, to simulate the fire.

We also added an example of each new primitive to the scene. The primitive Plane makes the background of the characters panel, the primitive Patch makes the palace dome, and the primitive DefBarrel makes the body of the torches.

Every primitive can be seen in more detail in the scene made by "demo.xml" file.

### Strong points of our project
- We have another primitive, one half torus
- Code Documentation
- We made an effort to make modular code. We tried to divide the code in separate functions to make it more readable
- We followed the week plan strictly
- Complex scene ("full-scene.xml"/"LAIG_TP1_XML_T1_G04_v02.xml")
- Scene to check primitive details ("demo.xml")
- Creative animations
- Its possible to listen to GOT theme song. On interface, select Miscellaneous and them Music

### Scene
- Iron throne
- Stairs to the iron throne
- Two torchs, each one with one light source
- One window, with one light source and some decoration around it
- Flags of the House Targaryen, representing the current ruling house
- Pillars, with these flags, the name Targaryen and the firepits
- Characters panel, showing the characters of the show
- A Dome
- You can see our scene [without half torus](./TP2/scenes/LAIG_TP2_XML_T1_G04_v01.xml) or [with half torus](./TP2/scenes/full-scene.xml).

----

### [TP3 - 3D Game Interface](TP3)

## Project information

For this third project, we implemented a graphic interface for the board game that we developed in our first project of the curricular unit "Programação em Lógica" (PLOG).

The board game, called "Taiji", which means Great Duality, is made for two players, the white and the black. *Taijitus* are the pieces of the game. Each piece contains a black part and a white part.  This is because good and evil are indivisible! Hence both players use the same indivisible "double" pieces.
This way, each time a *Taijitu* is played, both colors are placed, so you can be helping your opponent's game!

The white player starts playing and they change turns during the game, by each piece played. Whenever it is their turn to play, the player must place a *Taijitu* on the board, as long as there is free space to do so. A *Taijitu* can only be placed in an empty space of 2 connected squares. A square is considered connected to another square if it is horizontally or vertically adjacent (not diagonally).

The game ends when there is no free space to place *Taijitus*. The player with the highest score wins the game. To get your score, find the size of the largest group of your color. To determine the size of a group, simply count the squares of the same color that make it up. In the event of a tie, the "Dark" player wins.

There are many options for the game configuration, including different board sizes (7x7, 9x9 and 11x11), and different game modes (Player VS Player, Player VS Computer and Computer VS Computer). There are also two different types of the "bots" - the random bot, which places a *Taijitu* randomly, and the intelligent bot, who tries to find the best move in order to increase their largest group.

For more information about our project visit the repository of our project [here](https://github.com/Samuuuh/plog-taiji).

The manual of our game can be seen [here](./TP3/scenes/docs/manual.pdf).

> Official Game Rules: https://nestorgames.com/rulebooks/TAIJI_EN4.pdf

### Strong points of our project
- Code Documentation
- We made an effort to make modular code. We tried to divide the code in separate functions to make it more readable
- We also organized the files into many folders, according to their functionality
- Well-composed scenes, for each of the two scene themes (Mountains and Japan)
- Creative animations, while moving a piece to the board, and during the appearance of a new piece in the auxiliary board.
- Creative camera animations, after initializing the scene, and between each player turns.
- Interactive Menu, where the user can select the game configuration, and do many other things, like the "undo" of a move, reseting the board, starting the game movie, etc. This can be also done in the WebGL interface, as an alternative.
- It's possible to listen to the environment sound. On interface, select Miscellaneous and then Sound.
- Game is fluid and has no breaks. This can be checked since the water animation always running.
- We promisified XMLHttpRequest so we can have a better flow of our game.
- Board and auxiliary board can have differents coordinates, just like game menus.
- Water using shaders that were thaught in CGRA
- OBJ modeling. Models used: Sakura Tree and Pokemóns (Piplup, Lapras, Ho-Oh and Squirtle) from Sketchfab  
- Use of patches to create circular superficies (like the volcano)
- Good and creative use of textures, materials and lights to create more appealing scenes.

### Scene
##### Mountains theme

- Main menu panel
- Game info panel
- Environment skybox
- Mountain
- Two pillars, for each player
- Board and auxiliary board
- Water animation inside the mountain
- Pokemons using OBJ
- You can see this theme [here](./TP3/scenes/mountains.xml).

##### Japan theme

- Main menu panel
- Game info panel
- Environment skybox
- FLoating boat upside down
- Water animation surrounding the island
- Two Lamps
- Decorative shrubs
- Sandbox
- Board and auxiliary board
- Torii
- You can see this theme [here](./TP3/scenes/japan.xml).