import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // Hex Tester
    hexTest = /[0-9A-Fa-f]{6}/g;

    // List of Names
    names = [];

    // Color Variables
    colors = [];
    colorsUsed = [];

    // Inputs
    contestant = '';
    color = '';

    // Animation Variables
    rotation = 0;
    timer = 0;
    cssAnimation = document.createElement('style');
    spinBtn: any;

    // Segment Varibles
    segVal: {name: string, degStart: number, degEnd: number}[] = [];

    // Contestant Winner
    winner = '';

    // Constructor
  constructor(private router: Router) {
      // Checks the Local Storage to See if there is a registry saved from before if not then creates three default names
      if (localStorage.getItem ('names') === JSON.stringify([])) {
          this.names = ['Jonny', 'Tom', 'Jeff'];
        } else {
          this.names = JSON.parse(localStorage.getItem('names'));
        }
      // Checks the Local Storage to See if there is a registry saved from before if not then creates two default colors
      if (localStorage.getItem ('colors') === JSON.stringify([])) {
          this.colors = ['#FFDAB9', '#E6E6FA', '#7744ff'];
        } else {
          this.colors = JSON.parse(localStorage.getItem('colors'));
        }
      this.resetColors();
      this.cssAnimation.type = 'text/css';
      this.spinBtn = document.getElementsByClassName('btn-large');
  }

  ngAfterViewInit() {
      setTimeout(() => window['$']('ul.tabs').tabs(), 100);
      document.body.style.backgroundColor = '#00b140';
      this.canvas = <HTMLCanvasElement>document.getElementById('cnvs');
      this.ctx = this.canvas.getContext('2d');
      this.refreshWheel();
  }


    // Switches between the array of Colors
    colorSwitch() {
        if (this.colorsUsed.length === 0)
            this.resetColors();
        return this.colorsUsed.splice(0, 1);
    }

    // Resets the Colors
    resetColors() {
        for (const color of this.colors) {
          this.colorsUsed.push(color);
        }
    }

    // Converts from Degrees to Radians
    degToRad(degrees) {
        return (degrees * Math.PI) / 180;
    }

    // Sums an Array upto a point
    sumTo(a, i) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += a[j];
        }
        return sum;
    }

    // Get Random Value between two Values
    getRBwVal(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Get Random Int between two Values
    getRInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; // Min is inclusive, Max is Exclusive
    }

    // Draws the Names onto The segments of the Wheel
    drawSegmentLabel(canvas, context, data, i) {
       context.save();
       const x = Math.floor(canvas.width / 2);
       const y = Math.floor(canvas.height / 2);
       const angle = this.degToRad(this.sumTo(data, i));

       context.translate(x, y);
       context.rotate(angle);
       const dx = Math.floor(canvas.width * 0.5) - 10;
       const dy = Math.floor(canvas.height * 0.05) - 10;

       context.textAlign = 'right';
       const fontSize = Math.floor(canvas.height / 30);
       context.font = fontSize + 'pt Helvetica';

       context.fillText(this.names[i], dx, dy);

       context.restore();
    }

    // Draws each individual segment of the Wheel
    drawSegment(canvas, context, data, i) {
        context.save();
        const cenX = Math.floor(canvas.width / 2);
        const cenY = Math.floor(canvas.height / 2);
        const rad = Math.floor(canvas.width / 2);

        const sAngle = this.degToRad(this.sumTo(data, i));
        const arcSize = this.degToRad(data[i]);
        const eAngle = sAngle + arcSize;

        context.beginPath();
        context.moveTo(cenX, cenY);
        context.arc(cenX, cenY, rad, sAngle, eAngle, false);
        context.closePath();

        context.fillStyle = this.colorSwitch();
        context.fill();

        context.restore();

        this.drawSegmentLabel(canvas, context, data, i);
    }

    // Refreshes the Wheel
    refreshWheel() {
        const data = [];
        this.resetColors();
        for (const name of this.names) {
            data.push( 360 / this.names.length);
        }
        for (let i = 0; i < data.length; i++) {
          this.drawSegment(this.canvas, this.ctx, data, i);
        }
        this.createSegVal();
    }

    // Creates the Segment Values
    createSegVal() {
        this.segVal = [];
        const data = [];
        for (const name of this.names) {
            data.push( 360 / this.names.length);
        }
        for (let i = 0; i < data.length; i++) {
          this.segVal.push({name: this.names[i], degStart: this.sumTo(data, i), degEnd: (this.sumTo(data, i) + data[i])});
        }
    }
    // Adds Contestant
    addContestant() {
        if (this.contestant.trim() === '') {
          alert('Could not add Contestant, lacking information');
        } else {
          this.names.push(this.contestant);
          this.contestant = '';
        }
        localStorage.setItem('names', JSON.stringify(this.names));
        this.names = JSON.parse(localStorage.getItem('names'));
        this.refreshWheel();
  }

    // Removes the Selected Contestant
    removeSelectedContestant(name) {
        this.names.splice(this.names.indexOf(name), 1);
        localStorage.setItem('names', JSON.stringify(this.names));
        this.names = JSON.parse(localStorage.getItem('names'));
        this.refreshWheel();
  }

    // Adds Color
    addColor() {
        if (this.color.trim() === '' || this.testForHex()) {
          alert('Could not add Color, lacking information, needs to be in hex format');
        } else {
            this.colors.push(this.color);
            this.color = '';
            this.refreshWheel();
        }
        localStorage.setItem('colors', JSON.stringify(this.colors));
        this.colors = JSON.parse(localStorage.getItem('colors'));
  }

    // Removes the Selected Color
    removeSelectedColor(name) {
        this.colors.splice(this.colors.indexOf(name), 1);
        this.colorsUsed = [];
        this.resetColors();
        localStorage.setItem('colors', JSON.stringify(this.colors));
        this.colors = JSON.parse(localStorage.getItem('colors'));
        this.refreshWheel();
  }

    // Testing the Color value to see if it is in the Hex format
    testForHex() {
        if (this.hexTest.test (this.color) || this.hexTest.test (this.color.substring (1))) {
            if (this.color.charAt (0) !== '#') 
                this.color = '#' + this.color;
            return false;
        }
        return true;
    }

    // Percent of Total Wheel
    pTotal(seg1, seg2, isFirst) {
        let p1 = (seg1 / 360) * 100;
        let p2 = (seg2 / 360) * 100;
        if (seg1 > 100 && seg2 > 100) {
            while (p1 > 100 && p2 > 100) {
                p1 -= 100;
                p2 -= 100;
            }
        }
        if(isFirst)
            return p1;
        return p2;
    }

    // Checks Contestant Winner
    checkWinner() {
        const rot = this.pTotal(270, 270, true);
        for (const sVal of this.segVal) {
            if (rot >= this.pTotal(sVal.degStart + this.rotation, sVal.degEnd + this.rotation, true) && rot <= this.pTotal(sVal.degStart + this.rotation, sVal.degEnd + this.rotation, false))
                return sVal.name;
        }
    }
    // Rotation of the Wheel
    rotateWheel(id, rTimer) {
        const rRotation = this.getRInt (6, 9);
        this.timer += 0.1;
        if (this.timer > rTimer) {
            // Removes The Interval
            clearInterval(id);
            const animationTime = this.getRInt (5, 7);
            document.getElementById('cnvs').appendChild(this.cssAnimation);
           // document.getElementById('cnvs').style.webkitAnimation = `rotate ${animationTime}s ease-out 1 forwards`;
            setTimeout(() => {
                this.spinBtn[0].classList.remove('disabled');
            }, animationTime);
            this.winner = this.checkWinner();
        } else {
            this.rotation += rRotation;
            document.getElementById('cnvs').style.transform = `rotate(${this.rotation}deg)`;
        }
    }

    // Spin Function
    spinWheel() {
//        this.rotation+=20
//            document.getElementById('cnvs').style.transform = `rotate(${this.rotation}deg)`;
//        this.winner = this.checkWinner();
        this.rotation = 0;
        this.timer = 0;
        this.spinBtn[0].classList.add('disabled');
        // Temporary until animation is manually eased out of ****
        const endingSpin = document.createTextNode ('@-webkit-keyframes rotate {' +
                                               `from { -webkit-transform: rotate(${this.rotation}deg); }` +
                                               `to { -webkit-transform: rotate(${this.rotation + this.getRInt(3600, 7210)}deg); }` +
                                               '}');
        this.cssAnimation.appendChild (endingSpin);
        try {
            document.getElementById('cnvs').removeChild(this.cssAnimation);
        } catch (err) {
            console.log(err);
        }
        const rTimer = this.getRInt(50, 71);
        const intervalId = setInterval(() => this.rotateWheel(intervalId, rTimer), 1);
    }
}
