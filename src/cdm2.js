
define(['Crafty', 'Colors'], function() {


    Crafty.c('Line', {

        __length: 16,

        __stepWidth: 32,

        __row: 0,

        __steps: null,


        __createStep: function(position) {
            position--;
            var x    = position * this.__stepWidth + position * 5;
            var y    = this.__row * this.__stepWidth + this.__row * 5;
            var step = Crafty.e('Step').size(this.__stepWidth).shift(x, y)

            this.__steps.unshift(step);
        },


        init: function() {
            this.__steps = [];
        },


        play: function(position) {
            CDM2.log('Play sound on position ' + position);
            this.__steps[position-1].play();
        },


        position: function(row) {
            this.__row = row - 1;
            return this;
        },


        sound: function(id) {
            for (var i = 0; i < this.__steps.length; i++) {
                this.__steps[i].sound(id);
            }

            return this;
        },


        run: function() {
            for (var i = this.__length; i > 0; i--) {
                this.__createStep(i);
            }

            return this;
        }

    });


    Crafty.c('Step', {

        __size: 32,

        __color: null,

        __isActive: false,

        __sound: null,


        play: function() {
            if (!this.__isActive) {
                return this;
            }

            // Logging
            CDM2.log('Play sound: ' + this.__sound);

            Crafty.audio.play(this.__sound);

            this.color('yellow');
            this.timeout(function() {
                this.color(this.__color);
            }, 100);

            return this;
        },


        init: function() {
            this.requires('2D, DOM, Color, Mouse');

            this.__color = '#AAA';

            this.css('cursor', 'pointer');
            this.attr('w', this.__size)
                .attr('h', this.__size)
                .color(this.__color);

            this.bind('Click', function() {
                this.__color = Colors.complement(this.__color);
                this.color(this.__color);
                this.__isActive = !this.__isActive;
            });
        },

        size: function(v) {
            this.__size = v;
            return this;
        },


        sound: function(id) {
            this.__sound = id;
        }

    });


    Crafty.c('Transport', {

        _row: 4,

        isRunning: false,

        init: function() {
            this.requires('2D, DOM, Color, HTML, Mouse');

            var x = 37;
            var y = this._row * 32 + this._row * 5;

            this.attr('x', x);
            this.attr('y', y);
            this.attr('w', 32);
            this.attr('h', 32);
            this.color('green');
            this.css('cursor', 'pointer');
            this.stop();

            this.bind('Click', function() {
                if (this.isRunning) {
                    this.stop();
                }
                else {
                    this.play();
                }
            });
        },

        play: function() {
            this.isRunning = true;
            CDM2.instance.play();
            this.replace('<span style="position:relative; top: 17px; left: 7px; font-size: 25px;">⚼</span>')
        },

        stop: function() {
            this.isRunning = false;
            this.replace('<span style="position:relative; top: 15px; left: 10px; font-size: 25px;">‣</span>')
        }

    });


    Crafty.c('CDM2', {

        __steps: [],

        step: 1,

        transport: null,

        play: function() {
            this.timeout(function() {
                CDM2.log('Play sound on line 1');
                this.__steps[0].play(this.step);

                CDM2.log('Play sound on line 2');
                this.__steps[1].play(this.step);

                CDM2.log('Play sound on line 3');
                this.__steps[2].play(this.step);

                CDM2.log('Play sound on line 4');
                this.__steps[3].play(this.step);

                if (this.step == 16) {
                    this.step = 1;
                }
                else {
                    this.step++;
                }

                if (CDM2.instance.transport.isRunning) {
                    this.play();
                }
                else {
                    this.step = 1;
                }
            }, 210);
        },


        init: function() {
            CDM2.log('Add sounds')
            Crafty.audio.add({
                bd: ['sounds/bd.wav', 'sounds/bd.mp3', 'sounds/bd.ogg'],
                sd: ['sounds/sd.wav', 'sounds/sd.mp3', 'sounds/sd.ogg'],
                ch: ['sounds/ch.wav', 'sounds/ch.mp3', 'sounds/ch.ogg'],
                oh: ['sounds/oh.wav', 'sounds/oh.mp3', 'sounds/oh.ogg']
            });

            CDM2.log('Create line 1 to 4');
            this.__steps.push( Crafty.e('Line').position(1).run().sound('bd') );
            this.__steps.push( Crafty.e('Line').position(2).run().sound('sd') );
            this.__steps.push( Crafty.e('Line').position(3).run().sound('ch') );
            this.__steps.push( Crafty.e('Line').position(4).run().sound('oh') );

            // Transport
            this.transport = Crafty.e('Transport');

            this.play();
        }

    })


    var CDM2 = {

        debug: true,

        instance: null,

        log: function(msg) {
            if (this.debug) {
                console.log(msg);
            }
        },


        run: function() {
            CDM2.log('Initialize Crafty');
            Crafty.init();

            CDM2.log('Create CDM2');
            this.instance = Crafty.e('CDM2');
        }

    };

    return CDM2;

});



