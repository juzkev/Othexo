var a; 
var tournament; 
var tournamentinprogress; 
function Game( container, PlayerX, PlayerY, score, playerXHuman, playerYHuman, tournamentrounds ) { 
    // game board, stored in an array
    var board = [ ]; 
    // initialise the board, valid cells receive 0
    for( var i = 1; i <= 9; ++ i ) { 
        for( var j = 1; j <= 9; ++ j ) { 
            if(( i - j > - 5 ) &&( j - i > - 5 ) ) { 
                board [ i * 10 + j ] = 0; 
            } 
        } 
    } 
    // initialise randomly the starting stones
    if( Math.random( ) > 0.5 ) { 
        board [ 34 ] = 1; 
    } else { 
        board [ 34 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 44 ] = 1; 
    } else { 
        board [ 44 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 45 ] = 1; 
    } else { 
        board [ 45 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 54 ] = 1; 
    } else { 
        board [ 54 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 55 ] = 1; 
    } else { 
        board [ 55 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 56 ] = 1; 
    } else { 
        board [ 56 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 64 ] = 1; 
    } else { 
        board [ 64 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 65 ] = 1; 
    } else { 
        board [ 65 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 66 ] = 1; 
    } else { 
        board [ 66 ] = - 1; 
    } 
    if( Math.random( ) > 0.5 ) { 
        board [ 67 ] = 1; 
    } else { 
        board [ 67 ] = - 1; 
    } 
    // This could also be done by this command: [34, 44, 45, 54, 55, 56, 64, 65, 66, 67].map(function(index) { board[index] = Math.random() >= 0.5 ? 1 : -1; });
    
    // player "engines"
    var playerTypeX = new PlayerX( 1 ); 
    var playerTypeY = new PlayerY( - 1 ); 
    // 1 for player X, -1 for player Y
    var currentPlayer = 1; 
    // if both players pass or make an invalid move, the game must stop
    var previousMoveValid = true; 
    // number of empty cells (total 61, minus 10 starting stones)
    var emptyCells = 61 - 10; 
    // indicative text on which move was just made
    var lastMove = "New Game<br>Click on the pieces to make a move."; 
    //setTimeout() queue.
    var t; 
    // set default delay to 1000ms
    this.delay = 1000; 
    // store instance of game
    var gamethis = this; 
    /* drawing variables */
    /*the height of a hexagon is height = size * 2. 
	The vertical distance between adjacent hexes is vert = 3/4 * height.
	The width of a hexagon is width = sqrt(3)/2 * height. 
	The horizontal distance between adjacent hexes is horiz = width.*/	
    var size =((( document.documentElement.clientHeight / 2 ) / 14 ) >=(( // radius of hexagon dynamically definined according to client size
        document.documentElement.clientWidth / 2 ) /( Math.sqrt( 3 ) * 9 ) ) ) ?(( 
    document.documentElement.clientWidth / 2 ) /( Math.sqrt( 3 ) * 9 ) ) :(( 
        document.documentElement.clientHeight / 2 ) / 14 ); 
    var hd = size * Math.sqrt( 3 ); // horizontal distance 
    var vd = size * 1.5; // vertical distance 
    var hexagonarr = [ ]; // array to store drawn hexagons
    
    /* Colours */
    var lightgrey = new SVG.Color( '#D3D3D3' ); 
    var red = new SVG.Color( '#FF0000' ); 
    var lightred = new SVG.Color( '#FA8072' ); // SVG Salmon
    var blue = new SVG.Color( '#0000FF' ); 
    var lightblue = new SVG.Color( '#ADD8E6' ); // SVG Light blue
    
    /* Tournament Variables */
    var scorearray = new Array( ); 
	scorearray [ 0 ] = 0; 
	scorearray [ 1 ] = 0; 
	var xwin = 0; 
	var ywin = 0; 
	var draw = 0; 
	var xtotal = 0; 
	var ytotal = 0; 
	var tlog = ""; 
	var count = 0; 
    /* create an svg drawing */
    // draw Hexagon Grid
    //this.draw = function() {
    var drawing = SVG( document.getElementById( container ) ).size( document.documentElement.clientWidth / 2 + 2, document.documentElement.clientHeight / 2 + 2 ); 
    /* draw prototype Hexagon */
    var hexagon = drawing.polygon( ).ngon( { 
    		radius : size, 
    		edges : 6 
    } ).fill( '#D3D3D3' ).stroke( { 
    width : 1 
    } ); 
    // draw goverover layover
    var rect = drawing.rect( '99.9%', '99.9%' ).attr( { 
    		fill : lightgrey.toHex( ), 
    		stroke : '#000', 
    		'stroke-width' : 1 
    } ); 
    // draw gameover text
    var text = drawing.text( "Game Over" ).font( { 
    		family : 'Helvetica', 
    		size : document.documentElement.clientHeight / 8, 
    anchor : 'middle'    } ).move( '50%', document.documentElement.clientHeight / 4 - 1 - document.documentElement.clientHeight / 14 ); // center the text
    // groups gameover elements into a set
    var gameoverset = drawing.set( ); 
    gameoverset.add( rect ).add( text ); 
    gameoverset.opacity( 0 ); 
    /*clones prototype into grid*/
    for( i = 1; i <= 9; ++ i ) { 
        for( j = 1; j <= 9; ++ j ) { 
            if(( i - j > - 5 ) &&( j - i > - 5 ) ) { // if((i*10 + j) in board) {
                var k = i * 10 + j; 
                hexagonarr [ k ] = hexagon.clone( ).move(( document.documentElement.clientWidth / 
                    4 - 3 * hd + hd * j - hd / 2 * i ),( 0 + vd *( i - 1 ) ) ); 
                hexagonarr [ k ].mouseover( function( ) { // on mouseover, highlight hexagon cell with current player's colour
                		if(( hexagonarr.indexOf( this ) in board ) && board [  // if hexagon cell exists, and is empty cell
                        hexagonarr.indexOf( this ) ] === 0 ) { 
                        if( currentPlayer == 1 ) { 
                            this.animate( 100, '<>', 0 ).fill( lightred.toHex( ) ).stroke( { 
                                    width : 3 
                            } ); 
                        } else if( currentPlayer == - 1 ) { 
                            this.animate( 100, '<>', 0 ).fill( lightblue.toHex( ) ).stroke( { 
                                    width : 3 
                            } ); 
                        } 
                        this.front( );  // moves hexagon to front
                        } 
                } ); 
                hexagonarr [ k ].mouseout( function( ) { // on mouse out, returns hexagon cell to normal grey
                		if(( hexagonarr.indexOf( this ) in board ) && board [ 
                        hexagonarr.indexOf( this ) ] === 0 ) { 
                        this.animate( 100, '<>', 0 ).fill( lightgrey.toHex( ) ).stroke( { 
                        		width : 1 
                        } ); 
                        } 
                } ); 
                hexagonarr [ k ].click( function( ) { // event click on hexagon cell
                		if(( currentPlayer == 1 && playerXHuman ) || // determine if it is human player's turn
                			currentPlayer == - 1 && playerYHuman ) { 
                        var side =( currentPlayer == 1 ) ? "X" : "Y"; // currentplayer ==> X Y player
                        document.getElementById( "hidden" + side ).value = hexagonarr.indexOf( this ); // Fills in the cell selected for the human player directly to the hidden input
                        /*gamethis.validateMove( hexagonarr.indexOf( this ) ); */ // old callback to register move; this was removed to preserve bulk of the original code design by prof regarding play1 and play2
                        	} 
                } ); 
            } 
        } 
    } 
    hexagon.remove( ); // removes prototype hexagon
    
    // Updates colour on hexagon grid, instead of drawing them all over again
    this.reDraw = function( ) { 
        var x = 0; 
        var y = 0; 
        var k; 
        var b = ""; 
        if( currentPlayer !== 0 ) { // if game has ended, display gameover overlay
            if( rect.attr( 'opacity' ) == 0.75 ) { 
                gameoverset.each( function( ) { 
                		this.animate( ).opacity( 0 ); 
                		this.back( ); 
                } ); 
            } 
        } else if( rect.attr( 'opacity' ) === 0 ) { // remove gameover overlay upon restart
            gameoverset.each( function( ) { 
            		this.animate( ).opacity( 0.75 ); 
            		this.front( ); 
            } ); 
        } 
        for( var i = 1; i <= 9; ++ i ) { 
            for( var j = 1; j <= 9; ++ j ) { 
                if(( i - j > - 5 ) &&( j - i > - 5 ) ) { // if((i*10 + j) in board) {
                    k = i * 10 + j; 
                    switch( board [ k ] ) { 
                    case 1 : // if cell belongs red / X
                        x ++; 
                        if( hexagonarr [ k ].attr( 'fill' ) != red.toHex( ) ) { 
                            hexagonarr [ k ].animate( 500, '<>', 0 ).rotate( - 60 ).fill( 
                                red.toHex( ) ).stroke( { 
                            width : 1 
                            	} ); 
                        } 
                        break; 
                    case 0 : // if cell is empty
                        if( hexagonarr [ k ].attr( 'fill' ) != lightgrey.toHex( ) ) { // if cell was previously highlighted, (invalid move was made)
                            hexagonarr [ k ].animate( 500, '<>', 0 ).rotate( 0 ).fill( 
                                lightgrey.toHex( ) ).stroke( { 
                            width : 1 
                            	} ); 
                        } 
                        break; 
                    case - 1 : // if cell belongs to blue / Y
                        y ++; 
                        if( hexagonarr [ k ].attr( 'fill' ) != blue.toHex( ) ) { 
                            hexagonarr [ k ].animate( 500, '<>', 0 ).rotate( 60 ).fill( 
                                blue.toHex( ) ).stroke( { 
                            width : 1 
                            	} ); 
                        } 
                        break; 
                    } 
                } 
            } 
        } 
        b = b + "Red has " + x + " pieces and Blue has " + y + " pieces"; // merged status text printing with hexagon redrawing
        b += "<br>" + lastMove; 
        if( currentPlayer !== 0 ) { 
            b +=( currentPlayer == 1 ) ? "<br> Red player's turn" : 
            "<br> Blue Player's turn"; 
        } 
        document.getElementById( score ).innerHTML = b; 
    }; 
    // old callback to destory hexagon drawing upon restart, removed with alternative redrawing design.
    /* this.destroydrawing = function( ) { 
    drawing.destory( ); 
    }; */
    this.subsubmakemove = function( cell, offset ) { 
        var mme = cell + offset; 
        while(( mme in board ) &&( board [ mme ] == - currentPlayer ) ) { 
            mme += offset; 
        } 
        if( mme == cell + offset || !( mme in board ) ||( board [ mme ] != 
            currentPlayer ) ) { 
        return 0; 
        	} 
        	do { 
        		mme -= offset; 
        		board [ mme ] = currentPlayer; 
        	} while( cell != mme ); 
        	return 1; 
    }; 
    this.submakemove = function( cell ) { 
        var playername =( currentPlayer == 1 ) ? "Red player " : "Blue player "; 
        if(( cell in board ) &&( board [ cell ] === 0 ) ) { 
            var offsets = [ 1, 10, 11, - 1, - 10, - 11 ]; 
            var mmc = 0; 
            for( var index in offsets ) { 
                if( this.subsubmakemove( cell, offsets [ index ] ) == 1 ) { 
                    ++ mmc; 
                } 
            } 
            if( board [ cell ] == currentPlayer ) { 
                lastMove = playername + "moved successfully at " + cell; 
                return 1; 
            } 
        } 
        if( cell === 0 ) { 
            lastMove = playername + "passed a move"; 
        } else { 
            lastMove = playername + "tried unsuccessfully to move at " + cell; 
        } 
        return 0; 
    }; 
    this.validateMove = function( cell ) { 
        var validMove = this.submakemove( cell ) == 1; 
        currentPlayer = - currentPlayer; 
        if( ! validMove ) { 
            if( ! previousMoveValid ) { 
                lastMove += 
                "<br>Two players passed or made an invalid move in a row, game over<br> Please click restart to play again"; 
                currentPlayer = 0; 
            } else { 
                previousMoveValid = false; 
            } 
        } else { 
            if( -- emptyCells === 0 ) { 
                lastMove += 
                "<br>No more room left on the board, game over<br> Please click restart to play again"; 
                currentPlayer = 0; 
            } 
            previousMoveValid = true; 
        } 
        if( ! tournament ) { // disables hexagon drawing in tournament mode
            this.reDraw( ); 
        } 
        return currentPlayer !== 0; 
    }; 
    this.play1 = function( ) { 
        var cell = playerTypeX.nextMove( board.slice( 0 ) ); 
        if( cell == - 1 ) { 
            t = setTimeout( this.play1.bind( this ), 50 ); 
            return; 
        } 
        if( this.validateMove( cell ) ) { 
            t = setTimeout( this.play2.bind( this ), this.delay ); 
        } else if( ! this.validateMove( cell ) ) { 
            count ++; // tournament rounds completed count
            if( tournament ) { // callback to tournamentHandler() on game finish
                gamethis.tournamentHandler( ); 
            } 
        } 
    }; 
    this.play2 = function( ) { 
    	var cell = playerTypeY.nextMove( board.slice( 0 ) ); 
    	if( cell == - 1 ) { 
    		t = setTimeout( this.play2.bind( this ), 50 ); 
    		return; 
    	} 
    	if( this.validateMove( cell ) ) { 
    		t = setTimeout( this.play1.bind( this ), this.delay ); 
    	} else if( ! this.validateMove( cell ) ) { 
            count ++; // tournament rounds completed count
            if( tournament ) { // callback to tournamentHandler() on game finish
                gamethis.tournamentHandler( ); 
            } 
        } 
    }; 
    // internal tournamentHandler() design implemented as Javascript runs based on an event queue, in which setTimeout() will only be ran after loop is completed.
    this.tournamentHandler = function( ) { 
    	scorearray = gamethis.getScore( ); 
    	xtotal += scorearray [ 0 ]; 
    	ytotal += scorearray [ 1 ]; 
    	if( scorearray [ 0 ] > scorearray [ 1 ] ) { 
    		xwin ++; 
    		tlog += "Round " + count + ", Red player won.<br>"; 
    	} else if( scorearray [ 0 ] < scorearray [ 1 ] ) { 
    		ywin ++; 
    		tlog += "Round " + count + ", Blue player won.<br>"; 
    	} else if( scorearray [ 0 ] == scorearray [ 1 ] ) { 
    		draw ++; 
    		tlog += "Round " + count + ", Draw.<br>"; 
    	} 
    	var elem = document.getElementById( "tournamentlog" ); 
    	elem.innerHTML = tlog; // on the fly updating of log
    	elem.scrollTop = elem.scrollHeight; // scroll to bottom of log
        if( count < tournamentrounds ) { 
            gamethis.restart( container, PlayerX, PlayerY, score, playerXHuman, playerYHuman, tournamentrounds );    // restart while tournament round count is still lesser than target tournament rounds        
        } else if( count >= tournamentrounds ) { // tournament finished
            tlog = "Red player won " + xwin + " rounds.<br>Blue player won " + 
            ywin + " rounds.<br>They drew " + draw + " out of " + 
            tournamentrounds + " rounds.<br> Red player had " + xtotal + 
            " total pieces, while Blue player had " + ytotal + 
            " total pieces."; 
            document.getElementById( "tournamentresults" ).innerHTML = tlog; // print tournament results
            xwin = 0; // reset tournament variables
			ywin = 0; 
			draw = 0; 
			xtotal = 0; 
			ytotal = 0; 
			tlog = ""; 
			count = 0; 
			tournamentinprogress = false; // tournament ended, flag used to prevent multiple tournament executing
			
        } 
    }; 
    // returns the score for X and Y based on current board state.
    this.getScore = function( ) { 
    	var score = new Array( ); //	0 for x, 1 for y
    	score [ 0 ] = 0; 
    	score [ 1 ] = 0; 
    	for( var i = 1; i <= 9; ++ i ) { 
    		for( var j = 1; j <= 9; ++ j ) { 
    			if(( i - j > - 5 ) &&( j - i > - 5 ) ) { // if((i*10 + j) in board) {
    				k = i * 10 + j; 
    				switch( board [ k ] ) { 
    				case 1 : 
    					score [ 0 ]++; 
    					break; 
    				case - 1 : 
    					score [ 1 ]++; 
    					break; 
    				} 
    			} 
    		} 
    	} 
    	return score; 
    } 
    //getCurrentPlayer removed as tournamentHandler() has been implemented inside of Game class itself
    //make currentPlayer public through the function getCurrentPlayer(), used to determine if game has ended
    /*    
    this.getCurrentPlayer = function( ) { 
    return currentPlayer; 
    }; */
    this.start = function( ) { 
    	if( ! tournament ) { // disable draw for tournament
    		this.reDraw( ); 
    	} 
    	t = setTimeout( this.play1.bind( this ), this.delay ); 
    }; 
    this.stop = function( ) { 
    	clearInterval( t ); // used to stop the setInterval() used in play1() and play2()
    	/*drawing.remove();*/ // removed as redraw design was implemented
    	lastMove = "Game Stopped"; 
    }; 
    this.restart = function( ct, PlayerX, PlayerY, sc, pXH, pYH, tr ) { 
    	container = ct; 
    	score = sc; 
    	tournamentrounds = tr; 
    	playerXHuman = pXH; 
    	playerYHuman = pYH; 
    	// initialise the board, valid cells receive 0
    	for( var i = 1; i <= 9; ++ i ) { 
    		for( var j = 1; j <= 9; ++ j ) { 
    			if(( i - j > - 5 ) &&( j - i > - 5 ) ) { 
    				board [ i * 10 + j ] = 0; /* can consider storing empty board and writing it in instead?*/
    			} 
    		} 
    	} 
    	// initialise randomly the starting stones
    	if( Math.random( ) > 0.5 ) { 
    		board [ 34 ] = 1; 
    	} else { 
    		board [ 34 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 44 ] = 1; 
    	} else { 
    		board [ 44 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 45 ] = 1; 
    	} else { 
    		board [ 45 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 54 ] = 1; 
    	} else { 
    		board [ 54 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 55 ] = 1; 
    	} else { 
    		board [ 55 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 56 ] = 1; 
    	} else { 
    		board [ 56 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 64 ] = 1; 
    	} else { 
    		board [ 64 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 65 ] = 1; 
    	} else { 
    		board [ 65 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 66 ] = 1; 
    	} else { 
    		board [ 66 ] = - 1; 
    	} 
    	if( Math.random( ) > 0.5 ) { 
    		board [ 67 ] = 1; 
    	} else { 
    		board [ 67 ] = - 1; 
    	} 
    	// This could also be done by this command: [34, 44, 45, 54, 55, 56, 64, 65, 66, 67].map(function(index) { board[index] = Math.random() >= 0.5 ? 1 : -1; });
    	
    	// player "engines"
    	playerTypeX = new PlayerX( 1 ); 
    	playerTypeY = new PlayerY( - 1 ); 
    	// 1 for player X, -1 for player Y
    	currentPlayer = 1; 
    	// if both players pass or make an invalid move, the game must stop
    	previousMoveValid = true; 
    	// number of empty cells (total 61, minus 10 starting stones)
    	emptyCells = 61 - 10; 
    	// indicative text on which move was just made
    	lastMove = "New Game<br>Click on the pieces to make a move."; 
    	//reset scores
    	scorearray [ 0 ] = 0; 
    	scorearray [ 1 ] = 0; 
    	if( ! tournament ) { // disable draw for tournament
    		this.reDraw( ); 
    	} 
    	t = setTimeout( this.play1.bind( this ), this.delay ); 
    }; 
} 
function start( a ) { // recycleable game instance
	var pX = window [ document.getElementById( "playerX" ).value ]; 
	var pY = window [ document.getElementById( "playerY" ).value ]; 
	// Determine if Human Player
	var pXH =( document.getElementById( "playerX" ).value == "HumanPlayer" ) ? 
	true : false; 
	var pYH =( document.getElementById( "playerY" ).value == "HumanPlayer" ) ? 
	true : false; 
	var delay = parseInt( document.getElementById( "delay" ).value, 10 ); 
	tournament =( document.getElementById( "tournament" ).checked ) ? true : 
	false; 
	//check for tournamanet mode check for AI only, if tournament mode delay = 0
	if( tournament ) { 
		if( pXH || pYH ) { 
			alert( "ERROR, please select two AIs" ); 
			return; 
		} 
		delay = 0; 
		var tournamentrounds = document.getElementById( "tournamentrounds" ).value; // get target tournament rounds
	} 
	//hide hexagon board if tournament mode
	document.getElementById( "board" ).style.display =( tournament ) ? "none" : 
	"block"; 
	document.getElementById( "tournamentdiv" ).style.display =( tournament ) ? 
	"block" : "none"; 
	var game = new Game( "board", pX, pY, "score", pXH, pYH, tournamentrounds ); 
	game.delay = delay; 
	tournamentinprogress =( tournament ) ? true : false; // sets tournamentinprogress flag, used to prevent multiple tournaments fro runing
	// removed as tournamentHandler() implemented inside of Game class
	/*if( tournament ) { 
	tournamenthandler( game, tournamentrounds, "board", pX, pY, "score", 
	pXH, pYH ); 
	} else { 
	game.start( ); 
	} */
	game.start( ); 
	// storage game instance in a, for recylcing
	a = game; 
	// disables and hides start button, displays restart button
	document.getElementById( "start" ).disabled = true; 
	document.getElementById( "start" ).style.display = "none"; 
	document.getElementById( "restart" ).style.display = "inline-block"; 
	return a; 
} 
// tournamenthandler() removed as implemented inside of Game class
/*function tournamenthandler( game, tournamentrounds, board, pX, pY, score, pXH, pYH ) { 
var score = new Array( ); 
score [ 0 ] = 0; 
score [ 1 ] = 0; 
var xwin = 0; 
var ywin = 0; 
var draw = 0; 
var xtotal = 0; 
var ytotal = 0; 
var t = ""; 
var count = 0; 
var checkForRerun = function( game, tournamentrounds, board, pX, pY, 
score, pXH, pYH, score, xwin, ywin, draw, xtotal, ytotal, t, count ) { 
if( count < tournamentrounds ) { 
if( game.getCurrentPlayer( ) === 0 ) { 
game.stop( ); 
game.restart( board, pX, pY, score, pXH, pYH ); 
score = game.getScore( ); ////
xtotal += score [ 0 ]; 
ytotal += score [ 1 ]; 
if( score [ 0 ] > score [ 1 ] ) { 
xwin ++; 
t += "Round " + i + ", Red player won.<br>"; 
} else if( score [ 0 ] < score [ 1 ] ) { 
ywin ++; 
t += "Round " + i + ", Blue player won.<br>"; 
} else if( score [ 0 ] == score [ 1 ] ) { 
draw ++; 
t += "Round " + i + ", Draw.<br>"; 
} 
count ++; 
} else if( count >= tournamentrounds ) { 
clearInterval( timerID ); 
writeResults( t ); 
} 
} 
};  
/*for( var i = 1; i <= tournamentrounds; i ++ ) {  
do { 
score = game.score( );    ////
xtotal += score [ 0 ]; 
ytotal += score [ 1 ]; 
if( score [ 0 ]> score [ 1 ] ) { 
xwin ++; 
t += "Round " + i + ", Red player won.<br>"; 
} else if( score [ 0 ]< score [ 1 ] ) { 
ywin ++; 
t += "Round " + i + ", Blue player won.<br>"; 
} else if( score [ 0 ]== score [ 1 ] ) { 
draw ++; 
t += "Round " + i + ", Draw.<br>"; 
} 
game.stop( ); 
game.restart( board, pX, pY, score, pXH, pYH ); 
} while( game.currentPlayer === 0 ); 	
} */

/*var writeResults = function( t ) { 
document.getElementById( "tournamentlog" ).innerHTML = t; 
t = "Red player won " + xwin + " rounds.<br>Blue player won " + 
ywin + " rounds.<br>They drew " + draw + " out of " + 
tournamentrounds + " rounds.<br> Red player had " + xtotal + 
" total pieces, while Blue player had " + ytotal + 
" total pieces."; 
document.getElementById( "tournamentresults" ).innerHTML = t; 
}; 
var timerID = setInterval( checkForRerun( game, tournamentrounds, board, 
pX, pY, score, pXH, pYH, score, xwin, ywin, draw, xtotal, 
ytotal, t, count ), 10 ); 
} */
function restart( a ) { // recycling game instance
	var pX = window [ document.getElementById( "playerX" ).value ]; 
	var pY = window [ document.getElementById( "playerY" ).value ]; 
	// Determine if Human Player
	var pXH =( document.getElementById( "playerX" ).value == "HumanPlayer" ) ? 
	true : false; 
	var pYH =( document.getElementById( "playerY" ).value == "HumanPlayer" ) ? 
	true : false; 
	var delay = parseInt( document.getElementById( "delay" ).value, 10 ); 
	if( tournamentinprogress ) { // only 1 tournament can be ran at a time.
		alert( "Tournament in progress, please wait for it to complete" ); 
		return a; 
	} 
	tournament =( document.getElementById( "tournament" ).checked ) ? true : 
	false; 
	if( tournament ) { 
		if( pXH || pYH ) { 
			alert( "ERROR, please select two AIs" ); 
			return a; 
		} 
		delay = 0; 
		var tournamentrounds = document.getElementById( "tournamentrounds" ).value; 
	} 
	tournamentinprogress =( tournament ) ? true : false; 
	document.getElementById( "tournamentlog" ).innerHTML = ""; // clear tournament log and results
	document.getElementById( "tournamentresults" ).innerHTML = ""; 
	//hide hexagon board if tournament mode
	document.getElementById( "board" ).style.display =( tournament ) ? "none" : 
	"block"; 
	document.getElementById( "tournamentdiv" ).style.display =( tournament ) ? 
	"block" : "none"; 
	a.stop( ); // stops any previous running games.
	a.delay = delay; 
	a.restart( "board", pX, pY, "score", pXH, pYH, tournamentrounds ); 
	/*if( tournament ) { 
	tournamenthandler( a, tournamentrounds, "board", pX, pY, "score", 
	pXH, pYH ); 
	} else { 
	a.restart( "board", pX, pY, "score", pXH, pYH ); 
	} */
	return a; 
} 
function humanMove( side ) { 
	var text = document.getElementById( "move" + side ); 
	var hidden = document.getElementById( "hidden" + side ); 
	hidden.value = text.value; 
} 
function HumanPlayer( side ) { 
	var letter =( side == 1 ) ? "X" : "Y"; 
	//document.getElementById( "input" + letter ).style.display = "block"; 
	var textField = document.getElementById( "move" + letter ); 
	var hiddenField = document.getElementById( "hidden" + letter ); 
	var button = document.getElementById( "click" + letter ); 
	this.nextMove = function( board ) { 
		if( textField.disabled === true ) { 
			button.disabled = false; 
			textField.disabled = false; 
			textField.focus( ); 
		} 
		if( hiddenField.value === "" ) { 
			return - 1; 
		} 
		var move = hiddenField.value; 
		textField.value = ""; 
		hiddenField.value = ""; 
		textField.disabled = true; 
		button.disabled = true; 
		return parseInt( move, 10 ); 
	}; 
} 
function MysteryPlayer( side ) { 
	this.nextMove = function( board ) { 
		return t96move( board, side ); 
	}; 
} 
function PositionRandomPlayer( side ) { 
	this.nextMove = function( board ) { 
		return t97move( board, side ); 
	}; 
} 
function GreedyRandomPlayer( side ) { 
	this.nextMove = function( board ) { 
		return t98move( board, side ); 
	}; 
} 
function RandomPlayer( side ) { 
	this.nextMove = function( board ) { 
		return t99move( board, side ); 
	};                                
} 
//You should include the following function into your strategy file
function THEXI(side) {
	this.name = "THEXI";
	this.nextMove = function(board) {
			return t34move(board, side); // function defined in yourplayer.js
		};
}
//toggles visiblity for more tournament options when tournament mode is checked.
function toggledivvisibility( chk ) { 
	document.getElementById( "roundsdiv" ).style.display = chk.checked ? 
	"block" : "none"; 
	document.getElementById( "delay" ).disabled = chk.checked ? true : false; 
} 
