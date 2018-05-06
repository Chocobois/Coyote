function offset_verts(offset, verts) {
	var new_verts = [];
	verts.forEach(function(item){
		new_verts.push(item.clone().add(offset));
	});
	return new_verts;
}

function rotate_verts(verts, angle) {
	var around = Vec2(0, 0);  // rotate around this point
	var new_verts = [];
	verts.forEach(function(item) {
		new_verts.push(planck.Vec2(
			(Math.cos(angle) * item.x - Math.sin(angle) * item.y),
			(Math.sin(angle) * item.x + Math.cos(angle) * item.y)
		));
    });
	return new_verts;
}

function Player ()
{
}

Player.prototype.create = function ( group, x, y )
{
	var bodyFD = {};
	bodyFD.density = 1.0;
	bodyFD.friction = 0.1;

	var wheelFD = {};
	wheelFD.density = 10.0;
	wheelFD.friction = 0.9;

	var joint = {};
	joint.motorSpeed = 0.0;
	joint.maxMotorTorque = 15000.0;
	joint.enableMotor = true;
	joint.frequencyHz = 4;
	joint.dampingRatio = 0.7;

	var xy_vector = planck.Vec2(x, y);
	var wheelBack_offset = planck.Vec2(-7, 0);
	var wheelFront_offset = planck.Vec2(7, 0);

	this.bodyRadius = 6;
	this.wheelRadius = 1.4;
	this.bodyVertices = [
		Vec2(-10, 1),
		Vec2(-10, -1),
		Vec2(10, -1),
		Vec2(10, 1),
	];

	// create body
	this.body = Global.physics.createDynamicBody(Vec2(0.0, 8));
	this.body.createFixture(planck.Circle(this.bodyRadius), bodyFD);
	// this.body.createFixture(planck.Polygon(this.bodyVertices), bodyFD);

	// create wheels
	this.wheelBack = Global.physics.createDynamicBody(wheelBack_offset);
	this.wheelBack.createFixture(planck.Circle(this.wheelRadius), wheelFD);
	this.wheelFront = Global.physics.createDynamicBody(wheelFront_offset);
	this.wheelFront.createFixture(planck.Circle(this.wheelRadius), wheelFD);

	// join wheels to body with motors
	this.springBack = Global.physics.createJoint(planck.WheelJoint(joint, this.body, this.wheelBack, this.wheelBack.getPosition(), planck.Vec2(0.0, 1.0)));
	this.springFront = Global.physics.createJoint(planck.WheelJoint(joint, this.body, this.wheelFront, this.wheelFront.getPosition(), planck.Vec2(0.0, 1.0)));

	this.body.setPosition(xy_vector);
	this.body.setAngle(Math.PI);
	this.wheelBack.setPosition(xy_vector);
	this.wheelFront.setPosition(xy_vector);

	// Add wheel sensors
	this.sensor = {touchingF : false, touchingB : false};
	this.add_sensors();

	// add sprite, joined to body
	this.sprite = Global.game.add.sprite(0, 0, "coyote");
	this.sprite.anchor.set(0.5, 0.5);
	this.sprite_left = function(){
		this.sprite.scale.set(-0.05, 0.05);
	};
	this.sprite_right = function(){
		this.sprite.scale.set(0.05, 0.05);
	};
	this.sprite_right()

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
	this.sprite.angle = (this.body.getAngle() * 180 )/3.1415 -180;
	console.log(this.body.getAngle());

	// move motors
	var motor_speed = 100.0;
	if (left && right) {
		this.springBack.setMotorSpeed(0);
		this.springBack.enableMotor(true);
		this.springFront.setMotorSpeed(0);
		this.springFront.enableMotor(true);
	} else if (right) {
		this.springBack.setMotorSpeed(motor_speed);
		this.springBack.enableMotor(true);
		this.springFront.setMotorSpeed(motor_speed);
		this.springFront.enableMotor(true);
	} else if (left) {
		this.springBack.setMotorSpeed(-motor_speed);
		this.springBack.enableMotor(true);
		this.springFront.setMotorSpeed(-motor_speed);
		this.springFront.enableMotor(true);
	} else {
		this.springBack.setMotorSpeed(0);
		this.springBack.enableMotor(false);
		this.springFront.setMotorSpeed(0);
		this.springFront.enableMotor(false);
	}

	// jump
	if (this.keys.space.justDown && (this.sensor.touchingF && this.sensor.touchingB)) {
		const jump_speed = -20000;
		this.body.applyLinearImpulse(new Vec2(0, jump_speed), this.body.getPosition());
	}
};

Player.prototype.render = function (graphics)
{
	// draw body and sprite
	var p = this.body.getPosition();
	var angle = this.body.getAngle();
	graphics.beginFill(0xFF0000, 1);
	graphics.lineStyle(0.2, 0, 1.0);
	graphics.drawCircle(p.x, p.y, this.bodyRadius * 2);
	this.sprite.centerX = p.x;
	this.sprite.centerY = p.y;
	// graphics.drawPolygon(offset_verts(p, rotate_verts(this.bodyVertices, angle)));
	// sprite_vert = offset_verts(p, rotate_verts([planck.Vec2(0, -6)], angle))[0];
	// this.sprite.centerX = sprite_vert.x;
	// this.sprite.centerY = sprite_vert.y;

	// draw wheels
	var wb = this.wheelBack.getPosition();
	var wf = this.wheelFront.getPosition();
	graphics.beginFill(this.sensor.touchingB ? 0x00FF00 : 0x0000FF, 0.5);
	graphics.drawCircle(wb.x, wb.y, this.wheelRadius * 2);
	graphics.beginFill(this.sensor.touchingF ? 0x00FF00 : 0x0000FF, 0.5);
	graphics.drawCircle(wf.x, wf.y, this.wheelRadius * 2);

	graphics.lineStyle(1, 0xFF0000, 1.0);
	graphics.moveTo(this.springBack.getAnchorA().x, this.springBack.getAnchorA().y);
	graphics.lineTo(this.springBack.getAnchorB().x, this.springBack.getAnchorB().y);
	graphics.lineStyle(1, 0xFF0000, 1.0);
	graphics.moveTo(this.springFront.getAnchorA().x, this.springFront.getAnchorA().y);
	graphics.lineTo(this.springFront.getAnchorB().x, this.springFront.getAnchorB().y);
};
