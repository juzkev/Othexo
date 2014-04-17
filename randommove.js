var t97name = "Value Random";

var t97value = new Array(
           0,0,0,0,0,0,0,0,0,0,
           0,9,3,6,3,9,0,0,0,0,
           0,3,1,2,2,1,3,0,0,0,
           0,6,2,3,3,3,2,6,0,0,
           0,3,2,3,3,3,3,2,3,0,
           0,9,1,3,3,3,3,3,1,9,
           0,0,3,2,3,3,3,3,2,3,
           0,0,0,6,2,3,3,3,2,6,
           0,0,0,0,3,1,2,2,1,3,
           0,0,0,0,0,9,3,6,3,9,
           0,0,0,0,0,0,0,0,0,0);
// Array with respect to the quality of positions
// Entry 0 means impossible position
// Entry 1 is low quality ... Entry 9 is best quality
// Note that pieces in corners, when placed there, will never be turned
// Pieces next to the corner might enable the opponent to go into the corner,
// hence their quality is below those of other pieces. This is only a
// very rough measure and there are better ways to evaluate positions,
// in particular by taking the actual pieces on the board into account.

// This function computes how many pieces are turned when going
// into the direction offset. Target is the piece which is scheduled
// to be turned. The local varible number counts the number of turned
// pieces and the local variable position searches over the possible
// positions.
// target is the place where the player wants to move;
// board is the variable holding the board
// player is 1 for "X" and -1 for "Y"
// offset is the direction in which the move is searched
function t97onedirect(target,board,player,offset)
  { var position = target+offset; // next position considered
    var number = 0; // number of pieces which might be turned
    while ((position in board) && (board[position] == -player))
      { number++; position += offset; }
      // count number of pieces which might be turned
    if ((position in board) && (board[position] == player))
      { return(number); } else { return(0); } }
      // return the number only if a piece of the player is behind
      // all the pieces of the oponent, otherwise return 0

// This function computes how many pieces are turned when turning
// the piece target. The new piece itself is not counted.
// The operation "position = target*1" makes sure that position is a number.
// Note that one can only move to target if this function returns at least 1.
function t97alldirect(target,board,player)
  { var t97position = target*1;
    if (!(t97position in board)) { return(0); }
    if (board[t97position] != 0) { return(0); }
    return(t97onedirect(t97position,board,player,1)+
           t97onedirect(t97position,board,player,10)+
           t97onedirect(t97position,board,player,11)+
           t97onedirect(t97position,board,player,-1)+
           t97onedirect(t97position,board,player,-10)+
           t97onedirect(t97position,board,player,-11)); }

// This strategy moves to the target with the highest possible
// score in t97value; in the case that there is a tie between
// several targets, it chooses the possible target according to
// a distribution proportional to the number of pieces which can
// be turned. The more pieces can be turned, the higher the probability
// of the move to be taken.
function t97move(board, player)
  { var t97target; // loopvariable when searching targets of the move
    var t97possiblemoves = new Array(); // array with possible targets
    var t97movenum = 0; // current number of possible moves
    var t97maxvalue = 0; // quality of the possible moves
    var t97turnnum; // number of pieces turned by current move considered
    var t97count; // counting variable
    for (t97target in board) // search loop
      { t97turnnum = t97alldirect(t97target,board,player);
        if ((t97turnnum > 0)&&(t97value[t97target]>=t97maxvalue))
          // moves considered must turn pieces and be as good as previous ones
          { if (t97value[t97target] > t97maxvalue)
              { t97maxvalue = t97value[t97target]; t97movenum = 0; }
              // if a move is better than the previously considered, then
              // the previously considered ones are discarded
            for (t97count=0; t97count < t97turnnum; t97count++)
              { t97possiblemoves[t97movenum] = t97target; t97movenum++; } } }
              // make as many entries in possible moves as pieces turned
    if (t97movenum == 0) { return(0); } // no move possible, return 0
    t97target = t97possiblemoves[Math.floor(t97movenum*Math.random())];
       // chose by random one from the array among the first movenum many moves
    return(1*t97target); } // return a value which is a number

var t98name = "Greedy Random";

// This strategy searches for all possible moves and selects by random
// one of them. The probability of a move is proportional to the number
// of pieces turned by the move. This is obatined by maintaining the
// corresponding number of possible choices in the array t98possiblemoves.
// The strategy uses the function t97alldirect to count the number of
// pieces turned by a move.
function t98move(board, player)
  { var t98target; // loop variable for possible targets and final outcome
    var t98possiblemoves = new Array(); // possible moves selected
    var t98count; // counting variable
    var t98turnnum; // numbers of moves turned by currently considered move
    for (t98target in board) // main loop
      { t98turnnum = t97alldirect(t98target,board,player);
          // compute number of pieces turned by current move
        for (t98count = 0; t98count < t98turnnum; t98count++)
          { t98possiblemoves[t98possiblemoves.length] = t98target; } }
          // make as many entries of possible moves as pieces are turned
    if (t98possiblemoves.length == 0) { return(0); }
          // return 0 in the case that no move is possible
    t98target =
        t98possiblemoves[Math.floor(t98possiblemoves.length*Math.random())];
        // select with equal possibility one entry from the possible moves
    return(1*t98target); } // return a value which is a number

var t99name = "Random";

// This strategy searches for all possible moves and selects by random
// one of them; each move has the same probability, independent of its
// quality.
function t99move(board, player)
  { var t99target; // loop variable on possible loop targets and final outcome
    var t99possiblemoves = new Array(); // array of possible moves
    for (t99target in board) // main loop
      { if (t97alldirect(t99target,board,player) > 0)
          { t99possiblemoves[t99possiblemoves.length] = t99target; } }
      // if pieces can be turned then make one entry in array of possible moves
    if (t99possiblemoves.length == 0) { return(0); }
      // return 0 if no move is possible
    t99target =
        t99possiblemoves[Math.floor(t99possiblemoves.length*Math.random())];
     // select with equal probability among all possible moves
    return(1*t99target); } // return a value which is a number

var t96value = new Array();
// The array will be a slightly modified copy of the weights of player t97.
// Array with respect to the quality of positions
// Entry 0 means impossible position
// Entry 1 is low quality ... Entry 9 is best quality
// Note that pieces in corners, when placed there, will never be turned
// Pieces next to the corner might enable the opponent to go into the corner,
// hence their quality is below those of other pieces. This is only a
// very rough measure and there are better ways to evaluate positions,
// in particular by taking the actual pieces on the board into account.
// The following function uses t96value in order to evaluate a board position
// by multiplying each position with the value. At the end, the result is
// multiplied with the value of player (+1 or -1).
function t96boardeval(board,player)
  { var value = 0; var position;
    for (position in board)
      { value += board[position]*t96value[position]; }
    return(player*value); }

// This function permits to copy a board or t97value into t96value;
// these copies are needed as the search for new positions or adjustments
// of the values during a game should not have side effects on the main
// variables.
function t96boardcopy(board,subboard)
  { var position;
    for (position in board)
      { subboard[position] = board[position]; }
    return; }

// These two functions simulate whether it is possible to move by putting a new
// piece onto the position indicated by the variable of the same name.
// The function consists of a subfunction going in the direction of the
// offset and the main function. The simulation of moves is needed in order
// to anticipate possible moves and evaluate their outcomes.
function t96subsimulmove(position,player,board,offset)
  { var t96position = position+offset;
    while ((t96position in board) && (board[t96position] == -player))
      { t96position += offset; }
    if (t96position == position+offset) { return(0); }
    if (!(t96position in board)) { return(0); }
    if (board[t96position] != player) { return(0); }
    do { t96position -= offset; board[t96position] = player; }
    while (t96position != position);
    return(1); }

// Main function of simulated moves.
function t96simulmove(t96target,player,board)
  { if (board[t96target]!=0) { return(0); }
    if (t96subsimulmove(t96target,player,board,1)+
        t96subsimulmove(t96target,player,board,10)+
        t96subsimulmove(t96target,player,board,11)+
        t96subsimulmove(t96target,player,board,-1)+
        t96subsimulmove(t96target,player,board,-10)+
        t96subsimulmove(t96target,player,board,-11) > 0)
         { board[t96target] = player; return(1); }
    else { return(0); } }

// This function searches recursively for the best move which is
// stored in variable t96best together with the estimated quality
// in t96points. The pure strategy based on this was not that
// successful and lost against t97 on average; therefore a hybrid
// strategy where t96secondbest follows the principle of t97 of taken
// the best possible position (and among those the one with the best
// score) is implemented and then there is some algorithm which decides
// whether to follow t96best or t96secondbest. The algorithm takes in
// general t96secondbest whenever its score is only moderately worse
// than the one of t96best in order to give more weight to the target
// position of the move.
function t96search(board,player,depth,maxdepth,passy)
  { var t96target; var t96best = 0; var t96secondbest = 0; var t96points;
    var subboard = new Array();
    t96boardcopy(board,subboard);
    var t96bestpoints = t96boardeval(subboard,player);
    var t96secondbestpoints = t96bestpoints;
    if ((passy < 2)&&(depth < maxdepth))
      { for (t96target in subboard)
          { if (t96simulmove(1*t96target,player,subboard) > 0)
              { if (depth < maxdepth)
                  { t96points =
                      -t96search(subboard,-player,depth+1,maxdepth,0); }
                else { t96points = t96boardeval(subboard,player); }
                if (t96points > t96bestpoints)
                  { if (t96value[t96best] >= t96value[t96secondbest])
                      { t96secondbestpoints = t96bestpoints;
                        t96secondbest = t96best; }
                    t96bestpoints = t96points; t96best = 1*t96target; }
                else if ((t96secondbest == 0)||
                    (t96value[t96secondbest]< t96value[t96target])||
                    ((t96value[t96secondbest] == t96value[t96target])&&
                     (t96points > t96secondbestpoints)))
                  { t96secondbestpoints = t96points;
                    t96secondbest = 1*t96target; }
                t96boardcopy(board,subboard); } } }
    if (depth == 0)
      { if (t96secondbest == 0) { return(t96best); }
        if ((t96value[t96secondbest] > t96value[t96best])&&
            (t96secondbestpoints+10>t96bestpoints))
          { return(t96secondbest); }
        else { return(t96best); } }
    return(t96bestpoints); }

// The following function takes the scores from t97 and makes some
// adjustments in the following way: if a corner is taken, the neighbouring
// fields get a higher score in order to lose their penalty.
function t96move(board,player)
  { t96boardcopy(t97value,t96value);
    if (board[11] != 0)
      { t96value[12] = 5; t96value[21] = 5; t96value[22] = 5; }
    if (board[15] != 0)
      { t96value[14] = 5; t96value[25] = 5; t96value[26] = 5; }
    if (board[51] != 0)
      { t96value[41] = 5; t96value[52] = 5; t96value[62] = 5; }
    if (board[19] != 0)
      { t96value[48] = 5; t96value[58] = 5; t96value[69] = 5; }
    if (board[95] != 0)
      { t96value[84] = 5; t96value[85] = 5; t96value[96] = 5; }
    if (board[99] != 0)
      { t96value[98] = 5; t96value[88] = 5; t96value[89] = 5; }
    if (typeof passnum === "undefined")
      { return(1*t96search(board,player,0,3,0)); }
    else
      { return(1*t96search(board,player,0,3,passnum)); } }
