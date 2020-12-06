% ------------------------------------------------------------------------------------------------------------------------- %
%                                       Get the Symbol corresponding to each cell                                           %
%   Prototype:                                                                                                              %
%       character(+Name, -Symbol)                                                                                           %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Name -> Content of the cell to get its representation symbol                                                        %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Symbol -> Symbol of the cell, to be presented on the screen                                                         %
% ------------------------------------------------------------------------------------------------------------------------- %

character(empty, ' ').
character(black, 'X').    
character(white, 'O').

% ------------------------------------------------------------------------------------------------------------------------- %
%                                   Get a string with the name of the current Player                                        %
%   Prototype:                                                                                                              %
%       player(+Player, -String)                                                                                            %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Player -> The Player of the current turn (white, black)                                                             %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       String -> String composed with the color of the player, to be presented to the screen                               %
% ------------------------------------------------------------------------------------------------------------------------- %

player(white, 'White Player').
player(black, 'Black Player').

% ------------------------------------------------------------------------------------------------------------------------- %
%                                           Display game at a given moment                                                  %
%   Prototype:                                                                                                              %
%       display_game(+Gamestate, +Player)                                                                                   %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Gamestate -> The state of the current board                                                                         %
%       Player -> The player to play in the current turn                                                                    %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presents the current board and the current turn to the screen                                                       %
% ------------------------------------------------------------------------------------------------------------------------- %

display_game(Gamestate, Player) :- display_board(Gamestate), display_turn(Player).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                 Display Game Board                                                        %
%   Prototype:                                                                                                              %
%       display_board(+Gamestate)                                                                                           %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Gamestate -> The state of the current board                                                                         %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presents the current board to the screen                                                                            %
% ------------------------------------------------------------------------------------------------------------------------- %

display_board(Gamestate) :-
    length(Gamestate, N),
    nl, write('      '), print_numbers(1, N), nl,
    write('    \x250c\'), print_top(N), % Top Left Corner (┌)
    nl, print_matrix(Gamestate, 1, N),
    write('    \x2514\'), print_bot(N), % Bottom Left Corner (└)
    nl, !.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                     Display Game Turn                                                     %
%   Prototype:                                                                                                              %
%       display_turn(+Player)                                                                                               %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Player -> The player to play in the current turn                                                                    %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presents the current turn to the screen                                                                             %
% ------------------------------------------------------------------------------------------------------------------------- %

display_turn(Player) :-
    player(Player, Name),
    character(Player, Symbol),
    nl, write(Name), write(' turn. ('), write(Symbol), write(')'), nl.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                   Prints a line of numbers, enumerating the columns                                       %
%   Prototype:                                                                                                              %
%       print_numbers(+Acc, +N)                                                                                             %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Acc -> Actual column number to print. It begins with the value 1                                                    %
%       N -> Dimension of the board (N x N)                                                                                 %
%   Outputs:                                                                                                                %
%       Presents a line of numbers to the screen, enumerating the columns                                                   %
% ------------------------------------------------------------------------------------------------------------------------- %

print_numbers(N, N) :- write(N), !.
print_numbers(Acc, N) :-    % write becomes more clean when Acc has 2 digits (no deformatting)
    Acc >= 9,
    NewAcc is Acc + 1,
    write(Acc),
    write('  '),
    print_numbers(NewAcc, N), !.
print_numbers(Acc, N) :-
    NewAcc is Acc + 1,
    write(Acc),
    write('   '),
    print_numbers(NewAcc, N).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                               Display the Board Matrix                                                    %
%   Prototype:                                                                                                              %
%        print_matrix(+Matrix, +Acc, +N)                                                                                    %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Matrix -> The state of the current board                                                                            %
%       Acc -> Actual row line to print. It begins with value 1                                                             %
%       N -> Dimension of the board (N x N)                                                                                 %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presents the game matrix to the screen                                                                              %
% ------------------------------------------------------------------------------------------------------------------------- %

print_matrix([], _, _).
print_matrix([L|M], Acc, N) :-  % write becomes more clean when Acc has 2 digits (no deformatting)
    Acc > 9,
    write(Acc), write('  '),
    print_line(L), write('\n'),
    print_limits(Acc, N),
    NewAcc is Acc + 1,
    print_matrix(M, NewAcc, N), !.
print_matrix([L|M], Acc, N) :-
    write(' '), write(Acc), write('  '),
    print_line(L), write('\n'),
    print_limits(Acc, N),
    NewAcc is Acc + 1,
    print_matrix(M, NewAcc, N).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                              Present a single Matrix Line                                                 %
%   Prototype:                                                                                                              %
%       print_line(+Line)                                                                                                   %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Line -> Line of matrix to present to screen                                                                         %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presents a single Matrix Line to the screen                                                                         %
% ------------------------------------------------------------------------------------------------------------------------- %

print_line([]) :- write('\x2502\').  % Vertical Division (│)
print_line([Cell|L]) :-
    character(Cell, C),
    write('\x2502\ '), write(C), write(' '), % Vertical Division followed by Cell Value (│ C) 
    print_line(L).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                              Present left limits of the board                                             %
%   Prototype:                                                                                                              %
%        print_limits(+Acc, +N)                                                                                             %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Acc -> Number of line being presented                                                                               %
%       N -> Dimension of the board (N x N)                                                                                 %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presents the left limits of the board                                                                               %
% ------------------------------------------------------------------------------------------------------------------------- %

print_limits(A, A).
print_limits(_, 0) :- nl.
print_limits(_, N) :-
    write('    \x251c\'), % Left Limit (├)
    print_middle(N).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                     Presents board's middle horizontal limits                                             %
%   Prototype:                                                                                                              %
%        print_middle(+N)                                                                                                   %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       N -> Column which middle limit is being presented                                                                   %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presentes the board's middle horizontal limits                                                                      %
% ------------------------------------------------------------------------------------------------------------------------- %

print_middle(0) :- nl.
print_middle(N) :-
    N > 0,
    N1 is N - 1,
    write('\x2500\\x2500\\x2500\'), % Middle horizontal limit  (───)
    print_middle_intersect(N),
    print_middle(N1).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                       Presents board's top horizontal limits                                              %
%   Prototype:                                                                                                              %
%        print_top(+N)                                                                                                      %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       N -> Column which top limit is being presented                                                                      %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presentes the board's top horizontal limits                                                                         %
% ------------------------------------------------------------------------------------------------------------------------- %

print_top(0).
print_top(N) :-
    N > 0,
    N1 is N - 1,
    write('\x2500\\x2500\\x2500\'), % Top horizontal limit (───)
    print_top_intersect(N),
    print_top(N1).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                           Presents board's bottom horizontal limits                                       %
%   Prototype:                                                                                                              %
%        print_bot(+N)                                                                                                      %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       N -> Column which bottom limit is being presented                                                                   %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presentes the board's bottom horizontal limits                                                                      %
% ------------------------------------------------------------------------------------------------------------------------- %

print_bot(0).
print_bot(N) :-
    N > 0,
    N1 is N - 1,
write('\x2500\\x2500\\x2500\'), % Bottom horizontal limit (───)
    print_bot_intersect(N),
    print_bot(N1).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                          Presents board's middle intersect limits                                         %
%   Prototype:                                                                                                              %
%        print_middle_intersect(+N)                                                                                         %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       N -> Column which middle intersect limit is being presented                                                         %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presentes the board's middle intersect limits                                                                       %
% ------------------------------------------------------------------------------------------------------------------------- %

print_middle_intersect(1) :-
    write('\x2524\'). % Middle Left Intersect (┤)
print_middle_intersect(_) :-
    write('\x253c\'). % Middle Intersect (┼)

% ------------------------------------------------------------------------------------------------------------------------- %
%                                          Presents board's top intersect limits                                            %
%   Prototype:                                                                                                              %
%        print_top_intersect(+N)                                                                                            %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       N -> Column which top intersect limit is being presented                                                            %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presentes the board's top intersect limits                                                                          %
% ------------------------------------------------------------------------------------------------------------------------- %

print_top_intersect(1) :-
    write('\x2510\'). % Top Right Corner (┐)
print_top_intersect(_) :-
    write('\x252c\'). % Top Intersect (┬)

% ------------------------------------------------------------------------------------------------------------------------- %
%                                          Presents board's bottom intersect limits                                         %
%   Prototype:                                                                                                              %
%        print_bot_intersect(+N)                                                                                            %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       N -> Column which bottom intersect limit is being presented                                                         %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presentes the board's bottom intersect limits                                                                       %
% ------------------------------------------------------------------------------------------------------------------------- %

print_bot_intersect(1) :-
    write('\x2518\'). % Bottom Right Corner (┘)
print_bot_intersect(_) :-
    write('\x2534\'). % Bottom Intersect (┴)

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                   Show the Final Board                                                    %
%   Prototype:                                                                                                              %
%        showFinalBoard(+FinalBoard)                                                                                        %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       FinalBoard -> The final board of the game                                                                           %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presents the Final Board to the screen                                                                              %
% ------------------------------------------------------------------------------------------------------------------------- %

showFinalBoard(FinalBoard) :-
    length(FinalBoard, 7),
    nl, write('\t     Final Board'), nl,
    display_board(FinalBoard).

showFinalBoard(FinalBoard) :-
    length(FinalBoard, 9),
    nl, write('\t\t Final Board'), nl,
    display_board(FinalBoard).

showFinalBoard(FinalBoard) :-
    length(FinalBoard, 11),
    nl, write('\t\t     Final Board'), nl,
    display_board(FinalBoard).