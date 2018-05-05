
function Player ()
{
}

Player.prototype.create = function ( group, x, y )
{
	this.body = Global.physics.createDynamicBody(planck.Vec2(x, y));
	this.body.createFixture(planck.Circle(CIRCLE_RADIUS), { density: 1.0, friction: 0.9 });
	console.log(this.body);

	this.coyoteSprite = Global.game.add.sprite(0, 0, "coyote");
	this.coyoteSprite.scale.set(0.1, 0.1);

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

	const speed = 10000;
	this.body.applyForce(new Vec2(p.x*speed, p.y*speed), this.body.getPosition());
};

Player.prototype.render = function (graphics)
{
	var p = this.body.getPosition();
	graphics.drawCircle(p.x, p.y, CIRCLE_RADIUS * 2);
	this.coyoteSprite.centerX = p.x;
	this.coyoteSprite.centerY = p.y;
};
