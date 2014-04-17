//You should include the following function into your strategy file
var t34name = "THEXI";

function t34move(board, side) {
	
	var simboard = new Array(); //simboard is an array that mimics the board(a simulated board) that is copied from the actual board to be used every turn
    //simboard is additionally converted such that +1 is always a user piece, and -1 is always an enemy piece
    var predarray = new Array(); //predarray is an array that mimics the board, but instead of the actual pieces, they will hold the number of times the position will win in all predicted cases
    //ie. -5 would mean that in total, this case would cause a net loss of 5 times
    /* var countarray = new Array(); */
    
    for (var i = 1; i <= 9; ++i)
        for (var j = 1; j <= 9; ++j)
    if ((i - j > -5) && (j - i > -5))
    {
        predarray[i * 10 + j] = "#"; //initialised with an indicator so that if left untouched, computer will not choose the cell at all
        simboard[i * 10 + j] = board[i * 10 + j] * side;
        /* countarray[i * 10 + j] = 0; */
    }

    predictMove(simboard, predarray, 0, 0, countPieces(simboard), 1);

    var valueofchoice = -9999;
    var finalchoice = 0; //pass 0 by default	
    var higherPriority = new Array(11, 15, 51, 59, 95, 99);
    var highPriority = new Array(13, 31, 37, 73, 79, 97);
    var lowPriority1 = new Array(12, 14, 21, 26, 41, 48);
    var lowPriority2 = new Array(62, 69, 84, 89, 96, 98);
    var lowerPriority = new Array(22, 25, 52, 58, 85, 88);

    for (var i = 1; i <= 9; ++i)
        for (var j = 1; j <= 9; ++j)
    if (((i - j > -5) && (j - i > -5)) && predarray[i * 10 + j] != "#")
    {
    	/* predarray[i * 10 + j] /= countarray[i * 10 + j]; */
        for (var x = 0; x < 6; x++)
        {
        	
            if ((i * 10 + j) == higherPriority[x]) //extra consideration is also made for good positions
                predarray[i * 10 + j] = 9999;
            else if ((i * 10 + j) == highPriority[x])
                predarray[i * 10 + j] += 60;
            else if (((i * 10 + j) == lowPriority1[x]) || ((i * 10 + j) == lowPriority2[x]))
                predarray[i * 10 + j] -= 60;
            else if ((i * 10 + j) == lowerPriority[x])
                predarray[i * 10 + j] -= 120;
        }
        if (predarray[i * 10 + j] > valueofchoice)
        {
            valueofchoice = predarray[i * 10 + j];
            finalchoice = i * 10 + j;
        }
    }
    
    if ((predarray[finalchoice] < -10) && (countPieces(simboard) > 0))
    	finalchoice = 0;
    return finalchoice;

    /*-------------------------------------functions----------------------------------------------*/
    //calculates the net score. ie. 8 enemy pieces and 6 user pieces will cause function to return -2.
    function countPieces(board)
    {
        var count = 0;

        for (var i = 1; i <= 9; ++i)
            for (var j = 1; j <= 9; ++j)
        if ((i - j > -5) && (j - i > -5))
            count += board[i * 10 + j];
        return count;
    }

    //below function updates the board assuming a move is made in cellnum  	
    //userorenemy holds a value of +1 if it is a user piece, and holds a value of -1 if it is an enemy piece.
    //only changes the board if the move is valid
    function moveOnce(board, cellnum, userorenemy)
    {
        var checkValid = 0;
        var changecell;
        var changearray = new Array(); //stores position of pieces to be reversed
        var dirarray = new Array(-1, -10, -11, 1, 10, 11);
        var count;

        for (var i = 0; i < 6; i++)
        {
            count = 0;
            changecell = cellnum;
            while ((board[changecell + dirarray[i]] == (userorenemy * -1)) && (
                (changecell + dirarray[i]) in board))
            {
                changecell = changecell + dirarray[i];
                changearray[count] = changecell;
                count++;

            }
            if ((board[changecell + dirarray[i]] == userorenemy) && (count > 0)) //converts the reversed pieces in the board
            {
                for (var j = 0; j < count; j++)
                    board[changearray[j]] = userorenemy;
                checkValid = 1; //since at least one piece can be reversed, it is a legal move
                board[cellnum] = userorenemy; //since it is a legal move, user piece is put on cellnum
            }
        }
        return checkValid;
    } //end of moveOnce function		

    //function below attempts to write out the net number of cases where user wins under 4 user+enemy turns
    //for example, if by moving to cell 31, there is 1 case where user wins, and 3 cases where enemy wins, then function will write predarray[31] = -2
    //var count indicates the number of recursions done by that level
    //var totalcount indicates how many recursions the function did at the end. Important for cases when game is ending (totalcount lesser than number of moves to be predicted by function).
    //at the start, initcell, totalcount and count is set to be zero. userorenemy starts with user(defined as +1)
    function predictMove(simboard, predarray, count, initcell, initscore,
        userorenemy)
    {
        var simboard2;
        var valid;
        var check = 0;
        var dirarray = new Array(1, 10, 11, -1, -10, -11);

        if (count <= 2)
        {
            for (var i = 1; i <= 9; ++i)
            {
                for (var j = 1; j <= 9; ++j)
                {
                    if (((i - j > -5) && (j - i > -5)) && (simboard[i * 10 + j] == 0)) //simulation is done for all empty spaces
                    {
                        var diarrayflag = 0;
                        for (var x = 0; x < 6; x++)
                        {
                            if ((simboard[i * 10 + j + dirarray[x]] == (
                                userorenemy * -1)) && (diarrayflag == 0))
                            {

                                diarrayflag = 1;
                                simboard2 = simboard.slice(0);
                                valid = moveOnce(simboard2, (i * 10 + j),
                                    userorenemy);
                                if (valid == 1)
                                {
                                    count++;
                                    check = 1;
                                    if (count === 1)
                                    {
                                        initcell = i * 10 + j;
                                        predictMove(simboard2, predarray, count,
                                            initcell, initscore, (userorenemy * -
                                                1));
                                        count--;
                                    } else
                                    {
                                        predictMove(simboard2, predarray, count,
                                            initcell, initscore, (userorenemy * -
                                                1));
                                        count--;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            /*
            // if at final branch, or cannot move branch branch ++
            if (check == 0 || count == 2)
            	countarray[initcell]++;*/
            if (((check == 1) || ((check == 0) && (userorenemy == -1))) /*&& count == 2*/)
            {
            	
                var finalvalue = countPieces(simboard) - initscore;
                if ((predarray[initcell] == "#"))
                {
                    if (finalvalue < 0)
                        predarray[initcell] = -1;
                    else if (finalvalue == 0) 
                        predarray[initcell] = 0; 
                    else 
                        predarray[initcell] = 1;
                } else
                {
                    if (finalvalue < 0)
                        predarray[initcell] -= 1;
                    else if (finalvalue > 0)
                        predarray[initcell] += 1;
                }
                if ((check == 0) && (userorenemy == -1) && (countPieces(simboard)>0)) //bonus if enemy will be forced to pass
                    predarray[initcell] += 2;                
            }
        }
    } //end of predictMove function 	
}
