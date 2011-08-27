/*
 * connect4.js
 */

var connect4 = { VERSION: '0.1' }

connect4.model = (function(){
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

        this.whoHasConnect4 = function() {
            return _whoHasConnect4;
        }

        this.redHasConnect4 = function() {
            return this.whoHasConnect4() == RED;
        }

        this.blackHasConnect4 = function() {
            return this.whoHasConnect4() == BLACK;
        }

        this.dropPiece = function(piece, column) {
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

        this.dropRed = function(column) {
            return this.dropPiece(RED, column);
        }

        this.dropBlack = function(column) {
            return this.dropPiece(BLACK, column);
        }

        this.row = function(n) {
            var row = [];
            var i = 0;
            for ( ; i < board.length; i++ ) {
                row[i] = board[i][n];
            }
            return row;
        }

        this.eachRow = function(fn) {
            var i = 0;
            for ( ; i < HEIGHT; i++ ) {
                fn(this.row(i));
            }
        }

        this.col = function(n) {
            return board[n];
        }

        this.eachCol = function(fn) {
            var i = 0;
            for ( ; i < WIDTH; i++ ) {
                fn(board[i]);
            }
        }

        this.cell = function(x, y) {
            return board[x][y]
        }

        this.linearSearch = function(col) {
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

        this.hasVerticalConnect4 = function() {
            var i = 0;
            for ( ; i < WIDTH; i++ ) {
                if ( this.linearSearch(this.col(i)) ) return true;
            }
            return false;
        }

        this.hasHorizontalConnect4 = function() {
            var i = 0;
            for ( ; i < HEIGHT; i++ ) {
                if ( this.linearSearch(this.row(i)) ) return true;
            }
            return false;
        }

        this.line = function(fn) {
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

        this.hasDiagonalConnect4 = function() {
            var i = COL_NUM * -1; // -6
            var n = ROW_NUM;      //  5
            for ( ; i < n; i++ ) {
                var diag = this.line(function(x) { return x + i });
                if ( this.linearSearch(diag) ) return true;
            }

            // TODO: try to generalize
            var j = 3;
            var m = 8;
            for ( ; j < m; j++ ) {
                var diag = this.line(function(x) { return -x + j });
                if ( this.linearSearch(diag) ) return true;
            }
            return false;
        }

        this.hasConnect4 = function() {
            return this.hasVerticalConnect4() ||
                   this.hasHorizontalConnect4() || 
                   this.hasDiagonalConnect4();
        }

        return this;
	}

    return {
        Board: Board,
        RED: RED,
        BLACK: BLACK,
        EMPTY: EMPTY
    }
}());

connect4.test = function() {
    function testDiag() {
        var b = new connect4.model.Board();
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
    
        if ( b.hasConnect4() ) console.log("passed");
        else console.log("failed");
    }
    
    function testHorizontal() {
        var b = new connect4.model.Board();
        b.dropRed(0);
        b.dropRed(1);
        b.dropRed(2);
        b.dropRed(3);
    
        b.eachRow(function(row){ console.log(row) });
    
        if ( b.hasConnect4() ) console.log("passed");
        else console.log("failed");
    }

    function testVertical() {
        var b = new connect4.model.Board();
        b.dropRed(0);
        b.dropRed(0);
        b.dropRed(0);
        b.dropRed(0);
    
        b.eachRow(function(row){ console.log(row) });
    
        if ( b.hasConnect4() ) console.log("passed");
        else console.log("failed");
    }

    function testSuite() {
        testDiag();
        testHorizontal();
        testVertical();
    }
    
    return { suite: testSuite }
}();
