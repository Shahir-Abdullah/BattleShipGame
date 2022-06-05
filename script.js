
var model = {
    boardSize : 7,
    numShips : 3,
    shipLength : 3,
    shipSunk : 0,
    ships : [
        {locations : [00, 00, 00], hits : ["", "", ""]},
        {locations : [00, 00, 00], hits : ["", "", ""]},
        {locations : [00, 00, 00], hits : ["", "", ""]}
    ],
    generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
    generateShipLocations : function(){
        var locations;
        for(var i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShip();
            }while(this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
      
    collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

    fire : function(guess){
        for(var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			}else if(index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!!");
                if(this.isSunk(ship)){
                    view.displayMessage("You sank my battleship!");
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed!");
        return false;
    },

    isSunk : function(ship){
        for(var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    }

};
var view = {
    displayMessage : function (msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit : function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss : function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};



function parseGuess(guess){
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if(guess === null || guess.length !== 2){
        alert("Oops, please enter a letter and a number on the board.");
    }else{
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if(isNaN(row) || isNaN(column)){
            alert("Oops, that isn't on the board.");
        }else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert("Oops, that's off the board!");
        }else{
            return row + column;
        }

    }
    return null;

}

var controller = {
    guesses : 0,
    processGuess : function(guess){
        var location = parseGuess(guess);
        if(location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipSunk === model.numShips){
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
}
window.onload = init;
function init(){
    var fireButton = document.getElementById("fireButton");
    var guessInput = document.getElementById("guessInput");
    fireButton.onclick = function(){
        var guess = guessInput.value;
        controller.processGuess(guess);
        guessInput.value = "";
    };
    
    model.generateShipLocations();
}
