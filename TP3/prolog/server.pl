:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

:- consult('main.pl').
:- use_module(library('json/examples/json_codes')).

% Predicates to test the prolog server
parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).
test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

% Request: initial(N) -> N is the dimensions of the board (NxN)
% Reply: List representing the initial game board
parse_input(initial(N), Mjson) :- initial(N, M), json_to_atom(M, Mjson, [compact(true)]).

% Request: valid_move(L-C-O, CurrentBoard) -> L-C-O is the info of the piece to play (Row-Column-Orientation), CurrentBoard is the current game board
% Reply: String "valid" if the move is valid, "invalid" otherwise
parse_input(valid_move(L-C-O, CurrentBoard), Vjson) :- valid_move(L-C-O, CurrentBoard), json_to_atom(valid, Vjson, [compact(true)]).
parse_input(valid_move(_, _), Vjson) :- json_to_atom(invalid, Vjson, [compact(true)]).

% Request: movePlayer(GameState, L-C-O-Color) -> GameState is the current game board, L-C-O-Color is the info of the piece to be played (Row-Column-Orientation-Color)
% Reply: List representing the game board after the move by the player is done
parse_input(movePlayer(GameState, L-C-O-Color), Mjson) :- move(GameState, L-C-O-Color, NewGameState), json_to_atom(NewGameState, Mjson, [compact(true)]).

% Request: chooseRandom(GameState, Color) -> GameState is the current game board, Color is the color of the Random Bot to play
% Reply: List representing the move to be made by the Random Bot, in the format [Row, Column, Orientation]
parse_input(chooseRandom(GameState, Color), Json) :-
	choose_move(GameState, Color, random, L-C-O),
	json_to_atom([L,C,O], Json, [compact(true)]).

% Request: moveRandom(GameState, L-C-O-Color) -> GameState is the current game board, L-C-O-Color is the info of the piece to be played (Row-Column-Orientation-Color)
% Reply: List representing the game board after the move by the Random Bot is done
parse_input(moveRandom(GameState, L-C-O-Color), Mjson) :-
	move(GameState, L-C-O-Color, NextBoard),
	json_to_atom(NextBoard, Mjson, [compact(true)]).

% Request: chooseIntelligent(GameState, Color) -> GameState is the current game board, Color is the color of the Intelligent Bot to play
% Reply: List representing the move to be made by the Intelligent Bot, in the format [Row, Column, Orientation]
parse_input(chooseIntelligent(GameState, Color), Json) :-
	choose_move(GameState, Color, intelligent, L-C-O),
	json_to_atom([L,C,O], Json, [compact(true)]).

% Request: moveIntelligent(GameState, L-C-O-Color) -> GameState is the current game board, L-C-O-Color is the info of the piece to be played (Row-Column-Orientation-Color)
% Reply: List representing the game board after the move by the Intelligent Bot is done
parse_input(moveIntelligent(GameState, L-C-O-Color), Mjson) :-
	move(GameState, L-C-O-Color, NextBoard),
	json_to_atom(NextBoard, Mjson, [compact(true)]).

% Request: undo(GameState, L-C-BL-BC) -> GameState is the current game board, L-C-BL-BC is the info of the piece to be removed (MainPartRow-MainPartColumn-SecondaryPartRow-SecondaryPartColumn)
% Reply: List representing the game board after the move is undone
parse_input(undo(GameState, L-C-BL-BC), Mjson) :- undo(GameState, L-C-BL-BC, NewGameState), json_to_atom(NewGameState, Mjson, [compact(true)]).

% Request: game_over(GameBoard) -> GameBoard is the current game board
% Reply: If the game has ended, a list in the format [Winner, Score] is returned. Otherwise, an empty list is returned
parse_input(game_over(GameBoard), Json) :- game_over(GameBoard, Winner-Number), json_to_atom([Winner, Number], Json, [compact(true)]).
parse_input(game_over(_), Json) :- json_to_atom([], Json, [compact(true)]).

% Request: groups(GameBoard) -> GameBoard is the current game board
% Reply: List in the format [NumberWhite, NumberBlack], where NumberWhite is the size of the biggest white group, and NumberBlack the size of the biggest black group
parse_input(groups(GameBoard), Json) :-
	calculateBiggestGroup(GameBoard, NumberWhite, NumberBlack), json_to_atom([NumberWhite, NumberBlack], Json, [compact(true)]).

% Calculates the score of each player, given the current Board
calculateBiggestGroup(Board, NumberWhite, NumberBlack) :-
    value(Board, white, NumberWhite),
    value(Board, black, NumberBlack).

% Undoes a move, given a board GameState and the piece info (L-C-BL-BC), returning the new board (NewGameState)
undo(GameState, L-C-BL-BC, NewGameState) :-
    nth1(L, GameState, RowFirstElem),
    replace(RowFirstElem, C, empty, RowRemovedFirstElem),
    replace(GameState, L, RowRemovedFirstElem, BoardRemovedFirstElem),
    nth1(BL, BoardRemovedFirstElem, RowSecondElem),
    replace(RowSecondElem, BC, empty, RowRemovedSecondElem),
    replace(BoardRemovedFirstElem, BL, RowRemovedSecondElem, NewGameState).