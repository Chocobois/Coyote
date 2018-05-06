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
	// tunables
	var bodyFD = {};
	bodyFD.density = 1.0;
	bodyFD.friction = 0.1;

	var wheelFD = {};
	wheelFD.density = 10.0;
	wheelFD.friction = 0.9;

	this.jump_speed_max = 40000;
	this.jump_charge_time = 1000; // time in ms it takes to fully charge jump
	this.jump_start_time = undefined;
	this.jump_normal = false; // enable me to jump perpendicularly to the ground, sonic-style

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
	// this.bodyVertices = [
	// 	Vec2(-10, 1),
	// 	Vec2(-10, -1),
	// 	Vec2(10, -1),
	// 	Vec2(10, 1),
	// ];

	// create body
	this.body = Global.physics.createDynamicBody(Vec2(0.0, 8));
	this.body.createFixture(planck.Circle(this.bodyRadius), bodyFD);
	// this.body.createFixture(planck.Polygon(this.bodyVertices), bodyFD);

	// create wheels
	this.wheelBack = Global.physics.createDynamicBody(wheelBack_offset);
	this.wheelBack.createFixture(planck.Circle(this.wheelRadius), wheelFD);
	this.wheelFront = Global.physics.createDynamicBody(wheelFront_offset);
	this.wheelFront.createFixture(planck.Circle(this.wheelRadius), wheelFD);

	// join wheels to body with wheel joints
	this.springBack = Global.physics.createJoint(planck.WheelJoint(joint, this.body, this.wheelBack, this.wheelBack.getPosition(), planck.Vec2(0.0, 1.0)));
	this.springFront = Global.physics.createJoint(planck.WheelJoint(joint, this.body, this.wheelFront, this.wheelFront.getPosition(), planck.Vec2(0.0, 1.0)));

	// move body into specified x, y position
	this.body.setPosition(xy_vector);
	this.body.setAngle(Math.PI);
	this.wheelBack.setPosition(xy_vector);
	this.wheelFront.setPosition(xy_vector);

	// add wheel sensors
	this.sensor = {touchingF : false, touchingB : false};
	this.add_sensors();

	// add sprite, to be joined to body. also add some helper funcs.
	this.sprite = Global.game.add.sprite(0, 0, "coyote");
	this.sprite.anchor.set(0.5, 0.5);
	this.sprite_left = function(){
		this.sprite.scale.set(-0.05, 0.05);
	};
	this.sprite_right = function(){
		this.sprite.scale.set(0.05, 0.05);
	};
	this.sprite_is_left = function(){
		return this.sprite.scale.x < 0
	};
	this.sprite_is_right = function(){
		return this.sprite.scale.x > 0
	};
	this.sprite_right();

	// set up inputs
	this.keys = Global.game.input.keyboard.createCursorKeys();
	this.keys.w = Global.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = Global.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = Global.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = Global.game.input.keyboard.addKey( Phaser.Keyboard.D );
	this.keys.q = Global.game.input.keyboard.addKey( Phaser.Keyboard.Q );
	this.keys.e = Global.game.input.keyboard.addKey( Phaser.Keyboard.E );
	this.keys.space = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
};

// Add sensor below player to detect ground. Activates this.sensor.touching
Player.prototype.add_sensors = function()
{
	fd = {};
	fd.shape = planck.Circle(Vec2(0.0, 0.0), this.wheelRadius*2);
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
			m_sensorF.m_userData.touchingF += 1;
		}
		if (fixtureA == m_sensorB) {
			m_sensorB.m_userData.touchingB += 1;
		}

		if (fixtureB == m_sensorF) {
			m_sensorF.m_userData.touchingF += 1;
		}
		if (fixtureB == m_sensorB) {
			m_sensorB.m_userData.touchingB += 1;
		}
	});

	// Implement contact listener.
	Global.physics.on('end-contact', function(contact) {
		var fixtureA = contact.getFixtureA();
		var fixtureB = contact.getFixtureB();

		if (fixtureA == m_sensorF) {
			m_sensorF.m_userData.touchingF -= 1;
		}
		if (fixtureA == m_sensorB) {
			m_sensorB.m_userData.touchingB -= 1;
		}

		if (fixtureB == m_sensorF) {
			m_sensorF.m_userData.touchingF -= 1;
		}
		if (fixtureB == m_sensorB) {
			m_sensorB.m_userData.touchingB -= 1;
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
	this.sprite.angle = (this.body.getAngle() * 180 )/Math.PI -180;

	// flip sprite if player turns around
	var turn_threshold = 20.0;
	var current_speed = this.springBack.getJointSpeed();
	if (this.sprite_is_right() && current_speed < -turn_threshold) {
		this.sprite_left();
	} else if (this.sprite_is_left() && current_speed > turn_threshold) {
		this.sprite_right();
	}

	// Move
	if (left && right)
		this.move(true, 0);
	else if (right)
		this.move(true, 1);
	else if (left)
		this.move(true, -1);
	else
		this.move(false, 0);

	// Jump hold
	if (this.keys.space.justDown) {
		// store time pressed down
		this.jump_start_time = Date.now();
	}
	// Jump release
	if (this.keys.space.justUp) {
		if (this.jump_start_time && this.sensor.touchingF && this.sensor.touchingB) {
			let jump_hold_time = Math.min(Date.now() - this.jump_start_time, this.jump_charge_time);
			let jump_speed = this.jump_speed_max * (jump_hold_time / this.jump_charge_time);
			let jump_vector = planck.Vec2(0, -jump_speed);  //straight up vector
			if (this.jump_normal) {
				// rotate in the direction of normal
				jump_vector = rotate_verts([planck.Vec2(0, -jump_speed)], this.body.getAngle() - Math.PI)[0];
			}
			this.body.applyLinearImpulse(jump_vector, this.body.getPosition());
		}
		this.jump_start_time = undefined;
	}

	// Lean
	let lean_torque = 1000;
	if (this.keys.q.isDown) {
		this.body.applyAngularImpulse(-lean_torque)
	}
	if (this.keys.e.isDown) {
		this.body.applyAngularImpulse(lean_torque)
	}
};

Player.prototype.move = function (active, direction)
{
	const motor_speed = 100.0;

	var motor = function (wheel, sensor) {
		if (sensor) {
			wheel.enableMotor(active);
			wheel.setMotorSpeed(direction * motor_speed);
		} else {
			wheel.enableMotor(false);
			wheel.setMotorSpeed(0);
		}
	};

	motor(this.springBack, this.sensor.touchingB);
	motor(this.springFront, this.sensor.touchingF);
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
