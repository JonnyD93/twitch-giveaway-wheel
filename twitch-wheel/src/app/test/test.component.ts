import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

  board: number[];

  turn: boolean = false;
  lastWinner: string;
  o: any = {health: 5};

  constructor(){
    this.resetBoard();
    this.lastWinner = localStorage.getItem("lastWinner");
    console.log(JSON.stringify(this.o));
    console.log(JSON.parse(JSON.stringify(this.o)));
  }

  resetBoard(){
    this.board = [0,0,0,0,0,0,0,0,0];
    this.turn = false;
  }

setLastWinner(str){
  this.lastWinner = str;
  localStorage.setItem("lastWinner", this.lastWinner);
}

  select(index){
    if(this.board[index] === 0){
      this.board[index] = this.turn ? 2 : 1;
      if(this.checkWin(this.turn ? 2 : 1)){
        this.setLastWinner("Player " + (this.turn ? 2 : 1) + " Won!");
        console.log(this.lastWinner);
        this.resetBoard();
        return "tits";
      }
      if(this.checkTie()){
        this.setLastWinner("Tie!");
        this.resetBoard();
        return "tits";
      }
      this.turn = !this.turn;
    }
  }

  checkWin(val){
    if(
      this.allEqual(val, [0, 1, 2]) ||
      this.allEqual(val, [3, 4, 5]) ||
      this.allEqual(val, [6, 7, 8]) ||
      this.allEqual(val, [0, 3, 6]) ||
      this.allEqual(val, [1, 4, 7]) ||
      this.allEqual(val, [2, 5, 8]) ||
      this.allEqual(val, [0, 5, 8]) ||
      this.allEqual(val, [2, 5, 6])
    )
    return true;
    return false;
  }

  checkTie(){
    return this.board.filter(val=>val===0).length === 0
  }

  allEqual(val, ar){
    return ar.filter(a=>this.board[a]===val).length === ar.length;
  }

}
