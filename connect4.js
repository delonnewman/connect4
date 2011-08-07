/*
 * connect4.js
 */

var connect4 = (function(){
    var RED    = 1;
    var BLACK  = 2;
    var EMPTY  = 0;
    
    function Board() {
        var WIDTH   = 7;
        var HEIGHT  = 6;
        var COL_NUM = WIDTH  - 1;
        var ROW_NUM = HEIGHT - 1;
        
        var _whoHasConnect4 = 0;

        var board = function (w, h) {
            var b = [];
            var i = 0;
            for ( ; i < w; i++ ) {
                b[i] = [];
                var j = 0;
                for ( ; j < h; j++ ) {
                    b[i][j] = EMPTY 
                }
            }
            return b;
        }(WIDTH, HEIGHT);

        function whoHasConnect4() {
            return _whoHasConnect4();
        }

        function redHasConnect4() {
            return whoHasConnect4() == RED;
        }

        function blackHasConnect4() {
            return whoHasConnect4() == BLACK;
        }

        function dropPiece(piece, column) {
            var i = 0;
            var col = board[column]
            for ( ; i < HEIGHT; i++ ) {
                if ( col[i] == RED || col[i] == BLACK ) {
                    if ( i == 0 ) return false; // col full
                    else {
                        if ( col[i-1] == EMPTY ) col[i-1] = piece;
                    }
                } else {
                    // hit bottom
                    if ( i == (HEIGHT - 1) ) col[i] = piece;
                }
            }
            return true
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

        function line2(x1, y1, x2, y2) {
            if ( x1 > COL_NUM  || x2 > COL_NUM  ) return [];
            if ( y1 > ROW_NUM || y2 > ROW_NUM ) return [];

            var xs = range(x1, x2);
            console.log(xs);

            var ys = range(y1, y2);
            console.log(ys);

            if ( xs.length != ys.length ) return [];

            var line = []
            var i = 0;
            for ( ; i < xs.length; i++ ) {
                line.push(board[ys[i]][xs[i]]);
            }
            return line;
        }

        function range(n, m) {
            if ( n == m ) return [n];

            var iter = 1;
            var comp = function(a, b) { return a <= b };
            if ( n >  m ) {
                iter = -1;
                comp = function(a, b) { return a >= b };
            }

            var r = [];
            var i = n
            for ( ; comp(i, m); i += iter ) r.push(i);
            return r;
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
            if ( n == 4 ) {
                _whoHasConnect4 = last;
                return true;
            }
            else return false;
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

        function line(fn) {
            var line = [];
            var i = 0;
        
            for ( ; i < WIDTH; i++ ) {
                var x = i;
                var y = fn(x);
                if ( y > ROW_NUM || y < 0 || x > COL_NUM || x < 0 )
                    continue;
                else
                    line.push(board[x][y]);
            }
            return line;
        }

        function hasDiagonalConnect4() {
            var i = COL_NUM * -1; // -6
            var n = ROW_NUM;      //  5
            for ( ; i < n; i++ ) {
                var diag = line(function(x) { return x + i });
                console.log(diag);
                if ( linearSearch(diag) ) return true;
            }

            // TODO: try to generalize
            var j = 3;
            var m = 8;
            console.log(j);
            console.log(m);
            for ( ; j < m; j++ ) {
                var diag = line(function(x) { return -x + j });
                console.log(diag);
                if ( linearSearch(diag) ) return true;
            }
            return false;
        }

        function hasConnect4() {
            return hasVerticalConnect4() ||
                hasHorizontalConnect4() || 
                hasDiagonalConnect4();
        }

        return { 
            dropRed: dropRed,
            dropBlack: dropBlack,
            eachCol: eachCol,
            eachRow: eachRow,
            hasConnect4: hasConnect4,
            redHasConnect4: redHasConnect4,
            blackHasConnect4: blackHasConnect4
        }
	}

    return {
        Board: Board,
        RED: RED,
        BLACK: BLACK,
        EMPTY: EMPTY
    }
}());

function testDiag() {
    var b = new connect4.Board();
    b.dropRed(0);
    b.dropBlack(1);
    b.dropRed(1);
    b.dropBlack(2);
    b.dropBlack(2);
    b.dropRed(2);
    b.dropBlack(3);
    b.dropBlack(3);
    b.dropBlack(3);
    b.dropRed(3);

    b.eachRow(function(row){ console.log(row) });

    if ( b.hasDiagonalConnect4() ) console.log("passed");
    else console.log("failed");
}
