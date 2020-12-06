:- consult('board.pl').
:- consult('menus.pl').
:- consult('display.pl').
:- consult('logic.pl').

:- use_module(library(lists)).
:- use_module(library(clpfd)).
:- use_module(library(aggregate)).
:- use_module(library(random)).
:- use_module(library(system)).
:- use_module(library(between)).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                 Play - Start the app                                                      %
%   Prototype:                                                                                                              %
%       play/0                                                                                                              %
%                                                                                                                           %
%   Description:                                                                                                            %
%       Starts running the app, displaying the menus. Player with White color starts playing.                               %
% ------------------------------------------------------------------------------------------------------------------------- %

play :-
    abolish(state/2),
    display_players_menu,
    input(G, 0, 3, 'Type of game? ', players),
    G \= exit,
    display_dimensions_menu,
    input(N, 0, 3, 'Board Dimensions? ', dimensions),
    N \= exit,
    start_game(G, N).

play :- nl, write('Exiting Game...'), nl.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                     Start the Game                                                        %
%   Prototype:                                                                                                              %
%       start_game(+TypeGame, +Dimension)                                                                                   %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       TypeGame -> The type of the game to play (1 - Player VS Player, 2 - Player VS Computer, 3 - Computer VS Computer)   %
%       Dimension -> The dimensions of the board chosen (7 - Board 7x7, 9 - Board 9x9, 11 - Board 11x11)                    %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Starts the game cycle, ends when a final board is reached.                                                          %
% ------------------------------------------------------------------------------------------------------------------------- %

start_game(1, N) :-
    nl, initial(N, InitialBoard), assert(state(white, InitialBoard)),
    repeat,
        retract(state(Player, CurrentBoard)),
        display_game(CurrentBoard, Player),
        makeMove(Player, CurrentBoard, NextPlayer, NextBoard, player),
        assert(state(NextPlayer, NextBoard)),
        game_over(NextBoard, Winner-Number),
    showResult(Winner, Number),
    !.

start_game(2, N) :-
    display_ai_level,
    input(Difficulty, 1, 2, 'AI difficulty? ', difficulty),
    display_color_menu,
    input(Color, 1, 2, 'Player Color? ', color),
    nl, initial(N, InitialBoard), assert(state(white, InitialBoard)),
    repeat,
        retract(state(PlayerColor, CurrentBoard)),
        display_game(CurrentBoard, PlayerColor),
        return_player_type(Color, PlayerColor, PlayerType, Difficulty),
        makeMove(PlayerColor, CurrentBoard, NextPlayerColor, NextBoard, PlayerType),
        assert(state(NextPlayerColor, NextBoard)),
        game_over(NextBoard, Winner-Number),
    showResult(Winner, Number),
    !.

start_game(3, N) :-
    display_ai_level,
    write('White Color Bot Level? (1-random, 2-intelligent): '),
    input(DifficultyWhite, 1, 2, 'White Color Bot Level? ', difficulty),
    write('Black Color Bot Level? (1-random, 2-intelligent): '),
    input(DifficultyBlack, 1, 2, 'Black Color Bot Level? ', difficulty),
    nl, initial(N, InitialBoard), assert(state(white, InitialBoard)),
    repeat,
        retract(state(PlayerColor, CurrentBoard)),
        display_game(CurrentBoard, PlayerColor),
        next_difficulty(PlayerColor, DifficultyWhite, DifficultyBlack, Difficulty),
        makeMove(PlayerColor, CurrentBoard, NextPlayerColor, NextBoard, Difficulty),
        assert(state(NextPlayerColor, NextBoard)),
        sleep(1),
        game_over(NextBoard, Winner-Number),
    showResult(Winner, Number).