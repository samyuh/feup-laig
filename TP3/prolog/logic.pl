% ------------------------------------------------------------------------------------------------------------------------- %
%                                                        Make a move                                                        %
%   Prototype:                                                                                                              %
%       makeMove(+Color, +CurrentBoard, -NextPlayer, -NextBoard, +PlayerType)                                               %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Color -> The color of the player to play in the current turn                                                        %
%       CurrentBoard -> The state of the current board, before the move chosen by the player                                %
%       PlayerType -> Type of the player to play in the current turn (player or bot)                                        %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       NextPlayer -> The color of the player to play in the next turn                                                      %
%       NextBoard -> The state of the next board, after the move chosen by the player                                       %
% ------------------------------------------------------------------------------------------------------------------------- %

makeMove(Color, CurrentBoard, NextColor, NextBoard, player) :-
    length(CurrentBoard, Length),
    next_player(Color, NextColor),
    nl, write('Choose a cell for the '), write(Color), write(' part of the Taijitu:'), nl, nl,
    write('Row? '),
    input(L, 1, Length, 'Row? ', move),
    write('Column? '),
    input(C, 1, Length, 'Column? ', move),
    write('Orientation of the '), write(NextColor), write(' part (Up-1, Down-2, Left-3, Right-4)? '),
    atom_concat('Orientation of the ', NextColor, HalfString),
    atom_concat(HalfString, ' part? ', String),
    input(O, 1, 4, String, orientation),
    write('Chosen cell ['), write(L), write(', '), write(C), write(', '), write(O), write(']'), nl,
    valid_move(L-C-O, CurrentBoard),
    move(CurrentBoard, L-C-O-Color, NextBoard), !.

makeMove(Color, CurrentBoard, NextColor, NextBoard, random) :-
    choose_move(CurrentBoard, Color, random, L-C-O),
    write('Chosen cell ['), write(L), write(', '), write(C), write(', '), write(O), write(']'), nl,
    move(CurrentBoard, L-C-O-Color, NextBoard),
    next_player(Color, NextColor), !.

makeMove(Color, CurrentBoard, NextColor, NextBoard, intelligent) :-
    choose_move(CurrentBoard, Color, intelligent, L-C-O),
    write('Chosen cell ['), write(L), write(', '), write(C), write(', '), write(O), write(']'), nl,
    move(CurrentBoard, L-C-O-Color, NextBoard),
    next_player(Color, NextColor), !.

makeMove(Color, CurrentBoard, NextColor, NextBoard, PlayerType) :-
    write('Invalid move!'), nl,
    makeMove(Color, CurrentBoard, NextColor, NextBoard, PlayerType).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                        Valid move                                                         %
%   Prototype:                                                                                                              %
%       valid_move(+Move, +CurrentBoard)                                                                                    %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Move -> The Move to check if it's valid, in the format L-C-O, being L and C the Line and Column of the cell to be   %
%               filled with one part of the Taijitu and O the orientation of the Taijitu, to get the other part's cell      %
%       CurrentBoard -> The state of the current board                                                                      %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Sucess if the chosen location for the Taijitu (Line L, Collumn C, Orientation O) is valid in the CurrentBoard       %
% ------------------------------------------------------------------------------------------------------------------------- %

valid_move(L-C-O, CurrentBoard) :-
    get_value(L, C, CurrentBoard, empty),
    orientation(O, L-C, BL-BC),
    get_value(BL, BC, CurrentBoard, empty).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                        Get Cell Value                                                     %
%   Prototype:                                                                                                              %
%       get_value(+Row, +Column, +CurrentBoard, -Value)                                                                     %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Row -> The Row of the Cell which we want to know the value                                                          %
%       Column -> The Column of the Cell which we want to know the value                                                    %
%       CurrentBoard -> The state of the current board                                                                      %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Value -> The value of the Cell with row Row and column Column in the CurrentBoard. If the cell is not valid,        %
%                return value off_limits                                                                                    %
% ------------------------------------------------------------------------------------------------------------------------- %

get_value(Row, Column, CurrentBoard, Value) :-
    nth1(Row, CurrentBoard, RowList),
    nth1(Column, RowList, Value), !.

get_value(_, _, _, off_limits).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                  Process Taijitu Orientation                                              %
%   Prototype:                                                                                                              %
%       orientation(+O, +FirstCell, -SecondCell)                                                                            %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       O -> The Orientation of the Taijitu (up, down, left, right)                                                         %
%       FirstCell -> The Cell of the first part of the Taijitu, in the format L-C, where L is its Line and C its Column     %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       SecondCell -> The Cell of the second part of the Taijitu, in the format BL-BC, where L is its Line and C its Column %
% ------------------------------------------------------------------------------------------------------------------------- %

orientation(O, L-C, BL-BC) :- O == up, BL is L - 1, BC = C.
orientation(O, L-C, BL-BC) :- O == down, BL is L + 1, BC = C.
orientation(O, L-C, BL-BC) :- O == left, BL = L, BC is C - 1.
orientation(O, L-C, BL-BC) :- O == right, BL = L, BC is C + 1.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                      Place a Taijitu                                                      %
%   Prototype:                                                                                                              %
%       move(+GameState, +Move, -NewGameState)                                                                              %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       GameState -> The state of the current board, before the move Move is done                                           %
%       Move -> The move to execute, in the format L-C-O-Color, being L and C the line and column of the first part of the  %
%               Taijitu, O the orientation of the Taijitu, and Color the color of the first part of the Taijitu             %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       NewGameState -> The state of the next board, after executing the move Move                                          %
% ------------------------------------------------------------------------------------------------------------------------- %

move(GameState, L-C-O-Color, NewGameState) :-
    orientation(O, L-C, BL-BC),
    nth1(L, GameState, RowBeforeWhite),
    replace(RowBeforeWhite, C, Color, RowPlacedWhite),
    replace(GameState, L, RowPlacedWhite, BoardPlacedWhite),
    nth1(BL, BoardPlacedWhite, RowBeforeBlack),
    next_player(Color, NextColor),
    replace(RowBeforeBlack, BC, NextColor, RowPlacedBlack),
    replace(BoardPlacedWhite, BL, RowPlacedBlack, NewGameState).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                     Replace Cell Value                                                    %
%   Prototype:                                                                                                              %
%       replace(+OriginalList, +Index, +Element, -NewList)                                                                  %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       OriginalList -> The List to have one of its values replaced                                                         %
%       Index -> The index of the element to be replaced in the OriginalList                                                %
%       Element -> The new value to replace the element at the index Index of the OriginalList                              %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       NewList -> The resulting list, after replacing the element at the index Index for the value Element                 %
% ------------------------------------------------------------------------------------------------------------------------- %

replace([_|T], 1, X, [X|T]):- !.
replace([H|T], I, X, [H|R]):- I > -1, NI is I-1, replace(T, NI, X, R), !.
replace(L, _, _, L).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                 Return All Valid Moves                                                    %
%   Prototype:                                                                                                              %
%       valid_moves(+GameState, +Player, -ListOfMoves)                                                                      %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       GameState -> The state of the current board                                                                         %
%       Player -> The color of the current player (not needed in our case, but it respects the Project Enunciate)           %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       ListOfMoves -> The list of all the valid moves in the current board                                                 %
% ------------------------------------------------------------------------------------------------------------------------- %

valid_moves(GameState, _, ListOfMoves) :-
    length(GameState, Length),
    numlist(Length, RangeList),
    findall(L-C-O, (member(O, [up, down, left, right]), member(L, RangeList), member(C, RangeList), valid_move(L-C-O, GameState)), ListOfMoves).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                     Choose a Move                                                         %
%   Prototype:                                                                                                              %
%       choose_move(+GameState, +Player, +Level, -Move)                                                                     %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       GameState -> The state of the current board                                                                         %
%       Player -> The color of the current Bot to play                                                                      %
%       Level -> The level of the current Bot to play (random, intelligent)                                                 %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Move -> The best move for the Bot to make, depending on its level, in the format L-C-O (Line-Column-Orientation)    %
% ------------------------------------------------------------------------------------------------------------------------- %

choose_move(GameState, Player, random, L-C-O) :-
    valid_moves(GameState, Player, PossibleMoves),
    length(PossibleMoves, NumberMoves),
    LimitRandom is NumberMoves + 1,
    random(1, LimitRandom, R),
    nth1(R, PossibleMoves, L-C-O).

choose_move(GameState, Player, intelligent, L-C-O) :-
    valid_moves(GameState, Player, PossibleMoves),
    length(GameState, Length),
    numlist(1, Length, RangeList),
    setof(Move, calculateValueMove(GameState, Player, RangeList, PossibleMoves, Move), Moves),
    select_best_moves(Moves, [], BestMoves, _),
    length(BestMoves, NumberMoves),
    LimitRandom is NumberMoves + 1,
    random(1, LimitRandom, R),
    nth1(R, BestMoves, _-L-C-O).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                  Calculate Value of Move                                                  %
%   Prototype:                                                                                                              %
%       calculateValueMove(+GameState, +Color, +RangeList, +PossibleMoves, -ValueMove)                                      %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       GameState -> The state of the current board                                                                         %
%       Color -> The color of the current Bot to play                                                                       %
%       RangeList -> List with the possible values for the line and column of the Move                                      %
%       PossibleMoves -> List with all the valid moves in the Current Board                                                 %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       ValueMove -> A possible Move, associated with its value, in the format SymmetricalValue-L-C-O, where L, C and O are %
%                    the Line, Column and Orientation of the Taijitu, and SymmetricalValue is the symmetric of the value    %
%                    of the move, which is the biggest group found, possible to extend. We need its symmetric for the setof %
%                    used in choose_move() to order by actual decrescent order of the values (biggest come first)           %
% ------------------------------------------------------------------------------------------------------------------------- %

calculateValueMove(GameState, Color, RangeList, PossibleMoves, SymmetricalValue-L-C-O) :-
    member(L, RangeList),
    member(C, RangeList),
    member(O, [up, down, left, right]),
    member(L-C-O, PossibleMoves),
    move(GameState, L-C-O-Color, NewGameState),
    best_possible_value(NewGameState, Color, Value, _),
    SymmetricalValue is -Value.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                  Select the best moves                                                    %
%   Prototype:                                                                                                              %
%       select_best_moves(+ValueMoves, +AccMoves, -BestMoves, -BestValue)                                                   %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       ValueMoves -> Ordered List with the possible moves and its values, in the format V-L-C-O, being V their value, and  %
%       AccMoves -> List which will contain the best moves at a certain call of the predicate. It begins empty ([])         %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       BestMoves -> List with all the best moves for the current Bot to play                                               %
%       BestValue -> Value of the best moves chosen                                                                         %
% ------------------------------------------------------------------------------------------------------------------------- %

select_best_moves([V-L-C-O|Moves], [], BestMoves, _) :-
    select_best_moves(Moves, [V-L-C-O], BestMoves, V), !.

select_best_moves([], BestMoves, BestMoves, _) :- !.

select_best_moves([V-_-_-_|_], BestMoves, BestMoves, BestValue) :-
    V > BestValue, !.

select_best_moves([V-L-C-O|Moves], AccMoves, BestMoves, BestValue) :-
    append(AccMoves, [V-L-C-O], NewAccMoves),
    select_best_moves(Moves, NewAccMoves, BestMoves, BestValue).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                  Select the Next Player                                                   %
%   Prototype:                                                                                                              %
%       next_player(+Player, -NextPlayer)                                                                                   %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Player -> the color of the player of the current turn                                                               %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       NextPlayer -> the color of the player to play in the next turn                                                      %
% ------------------------------------------------------------------------------------------------------------------------- %

next_player(white, black).
next_player(black, white).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                   Get Difficulty of Bot to play in the current turn                                       %
%   Prototype:                                                                                                              %
%       next_difficulty(+Color, +DifficultyWhite, +DifficultyBlack, -Difficulty)                                            %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Color -> The color of the bot to play in the current turn                                                           %
%       DifficultyWhite -> The difficulty chosen for the White Bot                                                          %
%       DifficultyBlack -> The difficulty chosen for the Black Bot                                                          %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Difficulty -> The difficulty of the bot to play in the current turn                                                 %
% ------------------------------------------------------------------------------------------------------------------------- %

next_difficulty(white, DifficultyWhite, _, DifficultyWhite).
next_difficulty(black, _, DifficultyBlack, DifficultyBlack).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                      Return Player Type (Used in mode Player VS Computer)                                 %
%   Prototype:                                                                                                              %
%       return_player_type(+ChosenColor, +PlayerColor, -PlayerType, +Difficulty)                                            %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       ChosenColor -> the color chosen by the player, before the start of the game                                         %
%       PlayerColor -> the color of the player/bot to play in the current turn                                              %
%       Difficulty -> the difficulty of the bot, chosen before the start of the game                                        %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       PlayerType -> The type of the player to play in the current turn (player, random, intelligent)                      %
% ------------------------------------------------------------------------------------------------------------------------- %

return_player_type(PlayerColor, PlayerColor, player, _) :- !.
return_player_type(_, _, Difficulty, Difficulty).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                       Game Over                                                           %
%   Prototype:                                                                                                              %
%       game_over(+GameState, -WinnerData)                                                                                  %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       GameState -> The state of the current board.                                                                        %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       WinnerData -> If GameState is not a final board, fail. Otherwise, store in WinnerData, in the format Winner-Number, %
%                     the Winner of the game and the number of cells of the biggest group he accomplished                   %
% ------------------------------------------------------------------------------------------------------------------------- %

game_over(GameState, Player-Number) :-
    endOfGame(GameState),
    showFinalBoard(GameState),
    calculateWinner(GameState, Player, Number).                                                          

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                       End of Game                                                         %
%   Prototype:                                                                                                              %
%       endOfGame(+Board)                                                                                                   %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Board -> The state of the current board.                                                                            %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Success if the Board is a final board (no more possible moves), fail otherwise                                      %
% ------------------------------------------------------------------------------------------------------------------------- %

endOfGame(Board) :-
    (\+ search_move_rows(Board) ; \+ search_move_columns(Board)),
    !, fail.

endOfGame(_).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                    Find any horizontal placement in a board for a Taijitu                                 %
%   Prototype:                                                                                                              %
%       search_move_rows(+Board)                                                                                            %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Board -> The state of the current board                                                                             %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Success if there is no possible horizontal placement of a Taijitu, fail otherwise                                   %
% ------------------------------------------------------------------------------------------------------------------------- %

search_move_rows([]).
search_move_rows([Row|Board]) :-
    \+ row_move(Row),
    search_move_rows(Board).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                    Find any horizontal placement in a row for a Taijitu                                   %
%   Prototype:                                                                                                              %
%       row_move(+Row)                                                                                                      %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Row -> The row to check if there is any possible horizontal move for a Taijitu                                      %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Success if there is any possible horizontal placement for a Taijitu in the row, fail otherwise                      %
% ------------------------------------------------------------------------------------------------------------------------- %

row_move([_]) :- fail.
row_move([Elem1, Elem2|_]) :-
    Elem1 == empty,
    Elem2 == empty, !.
row_move([_, Elem2|RestRow]) :-
    row_move([Elem2|RestRow]).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                    Find any vertical placement in a board for a Taijitu                                   %
%   Prototype:                                                                                                              %
%       search_move_columns(+Board)                                                                                         %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Board -> The state of the current board                                                                             %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Success if there is no possible vertical placement of a Taijitu, fail otherwise                                     %
% ------------------------------------------------------------------------------------------------------------------------- %

search_move_columns(Board) :-
    clpfd:transpose(Board, TransposeBoard),
    search_move_rows(TransposeBoard).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                               Show Results of the game                                                    %
%   Prototype:                                                                                                              %
%       showResult(+Winner, +Number)                                                                                        %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Winner -> The winner of the game                                                                                    %
%       Number -> The number of cells of the biggest group achieved by the Winner                                           %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Presentes the results of the game to the screen                                                                     %
% ------------------------------------------------------------------------------------------------------------------------- %

showResult(Winner, Number) :-
    nl, write('The winner of the game is the '),
    player(Winner, String),
    write(String),
    write(' with a maximum group of '),
    write(Number), write(' Taijitus.'), nl.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                             Calculate Winner of the Game                                                  %
%   Prototype:                                                                                                              %
%       calculateWinner(+Board, -Player, -Number)                                                                           %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Board -> The final board of the game                                                                                %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Player -> The winner of the game                                                                                    %
%       Number -> The number of cells of the biggest group achieved by the Winner                                           %
% ------------------------------------------------------------------------------------------------------------------------- %

calculateWinner(Board, Player, Number) :-
    value(Board, white, NumberWhite),
    value(Board, black, NumberBlack),
    get_winner(NumberWhite, NumberBlack, Player, Number).

get_winner(NumberWhite, NumberBlack, Player, Number) :-
    NumberWhite > NumberBlack,
    Player = white, Number = NumberWhite, !.

get_winner(_, NumberBlack, Player, Number) :-
    Player = black, Number = NumberBlack.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                            Value of the biggest group of a color                                          %
%   Prototype:                                                                                                              %
%       value(+Board, +Color, -NumberColor)                                                                                 %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Board -> The final board of the game                                                                                %
%       Color -> The color to calculate the biggest group of this color                                                     %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       NumberColor -> The number of cells of the biggest group of color Color in the Board                                 %
% ------------------------------------------------------------------------------------------------------------------------- %

value(Board, Color, NumberColor) :-
    abolish(processed/2),
    assert(processed(-1, -1)),      % Ensure that predicate processed/2 exists, to avoid errors while trying to instantiate it
    calculateLargestGroup(Color, 1-1, [], Board, 0, 0, NumberColor).

% ------------------------------------------------------------------------------------------------------------------------- %
%                             Value of the biggest group of a color, which can be expanded                                  %
%   Prototype:                                                                                                              %
%       best_possible_value(+Board, +Color, -NumberColor, -BiggestGroup)                                                    %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Board -> The final board of the game                                                                                %
%       Color -> The color to calculate the biggest group of this color                                                     %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       NumberColor -> The number of cells of the biggest group of color Color in the Board, possible to expand             %
%       BiggestGroup -> List with the cells of the biggest group of color Color in the Board, possible to expand            %
% ------------------------------------------------------------------------------------------------------------------------- %

best_possible_value(Board, Color, NumberColor, BiggestGroup) :-
    abolish(processed/2),
    assert(processed(-1, -1)),      % Ensure that predicate processed/2 exists, to avoid errors while trying to instantiate it
    calculateLargestPossibleGroup(Color, 1-1, [], Board, 0, 0, NumberColor, [], BiggestGroup).

% ------------------------------------------------------------------------------------------------------------------------- %
%                             Calculate largest group of color Color in the Board                                           %
%   Prototype:                                                                                                              %
%       calculateLargestGroup(+Color, +Cell, +Queue, +Board, +AccNumber, +MaxNumber, -NumberColor)                          %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Color -> The color which we want to calculate the largest group of this color                                       %
%       Cell -> The cell being explored at the moment, in the format L-C (Line-Column). It begins with the value 1-1        %
%       Queue -> List with the cells to be processed, while analyzing a group. It begins empty ([])                         %
%       Board -> The final board of the game                                                                                %
%       AccNumber -> Counter of the current number of the cells already processed of the group being processed. It begins   %
%                    with value 0                                                                                           %
%       MaxNumber -> Contains the number of cells of the biggest group found so far. It begins with value 0                 %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       NumberColor -> The number of cells of the biggest group of color Color in the Board                                 %
% ------------------------------------------------------------------------------------------------------------------------- %

% Final Case -> Cell being explored is the last in the Board ([Length, Length])
% Do -> Copy BiggestNumber to NumberColor
calculateLargestGroup(_, Length-Length, [], Board, _, NumberColor, NumberColor) :-
    length(Board, Length).

% Case where we're not processing any group (Empty Queue, AccNumber = 0), and we find a not-processed cell with the desired Color
% Do -> Process Cell and fill Queue with the next Cells of the group to process
calculateLargestGroup(Color, L-C, [], Board, 0, BiggestNumber, NumberColor) :-
    get_value(L, C, Board, Color),
    \+ processed(L, C),
    assert(processed(L, C)),
    get_next_cells(Color, L, C, Board, List),
    List \= [],
    calculateLargestGroup(Color, L-C, List, Board, 1, BiggestNumber, NumberColor), !.

% Case where we're not processing any group (Empty Queue, AccNumber = 0), and we find a not-processed cell with different color of Color
% Do -> Process Cell and explore the next cell
calculateLargestGroup(Color, L-C, [], Board, 0, BiggestNumber, NumberColor) :-
    \+ get_value(L, C, Board, Color),
    \+ processed(L, C),
    assert(processed(L, C)),
    length(Board, Length),
    Mod is mod(C, Length), NewC is Mod + 1,
    DivInt is div(C, Length), NewL is L + DivInt,
    calculateLargestGroup(Color, NewL-NewC, [], Board, 0, BiggestNumber, NumberColor), !.

% Case where we're not processing any group (Empty Queue, AccNumber = 0), and we find a cell already processed
% Do -> Ignore cell, and explore next cell
calculateLargestGroup(Color, L-C, [], Board, 0, BiggestNumber, NumberColor) :-
    length(Board, Length),
    Mod is mod(C, Length), NewC is Mod + 1,
    DivInt is div(C, Length), NewL is L + DivInt,
    calculateLargestGroup(Color, NewL-NewC, [], Board, 0, BiggestNumber, NumberColor).

% Case where we're processing a group (Queue not empty, AccNumber \= 0), and adjacent cell is not processed
% Do -> Process adjacent cell, increase AccNumber and add its adjacent cells to Queue
calculateLargestGroup(Color, L-C, [[OL, OC]|List], Board, AccNumber, BiggestNumber, NumberColor) :-
    \+ processed(OL, OC),
    assert(processed(OL, OC)),
    get_next_cells(Color, OL, OC, Board, NewCells),
    append(List, NewCells, NewList),                                                
    NewAccNumber is AccNumber + 1,
    calculateLargestGroup(Color, L-C, NewList, Board, NewAccNumber, BiggestNumber, NumberColor), !.

% Case where we're processing a group (Queue not empty, AccNumber \= 0), and adjacent cell is already processed
% Do -> Ignore adjacent cell
calculateLargestGroup(Color, L-C, [[OL, OC]|List], Board, AccNumber, BiggestNumber, NumberColor) :-
    processed(OL, OC),
    calculateLargestGroup(Color, L-C, List, Board, AccNumber, BiggestNumber, NumberColor), !.

% Case where we finished processing a group (Empty Queue, AccNumber \= 0)
% Do -> Substitute BiggestNumber, since the group found has a larger number of cells, and explore next cell
calculateLargestGroup(Color, L-C, [], Board, AccNumber, BiggestNumber, NumberColor) :-
    AccNumber > BiggestNumber,
    length(Board, Length),
    Mod is mod(C, Length), NewC is Mod + 1,
    DivInt is div(C, Length), NewL is L + DivInt,
    calculateLargestGroup(Color, NewL-NewC, [], Board, 0, AccNumber, NumberColor), !.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                   Get Next Cells to process, of the color Color                                           %
%   Prototype:                                                                                                              %
%       get_next_cells(+Color, +L, +C, +Board, -List)                                                                       %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Color -> The color of the group we're exploring                                                                     %
%       L -> The line of the cell which we want to get adjacent cells with same color                                       %
%       C -> The column of the cell which we want to get adjacent cells with same color                                     %
%       Board -> The state of the current board                                                                             %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       List -> List with all cells adjacent to the cell with Line L and Column C, which must have color Color              %
% ------------------------------------------------------------------------------------------------------------------------- %

get_next_cells(Color, L, C, Board, List) :-
    NextL is L + 1, PreviousL is L - 1, NextC is C + 1, PreviousC is C - 1,
    get_value(PreviousL, C, Board, UpValue),
    get_value(NextL, C, Board, DownValue),
    get_value(L, PreviousC, Board, LeftValue),
    get_value(L, NextC, Board, RightValue),
    get_next([[PreviousL, C, UpValue], [NextL, C, DownValue], [L, PreviousC, LeftValue], [L, NextC, RightValue]], Color, [], List).

get_next([], _, List, List).
get_next([[L, C, Color]|Rest], Color, AccList, List) :-
    append(AccList, [[L, C]], NewList),
    \+ processed(L, C),
    get_next(Rest, Color, NewList, List), !.
get_next([[_, _, _]|Rest], Color, AccList, List) :-
    get_next(Rest, Color, AccList, List).

% ------------------------------------------------------------------------------------------------------------------------------------------ %
%                               Calculate largest group of color Color in the Board, possible to expand                                      %
%   Prototype:                                                                                                                               %
%       calculateLargestPossibleGroup(+Color, +Cell, +Queue, +Board, +AccNumber, +MaxNumber, -NumberColor, +AccGroup, -BiggestGroup)         %
%                                                                                                                                            %
%   Inputs:                                                                                                                                  %
%       Color -> The color which we want to calculate the largest expandable group of this color                                             %
%       Cell -> The cell being explored at the moment, in the format L-C (Line-Column). It begins with the value 1-1                         %
%       Queue -> List with the cells to be processed, while analyzing a group. It begins empty ([])                                          %
%       Board -> The state of the current board                                                                                              %
%       AccNumber -> Counter of the current number of the cells already processed of the group being processed. It begins with value 0       %
%       MaxNumber -> Contains the number of cells of the biggest expandable group found so far. It begins with value 0                       %
%       AccGroup -> List that contains the cells of the group being processed. It begins empty ([])                                          %
%                                                                                                                                            %
%   Outputs:                                                                                                                                 %
%       NumberColor -> The number of cells of the biggest expandable group of color Color in the Board                                       %
%       BiggestGroup -> List that contains the cells of the biggest expandable group with color Color                                        %
% ------------------------------------------------------------------------------------------------------------------------------------------ %

% Final Case -> Cell being explored is the last in the Board ([Length, Length])
% Do -> Copy BiggestNumber to NumberColor
calculateLargestPossibleGroup(_, Length-Length, [], Board, _, NumberColor, NumberColor, _, _) :-
    length(Board, Length).

% Case where we're not processing any group (Empty Queue, AccNumber = 0), and we find a not-processed cell with the desired Color
% Do -> Process Cell and fill Queue with the next Cells of the group to process. Add Cell to AccGroup
calculateLargestPossibleGroup(Color, L-C, [], Board, 0, BiggestNumber, NumberColor, AccGroup, BiggestGroup) :-
    get_value(L, C, Board, Color),
    \+ processed(L, C),
    assert(processed(L, C)),
    get_next_cells(Color, L, C, Board, List),
    List \= [],
    calculateLargestPossibleGroup(Color, L-C, List, Board, 1, BiggestNumber, NumberColor, [L-C|AccGroup], BiggestGroup), !.

% Case where we're not processing any group (Empty Queue, AccNumber = 0), and we find a not-processed cell with different color of Color
% Do -> Process Cell and explore the next cell
calculateLargestPossibleGroup(Color, L-C, [], Board, 0, BiggestNumber, NumberColor, AccGroup, BiggestGroup) :-
    \+ get_value(L, C, Board, Color),
    \+ processed(L, C),
    assert(processed(L, C)),
    length(Board, Length),
    Mod is mod(C, Length), NewC is Mod + 1,
    DivInt is div(C, Length), NewL is L + DivInt,
    calculateLargestPossibleGroup(Color, NewL-NewC, [], Board, 0, BiggestNumber, NumberColor, AccGroup, BiggestGroup), !.

% Case where we're not processing any group (Empty Queue, AccNumber = 0), and we find a cell already processed
% Do -> Ignore cell, and explore next cell
calculateLargestPossibleGroup(Color, L-C, [], Board, 0, BiggestNumber, NumberColor, AccGroup, BiggestGroup) :-
    length(Board, Length),
    Mod is mod(C, Length), NewC is Mod + 1,
    DivInt is div(C, Length), NewL is L + DivInt,
    calculateLargestPossibleGroup(Color, NewL-NewC, [], Board, 0, BiggestNumber, NumberColor, AccGroup, BiggestGroup).

% Case where we're processing a group (Queue not empty, AccNumber \= 0), and adjacent cell is not processed
% Do -> Process adjacent cell, increase AccNumber and add its adjacent cells to Queue. Add cell to AccGroup
calculateLargestPossibleGroup(Color, L-C, [[OL, OC]|List], Board, AccNumber, BiggestNumber, NumberColor, AccGroup, BiggestGroup) :-
    \+ processed(OL, OC),
    assert(processed(OL, OC)),
    get_next_cells(Color, OL, OC, Board, NewCells),
    append(List, NewCells, NewList),                                                
    NewAccNumber is AccNumber + 1,
    calculateLargestPossibleGroup(Color, L-C, NewList, Board, NewAccNumber, BiggestNumber, NumberColor, [OL-OC|AccGroup], BiggestGroup), !.

% Case where we're processing a group (Queue not empty, AccNumber \= 0), and adjacent cell is already processed
% Do -> Ignore adjacent cell
calculateLargestPossibleGroup(Color, L-C, [[OL, OC]|List], Board, AccNumber, BiggestNumber, NumberColor, AccGroup, BiggestGroup) :-
    processed(OL, OC),
    calculateLargestPossibleGroup(Color, L-C, List, Board, AccNumber, BiggestNumber, NumberColor, AccGroup, BiggestGroup), !.

% Case where we finished processing a group (Empty Queue, AccNumber \= 0)
% Do ->  Substitute BiggestNumber, since the group found has a larger number of cells, and explore next cell. Substitute BiggestGroup with AccGroup, and reset AccGroup
calculateLargestPossibleGroup(Color, L-C, [], Board, AccNumber, BiggestNumber, NumberColor, AccGroup, _) :-
    AccNumber > BiggestNumber,
    possible_to_increase(AccGroup, Board),
    length(Board, Length),
    Mod is mod(C, Length), NewC is Mod + 1,
    DivInt is div(C, Length), NewL is L + DivInt,
    calculateLargestPossibleGroup(Color, NewL-NewC, [], Board, 0, AccNumber, NumberColor, [], AccGroup), !.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                               Check if Group is Expandable                                                %
%   Prototype:                                                                                                              %
%       possible_to_increase(+Group, +Board)                                                                                %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Group -> The group to analyse if it's expandable                                                                    %
%       Board -> The state of the current board                                                                             %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Sucess if the group Group is expandable (not surrounded by occupied cells), fail otherwise                          %
% ------------------------------------------------------------------------------------------------------------------------- %

possible_to_increase([], _) :- fail.
possible_to_increase([Cell|_], Board) :-
    possible_to_extend(Cell, Board), !.
possible_to_increase([_|BiggestGroup], Board) :-
    possible_to_increase(BiggestGroup, Board).

possible_to_extend(Cell, Board) :-
    adjacent_cell_empty(Cell, Board, Adjacent),
    adjacent_cell_empty(Adjacent, Board, _).

adjacent_cell_empty(L-C, Board, Adjacent) :-
    NextL is L + 1, PreviousL is L - 1, NextC is C + 1, PreviousC is C - 1,
    get_value(PreviousL, C, Board, UpValue),
    get_value(NextL, C, Board, DownValue),
    get_value(L, PreviousC, Board, LeftValue),
    get_value(L, NextC, Board, RightValue),
    ((UpValue == empty, Adjacent = PreviousL-C) ; (DownValue == empty, Adjacent = NextL-C) ; (LeftValue == empty, Adjacent = L-PreviousC) ; (RightValue == empty, Adjacent = L-NextC)).