/*
 * connect4.js
 */

var connect4 = (function(){
    var RED    = 1;
    var BLACK  = 2;
    var EMPTY  = 0;
    
    function Board() {
        var WIDTH  = 7;
        var HEIGHT = 6;
        
        // not sure if this will always be true (it works for 7 x 6)
        var DIAGONALS = WIDTH + HEIGHT - 1;

        var board = build(WIDTH, HEIGHT);

        function build(w, h) {
            var b = [];
            var i = 0;
            for ( ; i < w; i++ ) {
                b[i] = []
                var j = 0;
                for ( ; j < h; j++ ) {
                    b[i][j] = EMPTY 
                }
            }
            return b;
        }

        function dropPiece(piece, column) {
            var i = 0;
            var col = board[column]
            for ( ; i < HEIGHT; i++ ) {
                if ( col[i] == RED || col[i] == BLACK ) {
                    if ( i == 0 ) return -1; // col full
                    else {
                        if ( col[i-1] == EMPTY ) col[i-1] = piece;
                    }
                } else {
                    // hit bottom
                    if ( i == (HEIGHT - 1) ) col[i] = piece;
                }
            }
        }

        function dropRed(column) {
            return dropPiece(RED, column);
        }

        function dropBlack(column) {
            return dropPiece(BLACK, column);
        }

        function row(n) {
            var row = [];
            var i = 0;
            for ( ; i < board.length; i++ ) {
                row[i] = board[i][n];
            }
            return row;
        }

        function eachRow(fn) {
            var i = 0;
            for ( ; i < HEIGHT; i++ ) {
                fn(row(i));
            }
        }

        function col(n) {
            return board[n];
        }

        function eachCol(fn) {
            var i = 0;
            for ( ; i < WIDTH; i++ ) {
                fn(board[i]);
            }
        }

        function cell(x, y) {
            return board[x][y]
        }

        function line(x1, y1, x2, y2) {
            var xi = 1;
            var yi = 1;
            if ( x1 < x2 ) xi = -1
            if ( y1 < y2 ) yi = -1

            var xs = [];
            var i = x1;
            for ( ; i <= x2; i += xi ) {
                xs.push(i)
            }
            console.log(xs);

            var ys = [];
            var j = y1;
            for ( ; j <= y2; j += yi ) {
                ys.push(j)
            }
            console.log(ys);
        }

        function diag(n) {
            
        }

        function linearSearch(col) {
            var i = 0;
            var n = 0;
            var last = 0;
            for ( ; i < col.length; i++ ) {
                if ( col[i] == RED ) {
                    if ( last == BLACK ) n = 0;
                    last = RED;
                    n++;
                }
                if ( col[i] == BLACK ) {
                    if ( last == RED ) n = 0;
                    last = BLACK
                    n++;
                }
            }
            if ( n == 4 ) return true;
            else          return false;
        }

        function hasVerticalConnect4() {
            var i = 0;
            for ( ; i < WIDTH; i++ ) {
                if ( linearSearch(col(i)) ) return true;
            }
            return false;
        }

        function hasHorizontalConnect4() {
            var i = 0;
            for ( ; i < HEIGHT; i++ ) {
                if ( linearSearch(row(i)) ) return true;
            }
            return false;
        }

        function hasDiagonalConnect4() {
            var i = 0;
            for ( ; i < DIAGONALS; i++ ) {

            }
        }

        function hasConnect4() {
            return hasVerticalConnect4() ||
                hasHorizontalConnect4() || 
                hasDiagonalConnect4();
        }

        return { 
            board: board,
            drop: dropPiece,
            dropRed: dropRed,
            dropBlack: dropBlack,
            eachCol: eachCol,
            col: col,
            eachRow: eachRow,
            row: row,
            hasConnect4: hasConnect4,
            hasHorizontalConnect4: hasHorizontalConnect4,
            hasVerticalConnect4: hasVerticalConnect4,
            linearSearch: linearSearch,
            cell: cell,
            line: line
        }
	}

    return {
        Board: Board,
        RED: RED,
        BLACK: BLACK,
        EMPTY: EMPTY
    }
}());
