% ------------------------------------------------------------------------------------------------------------------------- %
%                                                   Create Initial Board                                                    %
%   Prototype:                                                                                                              %
%       initial(+N, -M)                                                                                                     %
%                                                                                                                           %
%   Inputs:                                                                                                                 %
%       N -> The dimensions of the board, chosen by the user                                                                %
%                                                                                                                           %
%   Outputs:                                                                                                                %
%       M -> The Matrix representing the Initial Board (N x N)                                                              %
% ------------------------------------------------------------------------------------------------------------------------- %

initial(N, M) :- init_board(N, N, [], M).

init_board(0, _, M, M).
init_board(N, NC, MI, M) :-
    N > 0,
    N1 is N - 1,
    create_line(NC, [], L),
    init_board(N1, NC , [L|MI], M).

create_line(0, M, M).
create_line(N, MI, M) :-
    N > 0,
    N1 is N - 1,
    create_line(N1, [empty|MI], M).