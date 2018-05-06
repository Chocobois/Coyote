
function Player ()
{
}

Player.prototype.create = function ( group, x, y )
{
	var wheelFD = {};
	wheelFD.density = 1.0;
	wheelFD.friction = 0.9;

	// create body
	this.body = Global.physics.createDynamicBody(planck.Vec2(x, y));
	this.body.createFixture(planck.Circle(CIRCLE_RADIUS), { density: 1.0, friction: 0.9 });

	// create wheels
	this.wheelBack = Global.physics.createDynamicBody(planck.Vec2(x + -1.0, y + 0.35));
	this.wheelBack.createFixture(planck.Circle(0.4), wheelFD);
	this.wheelFront = Global.physics.createDynamicBody(planck.Vec2(x + 1.0, y + 0.4));
	this.wheelFront.createFixture(planck.Circle(0.4), wheelFD);

	// join wheels to body
	// this.springBack = Global.physics.createJoint(planck.DistanceJoint({
	// 	frequencyHz : 0.0,
	// 	dampingRatio : 0.0
	// }, this.body, this.wheelBack, this.wheelBack.getPosition(), Vec2(0.0, 1.0)));

	// var springFront = Global.physics.createJoint(planck.DistanceJoint({
	// 	frequencyHz : 0.0,
	// 	dampingRatio : 0.0
	// }, this.body, this.wheelFront, this.wheelFront.getPosition(), Vec2(0.0, 1.0)));


	// join sprite to body
	this.sprite = Global.game.add.sprite(0, 0, "coyote");
	this.sprite.anchor.set(0.5, 0.5);
	this.sprite.scale.set(0.05, 0.05);

	this.keys = Global.game.input.keyboard.createCursorKeys();
	this.keys.w = Global.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = Global.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = Global.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = Global.game.input.keyboard.addKey( Phaser.Keyboard.D );
	this.keys.space = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
};

Player.prototype.update = function ()
{
	var p = new Phaser.Point( 0, 0 );
	var left = this.keys.left.isDown || this.keys.a.isDown;
	var right = this.keys.right.isDown || this.keys.d.isDown;
	var down = this.keys.down.isDown || this.keys.s.isDown;
	var up = this.keys.up.isDown || this.keys.w.isDown;

	if ( left )		p.x -= 1;
	if ( right )	p.x += 1;
	if ( up )		p.y -= 1;
	if ( down )		p.y += 1;

	// rotate sprite according to speed
	this.sprite.angle = this.body.getAngularVelocity();

	// move left or right
	if (left || right) {
		const horizontal_speed = 20000;
		this.body.applyForce(new Vec2(p.x*horizontal_speed, p.y), this.body.getPosition());
	}

	// jump
	if (up) {
        const jump_speed = -200000;
        this.body.applyForce(new Vec2(0, jump_speed), this.body.getPosition());
    }
};

Player.prototype.render = function (graphics)
{
	var p = this.body.getPosition();
	graphics.beginFill(0xFF0000, 1);
	graphics.lineStyle(0, 0, 1.0);
	graphics.drawCircle(p.x, p.y, CIRCLE_RADIUS * 2);
	this.sprite.centerX = p.x;
	this.sprite.centerY = p.y;

	graphics.beginFill(0x00FF00, 1);
	var wb = this.wheelBack.getPosition();
	var wf = this.wheelFront.getPosition();
	graphics.drawCircle(wb.x, wb.y, 15);
	graphics.drawCircle(wf.x, wf.y, 15);

};
