var uno = {

	// CREATE

	deck: [],
	createCards: function() {
		var Card = function(color, name, shortname, descr, cssClass) {
			this.color = color;
			this.name = name;
			this.shortname = shortname;
			this.descr = descr;
			this.cssClass = cssClass;
	
			var cT  =	"<div class=\"card\" data-color=\""+this.color+"\" data-shortname=\""+this.shortname+"\">";
				cT +=		"<div class=\"front "+this.color+" "+this.cssClass+"\">";
				cT +=			"<div class=\"value\">"+this.name+"</div>";
				cT +=			"<div class=\"marker\">"+this.name+"</div>";
				cT +=			"<div class=\"descr\">"+this.descr+"</div>";
				cT +=		"</div>";
				cT +=		"<div class=\"back uno\">";
				cT +=			"<div class=\"value\">UNO</div>";
				cT +=		"</div>";
				cT +=	"</div>";

			this.render = cT;
	
			return this;
		};
		for ( c=1;c<=4;c++ ) {
			var color = "";
			if ( c == 1 ) { color = "red"; }
			else if ( c == 2 ) { color = "blue"; }
			else if ( c == 3 ) { color = "green"; }
			else { color = "yellow" }
			for ( i=1;i<=2;i++ ) {
				for ( n=1;n<=9;n++ ) {
					var numeric = new Card(color,n,n,n,"num");
					this.deck.push(numeric);
				}
				var skip = new Card(color,"\&times;","X","Skip","skip"),
					reverse = new Card(color,"\&#126;","R","Reverse","reverse"),
					plustwo = new Card(color,"+2","T","Draw two","add");
				this.deck.push(skip,reverse,plustwo);
			}
			var zero = new Card(color,"0","Z","0","num"),
				plusfour = new Card("black","+4","F","Draw four","add"),
				wild = new Card("black","W","W","Wild","wild")
			this.deck.push(zero,plusfour,wild);
		}
	},

	// RENDER

	render: function() {

		for ( i=1;i<=this.numOfPlayer;i++ ) { $('<section />').addClass('hand player'+i).appendTo('body'); }
		for ( i=this.deck.length-1;i>=0;i-- ) {
			var r = Math.floor(Math.random()*this.deck.length);
			$('#carddeck').append( this.deck[r].render );
			this.deck.splice(r,1);
		}
		$('section').fadeIn();
	},

	// PASS

	numOfCards: 7,
	numOfPlayer: 4,
	passCards: function() {
		for ( i=1;i<=this.numOfPlayer;i++ ) {
			for ( k=1;k<=this.numOfCards;k++ ) {
				$('#carddeck .card').last().appendTo( 'section.player'+i );
			}
		}
		$('#carddeck .card').last().appendTo( '#gamedeck' );
	},

	// RULES

	rules: function(T) {
		var D = $('#gamedeck .card').last(),
			DC = D.attr('data-color'),
			TC = T.attr('data-color'),
			DN = D.attr('data-shortname'),
			TN = T.attr('data-shortname'),
			active = this.wildActive,
			active2 = this.wildActive,
			skip = this.skipActive;
		switch ( DN ) {
			case 'X':
				if ( skip ) {
					if ( TN == DN ) { return true; }
				}
				else {
					if ( TN == DN ) { return true; }
					else if ( TC == DC ) { return true; }
					else if ( TN == "W" ) { return true; }
					else if ( TN == "F" ) { return true; }
					else { return false; }
				}
				break;
			case 'F':
				if ( active ) {
					if ( TN == DN ) { return true; }
					else if ( TN == "R" && TC == DC ) { return true; }
					else { return false; }
				}
				else {
					if ( TC == DC ) { return true; }
					else if ( TN == "W" ) { return true; }
					else if ( TN == "F" ) { return true; }
					else { return false; }				}
				break;
			case 'T':
				if ( active ) {
					if ( TN == DN ) { return true; }
					else if ( TN == "R" && TC == DC ) { return true; }
					else if ( TN == "F" ) { return true; }
					else { return false; }
				}
				else {
					if ( TN == DN ) { return true; }
					else if ( TC == DC ) { return true; }
					else if ( TN == "W" ) { return true; }
					else if ( TN == "F" ) { return true; }
					else { return false; }
				}
				break;
			case 'R':
				if ( active2 ) {
					if ( TN == DN ) { return true; }
					else if ( TN == "F" ) { return true; }
					else { return false; }
				}
				else if ( active ) {
					if ( TN == DN ) { return true; }
					else if ( TN == "T" && TC == DC ) { return true; }
					else if ( TN == "F" ) { return true; }
					else { return false; }
				}
				else {
					if ( TN == DN ) { return true; }
					else if ( TC == DC ) { return true; }
					else if ( TN == "W" ) { return true; }
					else if ( TN == "F" ) { return true; }
					else { return false; }	
				}
				break;
			default:
				if ( TN == DN ) { return true; }
				else if ( TC == DC ) { return true; }
				else if ( TN == "W" ) { return true; }
				else if ( TN == "F" ) { return true; }
				else { return false; }
				break;
		}
	},

	// ACTIONS

	go: function(T) {
		var TN = T.attr('data-shortname');
		if ( TN == 'X' ) { 
			this.skipActive = true;
			this.showActive('S');
			console.log('SKIP')
		}
		else if ( TN == 'T' ) {
			this.wildActive = true;
			this.cardToTacke +=2;
			this.showActive('W');
			console.log('WILD')
		}
		else if ( TN == 'F' ) {
			this.wildActive = true;
			this.wildActive2 = true;
			this.cardToTacke +=4;
			this.showActive('W');
			console.log('WILD2')
		}
		else if ( TN == 'R' ) {
			this.reverseToggle();
			console.log('REVERSE')
		}
		else if ( TN == 'Z' ) {
			this.swapCards();
			console.log('SWAP')
		}
		// ANIMATE
		$(T).appendTo('body').css({
			display: 'block',
			position: 'absolute',
			marginLeft: '-125px',
			marginTop: '-90px',
		});
		if ( this.playerTurn == 1 ) { $(T).css({ top: '100%', left: '50%' }); }
		else if ( this.playerTurn == 2 ) { $(T).css({ top: '50%', left: '0%' }); }
		else if ( this.playerTurn == 3 ) { $(T).css({ top: '0%', left: '50%' }); }
		else if ( this.playerTurn == 4 ) { $(T).css({ top: '50%', left: '100%' }); }
		$(T).animate({
			top: '50%',
			left: '50%',
			marginLeft: '20px',
			marginTop: '-160px'
		},200,function() {
			$(T).removeAttr('style').appendTo('#gamedeck');
			if ( TN == 'F' || TN == 'W' ) {
				if ( uno.playerTurn != 1 ) { 
					if ( uno.selectColor(T) ) { uno.nextTurn(); } 
				}
				else { uno.selectColor(T) }
			}
			else { uno.nextTurn(); }
		});
	},
	pass: function() {
		if ( this.wildActive || this.wildActive2 ) {
			this.takeCard( this.cardToTacke );
			this.wildActive = false;
			this.wildActive2 = false;
			this.cardToTacke = 0;
			this.showActive('H');
		}
		else if ( this.skipActive ) {
			this.takeCard();
			this.skipActive = false;
			this.showActive('H');
		}
		else { this.takeCard(); }
		if ( $('#carddeck .card').length == 0 ) { this.swapDecks() }
		this.nextTurn();
	},
	skipActive: false,
	wildActive: false,
	wildActive2: false,
	cardToTacke: 0,
	showActive: function(T) {
		if ( T == 'W' ) { $('#active div').addClass('num').html( '+'+this.cardToTacke ).fadeIn(50) }
		else if ( T == 'S' ) { $('#active div').addClass('skip').html('\&times;').fadeIn(50) }
		else if ( T == 'H' ) { $('#active div').html('').removeClass('num skip').fadeOut(50); }
	},
	takeCard: function(i) { 
		var append = function() { $('#carddeck .card').last().appendTo( 'section.player'+uno.playerTurn ) };
		if (!i) { append(); } 
		else { for ( n=1;n<=i;n++ ) { append(); } }
	},
	selectColor: function(T) {
		if ( this.playerTurn != 1 ) {
			var color = ['red', 'blue', 'green', 'yellow'],
				i = Math.floor(Math.random()*color.length);
			T.attr('data-color', color[i] ).find('.black').removeClass('black').addClass( color[i] );
			return true;
		}
		else {
			$('#selectcolor').fadeIn();
			$('#selectcolor div').click(function(){ 
				$('#gamedeck .card').last().attr('data-color', $(this).attr('id') ).find('.black').removeClass('black').addClass( $(this).attr('id') );
				$('#selectcolor').fadeOut();
				uno.nextTurn();
			});
		}
	},
	swapCards: function() {
		$('section.hand').fadeOut(100);
		$('section.player1').fadeOut(100,function() {
			var player1 = $('section.player1').html(),
				player2 = $('section.player2').html(),
				player3 = $('section.player3').html(),
				player4 = $('section.player4').html();
			if ( !uno.reverse ) { 
				$('section.player1').html(player4);
				$('section.player2').html(player1);
				$('section.player3').html(player2);
				$('section.player4').html(player3);
			}
			else {
				$('section.player1').html(player2);
				$('section.player2').html(player3);
				$('section.player3').html(player4);
				$('section.player4').html(player1);
			}
			$('section.hand').fadeIn(100);
		});
	},
	swapDecks: function() {
		var gamedeck = $('#gamedeck .card'),
			carddeck = $('#carddeck .card');
		for ( i=0;i<gamedeck.length-1;i++ ) {
			var r = Math.floor(Math.random()*gamedeck.length-1);
			$('#carddeck').prepend( gamedeck[r] );
		}
		for ( i=0;i<carddeck.length;i++ ) {
			if ( carddeck[i].attr('data-shortname') == 'F' || carddeck[i].attr('data-shortname') == 'W' ) {
				carddeck[i].find('.red').removeClass('red').addClass('black').attr('data-color','black');
				carddeck[i].find('.blue').removeClass('blue').addClass('black').attr('data-color','black');
				carddeck[i].find('.yellow').removeClass('yellow').addClass('black').attr('data-color','black');
				carddeck[i].find('.green').removeClass('green').addClass('black').attr('data-color','black');
			}
		}
	},
	
	// TURN

	playerTurn: 1,
	reverse: false,
	reverseToggle: function () { this.reverse = !this.reverse },
	nextTurn: function() {
		console.log(this.playerTurn+" : "+this.cardToTacke);
		if ( $('section.player'+uno.playerTurn+' .card').length == 0 ) {
			$('section').fadeOut(function(){});
			alert('Player'+this.playerTurn+' WIN!');
			this.restart();
		}
		else {		
			if ( this.reverse == false ) {
				this.playerTurn++;
				if ( this.playerTurn > this.numOfPlayer ) { this.playerTurn = 1; }
			}
			else if ( this.reverse == true ) {
				this.playerTurn--;
				if ( this.playerTurn == 0 ) { this.playerTurn = this.numOfPlayer; }
			}
			this.playerTurn = Math.abs(this.playerTurn);
			this.compTurn();
		}
	},
	compTurn: function() {
		if ( this.playerTurn != 1 ) {
			var cards = $('section.player'+uno.playerTurn+' .card'), i = 0, a = 0;
			while ( a == 0 ) {
				if ( i >= cards.length ) { this.pass();a++ }
				else if ( this.rules( $(cards[i]) ) ) { this.go( $(cards[i]) );a++ }
				else { i++ }
			}
		}
	},
	myTurn: function() {
		$('body')
			.delegate('*','mousedown',function(e) { e.preventDefault();return false; })
			.delegate('#carddeck','click',function() { if ( uno.playerTurn == 1 ) { uno.pass() } })
			.delegate('section.player1 .card','click',function() { if ( uno.playerTurn == 1 ) { if ( uno.rules($(this)) ) { uno.go( $(this) ); } } });
	},

	// START

	start: function() {
		this.createCards();
		this.render();
		this.passCards();
		this.myTurn();
	},
	restart: function() {
		this.wildActive = false;
		this.wildActive2 = false;
		this.cardToTacke = 0;
		this.playerTurn = 1;
		this.reverse = false;
		this.showActive('H');
		$('*').finish();
		$('section.hand').remove();
		$('#carddeck').html("");
		$('#gamedeck').html("");
		$('body').undelegate();
		this.start();
	}
}

jQuery(function() {
	uno.start();
});
