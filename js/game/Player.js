function add_vectors(a, b) {
	return planck.Vec2(a.x + b.x, a.y + b.y);
}

function vector_angle(a, b) {
	// angle in degrees
	return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
}

function Player ()
{
}

Player.prototype.create = function ( group, x, y )
{
	var FD = {};
	FD.density = 1.0;
	FD.friction = 0.9;

	var xy_vector = planck.Vec2(x, y);
	var wheelBack_offset = planck.Vec2(5, 9);
	var wheelFront_offset = planck.Vec2(-5, 9);

	this.bodyRadius = 5;
	this.wheelRadius = 2;

	// create body
	this.body = Global.physics.createDynamicBody(xy_vector);
	this.body.createFixture(planck.Circle(this.bodyRadius), FD);

	// create wheels
	this.wheelBack = Global.physics.createDynamicBody(add_vectors(xy_vector, wheelBack_offset));
	this.wheelBack.createFixture(planck.Circle(this.wheelRadius), FD);
	this.wheelFront = Global.physics.createDynamicBody(add_vectors(xy_vector, wheelFront_offset));
	this.wheelFront.createFixture(planck.Circle(this.wheelRadius), FD);

	// join wheels to body
	this.springBack = Global.physics.createJoint(planck.DistanceJoint({
		frequencyHz : 0.0,
		dampingRatio : 0.0
	}, this.body, this.body.getPosition(), this.wheelBack, this.wheelBack.getPosition()));

	this.springFront = Global.physics.createJoint(planck.DistanceJoint({
		frequencyHz : 0.0,
		dampingRatio : 0.0
	}, this.body, this.body.getPosition(), this.wheelFront, this.wheelFront.getPosition()));

	// join between wheels
	this.springBetween = Global.physics.createJoint(planck.DistanceJoint({
		frequencyHz : 0.0,
		dampingRatio : 0.0
	}, this.wheelBack, this.wheelBack.getPosition(), this.wheelFront, this.wheelFront.getPosition()));


	this.sensor = {touchingF : false, touchingB : false};
	this.add_sensors();

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

// Add sensor below player to detect ground. Activates this.sensor.touching
Player.prototype.add_sensors = function()
{
	fd = {};
	fd.shape = planck.Circle(Vec2(0.0, 0.0), this.wheelRadius);
	fd.isSensor = true;
	var m_sensorF = this.wheelFront.createFixture(fd);
	var m_sensorB = this.wheelBack.createFixture(fd);
	m_sensorF.m_userData = this.sensor;
	m_sensorB.m_userData = this.sensor;

	// Implement contact listener.
	Global.physics.on('begin-contact', function(contact) {
		var fixtureA = contact.getFixtureA();
		var fixtureB = contact.getFixtureB();

		if (fixtureA == m_sensorF) {
			m_sensorF.m_userData.touchingF = true;
		}
		if (fixtureA == m_sensorB) {
			m_sensorB.m_userData.touchingB = true;
		}

		if (fixtureB == m_sensorF) {
			m_sensorF.m_userData.touchingF = true;
		}
		if (fixtureB == m_sensorB) {
			m_sensorB.m_userData.touchingB = true;
		}
	});

	// Implement contact listener.
	Global.physics.on('end-contact', function(contact) {
		var fixtureA = contact.getFixtureA();
		var fixtureB = contact.getFixtureB();

		if (fixtureA == m_sensorF) {
			m_sensorF.m_userData.touchingF = false;
		}
		if (fixtureA == m_sensorB) {
			m_sensorB.m_userData.touchingB = false;
		}

		if (fixtureB == m_sensorF) {
			m_sensorF.m_userData.touchingF = false;
		}
		if (fixtureB == m_sensorB) {
			m_sensorB.m_userData.touchingB = false;
		}
	});
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
	this.sprite.angle = vector_angle(this.wheelFront.getPosition(), this.wheelBack.getPosition());

	// move left or right
	if (left || right) {
		const horizontal_speed = 20000;
		this.body.applyForce(new Vec2(p.x*horizontal_speed, p.y), this.body.getPosition());
	}

	// jump
	if (this.keys.space.justDown && (this.sensor.touchingF && this.sensor.touchingB)) {
		const jump_speed = -200000;
		this.body.applyLinearImpulse(new Vec2(0, jump_speed), this.body.getPosition());
	}
};

Player.prototype.render = function (graphics)
{
	var p = this.body.getPosition();
	graphics.beginFill(0xFF0000, 0.5);
	graphics.lineStyle(0, 0, 1.0);
	graphics.drawCircle(p.x, p.y, this.bodyRadius * 2);
	this.sprite.centerX = p.x;
	this.sprite.centerY = p.y;

	var wb = this.wheelBack.getPosition();
	var wf = this.wheelFront.getPosition();
	graphics.beginFill(this.sensor.touchingB ? 0x00FF00 : 0x0000FF, 0.5);
	graphics.drawCircle(wb.x, wb.y, this.wheelRadius * 2);
	graphics.beginFill(this.sensor.touchingF ? 0x00FF00 : 0x0000FF, 0.5);
	graphics.drawCircle(wf.x, wf.y, this.wheelRadius * 2);
};
