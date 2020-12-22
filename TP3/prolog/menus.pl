% ------------------------------------------------------------------------------------------------------------------------- %
%                                                 Display Players Menu                                                      %
%   Prototype:                                                                                                              %
%       display_players_menu/0                                                                                              %
%                                                                                                                           %
%   Description:                                                                                                            %
%       Display the Players Menu, asking the user the game mode he wants to play                                            %
%       (Player VS Player, Computer VS Player, Computer VS Computer)                                                        %
% ------------------------------------------------------------------------------------------------------------------------- %

display_players_menu :-
    nl,nl,
    write('\x250c\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2510\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                           _____     _  _ _                            \x2502\'),nl,
    write('\x2502\                          |_   _|_ _(_)(_|_)                           \x2502\'),nl,
    write('\x2502\                            | |/ _` | || | |                           \x2502\'),nl,
    write('\x2502\                            |_|\\__,_|_|/ |_|                           \x2502\'),nl,
    write('\x2502\                                     |__/                              \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                              Game Mode?                               \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\               \x250c\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2510\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\        [1]   Player vs Player          \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\        [2]  Computer vs Player         \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\        [3]  Computer vs Computer       \x2502\              \x2502\'),nl,
	write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\             [0] Exit Game              \x2502\              \x2502\'),nl,
    write('\x2502\               \x2514\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2518\              \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2514\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2518\'),nl,nl,nl.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                    Display Color Menu (Used in Player VS Computer mode)                                   %
%   Prototype:                                                                                                              %
%       display_color_menu/0                                                                                                %
%                                                                                                                           %
%   Description:                                                                                                            %
%       Display the Color Menu, asking the user which color he wants to be (White, Black)                                   %
% ------------------------------------------------------------------------------------------------------------------------- %

display_color_menu :-
    nl,nl,
    write('\x250c\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2510\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                           _____     _  _ _                            \x2502\'),nl,
    write('\x2502\                          |_   _|_ _(_)(_|_)                           \x2502\'),nl,
    write('\x2502\                            | |/ _` | || | |                           \x2502\'),nl,
    write('\x2502\                            |_|\\__,_|_|/ |_|                           \x2502\'),nl,
    write('\x2502\                                     |__/                              \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                              Color                                    \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\               \x250c\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2510\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\        [1]   White                     \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\        [2]   Black                     \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
	write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\             [0] Exit Game              \x2502\              \x2502\'),nl,
    write('\x2502\               \x2514\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2518\              \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2514\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2518\'),nl,nl,nl.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                    Display AI Level Menu (Used in Player VS Computer mode)                                %
%   Prototype:                                                                                                              %
%       display_ai_level/0                                                                                                  %
%                                                                                                                           %
%   Description:                                                                                                            %
%       Display the AI Level Menu, asking the user the difficulty of the bot (Random, Intelligent)                          %
% ------------------------------------------------------------------------------------------------------------------------- %

display_ai_level :-
    nl,nl,
    write('\x250c\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2510\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                           _____     _  _ _                            \x2502\'),nl,
    write('\x2502\                          |_   _|_ _(_)(_|_)                           \x2502\'),nl,
    write('\x2502\                            | |/ _` | || | |                           \x2502\'),nl,
    write('\x2502\                            |_|\\__,_|_|/ |_|                           \x2502\'),nl,
    write('\x2502\                                     |__/                              \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                              Difficulty                               \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\               \x250c\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2510\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\        [1]   Random                    \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\        [2]   Intelligent               \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
	write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\             [0] Exit Game              \x2502\              \x2502\'),nl,
    write('\x2502\               \x2514\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2518\              \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2514\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2518\'),nl,nl,nl.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                  Display Dimensions Menu                                                  %
%   Prototype:                                                                                                              %
%       display_dimensions_menu/0                                                                                           %
%                                                                                                                           %
%   Description:                                                                                                            %
%       Display the Dimensions Menu, asking the user the dimensions of the board                                            %
% ------------------------------------------------------------------------------------------------------------------------- %

display_dimensions_menu :-
    nl,nl,
    write('\x250c\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2510\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                           _____     _  _ _                            \x2502\'),nl,
    write('\x2502\                          |_   _|_ _(_)(_|_)                           \x2502\'),nl,
    write('\x2502\                            | |/ _` | || | |                           \x2502\'),nl,
    write('\x2502\                            |_|\\__,_|_|/ |_|                           \x2502\'),nl,
    write('\x2502\                                     |__/                              \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\                           Board Dimensions?                           \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2502\               \x250c\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2510\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\               [1]  7x7                 \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\               [2]  9x9                 \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\               [3]  11x11               \x2502\              \x2502\'),nl,
	write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\                                        \x2502\              \x2502\'),nl,
    write('\x2502\               \x2502\             [0] Exit Game              \x2502\              \x2502\'),nl,
    write('\x2502\               \x2514\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2518\              \x2502\'),nl,
    write('\x2502\                                                                       \x2502\'),nl,
    write('\x2514\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2500\\x2518\'),nl,nl,nl.

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                       Codes to Number                                                     %
%   Prototype:                                                                                                              %
%       codes_to_number(+Codes, +Exponent, +Acc, -FloatNumber)                                                              %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Codes -> The ASCII codes of the characters in the string entered by the user                                        %
%       Exponent -> The current Exponent to indicate digits position in final number                                        %
%       Acc -> Contains the value of the number being constructed, at a certain call. Begins with value 0                   %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       FloatNumber -> Number entered by the user, in float format                                                          %
% ------------------------------------------------------------------------------------------------------------------------- %

codes_to_number([], _, Number, Number).
codes_to_number([Code|Codes], Exponent, Acc, Number) :-
    NewAcc is Acc + (10**Exponent) * (Code - 48),
    NewExponent is Exponent - 1,
    codes_to_number(Codes, NewExponent, NewAcc, Number).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                       Read Input                                                          %
%   Prototype:                                                                                                              %
%       read_input(-Number)                                                                                                 %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Number -> Reads a number, entered by the user                                                                       %
% ------------------------------------------------------------------------------------------------------------------------- %

read_input(Number) :-
    read_line(Codes),
    length(Codes, NrCodes),
    Exponent is NrCodes - 1,
    codes_to_number(Codes, Exponent, 0, FloatNumber),
    Number is round(FloatNumber).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                         Input                                                             %
%   Prototype:                                                                                                              %
%       input(-N, +FirstOpt, +LastOpt, +String, +Type)                                                                      %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       FirstOpt -> Minimal value of the Option that can be entered                                                         %
%       LastOpt -> Maximal value of the Option that can be entered                                                          %
%       String -> The String to be presented to the screen if the user enters an invalid option                             %
%       Type -> The type of the input, to return the wanted option value                                                    %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       N -> The value of the option chosen by the user                                                                     %
% ------------------------------------------------------------------------------------------------------------------------- %

input(N, FirstOpt, LastOpt, String, Type) :-
    write('Option: '),
    read_input(Number),
    check_option(Number, N, FirstOpt, LastOpt, String, Type).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                  Check Option                                                             %
%   Prototype:                                                                                                              %
%       check_option(+O, -N, +FirstOpt, +LastOpt, +String, +Type)                                                           %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       O -> Option chosen by the user                                                                                      %
%       FirstOpt -> Minimal value of the Option that could be entered                                                       %
%       LastOpt -> Maximal value of the Option that could be entered                                                        %
%       String -> The String to be presented to the screen if the user entered an invalid option                            %
%       Type -> The type of the input, to return the wanted option value                                                    %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       N -> The value of the option chosen by the user                                                                     %
% ------------------------------------------------------------------------------------------------------------------------- %

check_option(O, N, FirstOpt, LastOpt, _, Type) :- O >= FirstOpt, O =< LastOpt, option(O, N, Type), !.
check_option(_, N, FirstOpt, LastOpt, String, Type) :-
    write('Invalid Option. '),
    write(String),
    read_input(Number),
    check_option(Number, N, FirstOpt, LastOpt, String, Type).

% ------------------------------------------------------------------------------------------------------------------------- %
%                                                        Option                                                             %
%   Prototype:                                                                                                              %
%       option(+Option, -Value, +Type)                                                                                      %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       Option -> Option chosen by the user                                                                                 %
%       Type -> The type of the input, to return the wanted option value                                                    %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       Value -> The correspondent value of the option chosen by the user                                                   %
% ------------------------------------------------------------------------------------------------------------------------- %

option(1, 7, dimensions).
option(2, 9, dimensions).
option(3, 11, dimensions).
option(0, exit, dimensions).

option(0, exit, players).
option(Option, Option, players).

option(Option, Option, move).
option(1, up, orientation).
option(2, down, orientation).
option(3, left, orientation).
option(4, right, orientation).

option(1, white, color).
option(2, black, color).

option(1, random, difficulty).
option(2, intelligent, difficulty).